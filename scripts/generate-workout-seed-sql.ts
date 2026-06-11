/**
 * Generate SQL seed batches for workout library (for MCP / SQL editor).
 * Run: npx tsx scripts/generate-workout-seed-sql.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { EXERCISE_CATALOG } from "../src/data/workout-library/exercise-catalog";
import { WORKOUT_LIBRARY } from "../src/data/workout-library/index";
import { exercisedbGifUrl } from "../src/lib/exercise-media";
import {
  estimateWorkoutCalories,
  workoutTotalMinutes,
} from "../src/lib/workout-library-actions";
import type { SeedWorkout } from "../src/lib/types";

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

function arrSql(tags: string[]): string {
  if (!tags.length) return "ARRAY[]::text[]";
  return `ARRAY[${tags.map((t) => `'${esc(t)}'`).join(", ")}]::text[]`;
}

function exerciseInserts(): string {
  const lines = EXERCISE_CATALOG.map((ex) => {
    const gif = ex.gif_url ?? exercisedbGifUrl(ex.exercisedb_name ?? ex.slug);
    const instr =
      ex.instructions?.length
        ? `ARRAY[${ex.instructions.map((i) => `'${esc(i)}'`).join(", ")}]::text[]`
        : "ARRAY[]::text[]";
    return `INSERT INTO exercises (slug, name, description, instructions, muscle_group, equipment, difficulty, source, source_id, gif_url, image_url, is_builtin)
VALUES ('${esc(ex.slug)}', '${esc(ex.name)}', ${ex.description ? `'${esc(ex.description)}'` : "NULL"}, ${instr}, ${ex.muscle_group ? `'${esc(ex.muscle_group)}'` : "NULL"}, ${ex.equipment ? `'${esc(ex.equipment)}'` : "NULL"}, '${ex.difficulty ?? "easy"}', 'exercisedb', '${esc(ex.exercisedb_name ?? ex.slug)}', '${esc(gif)}', '${esc(gif)}', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, gif_url = EXCLUDED.gif_url, image_url = EXCLUDED.image_url, instructions = EXCLUDED.instructions, updated_at = now();`;
  });
  return lines.join("\n");
}

function workoutBlock(workout: SeedWorkout): string {
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
  const mins = workoutTotalMinutes(mock);
  const cals = estimateWorkoutCalories(mock);
  const cover = `/workouts/${workout.category}.svg`;
  const catalog = new Map(EXERCISE_CATALOG.map((e) => [e.slug, e]));

  const parts: string[] = [];
  parts.push(`DO $$
DECLARE wid uuid;
BEGIN
  DELETE FROM workout_exercises WHERE workout_id IN (SELECT id FROM workouts WHERE is_builtin = true AND name = '${esc(workout.name)}');
  DELETE FROM workouts WHERE is_builtin = true AND name = '${esc(workout.name)}';

  INSERT INTO workouts (name, user_id, is_builtin, category, description, cover_image_url, difficulty, estimated_minutes, equipment_tags, tags, calories_estimate)
  VALUES ('${esc(workout.name)}', NULL, true, '${esc(workout.category)}', '${esc(workout.description)}', '${esc(cover)}', '${workout.difficulty}', ${mins}, ${arrSql(workout.equipment_tags)}, ${arrSql(workout.tags)}, ${cals})
  RETURNING id INTO wid;`);

  workout.exercises.forEach((e, order_index) => {
    const cat = catalog.get(e.exerciseSlug);
    const type = e.type ?? "sets_reps";
    const name = cat?.name ?? e.exerciseSlug;
    parts.push(`
  INSERT INTO workout_exercises (workout_id, exercise_id, name, type, sets, reps, duration_seconds, rest_seconds, notes, order_index)
  SELECT wid, ex.id, '${esc(name)}', '${type}', ${type === "sets_reps" ? e.sets ?? 3 : e.sets ?? 1}, ${type === "sets_reps" ? e.reps ?? 12 : "NULL"}, ${type === "timed" ? e.duration_seconds ?? 60 : "NULL"}, ${e.rest_seconds ?? 45}, ${e.notes ? `'${esc(e.notes)}'` : "NULL"}, ${order_index}
  FROM exercises ex WHERE ex.slug = '${esc(e.exerciseSlug)}';`);
  });

  parts.push(`
END $$;`);
  return parts.join("");
}

function main() {
  const outDir = resolve(process.cwd(), "scripts/seed-batches/workouts");
  mkdirSync(outDir, { recursive: true });

  writeFileSync(resolve(outDir, "00-exercises.sql"), exerciseInserts());

  const perFile = 8;
  for (let i = 0; i < WORKOUT_LIBRARY.length; i += perFile) {
    const chunk = WORKOUT_LIBRARY.slice(i, i + perFile);
    const sql = chunk.map(workoutBlock).join("\n\n");
    const n = String(Math.floor(i / perFile) + 1).padStart(2, "0");
    writeFileSync(resolve(outDir, `batch-${n}.sql`), sql);
  }

  console.log(
    `Wrote exercises + ${Math.ceil(WORKOUT_LIBRARY.length / perFile)} workout batches (${WORKOUT_LIBRARY.length} workouts)`
  );
}

main();
