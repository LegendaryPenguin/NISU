"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStreaks } from "@/context/StreakContext";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { getTodayKey } from "@/lib/helpers";
import { STREAK_PILLAR_THRESHOLD } from "@/lib/streak-config";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { shouldReduceMotion } from "@/lib/motion";
import PenguinBounce from "@/components/motion/PenguinBounce";

export type CelebrationKind = "streak" | "perfect";

const CONFETTI = [
  { color: "var(--nisu-coral)", left: "8%", delay: "0ms", rotate: "-12deg" },
  { color: "var(--nisu-sky)", left: "18%", delay: "60ms", rotate: "8deg" },
  { color: "var(--nisu-pink)", left: "78%", delay: "30ms", rotate: "-6deg" },
  { color: "var(--nisu-amber)", left: "88%", delay: "90ms", rotate: "14deg" },
  { color: "var(--nisu-coral-bold)", left: "42%", delay: "45ms", rotate: "-18deg" },
  { color: "var(--nisu-sky)", left: "55%", delay: "75ms", rotate: "6deg" },
  { color: "var(--nisu-pink-bold)", left: "30%", delay: "120ms", rotate: "10deg" },
  { color: "var(--nisu-amber)", left: "65%", delay: "15ms", rotate: "-8deg" },
] as const;

function celebrationStorageKey(
  todayKey: string,
  userId: string,
  kind: CelebrationKind
): string {
  return `nisu-celebration-${todayKey}-${userId}-${kind}`;
}

function wasCelebrated(
  todayKey: string,
  userId: string,
  kind: CelebrationKind
): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(celebrationStorageKey(todayKey, userId, kind)) === "1";
}

function markCelebrated(
  todayKey: string,
  userId: string,
  kind: CelebrationKind
): void {
  localStorage.setItem(celebrationStorageKey(todayKey, userId, kind), "1");
}

export function useStreakCelebration(): {
  kind: CelebrationKind | null;
  dismiss: () => void;
} {
  const { user } = useAuth();
  const { overallProgress } = useDailyProgress();
  const [kind, setKind] = useState<CelebrationKind | null>(null);
  const prevProgress = useRef<number | null>(null);
  const todayKey = getTodayKey();

  useEffect(() => {
    if (!user?.id) return;

    if (prevProgress.current === null) {
      prevProgress.current = overallProgress;
      return;
    }

    const prev = prevProgress.current;

    if (
      prev < STREAK_PILLAR_THRESHOLD &&
      overallProgress >= STREAK_PILLAR_THRESHOLD &&
      overallProgress < 4 &&
      !wasCelebrated(todayKey, user.id, "streak")
    ) {
      markCelebrated(todayKey, user.id, "streak");
      setKind("streak");
    } else if (
      prev < 4 &&
      overallProgress === 4 &&
      !wasCelebrated(todayKey, user.id, "perfect")
    ) {
      markCelebrated(todayKey, user.id, "perfect");
      setKind("perfect");
    }

    prevProgress.current = overallProgress;
  }, [overallProgress, user?.id, todayKey]);

  const dismiss = useCallback(() => setKind(null), []);

  return { kind, dismiss };
}

interface StreakCelebrationProps {
  kind: CelebrationKind;
  onDismiss: () => void;
}

export default function StreakCelebration({
  kind,
  onDismiss,
}: StreakCelebrationProps) {
  const { displayName, partnerName } = useAuth();
  const { yourStreak, togetherStreak, yourSuccessDates, partnerSuccessDates } =
    useStreaks();
  const { overallProgress } = useDailyProgress();
  const todayKey = getTodayKey();
  const reduced = shouldReduceMotion();

  const partnerAlsoToday =
    yourSuccessDates.includes(todayKey) &&
    partnerSuccessDates.includes(todayKey);

  const isPerfect = kind === "perfect";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      className="nisu-celebration-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-celebration-title"
      onClick={onDismiss}
    >
      <div
        className="nisu-celebration-panel relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {!reduced && (
          <div className="nisu-celebration-confetti pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {CONFETTI.map((piece, i) => (
              <span
                key={i}
                className="nisu-celebration-confetti-piece"
                style={{
                  left: piece.left,
                  backgroundColor: piece.color,
                  animationDelay: piece.delay,
                  ["--nisu-confetti-rotate" as string]: piece.rotate,
                }}
              />
            ))}
          </div>
        )}

        <div
          className={`nisu-celebration-card nisu-card p-6 text-center ${
            isPerfect ? "nisu-celebration-card-perfect" : "nisu-celebration-card-streak"
          }`}
        >
          <div className="flex items-end justify-center gap-2 mb-3">
            <PenguinBounce
              src={
                isPerfect
                  ? NISU_ASSETS.penguins.daily
                  : NISU_ASSETS.penguins.streak
              }
              width={72}
              height={72}
              className="w-[4.5rem] h-[4.5rem] object-contain"
              bounceKey={kind}
            />
            <Image
              src={NISU_ASSETS.ui.heart}
              alt=""
              width={28}
              height={28}
              className={`w-7 h-7 object-contain mb-2 ${reduced ? "" : "nisu-celebration-heart"}`}
            />
            <PenguinBounce
              src={NISU_ASSETS.penguins.partnerStreak}
              width={72}
              height={72}
              className={`w-[4.5rem] h-[4.5rem] object-contain ${reduced ? "" : "nisu-celebration-partner-delay"}`}
              bounceKey={`${kind}-partner`}
            />
          </div>

          <p
            id="streak-celebration-title"
            className="text-xl font-extrabold text-gray-900 mb-1"
          >
            {isPerfect ? "Perfect day!" : "Streak saved!"}
          </p>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {isPerfect
              ? "All 4 pillars complete — you crushed it."
              : `${overallProgress}/4 pillars — today's streak is locked in.`}
          </p>

          {yourStreak > 0 && (
            <p className="text-xs nisu-text-muted mb-3">
              {displayName}&apos;s streak:{" "}
              <span className="font-bold text-[var(--nisu-coral-dark)]">
                {yourStreak}
              </span>
              {togetherStreak > 0 && (
                <>
                  {" "}
                  · Together:{" "}
                  <span className="font-bold text-[var(--nisu-sky)]">
                    {togetherStreak}
                  </span>
                </>
              )}
            </p>
          )}

          {partnerAlsoToday && (
            <div
              className="nisu-celebration-together text-xs font-bold px-3 py-2 rounded-xl mb-4"
              style={{
                backgroundColor: "var(--nisu-pale-blue)",
                color: "var(--nisu-sky)",
              }}
            >
              You & {partnerName} both showed up today
            </div>
          )}

          <div className="flex justify-center gap-1.5 mb-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full border-2 border-[var(--nisu-border)] ${
                  i < overallProgress
                    ? isPerfect
                      ? "bg-[var(--nisu-coral-bold)]"
                      : "bg-[var(--nisu-pink-bold)]"
                    : "bg-white"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="nisu-cta-bold font-bold px-8 py-3 cursor-pointer nisu-focus-ring"
          >
            {isPerfect ? "Amazing — keep going" : "Nice work!"}
          </button>
        </div>
      </div>
    </div>
  );
}
