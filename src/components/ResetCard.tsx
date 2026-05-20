"use client";

import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import Checkbox from "./Checkbox";

export default function ResetCard() {
  const {
    progress,
    toggleReading,
    toggleJournaling,
    toggleMeditation,
    toggleOutside,
  } = useDailyProgress();

  const { reset } = progress;

  return (
    <div
      className={`rounded-2xl p-5 shadow-md border-l-4 transition-all duration-300 ${
        reset.completed
          ? "border-l-amber-500 bg-amber-50/80 shadow-amber-100"
          : "border-l-amber-400 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌙</span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Reset</h3>
            <p className="text-xs text-gray-400 italic">
              Clear your head before the day ends.
            </p>
          </div>
        </div>
        {reset.completed && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Complete
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-2 font-medium">Required:</p>
      <div className="mb-3">
        <Checkbox
          checked={reset.reading}
          onChange={toggleReading}
          label="Reading"
          sublabel="15 minutes"
          accentColor="bg-amber-500"
        />
      </div>

      <p className="text-xs text-gray-500 mb-2 font-medium">Choose one:</p>
      <div className="space-y-1 mb-3">
        <Checkbox
          checked={reset.journaling}
          onChange={toggleJournaling}
          label="Journaling"
          sublabel="5 minutes"
          accentColor="bg-amber-500"
        />
        <Checkbox
          checked={reset.meditation}
          onChange={toggleMeditation}
          label="Meditation / Mindfulness"
          sublabel="5 minutes"
          accentColor="bg-amber-500"
        />
      </div>

      <p className="text-xs text-gray-500 mb-2 font-medium">Bonus:</p>
      <div className="mb-3">
        <Checkbox
          checked={reset.outside}
          onChange={toggleOutside}
          label="Outside nature time"
          sublabel="Optional — go touch grass"
          accentColor="bg-amber-500"
        />
      </div>

      <div className="flex gap-3">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-700 transition-colors"
        >
          Open Journal →
        </Link>
      </div>
    </div>
  );
}
