"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { getTodayKey } from "@/lib/helpers";

interface StreakCalendarProps {
  youDates?: string[];
  partnerDates?: string[];
  youLabel?: string;
  partnerLabel?: string;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; currentMonth: boolean; dateKey: string }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({
      day: d,
      currentMonth: false,
      dateKey: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      currentMonth: true,
      dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      cells.push({
        day: d,
        currentMonth: false,
        dateKey: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
  }

  return cells;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function StreakCalendar({
  youDates = [],
  partnerDates = [],
  youLabel = "You",
  partnerLabel = "Partner",
}: StreakCalendarProps) {
  const todayKey = getTodayKey();
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const youSet = useMemo(() => new Set(youDates), [youDates]);
  const partnerSet = useMemo(() => new Set(partnerDates), [partnerDates]);

  const cells = useMemo(
    () => getCalendarGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const monthSuccessCount = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`;
    let n = 0;
    for (const d of youDates) {
      if (d.startsWith(prefix)) n++;
    }
    return n;
  }, [youDates, viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <div className="nisu-stat-light rounded-2xl p-4 w-full max-w-md border-2 border-[var(--nisu-border)] shadow-[var(--nisu-shadow)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden>
          📅
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-gray-900 text-base leading-tight">
            Streak Calendar
          </h2>
          <p className="text-[11px] nisu-text-muted font-medium">
            {monthSuccessCount > 0
              ? `${monthSuccessCount} win${monthSuccessCount === 1 ? "" : "s"} this month`
              : "Complete 3/4 pillars to mark a day"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <LegendPill
          icon={NISU_ASSETS.penguins.streak}
          label={youLabel}
          tint="coral"
        />
        <LegendPill
          icon={NISU_ASSETS.penguins.partnerStreak}
          label={partnerLabel}
          tint="sky"
        />
        <LegendPill icon="" label="Both" tint="both" dual />
      </div>

      <div className="bg-white rounded-xl border-2 border-[var(--nisu-border)] p-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[var(--nisu-border)] bg-[var(--nisu-pale-pink)] font-bold text-gray-800 hover:opacity-90 cursor-pointer"
          >
            ‹
          </button>
          <span className="font-extrabold text-gray-900 text-sm text-center flex-1">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[var(--nisu-border)] bg-[var(--nisu-pale-pink)] font-bold text-gray-800 hover:opacity-90 cursor-pointer"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d, i) => (
            <div
              key={`${d}-${i}`}
              className="text-center text-[10px] font-extrabold text-gray-400 py-0.5"
            >
              {d}
            </div>
          ))}
        </div>

        <div
          key={`${viewYear}-${viewMonth}`}
          className="grid grid-cols-7 gap-1 nisu-calendar-grid-fade"
        >
          {cells.map((cell) => {
            const hasYou = youSet.has(cell.dateKey);
            const hasPartner = partnerSet.has(cell.dateKey);
            const isToday = cell.dateKey === todayKey;
            const both = hasYou && hasPartner;

            return (
              <div
                key={cell.dateKey}
                className={[
                  "flex flex-col items-center justify-center rounded-lg min-h-[52px] p-0.5 transition-colors",
                  !cell.currentMonth && "opacity-35",
                  cell.currentMonth && !hasYou && !hasPartner && "bg-gray-50/80",
                  hasYou && !hasPartner && "bg-[var(--nisu-pale-pink)]",
                  hasPartner && !hasYou && "bg-[var(--nisu-pale-blue)]",
                  both && "bg-gradient-to-br from-[var(--nisu-pale-pink)] to-[var(--nisu-pale-blue)]",
                  isToday && "ring-2 ring-[var(--nisu-coral)] ring-offset-1",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className={`text-[11px] font-bold leading-none ${
                    isToday ? "text-[var(--nisu-coral)]" : "text-gray-800"
                  }`}
                >
                  {cell.day}
                </span>
                <div className="flex items-center justify-center gap-px mt-1 min-h-[22px]">
                  {hasYou && (
                    <Image
                      src={NISU_ASSETS.penguins.streak}
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain drop-shadow-sm nisu-penguin-pop"
                    />
                  )}
                  {hasPartner && (
                    <Image
                      src={NISU_ASSETS.penguins.partnerStreak}
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain drop-shadow-sm nisu-penguin-pop"
                      style={{ animationDelay: hasYou ? "80ms" : undefined }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LegendPill({
  icon,
  label,
  tint,
  dual,
}: {
  icon: string;
  label: string;
  tint: "coral" | "sky" | "both";
  dual?: boolean;
}) {
  const bg =
    tint === "coral"
      ? "bg-[var(--nisu-pale-pink)]"
      : tint === "sky"
        ? "bg-[var(--nisu-pale-blue)]"
        : "bg-gradient-to-r from-[var(--nisu-pale-pink)] to-[var(--nisu-pale-blue)]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--nisu-border)] text-[11px] font-bold text-gray-800 ${bg}`}
    >
      {dual ? (
        <span className="flex -space-x-1">
          <Image
            src={NISU_ASSETS.penguins.streak}
            alt=""
            width={14}
            height={14}
            className="w-3.5 h-3.5 object-contain"
          />
          <Image
            src={NISU_ASSETS.penguins.partnerStreak}
            alt=""
            width={14}
            height={14}
            className="w-3.5 h-3.5 object-contain"
          />
        </span>
      ) : icon ? (
        <Image
          src={icon}
          alt=""
          width={14}
          height={14}
          className="w-3.5 h-3.5 object-contain"
        />
      ) : null}
      {label}
    </span>
  );
}
