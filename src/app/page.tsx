"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import StreakCalendar from "@/components/StreakCalendar";
import { useAuth } from "@/context/AuthContext";
import { NISU_ASSETS } from "@/lib/nisu-assets";

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
  const { displayName, partnerName } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative banner strip */}
      <div className="relative w-full h-24 sm:h-32 overflow-hidden">
        <Image
          src={NISU_ASSETS.banner}
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <section className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 -mt-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-8">
          <div className="flex-shrink-0 text-center lg:text-left lg:pt-6 lg:max-w-xs">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight tracking-tight">
              {greeting},
              <br />
              <span className="text-[var(--nisu-coral)]">{displayName}!</span>
            </h1>
            <p className="mt-3 text-gray-500 text-sm sm:text-base">
              Every small step today builds
              <br className="hidden sm:block" /> your best summer.{" "}
              <span className="inline-block">&#10024;</span>
            </p>
            <Link
              href="/daily"
              className="inline-flex items-center gap-2 mt-6 px-7 py-3 nisu-cta text-sm shadow-lg"
            >
              Go to Task Board
              <span className="text-base">&rarr;</span>
            </Link>
          </div>

          <div className="flex items-end justify-center flex-shrink-0 -mb-2 lg:-mb-4">
            <Image
              src={NISU_ASSETS.penguins.daily}
              alt="NISU penguin"
              width={220}
              height={220}
              className="w-44 sm:w-52 lg:w-56 h-auto object-contain"
              priority
            />
          </div>

          <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end">
            <StreakCalendar />
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 nisu-card px-5 py-4">
            <Image
              src={NISU_ASSETS.penguins.streak}
              alt=""
              width={56}
              height={56}
              className="w-14 h-14 object-contain flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-600">
                  Your streak
                </span>
                <Image
                  src={NISU_ASSETS.ui.heart}
                  alt=""
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 object-contain"
                />
              </div>
              <p className="text-3xl font-extrabold leading-none mt-0.5 text-[var(--nisu-coral)]">
                {PLACEHOLDER_STREAK}{" "}
                <span className="text-sm font-semibold text-gray-500">days</span>
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-4 rounded-2xl px-5 py-4 nisu-card"
            style={{ backgroundColor: "var(--nisu-pale-pink)" }}
          >
            <Image
              src={NISU_ASSETS.penguins.partnerStreak}
              alt=""
              width={56}
              height={56}
              className="w-14 h-14 object-contain flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-600">
                  {partnerName}&apos;s streak
                </span>
                <Image
                  src={NISU_ASSETS.ui.heart}
                  alt=""
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 object-contain"
                />
              </div>
              <p className="text-3xl font-extrabold leading-none mt-0.5 text-[var(--nisu-coral)]">
                {PLACEHOLDER_PARTNER}{" "}
                <span className="text-sm font-semibold text-gray-500">days</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 nisu-card px-5 py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--nisu-cream)" }}
            >
              <span className="text-2xl">&#11088;</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">
                Completed together
              </span>
              <p className="text-3xl font-extrabold leading-none mt-0.5 text-[var(--nisu-amber)]">
                {PLACEHOLDER_TOGETHER}{" "}
                <span className="text-sm font-semibold text-gray-500">days</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div
          className="rounded-2xl px-6 py-4 flex items-center justify-between overflow-hidden"
          style={{ backgroundColor: "var(--nisu-banner-bg)" }}
        >
          <p className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 flex-wrap">
            <span className="text-[var(--nisu-sky)]">&#10024;</span>
            <span className="font-bold">Consistency is your superpower.</span>{" "}
            Keep stacking those wins!{" "}
            <Image
              src={NISU_ASSETS.ui.heart}
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 object-contain inline"
            />
          </p>
          <div className="flex-shrink-0 ml-4 hidden sm:block">
            <Image
              src={NISU_ASSETS.penguins.streak}
              alt=""
              width={70}
              height={70}
              className="w-[70px] h-auto object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
