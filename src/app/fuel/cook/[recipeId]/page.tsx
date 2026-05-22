"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { RecipeWithDetails, RecipeStep } from "@/lib/types";
import { fetchRecipeById } from "@/lib/fuel-actions";

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type CookStage = "loading" | "error" | "no-steps" | "cooking" | "done";

export default function CookPage() {
  const params = useParams();
  const recipeId = params.recipeId as string;

  const [recipe, setRecipe] = useState<RecipeWithDetails | null>(null);
  const [stage, setStage] = useState<CookStage>("loading");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRecipeById(recipeId);
        if (!data) {
          setStage("error");
          return;
        }
        setRecipe(data);
        if (data.recipe_steps.length === 0) {
          setStage("no-steps");
          return;
        }
        setStage("cooking");
        initTimerForStep(data.recipe_steps[0]);
      } catch {
        setStage("error");
      }
    })();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const initTimerForStep = (step: RecipeStep) => {
    clearTimer();
    setTimerRunning(false);
    setTimerDone(false);
    if (step.timer_seconds && step.timer_seconds > 0) {
      setTimerSeconds(step.timer_seconds);
    } else {
      setTimerSeconds(0);
    }
  };

  const startTimer = () => {
    if (timerDone || timerSeconds <= 0) return;
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setTimerRunning(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearTimer();
    setTimerRunning(false);
  };

  const resetTimer = () => {
    clearTimer();
    setTimerRunning(false);
    setTimerDone(false);
    const step = recipe?.recipe_steps[currentStepIndex];
    if (step?.timer_seconds) setTimerSeconds(step.timer_seconds);
  };

  const goToStep = (idx: number) => {
    if (!recipe) return;
    clearTimer();
    setCurrentStepIndex(idx);
    initTimerForStep(recipe.recipe_steps[idx]);
  };

  const handleNext = () => {
    if (!recipe) return;
    if (currentStepIndex < recipe.recipe_steps.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      clearTimer();
      setStage("done");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) goToStep(currentStepIndex - 1);
  };

  // ----- Render stages -----

  if (stage === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-sm mx-auto">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-gray-800 font-bold text-lg mb-2">
            Recipe not found
          </p>
          <Link
            href="/fuel"
            className="inline-block mt-3 bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Back to Fuel
          </Link>
        </div>
      </div>
    );
  }

  if (stage === "no-steps") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-sm mx-auto">
          <span className="text-5xl mb-4 block">📝</span>
          <p className="text-gray-800 font-bold text-lg mb-1">
            This recipe has no steps yet
          </p>
          <p className="text-gray-400 text-sm mb-5">
            Add some steps before you start cooking.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/fuel"
              className="text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Back to Fuel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "done" && recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md mx-auto border border-emerald-100">
          <span className="text-6xl mb-5 block">🎉</span>
          <p className="text-gray-800 font-extrabold text-xl mb-1">
            Nice work!
          </p>
          <p className="text-gray-500 text-sm mb-2">
            You finished cooking:
          </p>
          <p className="text-emerald-600 font-bold text-lg mb-6">
            {recipe.name}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                initTimerForStep(recipe.recipe_steps[0]);
                setStage("cooking");
              }}
              className="bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              Cook Again
            </button>
            <Link
              href="/fuel"
              className="text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----- Cooking stage -----

  if (!recipe) return null;

  const steps = recipe.recipe_steps;
  const step = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
  const hasTimer = step.timer_seconds !== null && step.timer_seconds > 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-28 md:pb-8">
      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/fuel"
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            ← Recipes
          </Link>
          <p className="text-xs text-gray-400">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>

        {/* Recipe name */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center mb-5 tracking-tight">
          {recipe.name}
        </h1>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6">
          <p className="text-xs font-bold text-emerald-500 mb-3 uppercase tracking-wide">
            Step {currentStepIndex + 1}
          </p>
          <p className="text-lg sm:text-xl text-gray-800 font-semibold leading-relaxed mb-6">
            {step.instruction}
          </p>

          {/* Timer */}
          {hasTimer && (
            <div className="bg-emerald-50 rounded-2xl p-5 text-center mb-2">
              <p
                className={`text-4xl sm:text-5xl font-mono font-bold tracking-wider mb-4 ${
                  timerDone ? "text-emerald-500" : "text-gray-800"
                }`}
              >
                {timerDone ? "Time's up!" : formatTimer(timerSeconds)}
              </p>
              <div className="flex gap-3 justify-center">
                {!timerRunning && !timerDone && (
                  <button
                    onClick={startTimer}
                    className="bg-emerald-500 text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
                  >
                    Start
                  </button>
                )}
                {timerRunning && (
                  <button
                    onClick={pauseTimer}
                    className="bg-yellow-500 text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-yellow-600 transition-colors cursor-pointer"
                  >
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="text-sm font-medium text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            {isLastStep ? "Finish Recipe" : "Done / Next"}
          </button>
          {!isLastStep && (
            <button
              onClick={handleNext}
              className="text-sm font-medium text-gray-400 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Skip →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
