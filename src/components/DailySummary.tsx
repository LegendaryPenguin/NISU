"use client";

import Image from "next/image";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { STREAK_PILLAR_THRESHOLD } from "@/lib/streak-config";
import type { PillarName } from "@/lib/types";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import MotionPanel from "@/components/motion/MotionPanel";
import PenguinBounce from "@/components/motion/PenguinBounce";

const PILLAR_META: Record<PillarName, { emoji: string; label: string }> = {
  fitness: { emoji: "💪", label: "Fitness" },
  fuel: { emoji: "🥗", label: "Fuel" },
  skill: { emoji: "🧠", label: "Skill" },
  reset: { emoji: "🌙", label: "Reset" },
};

function summaryKey(progress: number): string {
  if (progress === 4) return "perfect";
  if (progress >= STREAK_PILLAR_THRESHOLD) return "streak";
  return "summary";
}

export default function DailySummary() {
  const { progress, overallProgress } = useDailyProgress();
  const pillars: PillarName[] = ["fitness", "fuel", "skill", "reset"];
  const completed = pillars.filter((p) => progress[p].completed);
  const remaining = pillars.filter((p) => !progress[p].completed);
  const key = summaryKey(overallProgress);

  if (overallProgress === 4) {
    return (
      <MotionPanel panelKey={key} className="mt-8 ml-2">
        <div className="nisu-stat-bold rounded-2xl p-6 text-center">
          <PenguinBounce
            src={NISU_ASSETS.penguins.daily}
            width={64}
            height={64}
            className="w-16 h-16 object-contain mx-auto mb-2"
            bounceKey={key}
          />
          <p className="text-lg font-extrabold text-gray-800">
            All 4 pillars complete!
          </p>
          <p className="text-sm nisu-text-muted mt-1">
            You crushed it today. Rest well and do it again tomorrow.
          </p>
        </div>
      </MotionPanel>
    );
  }

  if (overallProgress >= STREAK_PILLAR_THRESHOLD) {
    return (
      <MotionPanel panelKey={key} className="mt-8 ml-2">
        <div className="nisu-stat-light rounded-2xl p-6 text-center border-2 border-[var(--nisu-border)]">
          <PenguinBounce
            src={NISU_ASSETS.penguins.streak}
            width={64}
            height={64}
            className="w-16 h-16 object-contain mx-auto mb-2"
            bounceKey={key}
          />
          <p className="text-lg font-extrabold text-gray-800">
            Streak day complete ({overallProgress}/4)
          </p>
          <p className="text-sm nisu-text-muted mt-1">
            {overallProgress === 3
              ? "You hit the 3-pillar goal. Optional: finish one more pillar."
              : "Keep going for a perfect day."}
          </p>
        </div>
      </MotionPanel>
    );
  }

  return (
    <MotionPanel panelKey={key} className="nisu-pillar-reset ml-2 mt-2 mb-2">
      <div className="nisu-pillar-inner p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Summary</h3>

        {completed.length > 0 && (
          <div className="mb-3">
            <p className="text-xs nisu-text-caption mb-1.5">Completed</p>
            <div className="flex flex-wrap gap-2">
              {completed.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-white text-gray-900 px-2.5 py-1 rounded-full border-2 border-[var(--nisu-border)]"
                >
                  {PILLAR_META[p].emoji} {PILLAR_META[p].label}
                </span>
              ))}
            </div>
          </div>
        )}

        {remaining.length > 0 && (
          <div>
            <p className="text-xs nisu-text-caption mb-1.5">Remaining</p>
            <div className="flex flex-wrap gap-2">
              {remaining.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-white text-gray-900 px-2.5 py-1 rounded-full border-2 border-[var(--nisu-border)]"
                >
                  {PILLAR_META[p].emoji} {PILLAR_META[p].label}
                </span>
              ))}
            </div>
            <p className="text-xs nisu-text-muted mt-3 font-semibold">
              {STREAK_PILLAR_THRESHOLD - overallProgress} more pillar
              {STREAK_PILLAR_THRESHOLD - overallProgress > 1 ? "s" : ""} needed
              for today&apos;s streak.
            </p>
          </div>
        )}
      </div>
    </MotionPanel>
  );
}
