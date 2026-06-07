"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { hasAnimationDevAccess } from "@/lib/dev-animation-access";
import ProgressHeader from "@/components/ProgressHeader";
import FitnessCard from "@/components/FitnessCard";
import FuelCard from "@/components/FuelCard";
import SkillCard from "@/components/SkillCard";
import ResetCard from "@/components/ResetCard";
import DailySummary from "@/components/DailySummary";
import StreakCelebration, {
  useStreakCelebration,
} from "@/components/motion/StreakCelebration";

export default function DailyRoutinePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoaded, resetToday } = useDailyProgress();
  const showDevTools = hasAnimationDevAccess(user?.email);
  const { kind: celebrationKind, dismiss: dismissCelebration } =
    useStreakCelebration();
  const [resetting, setResetting] = useState(false);

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
      </div>
    );
  }

  const handleReset = async () => {
    if (!confirm("Reset all progress for today? This clears localStorage and Supabase data for today.")) return;
    setResetting(true);
    await resetToday();
    setResetting(false);
  };

  return (
    <div className="min-h-screen">
      {celebrationKind && (
        <StreakCelebration
          kind={celebrationKind}
          onDismiss={dismissCelebration}
        />
      )}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProgressHeader />

        <div className="grid gap-5">
          <FitnessCard />
          <FuelCard />
          <SkillCard />
          <ResetCard />
        </div>

        <DailySummary />

        {showDevTools && (
          <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
            <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-2">
              Dev Tools
            </p>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="text-xs font-medium text-red-400 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {resetting ? "Resetting..." : "Reset Day (Dev)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
