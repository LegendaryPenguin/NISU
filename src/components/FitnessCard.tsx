"use client";

import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import Checkbox from "./Checkbox";

export default function FitnessCard() {
  const {
    progress,
    weeklyFunActiveCount,
    toggleDesignatedWorkout,
    toggleStepCount,
    toggleFunActive,
  } = useDailyProgress();

  const { fitness } = progress;
  const funActiveLimitReached = weeklyFunActiveCount >= 2 && !fitness.funActive;

  return (
    <div
      className={`rounded-2xl p-5 shadow-md border-l-4 transition-all duration-300 ${
        fitness.completed
          ? "border-l-blue-500 bg-blue-50/80 shadow-blue-100"
          : "border-l-blue-400 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💪</span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Fitness</h3>
            <p className="text-xs text-gray-400 italic">
              Move your body today.
            </p>
          </div>
        </div>
        {fitness.completed && (
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Complete
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-3 font-medium">
        Complete 1 of 3:
      </p>

      <div className="space-y-1 mb-3">
        <Checkbox
          checked={fitness.designatedWorkout}
          onChange={toggleDesignatedWorkout}
          label="Designated Workout"
          sublabel="Follow-along or gym session"
          accentColor="bg-blue-500"
        />
        <Checkbox
          checked={fitness.stepCount}
          onChange={toggleStepCount}
          label="Step Count"
          sublabel="Hit your daily steps"
          accentColor="bg-blue-500"
        />
        <Checkbox
          checked={fitness.funActive}
          onChange={toggleFunActive}
          label="Fun Active"
          sublabel="Sports, hiking, swimming..."
          disabled={funActiveLimitReached}
          accentColor="bg-blue-500"
        />
      </div>

      <div
        className={`text-xs px-3 py-2 rounded-lg mb-3 ${
          weeklyFunActiveCount >= 2
            ? "bg-amber-50 text-amber-600"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        Fun Active used this week:{" "}
        <span className="font-bold">{weeklyFunActiveCount} / 2</span>
        {funActiveLimitReached && " — Weekly limit reached"}
      </div>

      <Link
        href="/fitness"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
      >
        Open Fitness Page →
      </Link>
    </div>
  );
}
