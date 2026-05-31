"use client";

import Image from "next/image";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { formatDateDisplay, getTodayKey } from "@/lib/helpers";
import { NISU_ASSETS } from "@/lib/nisu-assets";

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
          <p className="text-sm text-gray-400 mt-0.5">
            {formatDateDisplay(todayKey)}
          </p>
        </div>
      </div>

      <div className="mt-4 nisu-pillar-fitness ml-2">
        <div className="nisu-pillar-inner p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Today&apos;s Progress
          </span>
          <span className="text-sm font-bold text-[var(--nisu-coral)]">
            {overallProgress} / 4 pillars
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

        <p className="text-xs text-gray-400 mt-2 italic">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
}
