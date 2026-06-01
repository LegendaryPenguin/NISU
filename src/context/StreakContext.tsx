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
import { isCoupleMember } from "@/lib/streak-config";
import {
  fetchStreakDashboard,
  registerCoupleMember,
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
  const [stats, setStats] = useState<StreakDashboard>(EMPTY);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshStreaks = useCallback(async () => {
    if (!user?.email || !isCoupleMember(user.email)) {
      setStats(EMPTY);
      setIsLoaded(true);
      return;
    }
    try {
      await registerCoupleMember(user.email);
      const data = await fetchStreakDashboard(user.email);
      setStats(data);
    } catch {
      setStats(EMPTY);
    } finally {
      setIsLoaded(true);
    }
  }, [user?.email]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setStats(EMPTY);
      setIsLoaded(true);
      return;
    }
    refreshStreaks();
  }, [authLoading, user, refreshStreaks]);

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
