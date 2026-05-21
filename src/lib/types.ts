export interface FitnessState {
  designatedWorkout: boolean;
  stepCount: boolean;
  funActive: boolean;
  completed: boolean;
  completionType?: "workout" | "steps" | "fun_active" | null;
  completionDetail?: string | null;
}

export interface FuelState {
  protein: boolean;
  water: boolean;
  sugaryFoods: number;
  completed: boolean;
}

export interface SkillState {
  requiredBlocks: number;
  completedBlocks: number;
  selectedChallenge: Challenge | null;
  completedChallengeIds: string[];
  completed: boolean;
}

export interface ResetState {
  reading: boolean;
  journaling: boolean;
  meditation: boolean;
  outside: boolean;
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  fitness: FitnessState;
  fuel: FuelState;
  skill: SkillState;
  reset: ResetState;
}

export interface Challenge {
  id: string;
  title: string;
  time: string;
  description: string;
  repeatable: boolean;
  active: boolean;
}

export type PillarName = "fitness" | "fuel" | "skill" | "reset";

// --- Fitness / Supabase types ---

export interface Workout {
  id: string;
  user_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  name: string;
  type: "sets_reps" | "timed";
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutWithExercises extends Workout {
  workout_exercises: WorkoutExercise[];
}

export interface FitnessActivityLog {
  id: string;
  user_id: string | null;
  date_key: string;
  type: "workout" | "steps" | "fun_active";
  workout_id: string | null;
  workout_name: string | null;
  description: string | null;
  steps_confirmed: boolean | null;
  fun_active_description: string | null;
  completed_at: string;
}
