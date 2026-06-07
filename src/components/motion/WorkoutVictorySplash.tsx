"use client";

import { useEffect, useRef } from "react";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { shouldReduceMotion } from "@/lib/motion";

interface WorkoutVictorySplashProps {
  active: boolean;
}

/**
 * Short 4s splash overlay — plays once when `active` becomes true.
 * Self-contained; does not block the complete-phase UI underneath.
 */
export default function WorkoutVictorySplash({ active }: WorkoutVictorySplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!active || played.current || shouldReduceMotion()) return;
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
  }, [active]);

  if (!active || shouldReduceMotion()) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-50 opacity-90"
      aria-hidden
    />
  );
}
