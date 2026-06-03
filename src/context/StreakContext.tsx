"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useDailyProgress } from "./DailyProgressContext";
import { getTodayKey, calculateOverallProgress } from "@/lib/helpers";
import {
  fetchStreakDashboard,
  registerCoupleMember,
  syncDayStreak,
  type StreakDashboard,
} from "@/lib/streak-actions";

interface StreakContextValue extends StreakDashboard {
  isLoaded: boolean;
  refreshStreaks: () => Promise<void>;
}

const EMPTY: StreakDashboard = {
  yourStreak: 0,
  partnerStreak: 0,
  togetherCount: 0,
  togetherStreak: 0,
  yourSuccessDates: [],
  partnerSuccessDates: [],
};

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const { progress, isLoaded: progressLoaded } = useDailyProgress();
  const todayKey = getTodayKey();
  const [stats, setStats] = useState<StreakDashboard>(EMPTY);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncAndRefreshStreaks = useCallback(async () => {
    if (!user?.email) {
      setStats(EMPTY);
      setIsLoaded(true);
      return;
    }
    try {
      await registerCoupleMember(user.email);
      const pillars = calculateOverallProgress(progress);
      await syncDayStreak(todayKey, pillars);
      const data = await fetchStreakDashboard(user.email);
      setStats(data);
    } catch {
      try {
        const data = await fetchStreakDashboard(user.email);
        setStats(data);
      } catch {
        setStats(EMPTY);
      }
    } finally {
      setIsLoaded(true);
    }
  }, [user?.email, progress, todayKey]);

  const refreshStreaks = syncAndRefreshStreaks;

  useEffect(() => {
    if (authLoading || !progressLoaded) return;
    if (!user) {
      setStats(EMPTY);
      setIsLoaded(true);
      return;
    }
    syncAndRefreshStreaks();
  }, [authLoading, user, progressLoaded, progress, syncAndRefreshStreaks]);

  useEffect(() => {
    if (!user || !progressLoaded) return;

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        syncAndRefreshStreaks();
      }
    };

    window.addEventListener("focus", syncAndRefreshStreaks);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", syncAndRefreshStreaks);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user, progressLoaded, syncAndRefreshStreaks]);

  return (
    <StreakContext.Provider value={{ ...stats, isLoaded, refreshStreaks }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreaks() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error("useStreaks must be used within StreakProvider");
  return ctx;
}
