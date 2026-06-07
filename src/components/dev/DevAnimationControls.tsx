"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  hasAnimationDevAccess,
  isDevForceMotionEnabled,
  setDevForceMotion,
} from "@/lib/dev-animation-access";
import { getTodayKey } from "@/lib/helpers";
import StreakCelebration, {
  type CelebrationKind,
} from "@/components/motion/StreakCelebration";
import WorkoutVictorySplash from "@/components/motion/WorkoutVictorySplash";

function clearCelebrationFlags(userId: string): void {
  const todayKey = getTodayKey();
  for (const kind of ["streak", "perfect"] as const) {
    localStorage.removeItem(`nisu-celebration-${todayKey}-${userId}-${kind}`);
  }
}

export default function DevAnimationControls() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [forceMotion, setForceMotion] = useState(false);

  useEffect(() => {
    setForceMotion(isDevForceMotionEnabled());
  }, []);
  const [previewKind, setPreviewKind] = useState<CelebrationKind | null>(null);
  const [splashKey, setSplashKey] = useState(0);
  const [showSplash, setShowSplash] = useState(false);

  if (!hasAnimationDevAccess(user?.email)) return null;

  const toggleForceMotion = () => {
    const next = !forceMotion;
    setDevForceMotion(next);
    setForceMotion(next);
  };

  const playHarbor = (kind: CelebrationKind) => {
    setShowSplash(false);
    setPreviewKind(kind);
  };

  const playSplash = () => {
    setPreviewKind(null);
    setShowSplash(true);
    setSplashKey((k) => k + 1);
  };

  const dismissHarbor = useCallback(() => setPreviewKind(null), []);

  const handleClearFlags = () => {
    if (!user?.id) return;
    clearCelebrationFlags(user.id);
    alert("Cleared today's celebration flags — real triggers can fire again.");
  };

  return (
    <>
      {previewKind && (
        <StreakCelebration
          kind={previewKind}
          onDismiss={dismissHarbor}
          previewPillarCount={previewKind === "perfect" ? 4 : 3}
        />
      )}
      {showSplash && (
        <WorkoutVictorySplash active replayKey={splashKey} />
      )}

      <div className="fixed left-3 bottom-[5.5rem] z-[90] max-w-[220px]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border-2 border-[var(--nisu-border)] bg-white shadow-[0_3px_0_rgba(26,26,26,0.12)] cursor-pointer hover:bg-[var(--nisu-pale-pink)]"
        >
          {open ? "Hide anim dev" : "Anim dev"}
        </button>

        {open && (
          <div className="mt-2 p-3 rounded-xl border-2 border-dashed border-[var(--nisu-coral)] bg-white/95 shadow-lg space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--nisu-coral)]">
              Nischay — preview cinematics
            </p>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={forceMotion}
                onChange={toggleForceMotion}
                className="rounded"
              />
              Force motion on
              <span className="text-[10px] text-gray-400 font-normal">
                (bypasses reduced-motion)
              </span>
            </label>

            <button
              type="button"
              onClick={() => playHarbor("streak")}
              className="block w-full text-left text-xs font-bold px-3 py-2 rounded-lg bg-[var(--nisu-pale-pink)] hover:opacity-90 cursor-pointer"
            >
              Harbor — Streak (3/4)
            </button>
            <button
              type="button"
              onClick={() => playHarbor("perfect")}
              className="block w-full text-left text-xs font-bold px-3 py-2 rounded-lg bg-[var(--nisu-pale-blue)] hover:opacity-90 cursor-pointer"
            >
              Harbor — Perfect (4/4)
            </button>
            <button
              type="button"
              onClick={playSplash}
              className="block w-full text-left text-xs font-bold px-3 py-2 rounded-lg bg-[var(--nisu-pale-pink-2)] hover:opacity-90 cursor-pointer"
            >
              Workout victory splash
            </button>
            <button
              type="button"
              onClick={handleClearFlags}
              className="block w-full text-left text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Reset celebration flags (today)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
