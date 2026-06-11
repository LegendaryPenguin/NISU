import { EXERCISE_CATALOG } from "./exercise-catalog";
import { buildWorkoutLibrary } from "./build-workouts";

export { EXERCISE_CATALOG, catalogBySlug } from "./exercise-catalog";
export { buildWorkoutLibrary } from "./build-workouts";

export const WORKOUT_LIBRARY = buildWorkoutLibrary();

export function categoryImage(category: string): string {
  return `/workouts/${category}.svg`;
}
