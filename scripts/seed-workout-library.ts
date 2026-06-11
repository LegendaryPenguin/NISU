/**
 * Seed NISU builtin workout library (150+ workouts).
 * Run: npm run seed:workouts
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { EXERCISE_CATALOG } from "../src/data/workout-library/exercise-catalog";
import { WORKOUT_LIBRARY } from "../src/data/workout-library/index";
import { exercisedbGifUrl } from "../src/lib/exercise-media";
import type { SeedWorkout } from "../src/lib/types";
import {
  estimateWorkoutCalories,
  workoutTotalMinutes,
} from "../src/lib/workout-library-actions";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* env may already be set */
  }
}

async function ensureExercises(supabase: SupabaseClient): Promise<Map<string, string>> {
  const slugToId = new Map<string, string>();
  for (const ex of EXERCISE_CATALOG) {
    const gif =
      ex.gif_url ?? exercisedbGifUrl(ex.exercisedb_name ?? ex.slug);
    const { data, error } = await supabase
      .from("exercises")
      .upsert(
        {
          slug: ex.slug,
          name: ex.name,
          description: ex.description ?? null,
          instructions: ex.instructions ?? [],
          muscle_group: ex.muscle_group ?? null,
          equipment: ex.equipment ?? null,
          difficulty: ex.difficulty ?? "easy",
          source: "exercisedb",
          source_id: ex.exercisedb_name ?? ex.slug,
          gif_url: gif,
          image_url: ex.image_url ?? gif,
          is_builtin: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id, slug")
      .single();
    if (error) throw error;
    slugToId.set(data.slug, data.id);
  }
  return slugToId;
}

function estimateFromSeed(workout: SeedWorkout): { minutes: number; calories: number } {
  const mock = {
    ...workout,
    id: "x",
    user_id: null,
    created_at: "",
    updated_at: "",
    estimated_minutes: null,
    calories_estimate: null,
    workout_exercises: workout.exercises.map((e, i) => ({
      id: String(i),
      workout_id: "x",
      exercise_id: null,
      name: e.exerciseSlug,
      type: e.type ?? "sets_reps",
      sets: e.sets ?? 3,
      reps: e.reps ?? 12,
      duration_seconds: e.duration_seconds ?? null,
      rest_seconds: e.rest_seconds ?? 45,
      order_index: i,
      created_at: "",
      updated_at: "",
    })),
  };
  return {
    minutes: workoutTotalMinutes(mock),
    calories: estimateWorkoutCalories(mock),
  };
}

async function seedWorkout(
  supabase: SupabaseClient,
  workout: SeedWorkout,
  slugToId: Map<string, string>
) {
  const { minutes, calories } = estimateFromSeed(workout);
  const cover = `/workouts/${workout.category}.svg`;

  const { data: existing } = await supabase
    .from("workouts")
    .select("id")
    .eq("is_builtin", true)
    .eq("name", workout.name)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from("workout_exercises").delete().eq("workout_id", existing.id);
    await supabase.from("workouts").delete().eq("id", existing.id);
  }

  const { data: row, error: wErr } = await supabase
    .from("workouts")
    .insert({
      name: workout.name,
      user_id: null,
      is_builtin: true,
      category: workout.category,
      description: workout.description,
      cover_image_url: cover,
      difficulty: workout.difficulty,
      estimated_minutes: minutes,
      equipment_tags: workout.equipment_tags,
      tags: workout.tags,
      calories_estimate: calories,
    })
    .select("id")
    .single();
  if (wErr) throw wErr;

  const workoutId = row.id as string;
  const catalog = new Map(EXERCISE_CATALOG.map((e) => [e.slug, e]));

  const rows = workout.exercises.map((e, order_index) => {
    const cat = catalog.get(e.exerciseSlug);
    const exerciseId = slugToId.get(e.exerciseSlug) ?? null;
    const type = e.type ?? "sets_reps";
    return {
      workout_id: workoutId,
      exercise_id: exerciseId,
      name: cat?.name ?? e.exerciseSlug,
      type,
      sets: type === "sets_reps" ? (e.sets ?? 3) : e.sets ?? 1,
      reps: type === "sets_reps" ? (e.reps ?? 12) : null,
      duration_seconds: type === "timed" ? (e.duration_seconds ?? 60) : null,
      rest_seconds: e.rest_seconds ?? 45,
      notes: e.notes ?? null,
      order_index,
    };
  });

  const { error: exErr } = await supabase.from("workout_exercises").insert(rows);
  if (exErr) throw exErr;
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log(`Seeding ${EXERCISE_CATALOG.length} exercises…`);
  const slugToId = await ensureExercises(supabase);
  console.log(`Seeding ${WORKOUT_LIBRARY.length} workouts…`);

  let ok = 0;
  for (const w of WORKOUT_LIBRARY) {
    try {
      await seedWorkout(supabase, w, slugToId);
      ok++;
      if (ok % 25 === 0) console.log(`  …${ok} workouts`);
    } catch (e) {
      console.error(`Failed: ${w.name}`, e);
    }
  }
  console.log(`\nDone: ${ok}/${WORKOUT_LIBRARY.length} workouts seeded.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
