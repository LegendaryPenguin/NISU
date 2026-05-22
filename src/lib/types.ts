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
  completed: boolean;
  // Legacy fields kept for backward compat with older localStorage entries
  selectedChallenge?: Challenge | null;
  completedChallengeIds?: string[];
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

// --- Skill / Supabase types ---

export interface SkillItem {
  id: string;
  user_id: string | null;
  kind: "main" | "wheel";
  name: string;
  time: string;
  description: string;
  repeatable: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillActivityLog {
  id: string;
  user_id: string | null;
  date_key: string;
  type: "main" | "wheel";
  skill_item_id: string | null;
  skill_name: string;
  skill_time: string | null;
  skill_description: string | null;
  completed_at: string;
}

export interface DailyWheelSelection {
  id: string;
  user_id: string | null;
  date_key: string;
  skill_item_id: string;
  skill_name: string;
  skill_time: string | null;
  skill_description: string | null;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

// --- Fuel / Recipe types ---

export interface Recipe {
  id: string;
  user_id: string | null;
  name: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  text: string;
  order_index: number;
}

export interface RecipeStep {
  id: string;
  recipe_id: string;
  instruction: string;
  timer_seconds: number | null;
  order_index: number;
}

export interface RecipeWithDetails extends Recipe {
  recipe_ingredients: RecipeIngredient[];
  recipe_steps: RecipeStep[];
}

// --- Journal / Brain Dump types ---

export interface JournalEntry {
  id: string;
  user_id: string | null;
  date_key: string;
  mind: string;
  next_action: string;
  avoiding: string;
  good_thing: string;
  extra_dump: string | null;
  created_at: string;
}
