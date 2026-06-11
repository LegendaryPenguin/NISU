import type { Exercise, WorkoutCategory } from "./types";
import gifUrlMap from "@/data/exercises/gif-url-map.json";

const BROKEN_CDN_HOST = "static.exercisedb.dev";
const GIF_MAP = gifUrlMap as Record<string, string>;

function mapLookup(...keys: (string | null | undefined)[]): string | null {
  for (const key of keys) {
    if (!key) continue;
    const hit = GIF_MAP[key];
    if (hit) return hit;
  }
  return null;
}

function isBrokenCdn(url: string): boolean {
  return url.includes(BROKEN_CDN_HOST);
}

/** Resolve a working GIF URL (jsDelivr mirror — ExerciseDB slug CDN returns 404). */
export function exercisedbGifUrl(nameOrId: string): string {
  return (
    mapLookup(nameOrId) ??
    `https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@main/assets/0662.gif`
  );
}

export function categoryCoverUrl(category: WorkoutCategory | string): string {
  return `/workouts/${category}.svg`;
}

export function resolveExerciseGif(exercise: Exercise | null | undefined): string {
  if (!exercise) return "/workouts/home.svg";

  const fromMap = mapLookup(exercise.slug, exercise.source_id ?? undefined);
  if (fromMap) return fromMap;

  if (exercise.gif_url && !isBrokenCdn(exercise.gif_url)) {
    return exercise.gif_url;
  }

  if (exercise.slug) return exercisedbGifUrl(exercise.slug);
  return categoryCoverUrl(exercise.muscle_group ?? "home");
}

export function resolveExerciseStill(exercise: Exercise | null | undefined): string {
  if (!exercise) return "/workouts/home.svg";

  const fromMap = mapLookup(exercise.slug, exercise.source_id ?? undefined);
  if (fromMap) return fromMap;

  if (exercise.image_url && !isBrokenCdn(exercise.image_url)) {
    return exercise.image_url;
  }

  return resolveExerciseGif(exercise);
}

export function shouldUseStillImage(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
