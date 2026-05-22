"use client";

import Link from "next/link";
import { useMemo } from "react";
import PenguinMascot from "@/components/PenguinMascot";
import StreakCalendar from "@/components/StreakCalendar";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const PLACEHOLDER_STREAK = 18;
const PLACEHOLDER_PARTNER = 14;
const PLACEHOLDER_TOGETHER = 12;

export default function LandingPage() {
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* ─── Hero Section ─── */}
      <section className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-8">
          {/* Left: greeting + CTA */}
          <div className="flex-shrink-0 text-center lg:text-left lg:pt-6 lg:max-w-xs">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight tracking-tight">
              {greeting},
              <br />
              <span style={{ color: "#ff787e" }}>Surender!</span>
            </h1>
            <p className="mt-3 text-gray-500 text-sm sm:text-base">
              Every small step today builds
              <br className="hidden sm:block" /> your best summer.{" "}
              <span className="inline-block">&#10024;</span>
            </p>
            <Link
              href="/daily"
              className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full text-white font-bold text-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #ff787e 0%, #ffb0ab 100%)",
              }}
            >
              Go to Task Board
              <span className="text-base">&rarr;</span>
            </Link>
          </div>

          {/* Center: penguin mascot (desktop only, overlapping) */}
          <div className="hidden lg:flex items-end justify-center flex-shrink-0 -mb-4 relative" style={{ marginLeft: "-10px", marginRight: "-30px" }}>
            <PenguinMascot variant="hero" size={220} />
          </div>

          {/* Mobile penguin (shown above calendar on small screens) */}
          <div className="lg:hidden flex justify-center -mb-2">
            <PenguinMascot variant="hero" size={180} />
          </div>

          {/* Right: streak calendar */}
          <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end">
            <StreakCalendar />
          </div>
        </div>
      </section>

      {/* ─── Stat Cards ─── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Your streak */}
          <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
            <PenguinMascot variant="small" size={56} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-600">
                  Your streak
                </span>
                <span style={{ color: "#ff787e" }} className="text-xs">
                  &#10084;
                </span>
              </div>
              <p
                className="text-3xl font-extrabold leading-none mt-0.5"
                style={{ color: "#ff787e" }}
              >
                {PLACEHOLDER_STREAK}{" "}
                <span className="text-sm font-semibold text-gray-500">
                  days
                </span>
              </p>
            </div>
          </div>

          {/* Partner streak */}
          <div
            className="flex items-center gap-4 rounded-2xl px-5 py-4 shadow-sm border border-gray-100"
            style={{ backgroundColor: "#fff5f4" }}
          >
            <PenguinMascot variant="small" size={56} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-600">
                  Partner streak
                </span>
                <span style={{ color: "#ff787e" }} className="text-xs">
                  &#10084;
                </span>
              </div>
              <p
                className="text-3xl font-extrabold leading-none mt-0.5"
                style={{ color: "#ff787e" }}
              >
                {PLACEHOLDER_PARTNER}{" "}
                <span className="text-sm font-semibold text-gray-500">
                  days
                </span>
              </p>
            </div>
          </div>

          {/* Completed together */}
          <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#fff8eb" }}
            >
              <span className="text-2xl">&#11088;</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">
                Completed together
              </span>
              <p
                className="text-3xl font-extrabold leading-none mt-0.5"
                style={{ color: "#fdb95c" }}
              >
                {PLACEHOLDER_TOGETHER}{" "}
                <span className="text-sm font-semibold text-gray-500">
                  days
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Motivational Banner ─── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div
          className="rounded-2xl px-6 py-4 flex items-center justify-between overflow-hidden"
          style={{ backgroundColor: "#fef0ee" }}
        >
          <p className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 flex-wrap">
            <span style={{ color: "#73d9ff" }}>&#10024;</span>
            <span className="font-bold">
              Consistency is your superpower.
            </span>{" "}
            Keep stacking those wins!{" "}
            <span style={{ color: "#ff787e" }}>&#10084;</span>
          </p>
          <div className="flex-shrink-0 ml-4 hidden sm:block">
            <PenguinMascot variant="peek" size={70} />
          </div>
        </div>
      </section>
    </div>
  );
}
