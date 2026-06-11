"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import WorkoutOverview from "@/components/fitness/WorkoutOverview";
import WorkoutPrepChecklist from "@/components/fitness/WorkoutPrepChecklist";
import WorkoutExerciseRunner from "@/components/fitness/WorkoutExerciseRunner";
import WorkoutVictorySplash from "@/components/motion/WorkoutVictorySplash";
import PenguinBounce from "@/components/motion/PenguinBounce";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import type { WorkoutWithExercises } from "@/lib/types";
import { fetchLibraryWorkoutById } from "@/lib/workout-library-actions";
import { useDailyProgress } from "@/context/DailyProgressContext";

type Stage = "loading" | "error" | "overview" | "prep" | "active" | "done";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params.id as string;
  const { progress, completeFitnessViaWorkout } = useDailyProgress();

  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchLibraryWorkoutById(workoutId);
      if (!data || !data.is_builtin) {
        setStage("error");
        return;
      }
      if (data.workout_exercises.length === 0) {
        setStage("error");
        return;
      }
      setWorkout(data);
      setStage("overview");
    } catch {
      setStage("error");
    }
  }, [workoutId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFinish = async () => {
    if (!workout) return;
    setFinishing(true);
    setError(null);
    try {
      await completeFitnessViaWorkout(workout.id, workout.name);
      router.push("/daily");
    } catch {
      setError("Failed to save. Please try again.");
      setFinishing(false);
    }
  };

  if (stage === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
      </div>
    );
  }

  if (stage === "error" || !workout) {
    return (
      <div className="min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          <PageHeader
            title="Workout"
            section="fitness"
            showBack
            backHref="/fitness?tab=library"
            backLabel="Back to library"
          />
          <div className="nisu-card p-10 text-center">
            <p className="font-bold text-gray-900 mb-2">Workout not found</p>
            <Link href="/fitness?tab=library" className="nisu-cta-bold text-sm px-6 py-2.5 inline-block mt-3">
              Browse workouts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (progress.fitness.completed && stage !== "done") {
    return (
      <div className="min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <span className="text-5xl mb-4 block">✅</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Fitness Already Complete
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            You already completed today&apos;s Fitness pillar.
          </p>
          <button
            type="button"
            onClick={() => router.push("/daily")}
            className="nisu-cta-bold font-bold px-8 py-3 cursor-pointer"
          >
            Back to Daily
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {stage !== "active" && stage !== "done" && (
          <PageHeader
            title={workout.name}
            section="fitness"
            showBack
            backHref="/fitness?tab=library"
            backLabel="Library"
          />
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {stage === "overview" && (
          <WorkoutOverview
            workout={workout}
            onStartPrep={() => setStage("prep")}
          />
        )}

        {stage === "prep" && (
          <WorkoutPrepChecklist
            workout={workout}
            onStart={() => setStage("active")}
            onBack={() => setStage("overview")}
          />
        )}

        {stage === "active" && (
          <WorkoutExerciseRunner
            workout={workout}
            onComplete={() => setStage("done")}
            onPauseExit={() => setStage("prep")}
          />
        )}

        {stage === "done" && (
          <>
            <WorkoutVictorySplash active />
            <div className="text-center py-8">
              <div className="nisu-card p-8 mb-6">
                <PenguinBounce
                  src={NISU_ASSETS.penguins.fitness}
                  width={80}
                  height={80}
                  className="w-20 h-20 mx-auto mb-4"
                  bounceKey="workout-done"
                />
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Workout Complete!
                </h1>
                <p className="text-sm text-gray-500">{workout.name}</p>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                disabled={finishing}
                className="nisu-cta-bold font-bold px-8 py-3.5 disabled:opacity-50 cursor-pointer"
              >
                {finishing ? "Saving..." : "Finish & Mark Fitness Complete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
