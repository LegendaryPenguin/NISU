import { createClient } from "@/utils/supabase/client";
import { getAuthUserId } from "./auth-helpers";
import type {
  Workout,
  WorkoutExercise,
  WorkoutWithExercises,
  FitnessActivityLog,
} from "./types";
import { getCurrentWeekDates } from "./helpers";

const supabase = () => createClient();

// ----- Workouts -----

const WORKOUT_SELECT = `
  *,
  workout_exercises (
    *,
    exercise:exercises (*)
  )
`;

function normalizeWorkoutRow(w: Record<string, unknown>): WorkoutWithExercises {
  const row = w as unknown as WorkoutWithExercises;
  return {
    ...row,
    workout_exercises: ((w.workout_exercises ?? []) as WorkoutExercise[]).sort(
      (a, b) => a.order_index - b.order_index
    ),
  };
}

export async function fetchWorkouts(): Promise<WorkoutWithExercises[]> {
  const [builtins, mine] = await Promise.all([
    fetchBuiltinWorkoutsInternal(),
    fetchUserWorkoutsInternal(),
  ]);
  return [...builtins, ...mine];
}

async function fetchBuiltinWorkoutsInternal(): Promise<WorkoutWithExercises[]> {
  const { data, error } = await supabase()
    .from("workouts")
    .select(WORKOUT_SELECT)
    .eq("is_builtin", true)
    .order("name");
  if (error) throw error;
  return (data ?? []).map((w) => normalizeWorkoutRow(w as Record<string, unknown>));
}

export async function fetchUserWorkouts(): Promise<WorkoutWithExercises[]> {
  return fetchUserWorkoutsInternal();
}

async function fetchUserWorkoutsInternal(): Promise<WorkoutWithExercises[]> {
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
  return (data ?? []).map((w) => normalizeWorkoutRow(w as Record<string, unknown>));
}

export async function fetchWorkoutById(
  id: string
): Promise<WorkoutWithExercises | null> {
  const { data, error } = await supabase()
    .from("workouts")
    .select(WORKOUT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return normalizeWorkoutRow(data as Record<string, unknown>);
}

export async function createWorkout(name: string): Promise<Workout> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("workouts")
    .insert({ name, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWorkout(
  id: string,
  name: string
): Promise<Workout> {
  const { data, error } = await supabase()
    .from("workouts")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase().from("workouts").delete().eq("id", id);
  if (error) throw error;
}

// ----- Exercises -----

export async function addExercises(
  workoutId: string,
  exercises: Omit<WorkoutExercise, "id" | "workout_id" | "created_at" | "updated_at">[]
): Promise<WorkoutExercise[]> {
  const rows = exercises.map((e) => ({ ...e, workout_id: workoutId }));
  const { data, error } = await supabase()
    .from("workout_exercises")
    .insert(rows)
    .select();
  if (error) throw error;
  return data ?? [];
}

export async function deleteExercisesByWorkout(
  workoutId: string
): Promise<void> {
  const { error } = await supabase()
    .from("workout_exercises")
    .delete()
    .eq("workout_id", workoutId);
  if (error) throw error;
}

export async function replaceExercises(
  workoutId: string,
  exercises: Omit<WorkoutExercise, "id" | "workout_id" | "created_at" | "updated_at">[]
): Promise<WorkoutExercise[]> {
  await deleteExercisesByWorkout(workoutId);
  if (exercises.length === 0) return [];
  return addExercises(workoutId, exercises);
}

// ----- Fitness Activity Log -----

export async function logFitnessActivity(
  entry: Omit<FitnessActivityLog, "id" | "completed_at" | "user_id">
): Promise<FitnessActivityLog> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("fitness_activity_log")
    .insert({ ...entry, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTodayFitnessLog(
  dateKey: string
): Promise<FitnessActivityLog | null> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("fitness_activity_log")
    .select()
    .eq("user_id", userId)
    .eq("date_key", dateKey)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchWorkoutHistory(
  limit = 60
): Promise<FitnessActivityLog[]> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("fitness_activity_log")
    .select()
    .eq("user_id", userId)
    .eq("type", "workout")
    .order("completed_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function deleteTodayFitnessLog(dateKey: string): Promise<void> {
  const { error } = await supabase()
    .from("fitness_activity_log")
    .delete()
    .eq("date_key", dateKey);
  if (error) throw error;
}

export async function getWeeklyFunActiveCountFromDb(
  todayKey: string
): Promise<number> {
  const weekDates = getCurrentWeekDates(todayKey);
  const monday = weekDates[0];
  const sunday = weekDates[6];
  const { count, error } = await supabase()
    .from("fitness_activity_log")
    .select("*", { count: "exact", head: true })
    .eq("type", "fun_active")
    .gte("date_key", monday)
    .lte("date_key", sunday);
  if (error) throw error;
  return count ?? 0;
}
