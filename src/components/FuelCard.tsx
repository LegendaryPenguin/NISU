"use client";

import Image from "next/image";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import CompleteBadge from "@/components/motion/CompleteBadge";

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
    <div className={`nisu-pillar-fuel ml-2 mb-2 ${fuel.completed ? "opacity-95" : ""}`}>
      <div className="nisu-pillar-inner p-5">
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
            <p className="text-xs nisu-text-muted italic">
              Hit the basics. Hydrate. Don&apos;t run on sugar.
            </p>
          </div>
        </div>
        {fuel.completed && (
          <CompleteBadge backgroundColor="var(--nisu-coral)" />
        )}
      </div>

      <p className="text-xs nisu-text-caption mb-3">Mandatory:</p>

      <div className="space-y-2 mb-4">
        <FuelActionRow
          checked={fuel.protein}
          onClick={toggleProtein}
          label="Protein Goal"
          sublabel="Hit your daily protein target"
          emoji="🥩"
        />
        <FuelActionRow
          checked={fuel.water}
          onClick={toggleWater}
          label="Water Goal"
          sublabel="Stay hydrated all day"
          emoji="💧"
        />
      </div>

      <div className="mb-4">
        <div
          className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl nisu-row-action-fuel ${
            overSugarLimit ? "ring-2 ring-[var(--nisu-coral)]" : ""
          }`}
        >
          <div>
            <p className="text-sm font-bold text-gray-900">
              Sugary foods today
            </p>
            <p className="text-xs nisu-text-muted">Track up to 2 per day</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
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
          <div className="text-xs px-3 py-2 rounded-lg bg-[var(--nisu-pale-pink)] text-[var(--nisu-coral)] font-medium mt-2">
            Over today&apos;s sugar limit — try to dial it back.
          </div>
        )}
      </div>

      <Link
        href="/fuel"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--nisu-coral)] hover:opacity-80 transition-opacity"
      >
        Open Fuel Page →
      </Link>
      </div>
    </div>
  );
}

function FuelActionRow({
  checked,
  onClick,
  label,
  sublabel,
  emoji,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
  emoji: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl text-left cursor-pointer hover:opacity-90 transition-opacity ${
        checked
          ? "nisu-row-action-fuel opacity-80 ring-2 ring-[var(--nisu-coral)]"
          : "nisu-row-action-fuel"
      }`}
    >
      <div>
        <p
          className={`text-sm font-bold ${
            checked ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {label}
        </p>
        <p className="text-xs nisu-text-muted">{sublabel}</p>
      </div>
      <span className="text-lg flex-shrink-0">{checked ? "✅" : emoji}</span>
    </button>
  );
}
