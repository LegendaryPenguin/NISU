"use client";

import Image from "next/image";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { NISU_ASSETS } from "@/lib/nisu-assets";

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
      className={`rounded-2xl p-5 shadow-md transition-all duration-300 nisu-section-card-fuel ${
        fuel.completed ? "opacity-95" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={NISU_ASSETS.penguins.fuel}
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
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
        <FuelCheckbox
          checked={fuel.protein}
          onChange={toggleProtein}
          label="Protein Goal"
          sublabel="Hit your daily protein target"
        />
        <FuelCheckbox
          checked={fuel.water}
          onChange={toggleWater}
          label="Water Goal"
          sublabel="Stay hydrated all day"
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
              className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
              aria-label="Decrease sugary foods"
            >
              <Image
                src={NISU_ASSETS.ui.minus}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </button>
            <span
              className={`text-sm font-bold min-w-[40px] text-center ${
                overSugarLimit ? "text-[var(--nisu-coral)]" : "text-gray-700"
              }`}
            >
              {fuel.sugaryFoods} / 2
            </span>
            <button
              onClick={incrementSugar}
              className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
              aria-label="Increase sugary foods"
            >
              <Image
                src={NISU_ASSETS.ui.plus}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </button>
          </div>
        </div>
        {overSugarLimit && (
          <div className="text-xs px-3 py-2 rounded-lg bg-[var(--nisu-pale-pink)] text-[var(--nisu-coral)] font-medium">
            Over today&apos;s sugar limit — try to dial it back.
          </div>
        )}
      </div>

      <Link
        href="/fuel"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
      >
        Open Fuel Page →
      </Link>
    </div>
  );
}

function FuelCheckbox({
  checked,
  onChange,
  label,
  sublabel,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  sublabel?: string;
}) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-black/[0.03] cursor-pointer ${
        checked ? "bg-black/[0.02]" : ""
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          checked
            ? "bg-emerald-500 border-transparent"
            : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
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
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium transition-all duration-200 ${
            checked ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-gray-400">{sublabel}</span>
        )}
      </div>
    </button>
  );
}
