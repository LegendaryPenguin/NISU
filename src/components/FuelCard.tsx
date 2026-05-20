"use client";

import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import Checkbox from "./Checkbox";

export default function FuelCard() {
  const {
    progress,
    toggleProtein,
    toggleWater,
    incrementSugar,
    decrementSugar,
  } = useDailyProgress();

  const { fuel } = progress;
  const overSugarLimit = fuel.sugaryFoods > 2;

  return (
    <div
      className={`rounded-2xl p-5 shadow-md border-l-4 transition-all duration-300 ${
        fuel.completed
          ? "border-l-emerald-500 bg-emerald-50/80 shadow-emerald-100"
          : "border-l-emerald-400 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥗</span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Fuel</h3>
            <p className="text-xs text-gray-400 italic">
              Hit the basics. Hydrate. Don&apos;t run on sugar.
            </p>
          </div>
        </div>
        {fuel.completed && (
          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Complete
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-3 font-medium">Mandatory:</p>

      <div className="space-y-1 mb-4">
        <Checkbox
          checked={fuel.protein}
          onChange={toggleProtein}
          label="Protein goal"
          sublabel="Hit your daily protein target"
          accentColor="bg-emerald-500"
        />
        <Checkbox
          checked={fuel.water}
          onChange={toggleWater}
          label="Water goal"
          sublabel="Stay hydrated all day"
          accentColor="bg-emerald-500"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">
            Sugary foods today:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={decrementSugar}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm transition-colors cursor-pointer"
            >
              −
            </button>
            <span
              className={`text-sm font-bold min-w-[40px] text-center ${
                overSugarLimit ? "text-red-500" : "text-gray-700"
              }`}
            >
              {fuel.sugaryFoods} / 2
            </span>
            <button
              onClick={incrementSugar}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
        {overSugarLimit && (
          <div className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500 font-medium">
            Over today&apos;s sugar limit — try to dial it back.
          </div>
        )}
      </div>

      <Link
        href="/fuel"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-700 transition-colors"
      >
        Open Fuel Page →
      </Link>
    </div>
  );
}
