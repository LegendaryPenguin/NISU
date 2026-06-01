"use client";

import Image from "next/image";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
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
    <div className={`nisu-pillar-reset ml-2 mb-2 ${reset.completed ? "opacity-95" : ""}`}>
      <div className="nisu-pillar-inner p-5">
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
            <p className="text-xs nisu-text-muted italic">
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

      <p className="text-xs nisu-text-caption mb-2">Required:</p>
      <div className="space-y-2 mb-3">
        <ResetActionRow
          checked={reset.reading}
          onClick={toggleReading}
          label="Reading"
          sublabel="15 minutes"
          emoji="📖"
        />
      </div>

      <p className="text-xs nisu-text-caption mb-2">Choose one:</p>
      <div className="space-y-2 mb-3">
        <Link href="/journal" className="block">
          <div
            className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl nisu-row-action-reset cursor-pointer hover:opacity-90 ${
              reset.journaling ? "opacity-80 ring-2 ring-[var(--nisu-amber)]" : ""
            }`}
          >
            <div>
              <p
                className={`text-sm font-bold ${
                  reset.journaling
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                Journaling / Brain Dump
              </p>
              <p className="text-xs nisu-text-muted">
                {reset.journaling ? "Done for today" : "5 minutes → open journal"}
              </p>
            </div>
            <span className="text-lg flex-shrink-0">
              {reset.journaling ? "✅" : "📝"}
            </span>
          </div>
        </Link>
        <ResetActionRow
          checked={reset.meditation}
          onClick={toggleMeditation}
          label="Meditation / Mindfulness"
          sublabel="5 minutes"
          emoji="🧘"
        />
      </div>

      <p className="text-xs nisu-text-caption mb-2">Bonus:</p>
      <div className="mb-3">
        <ResetActionRow
          checked={reset.outside}
          onClick={toggleOutside}
          label="Outside Nature Time"
          sublabel="Optional – go touch grass"
          emoji="🌿"
        />
      </div>
      </div>
    </div>
  );
}

function ResetActionRow({
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
          ? "nisu-row-action-reset opacity-80 ring-2 ring-[var(--nisu-amber)]"
          : "nisu-row-action-reset"
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
