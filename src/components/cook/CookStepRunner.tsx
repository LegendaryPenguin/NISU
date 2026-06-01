"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { RecipeStep } from "@/lib/types";
import { getYoutubeEmbedId } from "@/lib/fuel-actions";

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface CookStepRunnerProps {
  steps: RecipeStep[];
  currentIndex: number;
  onNext: () => void;
  onBack: () => void;
}

export default function CookStepRunner({
  steps,
  currentIndex,
  onNext,
  onBack,
}: CookStepRunnerProps) {
  const step = steps[currentIndex];
  const total = steps.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;

  const [timerSeconds, setTimerSeconds] = useState(step.timer_seconds ?? 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasTimer = (step.timer_seconds ?? 0) > 0;
  const ytId = getYoutubeEmbedId(step.youtube_url);
  const stepIngs = step.step_ingredients ?? [];

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
    setTimerDone(false);
    setShowVideo(false);
    setTimerSeconds(step.timer_seconds ?? 0);
    if (step.timer_seconds && step.timer_seconds > 0) {
      setTimerRunning(true);
    }
  }, [step]);

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerRunning(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerSeconds]);

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden border border-[var(--nisu-border)]">
        <div
          className="bg-[var(--nisu-sky)] h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-center gap-1.5 mb-5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i <= currentIndex
                ? "w-4 bg-[var(--nisu-coral)]"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="nisu-card p-5 sm:p-6 mb-5">
        <p className="text-xs font-bold text-[var(--nisu-coral)] uppercase tracking-wide mb-2">
          Step {currentIndex + 1} of {total}
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed mb-4">
          {step.instruction}
        </p>

        {stepIngs.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-900 mb-2">
              You&apos;ll need now
            </p>
            <div className="flex flex-wrap gap-2">
              {stepIngs.map((ing) => (
                <span
                  key={ing}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--nisu-pale-pink)] border-2 border-[var(--nisu-border)] text-gray-900"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {step.tip && (
          <p className="text-xs font-semibold text-gray-800 bg-[var(--nisu-cream)] border-2 border-[var(--nisu-border)] rounded-xl px-3 py-2 mb-4">
            Tip: {step.tip}
          </p>
        )}

        {step.image_url && (
          <div className="relative w-full h-36 mb-4 rounded-xl overflow-hidden border-2 border-[var(--nisu-border)]">
            <Image src={step.image_url} alt="" fill className="object-cover" />
          </div>
        )}

        {hasTimer && (
          <div
            className="rounded-2xl p-4 text-center mb-4 border-2 border-[var(--nisu-border)]"
            style={{ backgroundColor: "var(--nisu-pale-pink)" }}
          >
            <p
              className={`text-4xl font-mono font-extrabold mb-3 ${
                timerDone ? "text-[var(--nisu-coral)]" : "text-gray-900"
              }`}
            >
              {timerDone ? "Time's up!" : formatTimer(timerSeconds)}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {!timerRunning && !timerDone && (
                <button
                  onClick={() => setTimerRunning(true)}
                  className="nisu-cta-bold text-sm px-4 py-2 cursor-pointer"
                >
                  Start timer
                </button>
              )}
              {timerRunning && (
                <button
                  onClick={() => setTimerRunning(false)}
                  className="text-sm font-bold px-4 py-2 rounded-full border-2 border-[var(--nisu-border)] cursor-pointer"
                >
                  Pause
                </button>
              )}
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerDone(false);
                  setTimerSeconds(step.timer_seconds ?? 0);
                }}
                className="text-sm font-bold px-4 py-2 rounded-full border-2 border-[var(--nisu-border)] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {ytId && (
          <div className="mb-2">
            {!showVideo ? (
              <button
                onClick={() => setShowVideo(true)}
                className="w-full text-sm font-bold py-2.5 rounded-full border-2 border-[var(--nisu-border)] bg-white cursor-pointer"
              >
                Watch technique video
              </button>
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden border-2 border-[var(--nisu-border)]">
                <iframe
                  title="Cooking technique"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={onBack}
            className="py-3 px-5 rounded-full border-2 border-[var(--nisu-border)] font-bold text-sm cursor-pointer"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 nisu-cta-bold py-3.5 text-base cursor-pointer"
        >
          {isLast ? "Finish!" : "Done — next step"}
        </button>
      </div>
    </div>
  );
}
