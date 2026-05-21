"use client";

import { useState } from "react";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";

type CardFlow = "idle" | "steps" | "funActive";

export default function FitnessCard() {
  const {
    progress,
    weeklyFunActiveCount,
    completeFitnessViaSteps,
    completeFitnessViaFunActive,
  } = useDailyProgress();

  const { fitness } = progress;
  const [flow, setFlow] = useState<CardFlow>("idle");
  const [funActiveDesc, setFunActiveDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const funActiveLimitReached = weeklyFunActiveCount >= 2;

  const handleConfirmSteps = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await completeFitnessViaSteps();
      setFlow("idle");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitFunActive = async () => {
    const trimmed = funActiveDesc.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    try {
      await completeFitnessViaFunActive(trimmed);
      setFunActiveDesc("");
      setFlow("idle");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Completed state
  if (fitness.completed) {
    const completionLabel =
      fitness.completionType === "workout"
        ? `Completed via Workout: ${fitness.completionDetail || "Custom"}`
        : fitness.completionType === "steps"
        ? "Completed via Steps (15k+)"
        : fitness.completionType === "fun_active"
        ? `Completed via Fun Active: ${fitness.completionDetail || ""}`
        : "Fitness complete";

    return (
      <div className="rounded-2xl p-5 shadow-md border-l-4 border-l-blue-500 bg-blue-50/80 shadow-blue-100 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💪</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Fitness</h3>
              <p className="text-xs text-gray-400 italic">
                Move your body today.
              </p>
            </div>
          </div>
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Complete
          </span>
        </div>

        <div className="bg-blue-100/60 rounded-xl px-4 py-3 mb-3">
          <p className="text-sm font-semibold text-blue-800">
            ✅ {completionLabel}
          </p>
        </div>

        <Link
          href="/fitness"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
        >
          Manage Workouts →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 shadow-md border-l-4 border-l-blue-400 bg-white transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💪</span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Fitness</h3>
            <p className="text-xs text-gray-400 italic">
              Move your body today.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3 font-medium">
        Complete 1 of 3:
      </p>

      {error && (
        <div className="text-xs bg-red-50 text-red-500 px-3 py-2 rounded-lg mb-3">
          {error}
        </div>
      )}

      {flow === "idle" && (
        <div className="space-y-2 mb-3">
          <Link
            href="/fitness/start"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left"
          >
            <span className="text-lg">🏋️</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Start Workout
              </p>
              <p className="text-xs text-gray-400">
                Select and complete a saved workout
              </p>
            </div>
          </Link>

          <button
            onClick={() => setFlow("steps")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left cursor-pointer"
          >
            <span className="text-lg">👟</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Confirm Steps
              </p>
              <p className="text-xs text-gray-400">
                Confirm you hit 15,000 steps
              </p>
            </div>
          </button>

          <button
            onClick={() => !funActiveLimitReached && setFlow("funActive")}
            disabled={funActiveLimitReached}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
              funActiveLimitReached
                ? "bg-gray-50 opacity-50 cursor-not-allowed"
                : "bg-blue-50 hover:bg-blue-100 cursor-pointer"
            }`}
          >
            <span className="text-lg">🏄</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Log Fun Active
              </p>
              <p className="text-xs text-gray-400">
                Sports, hiking, swimming...
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Step Count Confirmation */}
      {flow === "steps" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Step Count Confirmation
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Did your health app say you completed 15,000 steps today?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmSteps}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Yes, completed 15k steps"}
            </button>
            <button
              onClick={() => setFlow("idle")}
              disabled={submitting}
              className="py-2.5 px-4 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fun Active Form */}
      {flow === "funActive" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Log Fun Active
          </p>
          <p className="text-xs text-gray-500 mb-3">
            What active fun did you do today?
          </p>
          <input
            type="text"
            value={funActiveDesc}
            onChange={(e) => setFunActiveDesc(e.target.value)}
            placeholder="Basketball for 45 min, long walk, swimming..."
            className="w-full px-3 py-2.5 rounded-lg border border-blue-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitFunActive}
              disabled={submitting || !funActiveDesc.trim()}
              className="flex-1 py-2.5 px-4 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Complete Fun Active"}
            </button>
            <button
              onClick={() => {
                setFlow("idle");
                setFunActiveDesc("");
              }}
              disabled={submitting}
              className="py-2.5 px-4 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        className={`text-xs px-3 py-2 rounded-lg mb-3 ${
          funActiveLimitReached
            ? "bg-amber-50 text-amber-600"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        Fun Active used this week:{" "}
        <span className="font-bold">{weeklyFunActiveCount} / 2</span>
        {funActiveLimitReached &&
          " — Weekly limit reached. Choose Workout or Steps."}
      </div>

      <Link
        href="/fitness"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
      >
        Manage Workouts →
      </Link>
    </div>
  );
}
