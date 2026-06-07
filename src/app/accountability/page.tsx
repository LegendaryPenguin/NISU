"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useStreaks } from "@/context/StreakContext";
import StreakCalendar from "@/components/StreakCalendar";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { STREAK_PILLAR_THRESHOLD } from "@/lib/streak-config";
import AnimatedNumber from "@/components/motion/AnimatedNumber";

export default function AccountabilityPage() {
  const { displayName, partnerName } = useAuth();
  const {
    yourStreak,
    partnerStreak,
    togetherCount,
    togetherStreak,
    yourSuccessDates,
    partnerSuccessDates,
    isLoaded,
  } = useStreaks();

  return (
    <div className="min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Image
            src={NISU_ASSETS.penguins.streak}
            alt=""
            width={56}
            height={56}
            className="w-14 h-14 object-contain"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Streaks
            </h1>
            <p className="text-sm nisu-text-muted">
              {STREAK_PILLAR_THRESHOLD} of 4 pillars counts as a win.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 ml-2">
          <StatChip label="You" value={isLoaded ? yourStreak : "—"} accent="coral" />
          <StatChip
            label={partnerName}
            value={isLoaded ? partnerStreak : "—"}
            accent="sky"
          />
          <StatChip
            label="Partner streak"
            value={isLoaded ? togetherStreak : "—"}
            accent="sky"
          />
          <StatChip
            label="Together total"
            value={isLoaded ? togetherCount : "—"}
            accent="amber"
          />
        </div>

        <div className="flex justify-center mb-6">
          <StreakCalendar
            youDates={yourSuccessDates}
            partnerDates={partnerSuccessDates}
            youLabel={displayName}
            partnerLabel={partnerName}
          />
        </div>

        <div className="nisu-pillar-fitness ml-2">
          <div className="nisu-pillar-inner p-4 text-sm text-gray-700">
            <p className="font-bold text-gray-900 mb-1">How streaks work</p>
            <ul className="space-y-1.5 text-xs nisu-text-muted list-disc pl-4">
              <li>
                Complete {STREAK_PILLAR_THRESHOLD} of 4 pillars in a day to earn
                your streak for that day.
              </li>
              <li>
                When both you and {partnerName} hit {STREAK_PILLAR_THRESHOLD}/4
                on the same day, it counts toward Completed together.
              </li>
              <li>
                Missing a day breaks your current streak — pick it back up
                tomorrow.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "coral" | "sky" | "amber";
}) {
  const color =
    accent === "coral"
      ? "var(--nisu-coral)"
      : accent === "sky"
        ? "var(--nisu-sky)"
        : "var(--nisu-amber)";

  return (
    <div className="nisu-stat-light px-3 py-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 truncate">
        {label}
      </p>
      <p
        className="text-2xl font-extrabold leading-none mt-1"
        style={{ color }}
      >
        <AnimatedNumber value={value} />
      </p>
      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">days</p>
    </div>
  );
}
