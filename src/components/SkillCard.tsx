"use client";

import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { isWeekend, getTodayKey } from "@/lib/helpers";

export default function SkillCard() {
  const {
    progress,
    completeMainSkill,
    spinChallenge,
    completeChallenge,
    clearSelectedChallenge,
  } = useDailyProgress();

  const { skill } = progress;
  const weekend = isWeekend(getTodayKey());

  return (
    <div
      className={`rounded-2xl p-5 shadow-md border-l-4 transition-all duration-300 ${
        skill.completed
          ? "border-l-violet-500 bg-violet-50/80 shadow-violet-100"
          : "border-l-violet-400 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Skill</h3>
            <p className="text-xs text-gray-400 italic">
              Build something. Learn something. Stay sharp.
            </p>
          </div>
        </div>
        {skill.completed && (
          <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Complete
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div
          className={`text-xs px-3 py-2 rounded-lg font-medium ${
            skill.completed
              ? "bg-violet-100 text-violet-700"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          Today&apos;s goal:{" "}
          <span className="font-bold">
            {skill.completedBlocks} / {skill.requiredBlocks}
          </span>{" "}
          skill block{skill.requiredBlocks > 1 ? "s" : ""}
          {weekend && (
            <span className="ml-1.5 text-violet-400">(weekend)</span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={completeMainSkill}
          disabled={skill.completed}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            skill.completed
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer"
          }`}
        >
          ✅ Complete Main Skill Block
        </button>

        {!skill.selectedChallenge ? (
          <button
            onClick={spinChallenge}
            disabled={skill.completed}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              skill.completed
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-500 text-white hover:bg-violet-600 cursor-pointer shadow-sm"
            }`}
          >
            🎲 Spin Challenge Wheel
          </button>
        ) : (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs text-violet-500 font-semibold mb-1 uppercase tracking-wide">
              Today&apos;s Challenge
            </p>
            <p className="text-sm font-bold text-gray-800 mb-1">
              {skill.selectedChallenge.title}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              {skill.selectedChallenge.description}
            </p>
            <p className="text-xs text-violet-400 font-medium mb-3">
              ⏱ {skill.selectedChallenge.time}
            </p>
            <div className="flex gap-2">
              <button
                onClick={completeChallenge}
                className="flex-1 py-2 px-3 rounded-lg bg-violet-500 text-white text-xs font-bold hover:bg-violet-600 transition-colors cursor-pointer"
              >
                Mark Complete
              </button>
              <button
                onClick={clearSelectedChallenge}
                className="py-2 px-3 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/skill"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors"
      >
        Open Skill / Wheel Page →
      </Link>
    </div>
  );
}
