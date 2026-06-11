"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WorkoutWithExercises } from "@/lib/types";
import {
  estimateWorkoutCalories,
  filterWorkouts,
  todaysPickIndex,
  workoutCoverUrl,
  workoutPreviewExercises,
  workoutTotalMinutes,
} from "@/lib/workout-library-actions";
import ExerciseMedia from "./ExerciseMedia";
import WorkoutCoverImage from "./WorkoutCoverImage";

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pilates", label: "Pilates" },
  { id: "home", label: "At Home" },
  { id: "weights", label: "Weights" },
  { id: "full_body", label: "Full Body" },
  { id: "hiit", label: "HIIT" },
  { id: "upper", label: "Upper" },
  { id: "lower", label: "Lower" },
  { id: "mobility", label: "Mobility" },
  { id: "quick", label: "Quick" },
  { id: "beginner", label: "Beginner" },
];

function difficultyLabel(d: string | null | undefined): string {
  if (!d) return "";
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function WorkoutCard({ workout }: { workout: WorkoutWithExercises }) {
  const cover = workoutCoverUrl(workout);
  const mins = workoutTotalMinutes(workout);
  const cals = estimateWorkoutCalories(workout);
  const previews = workoutPreviewExercises(workout, 4);

  return (
    <div className="nisu-card overflow-hidden flex flex-col">
      <div className="relative w-full aspect-video border-b-2 border-[var(--nisu-border)] bg-[var(--nisu-pale-blue)]">
        <WorkoutCoverImage
          src={cover}
          category={workout.category}
          className="w-full h-full object-cover"
          sizes="(max-width: 640px) 100vw, 320px"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pb-3 pt-8">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-gray-900 border border-white/50">
              {mins} min
            </span>
            {workout.difficulty && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-gray-900 border border-white/50">
                {difficultyLabel(workout.difficulty)}
              </span>
            )}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-gray-900 border border-white/50">
              {workout.workout_exercises.length} moves
            </span>
          </div>
        </div>
        {workout.category && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--nisu-coral)] text-white border-2 border-[var(--nisu-border)] capitalize">
            {workout.category.replace(/_/g, " ")}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-0.5">{workout.name}</h3>
        {workout.description && (
          <p className="text-xs nisu-text-muted mb-2 line-clamp-2">
            {workout.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--nisu-pale-pink)] border border-[var(--nisu-border)]">
            ~{cals} cal
          </span>
        </div>

        {previews.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {previews.map((ex) => (
              <div
                key={ex.id}
                className="relative flex-shrink-0 w-14 h-14 rounded-lg border-2 border-[var(--nisu-border)] overflow-hidden bg-white"
              >
                <ExerciseMedia exercise={ex.exercise} alt={ex.name} />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-auto flex-wrap">
          <Link
            href={`/fitness/workout/${workout.id}`}
            className="nisu-cta-bold text-xs px-4 py-2"
          >
            Start
          </Link>
          <Link
            href={`/fitness/workout/${workout.id}`}
            className="text-xs font-bold nisu-text-muted px-2 py-2"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

interface WorkoutBrowserProps {
  workouts: WorkoutWithExercises[];
}

export default function WorkoutBrowser({ workouts }: WorkoutBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () => filterWorkouts(workouts, category, query),
    [workouts, category, query]
  );

  const pick =
    filtered.length > 0
      ? filtered[todaysPickIndex(filtered.length)]
      : workouts[todaysPickIndex(workouts.length)] ?? null;

  if (workouts.length === 0) {
    return (
      <div className="nisu-card p-10 text-center">
        <span className="text-4xl mb-3 block">🏋️</span>
        <p className="font-bold text-gray-900 mb-1">Library not seeded yet</p>
        <p className="text-sm nisu-text-muted mb-4">
          Run <code className="text-xs bg-gray-100 px-1 rounded">npm run seed:workouts</code> to load 150+ workouts.
        </p>
      </div>
    );
  }

  return (
    <div>
      {pick && (
        <div className="nisu-card overflow-hidden mb-6 border-2 border-[var(--nisu-sky)]">
          <div className="relative w-full h-40 sm:h-44">
            <WorkoutCoverImage
              src={workoutCoverUrl(pick)}
              category={pick.category}
              className="w-full h-full object-cover"
              sizes="600px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--nisu-pale-pink)] mb-1">
                Today&apos;s pick
              </p>
              <h2 className="font-extrabold text-white text-lg truncate max-w-[70%]">
                {pick.name}
              </h2>
              <p className="text-xs text-white/90">
                {workoutTotalMinutes(pick)} min · {pick.workout_exercises.length} exercises
              </p>
            </div>
            <Link
              href={`/fitness/workout/${pick.id}`}
              className="absolute bottom-5 right-5 nisu-cta-bold text-xs px-4 py-2.5"
            >
              Go
            </Link>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workouts, muscles, equipment…"
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--nisu-border)] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)] bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-full border-2 transition-colors cursor-pointer ${
              category === c.id
                ? "bg-[var(--nisu-coral)] text-white border-[var(--nisu-border)]"
                : "bg-white border-[var(--nisu-border)] text-gray-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-sm nisu-text-muted mb-4">
        {filtered.length} workout{filtered.length !== 1 ? "s" : ""} in NISU Gym
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((w) => (
          <WorkoutCard key={w.id} workout={w} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm nisu-text-muted py-8">
          No workouts match. Try another filter.
        </p>
      )}
    </div>
  );
}
