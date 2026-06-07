"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStreaks } from "@/context/StreakContext";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { getTodayKey } from "@/lib/helpers";
import { STREAK_PILLAR_THRESHOLD } from "@/lib/streak-config";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { isMotionAllowed } from "@/lib/motion";
import "./cinematic-shell.css";

export type CelebrationKind = "streak" | "perfect";

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
  return (
    localStorage.getItem(celebrationStorageKey(todayKey, userId, kind)) === "1"
  );
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
  /** Dev preview — lantern count when overallProgress is lower */
  previewPillarCount?: number;
}

export default function StreakCelebration({
  kind,
  onDismiss,
  previewPillarCount,
}: StreakCelebrationProps) {
  const { displayName, partnerName } = useAuth();
  const { yourStreak, togetherStreak, yourSuccessDates, partnerSuccessDates } =
    useStreaks();
  const { overallProgress } = useDailyProgress();
  const todayKey = getTodayKey();
  const canvasRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const reduced = !isMotionAllowed();
  const pillarCount = previewPillarCount ?? overallProgress;

  const partnerAlsoToday =
    yourSuccessDates.includes(todayKey) &&
    partnerSuccessDates.includes(todayKey);

  const isPerfect = kind === "perfect";

  const handleComplete = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (reduced) return;
    if (!canvasRef.current || started.current) return;
    started.current = true;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cleanup: (() => void) | undefined;

    void import("./harbor-cinematic/main").then(({ bootstrapHarborCinematic }) => {
      if (!canvasRef.current) return;
      cleanup = bootstrapHarborCinematic({
        rootEl: canvasRef.current,
        kind,
        pillarCount,
        heroTextureUrl: isPerfect
          ? NISU_ASSETS.penguins.daily
          : NISU_ASSETS.penguins.streak,
        partnerTextureUrl: NISU_ASSETS.penguins.partnerStreak,
        onComplete: handleComplete,
      });
    });

    return () => {
      cleanup?.();
      document.body.style.overflow = prevOverflow;
      started.current = false;
    };
  }, [reduced, kind, isPerfect, pillarCount, handleComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  if (reduced) {
    return (
      <div className="nisu-cinematic-fallback" role="dialog" aria-modal="true">
        <Image
          src={NISU_ASSETS.penguins.streak}
          alt=""
          width={96}
          height={96}
          className="w-24 h-24 object-contain"
        />
        <p className="text-xl font-extrabold text-gray-900">
          {isPerfect ? "Perfect day!" : "Streak saved!"}
        </p>
        <p className="text-sm font-semibold text-gray-700 max-w-xs">
          {isPerfect
            ? "All 4 pillars complete."
            : `${pillarCount}/4 pillars — streak locked in.`}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="nisu-cta-bold font-bold px-8 py-3 cursor-pointer"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="nisu-cinematic-root" role="dialog" aria-modal="true">
      <div ref={canvasRef} className="nisu-cinematic-canvas" />

      <div className="nisu-cinematic-bar is-top" aria-hidden />
      <div className="nisu-cinematic-bar is-bottom" aria-hidden />

      <div className="nisu-cinematic-hud">
        <p className="nisu-cinematic-chip">
          {isPerfect ? "Full Crew" : "Harbor Lights"}
        </p>
        <h2 className="nisu-cinematic-title">
          {isPerfect ? "Every lantern lit" : "Dockside reunion"}
        </h2>
        <p className="nisu-cinematic-subtitle">
          {isPerfect
            ? "All four pillars glowing — you and your partner made it home for the night."
            : `${pillarCount} of 4 pillars — the streak lanterns are burning bright.`}
        </p>
        {(yourStreak > 0 || partnerAlsoToday) && (
          <p className="nisu-cinematic-stats">
            {yourStreak > 0 && (
              <>
                {displayName}&apos;s streak: {yourStreak}
                {togetherStreak > 0 && ` · Together: ${togetherStreak}`}
              </>
            )}
            {partnerAlsoToday && (
              <>
                {yourStreak > 0 && " · "}
                You & {partnerName} both showed up today
              </>
            )}
          </p>
        )}
      </div>

      <div className="nisu-cinematic-fade" aria-hidden />

      <button
        type="button"
        className="nisu-cinematic-skip nisu-focus-ring"
        onClick={onDismiss}
      >
        Skip
      </button>
    </div>
  );
}
