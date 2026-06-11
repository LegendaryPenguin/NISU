"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkoutExercise, WorkoutWithExercises } from "@/lib/types";
import { formatDuration } from "@/lib/helpers";
import PenguinBounce from "@/components/motion/PenguinBounce";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import ExerciseMedia from "./ExerciseMedia";

type RunnerPhase = "exercise" | "rest";

interface SessionState {
  workoutId: string;
  currentIdx: number;
  currentSet: number;
  phase: RunnerPhase;
  restSeconds: number;
}

function sessionKey(workoutId: string) {
  return `nisu-workout-session-${workoutId}`;
}

interface WorkoutExerciseRunnerProps {
  workout: WorkoutWithExercises;
  onComplete: () => void;
  onPauseExit?: () => void;
}

export default function WorkoutExerciseRunner({
  workout,
  onComplete,
  onPauseExit,
}: WorkoutExerciseRunnerProps) {
  const exercises = workout.workout_exercises;
  const total = exercises.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<RunnerPhase>("exercise");
  const [restSeconds, setRestSeconds] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showHalfway, setShowHalfway] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const halfwayShown = useRef(false);

  const current: WorkoutExercise = exercises[currentIdx];
  const nextEx: WorkoutExercise | null = exercises[currentIdx + 1] ?? null;

  const persistSession = useCallback(() => {
    const state: SessionState = {
      workoutId: workout.id,
      currentIdx,
      currentSet,
      phase,
      restSeconds,
    };
    sessionStorage.setItem(sessionKey(workout.id), JSON.stringify(state));
  }, [workout.id, currentIdx, currentSet, phase, restSeconds]);

  useEffect(() => {
    const raw = sessionStorage.getItem(sessionKey(workout.id));
    if (!raw) return;
    try {
      const s = JSON.parse(raw) as SessionState;
      if (s.workoutId === workout.id) {
        setCurrentIdx(s.currentIdx);
        setCurrentSet(s.currentSet);
        setPhase(s.phase);
        setRestSeconds(s.restSeconds);
      }
    } catch {
      /* ignore */
    }
  }, [workout.id]);

  useEffect(() => {
    persistSession();
  }, [persistSession]);

  const initTimed = useCallback((ex: WorkoutExercise) => {
    setTimerSeconds(ex.duration_seconds ?? 60);
    setTimerRunning(false);
    setTimerDone(false);
  }, []);

  useEffect(() => {
    if (phase === "exercise" && current?.type === "timed") {
      initTimed(current);
    }
  }, [currentIdx, phase, current, initTimed]);

  useEffect(() => {
    if (phase === "rest" && restSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRestSeconds((p) => {
          if (p <= 1) {
            setPhase("exercise");
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    } else if (timerRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((p) => {
          if (p <= 1) {
            setTimerRunning(false);
            setTimerDone(true);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, restSeconds, timerRunning, timerSeconds]);

  useEffect(() => {
    if (!halfwayShown.current && currentIdx >= Math.floor(total / 2)) {
      halfwayShown.current = true;
      setShowHalfway(true);
      const t = setTimeout(() => setShowHalfway(false), 2500);
      return () => clearTimeout(t);
    }
  }, [currentIdx, total]);

  const afterSetOrExercise = () => {
    const sets = current.sets ?? 1;
    const rest = current.rest_seconds ?? 45;

    if (currentSet < sets) {
      setCurrentSet((s) => s + 1);
      if (rest > 0) {
        setRestSeconds(rest);
        setPhase("rest");
      }
      return;
    }

    if (currentIdx + 1 >= total) {
      sessionStorage.removeItem(sessionKey(workout.id));
      onComplete();
      return;
    }

    setCurrentIdx((i) => i + 1);
    setCurrentSet(1);
    if (rest > 0) {
      setRestSeconds(rest);
      setPhase("rest");
    } else {
      setPhase("exercise");
    }
  };

  const handleLogSet = () => afterSetOrExercise();

  const handleTimedNext = () => {
    if (!timerDone && current.type === "timed") return;
    afterSetOrExercise();
  };

  const handleSkipRest = () => {
    setRestSeconds(0);
    setPhase("exercise");
  };

  const handleSkipExercise = () => {
    if (!confirm("Skip this exercise?")) return;
    setCurrentSet(1);
    if (currentIdx + 1 >= total) {
      sessionStorage.removeItem(sessionKey(workout.id));
      onComplete();
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase("exercise");
    }
  };

  const handlePause = () => {
    persistSession();
    onPauseExit?.();
  };

  const cue =
    current.instructions_override ??
    current.notes ??
    current.exercise?.instructions?.[0] ??
    current.exercise?.description ??
    null;

  const progressPct = ((currentIdx + 1) / total) * 100;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--nisu-coral)] uppercase tracking-wide">
          {workout.name}
        </span>
        <button
          type="button"
          onClick={handlePause}
          className="text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          Pause
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          {phase === "rest" ? "Rest" : `Exercise ${currentIdx + 1} of ${total}`}
        </span>
        <span className="text-xs text-gray-400">{Math.round(progressPct)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[var(--nisu-sky)] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {showHalfway && (
        <div className="text-center mb-4 nisu-workout-phase-enter">
          <PenguinBounce
            src={NISU_ASSETS.penguins.fitness}
            width={56}
            height={56}
            className="w-14 h-14 mx-auto mb-1"
            bounceKey="halfway"
          />
          <p className="text-sm font-bold text-[var(--nisu-coral)]">Halfway there!</p>
        </div>
      )}

      {phase === "rest" ? (
        <div className="nisu-card p-8 text-center nisu-workout-phase-enter">
          <p className="text-sm text-gray-500 mb-2">Rest before next set</p>
          <p className="text-5xl font-mono font-extrabold text-gray-900 mb-6">
            {Math.floor(restSeconds / 60)
              .toString()
              .padStart(2, "0")}
            :{(restSeconds % 60).toString().padStart(2, "0")}
          </p>
          {nextEx && currentIdx + 1 < total && currentSet >= (current.sets ?? 1) && (
            <div className="flex items-center gap-3 justify-center mb-6 p-3 rounded-xl bg-gray-50">
              <div className="relative w-12 h-12 rounded-lg border overflow-hidden flex-shrink-0">
                <ExerciseMedia exercise={nextEx.exercise} alt={nextEx.name} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Up next</p>
                <p className="text-sm font-bold text-gray-800">{nextEx.name}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleSkipRest}
            className="nisu-cta-bold font-bold px-8 py-3 cursor-pointer"
          >
            Skip rest
          </button>
        </div>
      ) : (
        <div className="nisu-card overflow-hidden nisu-workout-phase-enter">
          <div className="relative w-full aspect-[4/3] bg-[var(--nisu-pale-blue)] border-b-2 border-[var(--nisu-border)]">
            <ExerciseMedia
              exercise={current.exercise}
              alt={current.name}
              className="w-full h-full object-contain p-2"
              priority
            />
          </div>

          <div className="p-6">
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">{current.name}</h2>
            {cue && (
              <p className="text-sm text-[var(--nisu-coral)] font-medium mb-3 italic">
                &ldquo;{cue}&rdquo;
              </p>
            )}

            {current.type === "timed" ? (
              <>
                <p className="text-xs text-gray-400 mb-4">
                  Hold for {formatDuration(current.duration_seconds ?? 0)}
                </p>
                <div className="text-5xl font-mono font-extrabold text-center mb-4 tabular-nums">
                  {Math.floor(timerSeconds / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timerSeconds % 60).toString().padStart(2, "0")}
                </div>
                <div className="flex justify-center gap-2 mb-4">
                  {!timerDone && !timerRunning && (
                    <button
                      type="button"
                      onClick={() => setTimerRunning(true)}
                      className="nisu-cta-bold font-bold px-6 py-2.5 cursor-pointer"
                    >
                      Start
                    </button>
                  )}
                  {timerRunning && (
                    <button
                      type="button"
                      onClick={() => setTimerRunning(false)}
                      className="bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                    >
                      Pause
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleTimedNext}
                  disabled={!timerDone}
                  className={`w-full py-3.5 rounded-full font-bold text-sm ${
                    timerDone
                      ? "nisu-cta-bold cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {currentIdx + 1 < total ? "Next exercise →" : "Finish workout →"}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-4">
                  {current.sets} sets × {current.reps} reps
                </p>
                <p className="text-sm text-gray-500 mb-2 text-center">
                  Set{" "}
                  <span className="font-bold text-gray-900 text-lg">{currentSet}</span> of{" "}
                  {current.sets}
                </p>
                <div className="flex justify-center gap-1.5 mb-4">
                  {Array.from({ length: current.sets ?? 1 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-2 rounded-full ${
                        i < currentSet - 1
                          ? "bg-[var(--nisu-coral)]"
                          : i === currentSet - 1
                          ? "bg-[var(--nisu-pink)]"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleLogSet}
                  className="w-full py-4 rounded-full nisu-cta-bold font-bold text-lg cursor-pointer mb-2"
                >
                  Log {current.reps} reps ✓
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleSkipExercise}
              className="w-full text-xs font-medium text-gray-400 py-2 cursor-pointer hover:text-gray-600"
            >
              Skip exercise
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
