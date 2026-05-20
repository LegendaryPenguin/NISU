"use client";

import { useDailyProgress } from "@/context/DailyProgressContext";
import { formatDateDisplay, getTodayKey } from "@/lib/helpers";

export default function ProgressHeader() {
  const { overallProgress } = useDailyProgress();
  const todayKey = getTodayKey();
  const pct = (overallProgress / 4) * 100;

  const getMessage = () => {
    switch (overallProgress) {
      case 0:
        return "Fresh start. Let's get after it.";
      case 1:
        return "One down. Keep the momentum going.";
      case 2:
        return "Halfway there. You're locked in.";
      case 3:
        return "Almost done. Finish strong.";
      case 4:
        return "All pillars complete. Legendary day.";
      default:
        return "";
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Daily Routine
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {formatDateDisplay(todayKey)}
        </p>
      </div>

      <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Today&apos;s Progress
          </span>
          <span className="text-sm font-bold text-gray-900">
            {overallProgress} / 4 pillars
          </span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background:
                overallProgress === 4
                  ? "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-2 italic">{getMessage()}</p>
      </div>
    </div>
  );
}
