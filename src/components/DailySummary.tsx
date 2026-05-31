"use client";

import Image from "next/image";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { PillarName } from "@/lib/types";
import { NISU_ASSETS } from "@/lib/nisu-assets";

const PILLAR_META: Record<
  PillarName,
  { icon: string; label: string }
> = {
  fitness: { icon: NISU_ASSETS.icons.fitness, label: "Fitness" },
  fuel: { icon: NISU_ASSETS.icons.fuel, label: "Fuel" },
  skill: { icon: NISU_ASSETS.icons.skill, label: "Skill" },
  reset: { icon: NISU_ASSETS.penguins.reset, label: "Reset" },
};

export default function DailySummary() {
  const { progress, overallProgress } = useDailyProgress();
  const pillars: PillarName[] = ["fitness", "fuel", "skill", "reset"];
  const completed = pillars.filter((p) => progress[p].completed);
  const remaining = pillars.filter((p) => !progress[p].completed);

  if (overallProgress === 4) {
    return (
      <div
        className="mt-8 rounded-2xl p-6 text-center shadow-md border border-[var(--nisu-pale-pink-2)]"
        style={{
          background:
            "linear-gradient(135deg, var(--nisu-cream), var(--nisu-pale-pink), var(--nisu-pale-blue))",
        }}
      >
        <Image
          src={NISU_ASSETS.penguins.daily}
          alt=""
          width={64}
          height={64}
          className="w-16 h-16 object-contain mx-auto mb-2"
        />
        <p className="text-lg font-extrabold text-gray-800">
          All 4 pillars complete!
        </p>
        <p className="text-sm text-gray-500 mt-1">
          You crushed it today. Rest well and do it again tomorrow.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 nisu-card p-5">
      <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Summary</h3>

      {completed.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 font-medium mb-1.5">Completed</p>
          <div className="flex flex-wrap gap-2">
            {completed.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--nisu-pale-blue)] text-gray-700 px-2.5 py-1 rounded-full border border-[var(--nisu-pale-pink-2)]"
              >
                <Image
                  src={PILLAR_META[p].icon}
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
                {PILLAR_META[p].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">Remaining</p>
          <div className="flex flex-wrap gap-2">
            {remaining.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-[var(--nisu-pale-pink)] text-gray-500 px-2.5 py-1 rounded-full border border-[var(--nisu-pale-pink-2)]"
              >
                <Image
                  src={PILLAR_META[p].icon}
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain opacity-60"
                />
                {PILLAR_META[p].label}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            {remaining.length} more pillar
            {remaining.length > 1 ? "s" : ""} to complete today.
          </p>
        </div>
      )}
    </div>
  );
}
