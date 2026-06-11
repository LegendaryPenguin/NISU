import type { Exercise, WorkoutCategory } from "./types";

/** ExerciseDB static CDN — used until Supabase Storage mirror is seeded */
export function exercisedbGifUrl(nameOrId: string): string {
  const slug = nameOrId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://static.exercisedb.dev/media/${slug}.gif`;
}

export function categoryCoverUrl(category: WorkoutCategory | string): string {
  return `/workouts/${category}.svg`;
}

export function resolveExerciseGif(exercise: Exercise | null | undefined): string {
  if (!exercise) return "/workouts/home.svg";
  if (exercise.gif_url) return exercise.gif_url;
  if (exercise.source_id) return exercisedbGifUrl(exercise.source_id);
  if (exercise.slug) return exercisedbGifUrl(exercise.slug);
  return categoryCoverUrl(exercise.muscle_group ?? "home");
}

export function resolveExerciseStill(exercise: Exercise | null | undefined): string {
  if (!exercise) return "/workouts/home.svg";
  if (exercise.image_url) return exercise.image_url;
  return resolveExerciseGif(exercise);
}

export function shouldUseStillImage(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
