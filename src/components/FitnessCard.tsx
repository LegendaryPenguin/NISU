"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import MotionPanel from "@/components/motion/MotionPanel";
import CompleteBadge from "@/components/motion/CompleteBadge";

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
      <div className="nisu-pillar-fitness ml-2 mt-2">
        <div className="nisu-pillar-inner p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Image
              src={NISU_ASSETS.penguins.fitness}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Fitness</h3>
              <p className="text-xs nisu-text-muted italic">
                Move your body today.
              </p>
            </div>
          </div>
          <CompleteBadge backgroundColor="var(--nisu-sky)" />
        </div>

        <div
          className="rounded-xl px-4 py-3 mb-3"
          style={{ backgroundColor: "var(--nisu-pale-blue)" }}
        >
          <p className="text-sm font-semibold text-gray-800">
            ✅ {completionLabel}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/fitness/history"
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--nisu-sky)" }}
          >
            Workout history →
          </Link>
          <Link
            href="/fitness"
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--nisu-sky)" }}
          >
            Manage workouts →
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nisu-pillar-fitness ml-2 mt-2">
      <div className="nisu-pillar-inner p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={NISU_ASSETS.penguins.fitness}
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Fitness</h3>
            <p className="text-xs nisu-text-muted italic">
              Move your body today.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs nisu-text-caption mb-3">
        Complete 1 of 3:
      </p>

      {error && (
        <div
          key={error}
          className="nisu-error-enter text-xs bg-red-50 text-red-500 px-3 py-2 rounded-lg mb-3"
        >
          {error}
        </div>
      )}

      <MotionPanel panelKey={flow} origin="top">
      {flow === "idle" && (
        <div className="space-y-2 mb-3">
          <Link
            href="/fitness/start"
            className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl nisu-row-action-fitness text-left cursor-pointer hover:opacity-90"
          >
            <div>
              <p className="text-sm font-bold text-gray-900">
                Start workout
              </p>
              <p className="text-xs nisu-text-muted">
                Select and complete a saved workout
              </p>
            </div>
            <span className="text-lg flex-shrink-0">🏋</span>
          </Link>

          <button
            onClick={() => setFlow("steps")}
            className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl nisu-row-action-fitness text-left cursor-pointer hover:opacity-90"
          >
            <div>
              <p className="text-sm font-bold text-gray-900">
                Confirm Steps
              </p>
              <p className="text-xs nisu-text-muted">
                Confirm you hit 15,000 steps
              </p>
            </div>
            <span className="text-lg flex-shrink-0">👟</span>
          </button>

          <button
            onClick={() => !funActiveLimitReached && setFlow("funActive")}
            disabled={funActiveLimitReached}
            className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
              funActiveLimitReached
                ? "bg-gray-50 opacity-50 cursor-not-allowed"
                : "nisu-row-action-fitness cursor-pointer hover:opacity-90"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-gray-900">
                Log Fun Active
              </p>
              <p className="text-xs nisu-text-muted">
                Sports, hiking, swimming
              </p>
            </div>
            <span className="text-lg flex-shrink-0">🏄🏻‍♀️</span>
          </button>
        </div>
      )}

      {/* Step Count Confirmation */}
      {flow === "steps" && (
        <div
          className="rounded-xl p-4 mb-3 border"
          style={{
            backgroundColor: "var(--nisu-pale-blue)",
            borderColor: "var(--nisu-sky)",
          }}
        >
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Step Count Confirmation
          </p>
          <p className="text-xs nisu-text-muted mb-4">
            Did your health app say you completed 15,000 steps today?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmSteps}
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-full nisu-cta-bold text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
        <div
          className="rounded-xl p-4 mb-3 border"
          style={{
            backgroundColor: "var(--nisu-pale-blue)",
            borderColor: "var(--nisu-sky)",
          }}
        >
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Log Fun Active
          </p>
          <p className="text-xs nisu-text-muted mb-3">
            What active fun did you do today?
          </p>
          <input
            type="text"
            value={funActiveDesc}
            onChange={(e) => setFunActiveDesc(e.target.value)}
            placeholder="Basketball for 45 min, long walk, swimming..."
            className="w-full px-3 py-2.5 rounded-lg border bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 mb-3"
            style={{ borderColor: "var(--nisu-sky)" }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitFunActive}
              disabled={submitting || !funActiveDesc.trim()}
              className="flex-1 py-2.5 px-4 rounded-full nisu-cta-bold text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
      </MotionPanel>

      <div
        className={`text-xs px-3 py-2 rounded-lg mb-3 ${
          funActiveLimitReached
            ? "bg-amber-50 text-amber-600"
            : "bg-gray-50 nisu-text-muted"
        }`}
      >
        Fun Active used this week:{" "}
        <span className="font-bold">{weeklyFunActiveCount} / 2</span>
        {funActiveLimitReached &&
          " — Weekly limit reached. Choose Workout or Steps."}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/fitness/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--nisu-sky)" }}
        >
          Workout history →
        </Link>
        <Link
          href="/fitness"
          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--nisu-sky)" }}
        >
          Manage workouts →
        </Link>
      </div>
      </div>
    </div>
  );
}
