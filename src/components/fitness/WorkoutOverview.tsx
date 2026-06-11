"use client";

import type { WorkoutWithExercises } from "@/lib/types";
import {
  estimateWorkoutCalories,
  workoutCoverUrl,
  workoutTotalMinutes,
} from "@/lib/workout-library-actions";
import ExerciseMedia from "./ExerciseMedia";
import WorkoutCoverImage from "./WorkoutCoverImage";

interface WorkoutOverviewProps {
  workout: WorkoutWithExercises;
  onStartPrep: () => void;
}

export default function WorkoutOverview({
  workout,
  onStartPrep,
}: WorkoutOverviewProps) {
  const cover = workoutCoverUrl(workout);

  return (
    <div>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[var(--nisu-border)] mb-6 bg-[var(--nisu-pale-blue)]">
        <WorkoutCoverImage
          src={cover}
          category={workout.category}
          className="w-full h-full object-cover"
          sizes="600px"
        />
      </div>

      <div className="nisu-card p-6 mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{workout.name}</h1>
        {workout.description && (
          <p className="text-sm nisu-text-muted mb-4">{workout.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--nisu-cream)] border border-[var(--nisu-border)]">
            {workoutTotalMinutes(workout)} min
          </span>
          {workout.difficulty && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--nisu-pale-blue)] border border-[var(--nisu-border)] capitalize">
              {workout.difficulty}
            </span>
          )}
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--nisu-pale-pink)] border border-[var(--nisu-border)]">
            ~{estimateWorkoutCalories(workout)} cal
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-[var(--nisu-border)]">
            {workout.workout_exercises.length} exercises
          </span>
        </div>

        <div
          className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ backgroundColor: "var(--nisu-pale-blue)" }}
        >
          <p className="font-semibold text-gray-800">
            Lights today&apos;s Fitness lantern
          </p>
          <p className="text-xs nisu-text-muted mt-1">
            Complete this workout to mark your Fitness pillar and keep your streak
            burning with your partner.
          </p>
        </div>

        {(workout.equipment_tags ?? []).length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Equipment
            </p>
            <div className="flex flex-wrap gap-1">
              {workout.equipment_tags!.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 capitalize"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
          Exercise preview
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {workout.workout_exercises.map((ex) => (
            <div key={ex.id} className="flex-shrink-0 w-20 text-center">
              <div className="relative w-16 h-16 mx-auto rounded-xl border-2 border-[var(--nisu-border)] overflow-hidden bg-white mb-1">
                <ExerciseMedia exercise={ex.exercise} alt={ex.name} />
              </div>
              <p className="text-[10px] font-semibold text-gray-600 line-clamp-2">
                {ex.name}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStartPrep}
          className="w-full nisu-cta-bold font-bold py-3.5 cursor-pointer"
        >
          Continue to prep →
        </button>
      </div>
    </div>
  );
}
