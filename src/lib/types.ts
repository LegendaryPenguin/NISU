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

export type WorkoutCategory =
  | "pilates"
  | "home"
  | "weights"
  | "full_body"
  | "hiit"
  | "upper"
  | "lower"
  | "mobility";

export type WorkoutDifficulty = "easy" | "medium" | "hard";

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  instructions?: string[] | null;
  image_url?: string | null;
  gif_url?: string | null;
  muscle_group?: string | null;
  equipment?: string | null;
  difficulty?: WorkoutDifficulty | string | null;
  mechanic?: string | null;
  source?: string | null;
  source_id?: string | null;
  is_builtin?: boolean;
}

export interface Workout {
  id: string;
  user_id: string | null;
  name: string;
  is_builtin?: boolean;
  category?: WorkoutCategory | string | null;
  description?: string | null;
  cover_image_url?: string | null;
  difficulty?: WorkoutDifficulty | string | null;
  estimated_minutes?: number | null;
  equipment_tags?: string[] | null;
  tags?: string[] | null;
  calories_estimate?: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id?: string | null;
  name: string;
  type: "sets_reps" | "timed";
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
  instructions_override?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  exercise?: Exercise | null;
}

export interface WorkoutWithExercises extends Workout {
  workout_exercises: WorkoutExercise[];
}

export interface SeedExercise {
  slug: string;
  name: string;
  description?: string;
  instructions?: string[];
  muscle_group?: string;
  equipment?: string;
  difficulty?: WorkoutDifficulty;
  mechanic?: string;
  source_id?: string;
  exercisedb_name?: string;
  gif_url?: string;
  image_url?: string;
}

export interface SeedWorkoutExercise {
  exerciseSlug: string;
  type?: "sets_reps" | "timed";
  sets?: number;
  reps?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  notes?: string;
}

export interface SeedWorkout {
  name: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  description: string;
  tags: string[];
  equipment_tags: string[];
  exercises: SeedWorkoutExercise[];
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

export type RecipeCategory =
  | "breakfast"
  | "dal"
  | "rice"
  | "curry"
  | "bread"
  | "snack"
  | "dessert"
  | "drink";

export type RecipeRegion = "north" | "south" | "pan-indian";
export type RecipeDifficulty = "easy" | "medium";

export interface Recipe {
  id: string;
  user_id: string | null;
  name: string;
  is_builtin?: boolean;
  category?: RecipeCategory | string | null;
  region?: RecipeRegion | string | null;
  description?: string | null;
  image_url?: string | null;
  prep_minutes?: number | null;
  cook_minutes?: number | null;
  difficulty?: RecipeDifficulty | string | null;
  tags?: string[] | null;
  servings?: number | null;
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
  step_ingredients?: string[] | null;
  image_url?: string | null;
  youtube_url?: string | null;
  tip?: string | null;
}

export interface RecipeWithDetails extends Recipe {
  recipe_ingredients: RecipeIngredient[];
  recipe_steps: RecipeStep[];
}

export interface SeedRecipeStep {
  instruction: string;
  timer_seconds?: number | null;
  step_ingredients?: string[];
  image_url?: string | null;
  youtube_url?: string | null;
  tip?: string | null;
}

export interface SeedRecipe {
  name: string;
  category: RecipeCategory;
  region: RecipeRegion;
  description: string;
  image_url: string;
  prep_minutes: number;
  cook_minutes: number;
  difficulty: RecipeDifficulty;
  tags: string[];
  servings: number;
  ingredients: string[];
  steps: SeedRecipeStep[];
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
