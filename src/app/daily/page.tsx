"use client";

import { useDailyProgress } from "@/context/DailyProgressContext";
import ProgressHeader from "@/components/ProgressHeader";
import FitnessCard from "@/components/FitnessCard";
import FuelCard from "@/components/FuelCard";
import SkillCard from "@/components/SkillCard";
import ResetCard from "@/components/ResetCard";
import DailySummary from "@/components/DailySummary";

export default function DailyRoutinePage() {
  const { isLoaded } = useDailyProgress();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProgressHeader />

        <div className="grid gap-5">
          <FitnessCard />
          <FuelCard />
          <SkillCard />
          <ResetCard />
        </div>

        <DailySummary />
      </div>
    </div>
  );
}
