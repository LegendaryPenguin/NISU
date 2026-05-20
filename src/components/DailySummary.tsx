"use client";

import { useDailyProgress } from "@/context/DailyProgressContext";
import { PillarName } from "@/lib/types";

const PILLAR_META: Record<PillarName, { emoji: string; label: string }> = {
  fitness: { emoji: "💪", label: "Fitness" },
  fuel: { emoji: "🥗", label: "Fuel" },
  skill: { emoji: "🧠", label: "Skill" },
  reset: { emoji: "🌙", label: "Reset" },
};

export default function DailySummary() {
  const { progress, overallProgress } = useDailyProgress();
  const pillars: PillarName[] = ["fitness", "fuel", "skill", "reset"];
  const completed = pillars.filter((p) => progress[p].completed);
  const remaining = pillars.filter((p) => !progress[p].completed);

  if (overallProgress === 4) {
    return (
      <div className="mt-8 rounded-2xl p-6 text-center shadow-md border border-amber-200"
        style={{
          background: "linear-gradient(135deg, #fef3c7, #fce7f3, #ede9fe)",
        }}
      >
        <p className="text-3xl mb-2">🏆</p>
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
    <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Summary</h3>

      {completed.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 font-medium mb-1.5">
            Completed
          </p>
          <div className="flex flex-wrap gap-2">
            {completed.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-600 px-2.5 py-1 rounded-full"
              >
                {PILLAR_META[p].emoji} {PILLAR_META[p].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">
            Remaining
          </p>
          <div className="flex flex-wrap gap-2">
            {remaining.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 text-xs font-medium bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full"
              >
                {PILLAR_META[p].emoji} {PILLAR_META[p].label}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            Finish {remaining.length} more pillar
            {remaining.length > 1 ? "s" : ""} to complete today.
          </p>
        </div>
      )}
    </div>
  );
}
