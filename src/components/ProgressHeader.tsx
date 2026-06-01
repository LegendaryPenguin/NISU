"use client";

import Image from "next/image";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { formatDateDisplay, getTodayKey, STREAK_PILLAR_THRESHOLD } from "@/lib/helpers";
import { NISU_ASSETS } from "@/lib/nisu-assets";

export default function ProgressHeader() {
  const { overallProgress } = useDailyProgress();
  const todayKey = getTodayKey();
  const pct = (overallProgress / 4) * 100;

  const streakEligible = overallProgress >= STREAK_PILLAR_THRESHOLD;

  const getMessage = () => {
    if (streakEligible && overallProgress < 4) {
      return `Streak earned! ${overallProgress}/4 pillars — optional bonus left.`;
    }
    switch (overallProgress) {
      case 0:
        return `Complete ${STREAK_PILLAR_THRESHOLD} of 4 pillars to keep your streak.`;
      case 1:
        return "One down. Two more for today's streak.";
      case 2:
        return "Halfway there. One more pillar for your streak.";
      case 3:
        return "Streak day secured! Finish a 4th pillar if you want.";
      case 4:
        return "All pillars complete. Legendary day.";
      default:
        return "";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <Image
          src={NISU_ASSETS.penguins.daily}
          alt=""
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Daily Routine
          </h1>
          <p className="text-sm nisu-text-muted mt-0.5">{formatDateDisplay(todayKey)}</p>
        </div>
      </div>

      <div className="mt-4 nisu-pillar-fitness ml-2">
        <div className="nisu-pillar-inner p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900">
            Today&apos;s Progress
          </span>
          <span className="text-sm font-bold text-[var(--nisu-coral)]">
            {overallProgress} / 4 pillars
            {streakEligible && (
              <span className="text-gray-600 font-semibold"> · streak ✓</span>
            )}
          </span>
        </div>

        <div className="w-full h-3 bg-[var(--nisu-pale-pink)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background:
                overallProgress === 4
                  ? "linear-gradient(90deg, var(--nisu-coral), var(--nisu-amber), var(--nisu-sky))"
                  : "linear-gradient(90deg, var(--nisu-sky), var(--nisu-coral))",
            }}
          />
        </div>

        <p className="text-xs nisu-text-muted mt-2 font-medium">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
}
