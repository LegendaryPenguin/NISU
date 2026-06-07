"use client";

import { useEffect, useRef } from "react";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { isMotionAllowed } from "@/lib/motion";

interface WorkoutVictorySplashProps {
  active: boolean;
  /** Bump to replay (dev preview) */
  replayKey?: number;
}

/**
 * Short 4s splash overlay — plays once when `active` becomes true.
 * Self-contained; does not block the complete-phase UI underneath.
 */
export default function WorkoutVictorySplash({
  active,
  replayKey = 0,
}: WorkoutVictorySplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    played.current = false;
  }, [replayKey]);

  useEffect(() => {
    if (!active || played.current || !isMotionAllowed()) return;
    if (!rootRef.current) return;
    played.current = true;

    let cleanup: (() => void) | undefined;
    void import("./workout-splash/main").then(({ bootstrapWorkoutSplash }) => {
      if (!rootRef.current) return;
      cleanup = bootstrapWorkoutSplash({
        rootEl: rootRef.current,
        penguinTextureUrl: NISU_ASSETS.penguins.fitness,
      });
    });

    return () => {
      cleanup?.();
    };
  }, [active, replayKey]);

  if (!active || !isMotionAllowed()) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-50 opacity-90"
      aria-hidden
    />
  );
}
