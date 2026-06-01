"use client";

import { useEffect, useRef } from "react";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { useStreaks } from "@/context/StreakContext";

/** Refreshes streak stats when daily pillar progress changes. */
export default function StreakSync() {
  const { overallProgress, isLoaded } = useDailyProgress();
  const { refreshStreaks } = useStreaks();
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (prev.current === overallProgress) return;
    prev.current = overallProgress;
    refreshStreaks();
  }, [overallProgress, isLoaded, refreshStreaks]);

  return null;
}
