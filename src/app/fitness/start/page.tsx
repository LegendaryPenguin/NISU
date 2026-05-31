"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import type { WorkoutWithExercises, WorkoutExercise } from "@/lib/types";
import { formatDuration } from "@/lib/helpers";
import { fetchWorkouts } from "@/lib/fitness-actions";
import { useDailyProgress } from "@/context/DailyProgressContext";

type Phase = "select" | "running" | "complete";

export default function WorkoutStartPage() {
  const router = useRouter();
  const {
    progress,
    completeFitnessViaWorkout,
  } = useDailyProgress();

  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutWithExercises | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    fetchWorkouts()
      .then(setWorkouts)
      .catch(() => setError("Failed to load workouts."))
      .finally(() => setLoading(false));
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerSeconds]);

  const currentExercise: WorkoutExercise | null =
    selectedWorkout?.workout_exercises[currentIdx] ?? null;

  const totalExercises = selectedWorkout?.workout_exercises.length ?? 0;

  const startWorkout = (w: WorkoutWithExercises) => {
    setSelectedWorkout(w);
    setCurrentIdx(0);
    setCurrentSet(1);
    setPhase("running");
    initExerciseState(w.workout_exercises[0]);
  };

  const initExerciseState = useCallback((ex: WorkoutExercise) => {
    if (ex.type === "timed") {
      setTimerSeconds(ex.duration_seconds ?? 60);
      setTimerRunning(false);
      setTimerDone(false);
    }
    setCurrentSet(1);
  }, []);

  const moveToNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= totalExercises) {
      setPhase("complete");
    } else {
      setCurrentIdx(nextIdx);
      const nextEx = selectedWorkout!.workout_exercises[nextIdx];
      initExerciseState(nextEx);
    }
  };

  const handleLogSet = () => {
    if (!currentExercise) return;
    if (currentSet >= (currentExercise.sets ?? 1)) {
      moveToNext();
    } else {
      setCurrentSet((prev) => prev + 1);
    }
  };

  const handleTimerStart = () => setTimerRunning(true);
  const handleTimerPause = () => setTimerRunning(false);
  const handleTimerReset = () => {
    setTimerRunning(false);
    setTimerDone(false);
    setTimerSeconds(currentExercise?.duration_seconds ?? 60);
  };

  const handleFinish = async () => {
    if (!selectedWorkout) return;
    setFinishing(true);
    setError(null);
    try {
      await completeFitnessViaWorkout(selectedWorkout.id, selectedWorkout.name);
      router.push("/daily");
    } catch {
      setError("Failed to save workout completion. Please try again.");
      setFinishing(false);
    }
  };

  // Already complete guard
  if (progress.fitness.completed) {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <span className="text-5xl mb-4 block">✅</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Fitness Already Complete
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            You already completed today&apos;s Fitness pillar.
          </p>
          <button
            onClick={() => router.push("/daily")}
            className="bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Back to Daily Routine
          </button>
        </div>
      </div>
    );
  }

  // PHASE: SELECT
  if (phase === "select") {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <PageHeader
            title="Start Workout"
            section="fitness"
            subtitle="Select a saved workout to begin."
            showBack
          />

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
            </div>
          ) : workouts.length === 0 ? (
            <div className="nisu-card p-8 text-center">
              <span className="text-4xl mb-3 block">🏋️</span>
              <p className="text-gray-600 font-semibold mb-1">
                No workouts yet
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Create one first in the Fitness page.
              </p>
              <button
                onClick={() => router.push("/fitness")}
                className="nisu-cta-bold text-sm px-5 py-2.5 cursor-pointer"
              >
                Go to Fitness Page
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((w) => {
                const hasExercises = w.workout_exercises.length > 0;
                return (
                  <div
                    key={w.id}
                    className="nisu-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{w.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {w.workout_exercises.length} exercise
                          {w.workout_exercises.length !== 1 ? "s" : ""}
                          {w.workout_exercises.length > 0 && (
                            <span className="ml-2">
                              {w.workout_exercises.map((ex) =>
                                ex.type === "sets_reps"
                                  ? `${ex.sets}×${ex.reps}`
                                  : formatDuration(ex.duration_seconds ?? 0)
                              ).join(" · ")}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => hasExercises && startWorkout(w)}
                        disabled={!hasExercises}
                        className={`text-sm font-bold px-5 py-2 rounded-full transition-colors ${
                          hasExercises
                            ? "nisu-cta-bold cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {hasExercises ? "Start" : "No exercises"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    );
  }

  // PHASE: RUNNING
  if (phase === "running" && currentExercise) {
    const progressPct = ((currentIdx + 1) / totalExercises) * 100;

    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Workout header */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-[var(--nisu-coral)] uppercase tracking-wide mb-1">
              {selectedWorkout?.name}
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Exercise {currentIdx + 1} of {totalExercises}
              </span>
              <span className="text-xs text-gray-400">
                {Math.round(progressPct)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--nisu-sky)] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Current Exercise Card */}
          <div className="nisu-card p-6 text-center">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              {currentExercise.name}
            </h2>

            {/* TIMED */}
            {currentExercise.type === "timed" && (
              <>
                <p className="text-xs text-gray-400 mb-6">
                  Duration:{" "}
                  {formatDuration(currentExercise.duration_seconds ?? 0)}
                </p>

                <div className="mb-6">
                  <div
                    className={`text-6xl font-mono font-extrabold tabular-nums ${
                      timerDone ? "text-green-500" : timerSeconds <= 10 && timerRunning ? "text-red-500" : "text-gray-900"
                    }`}
                  >
                    {Math.floor(timerSeconds / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(timerSeconds % 60).toString().padStart(2, "0")}
                  </div>
                  {timerDone && (
                    <p className="text-green-600 font-semibold text-sm mt-2">
                      Time&apos;s up!
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  {!timerDone && !timerRunning && (
                    <button
                      onClick={handleTimerStart}
                      className="nisu-cta-bold font-bold px-6 py-3 cursor-pointer"
                    >
                      {timerSeconds ===
                      (currentExercise.duration_seconds ?? 60)
                        ? "Start"
                        : "Resume"}
                    </button>
                  )}
                  {timerRunning && (
                    <button
                      onClick={handleTimerPause}
                      className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={handleTimerReset}
                    className="bg-gray-100 text-gray-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <button
                  onClick={moveToNext}
                  disabled={!timerDone}
                  className={`w-full py-3.5 rounded-full font-bold text-sm transition-colors ${
                    timerDone
                      ? "nisu-cta-bold cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {currentIdx + 1 < totalExercises
                    ? "Next Exercise →"
                    : "Finish Workout →"}
                </button>
              </>
            )}

            {/* SETS & REPS */}
            {currentExercise.type === "sets_reps" && (
              <>
                <p className="text-xs text-gray-400 mb-6">
                  {currentExercise.sets} sets × {currentExercise.reps} reps
                </p>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Set{" "}
                    <span className="font-bold text-gray-900 text-lg">
                      {currentSet}
                    </span>{" "}
                    of {currentExercise.sets}
                  </p>
                  <div className="flex justify-center gap-1.5 mb-4">
                    {Array.from(
                      { length: currentExercise.sets ?? 1 },
                      (_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-2 rounded-full transition-all ${
                            i < currentSet - 1
                              ? "bg-[var(--nisu-coral)]"
                              : i === currentSet - 1
                              ? "bg-[var(--nisu-pink)]"
                              : "bg-gray-200"
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogSet}
                  className="w-full py-4 rounded-full nisu-cta-bold font-bold text-lg cursor-pointer mb-3"
                >
                  Log {currentExercise.reps} reps ✓
                </button>

                <p className="text-xs text-gray-400">
                  {currentSet < (currentExercise.sets ?? 1)
                    ? `${(currentExercise.sets ?? 1) - currentSet} set${
                        (currentExercise.sets ?? 1) - currentSet > 1
                          ? "s"
                          : ""
                      } remaining`
                    : "Last set — you got this!"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PHASE: COMPLETE
  if (phase === "complete") {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Workout Complete!
          </h1>
          <p className="text-sm text-gray-500 mb-2">
            {selectedWorkout?.name}
          </p>
          <p className="text-xs text-gray-400 mb-8">
            {totalExercises} exercise{totalExercises !== 1 ? "s" : ""}{" "}
            finished
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleFinish}
            disabled={finishing}
            className="nisu-cta-bold font-bold px-8 py-3.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {finishing ? "Saving..." : "Finish & Mark Fitness Complete"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
