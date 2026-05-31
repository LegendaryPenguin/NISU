"use client";

import Image from "next/image";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import Checkbox from "./Checkbox";
import { NISU_ASSETS } from "@/lib/nisu-assets";

export default function ResetCard() {
  const {
    progress,
    toggleReading,
    toggleMeditation,
    toggleOutside,
  } = useDailyProgress();

  const { reset } = progress;

  return (
    <div className={`nisu-card p-5 ${reset.completed ? "opacity-95" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={NISU_ASSETS.penguins.reset}
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Reset</h3>
            <p className="text-xs text-gray-400 italic">
              Clear your mind before the day ends.
            </p>
          </div>
        </div>
        {reset.completed && (
          <span
            className="text-white text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--nisu-amber)" }}
          >
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
          accentColor="bg-[var(--nisu-amber)]"
        />
      </div>

      <p className="text-xs text-gray-500 mb-2 font-medium">Choose one:</p>
      <div className="space-y-1 mb-3">
        <Link href="/journal" className="block">
          <div
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-black/[0.03] ${
              reset.journaling ? "bg-black/[0.02]" : ""
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                reset.journaling
                  ? "border-transparent"
                  : "border-gray-300 bg-white"
              }`}
              style={
                reset.journaling
                  ? { backgroundColor: "var(--nisu-amber)" }
                  : undefined
              }
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
              <span
                className="text-xs font-medium"
                style={{ color: "var(--nisu-amber)" }}
              >
                Go →
              </span>
            )}
          </div>
        </Link>
        <Checkbox
          checked={reset.meditation}
          onChange={toggleMeditation}
          label="Meditation / Mindfulness"
          sublabel="5 minutes"
          accentColor="bg-[var(--nisu-amber)]"
        />
      </div>

      <p className="text-xs text-gray-500 mb-2 font-medium">Bonus:</p>
      <div className="mb-3">
        <Checkbox
          checked={reset.outside}
          onChange={toggleOutside}
          label="Outside Nature Time"
          sublabel="Optional – go touch grass"
          accentColor="bg-[var(--nisu-amber)]"
        />
      </div>
    </div>
  );
}
