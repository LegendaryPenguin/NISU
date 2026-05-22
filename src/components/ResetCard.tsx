"use client";

import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import Checkbox from "./Checkbox";

export default function ResetCard() {
  const {
    progress,
    toggleReading,
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
        {/* Journaling navigates to the brain dump page */}
        <Link href="/journal" className="block">
          <div
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-black/[0.03] ${
              reset.journaling ? "bg-black/[0.02]" : ""
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                reset.journaling
                  ? "bg-amber-500 border-transparent"
                  : "border-gray-300 bg-white"
              }`}
            >
              {reset.journaling && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <span
                className={`text-sm font-medium transition-all duration-200 ${
                  reset.journaling
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }`}
              >
                Journaling / Brain Dump
              </span>
              <span className="text-xs text-gray-400">
                {reset.journaling ? "Done for today" : "5 minutes → open journal"}
              </span>
            </div>
            {!reset.journaling && (
              <span className="text-xs text-amber-500 font-medium">Go →</span>
            )}
          </div>
        </Link>
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
    </div>
  );
}
