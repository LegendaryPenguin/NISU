"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { NISU_ASSETS } from "@/lib/nisu-assets";

interface StreakCalendarProps {
  youDates?: string[];
  partnerDates?: string[];
  youLabel?: string;
  partnerLabel?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const youSet = useMemo(() => new Set(youDates), [youDates]);
  const partnerSet = useMemo(() => new Set(partnerDates), [partnerDates]);

  const cells = useMemo(
    () => getCalendarGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--nisu-pale-pink-2)] w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <span className="font-bold text-gray-800 text-sm">
            Streak Calendar
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Image
              src={NISU_ASSETS.penguins.streak}
              alt=""
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain"
            />
            {youLabel}
          </span>
          <span className="flex items-center gap-1">
            <Image
              src={NISU_ASSETS.penguins.partnerStreak}
              alt=""
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain"
            />
            {partnerLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 cursor-pointer"
        >
          &lt;
        </button>
        <span className="font-semibold text-gray-800 text-sm min-w-[130px] text-center">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 cursor-pointer"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const hasYou = youSet.has(cell.dateKey);
          const hasPartner = partnerSet.has(cell.dateKey);

          return (
            <div
              key={i}
              className={`flex flex-col items-center py-1.5 ${
                cell.currentMonth ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <span className="text-xs font-medium">{cell.day}</span>
              <div className="flex items-center gap-0.5 mt-0.5 h-4">
                {hasYou && (
                  <Image
                    src={NISU_ASSETS.penguins.streak}
                    alt=""
                    width={12}
                    height={12}
                    className="w-3 h-3 object-contain"
                  />
                )}
                {hasPartner && (
                  <Image
                    src={NISU_ASSETS.penguins.partnerStreak}
                    alt=""
                    width={12}
                    height={12}
                    className="w-3 h-3 object-contain"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
