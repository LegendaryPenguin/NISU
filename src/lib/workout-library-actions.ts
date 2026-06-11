import { createClient } from "@/utils/supabase/client";
import { categoryCoverUrl, exercisedbGifUrl } from "./exercise-media";
import type {
  Exercise,
  WorkoutCategory,
  WorkoutDifficulty,
  WorkoutExercise,
  WorkoutWithExercises,
} from "./types";

const supabase = () => createClient();

const WORKOUT_SELECT = `
  *,
  workout_exercises (
    *,
    exercise:exercises (*)
  )
`;

function normalizeExercise(raw: Record<string, unknown> | null): Exercise | null {
  if (!raw) return null;
  return raw as unknown as Exercise;
}

function normalizeWorkoutExercise(
  raw: Record<string, unknown>
): WorkoutExercise {
  const row = raw as unknown as WorkoutExercise & { exercise?: Record<string, unknown> };
  return {
    ...row,
    exercise: normalizeExercise(row.exercise ?? null),
  };
}

function normalizeWorkout(raw: Record<string, unknown>): WorkoutWithExercises {
  const w = raw as unknown as WorkoutWithExercises;
  const exercises = ((raw.workout_exercises ?? []) as Record<string, unknown>[])
    .map(normalizeWorkoutExercise)
    .sort((a, b) => a.order_index - b.order_index);
  return {
    ...w,
    tags: (w.tags as string[] | null) ?? [],
    equipment_tags: (w.equipment_tags as string[] | null) ?? [],
    is_builtin: Boolean(w.is_builtin),
    workout_exercises: exercises,
  };
}

export function workoutTotalMinutes(w: WorkoutWithExercises): number {
  if (w.estimated_minutes) return w.estimated_minutes;
  let seconds = 0;
  for (const ex of w.workout_exercises) {
    if (ex.type === "timed") {
      seconds += (ex.duration_seconds ?? 60) * (ex.sets ?? 1);
    } else {
      const sets = ex.sets ?? 3;
      seconds += sets * 45 + (ex.reps ?? 10) * sets * 2;
    }
    seconds += ex.rest_seconds ?? 45;
  }
  return Math.max(10, Math.round(seconds / 60));
}

export function estimateWorkoutCalories(w: WorkoutWithExercises): number {
  if (w.calories_estimate) return w.calories_estimate;
  const mins = workoutTotalMinutes(w);
  const mult =
    w.difficulty === "hard" ? 9 : w.difficulty === "medium" ? 7 : 5;
  return Math.round(mins * mult);
}

export function workoutMatchesSearch(
  w: WorkoutWithExercises,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    w.name,
    w.description ?? "",
    w.category ?? "",
    ...(w.tags ?? []),
    ...(w.equipment_tags ?? []),
    ...w.workout_exercises.map((e) => e.name),
    ...w.workout_exercises.map((e) => e.exercise?.muscle_group ?? ""),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

/** Prefer animated exercise media over flat category SVG covers. */
export function workoutCoverUrl(w: WorkoutWithExercises): string {
  for (const row of w.workout_exercises) {
    const ex = row.exercise;
    if (ex?.gif_url) return ex.gif_url;
    if (ex?.image_url) return ex.image_url;
    if (ex?.slug) return exercisedbGifUrl(ex.slug);
    if (ex?.source_id) return exercisedbGifUrl(ex.source_id);
  }
  if (w.cover_image_url?.startsWith("http")) return w.cover_image_url;
  return categoryCoverUrl(w.category ?? "home");
}

export function workoutPreviewExercises(
  w: WorkoutWithExercises,
  limit = 4
): WorkoutWithExercises["workout_exercises"] {
  return w.workout_exercises.slice(0, limit);
}

export async function fetchBuiltinWorkouts(): Promise<WorkoutWithExercises[]> {
  const { data, error } = await supabase()
    .from("workouts")
    .select(WORKOUT_SELECT)
    .eq("is_builtin", true)
    .order("category")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((row) => normalizeWorkout(row as Record<string, unknown>));
}

export async function fetchUserWorkouts(): Promise<WorkoutWithExercises[]> {
  const { data: auth } = await supabase().auth.getUser();
  const userId = auth.user?.id;
  let query = supabase()
    .from("workouts")
    .select(WORKOUT_SELECT)
    .eq("is_builtin", false)
    .order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalizeWorkout(row as Record<string, unknown>));
}

export async function fetchLibraryWorkoutById(
  id: string
): Promise<WorkoutWithExercises | null> {
  const { data, error } = await supabase()
    .from("workouts")
    .select(WORKOUT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return normalizeWorkout(data as Record<string, unknown>);
}

export function filterWorkouts(
  workouts: WorkoutWithExercises[],
  category: string,
  query: string
): WorkoutWithExercises[] {
  return workouts.filter((w) => {
    if (!workoutMatchesSearch(w, query)) return false;
    if (category === "all") return true;
    if (category === "quick") return workoutTotalMinutes(w) < 20;
    if (category === "beginner") return w.difficulty === "easy";
    return w.category === category;
  });
}

export function todaysPickIndex(count: number): number {
  if (count <= 0) return 0;
  const start = new Date(new Date().getFullYear(), 0, 0);
  const day = Math.floor(
    (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return day % count;
}

export type { WorkoutCategory, WorkoutDifficulty };
