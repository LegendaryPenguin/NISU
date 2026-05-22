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

export async function fetchWorkouts(): Promise<WorkoutWithExercises[]> {
  const { data, error } = await supabase()
    .from("workouts")
    .select("*, workout_exercises(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((w) => ({
    ...w,
    workout_exercises: (w.workout_exercises ?? []).sort(
      (a: WorkoutExercise, b: WorkoutExercise) => a.order_index - b.order_index
    ),
  }));
}

export async function fetchWorkoutById(
  id: string
): Promise<WorkoutWithExercises | null> {
  const { data, error } = await supabase()
    .from("workouts")
    .select("*, workout_exercises(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    workout_exercises: (data.workout_exercises ?? []).sort(
      (a: WorkoutExercise, b: WorkoutExercise) => a.order_index - b.order_index
    ),
  };
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
  const { data, error } = await supabase()
    .from("fitness_activity_log")
    .select()
    .eq("date_key", dateKey)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
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
