"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
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
      <section className="w-full max-w-lg mx-auto px-4 pt-6 pb-8">
        <div className="text-center mb-4">
          <Image
            src={NISU_ASSETS.penguins.daily}
            alt="NISU penguin"
            width={180}
            height={180}
            className="w-40 h-auto object-contain mx-auto mb-4"
            priority
          />
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {greeting},
            <br />
            <span className="text-[var(--nisu-coral)]">{displayName}!</span>
          </h1>
          <p className="mt-3 text-gray-500 text-sm">
            Every small step today builds your best summer.{" "}
            <span>&#10024;</span>
          </p>
          <Link
            href="/daily"
            className="inline-flex items-center gap-2 mt-6 px-7 py-3 nisu-cta text-sm shadow-lg"
          >
            Go to Task Board
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
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
                  Partner streak
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

        <div
          className="rounded-2xl px-6 py-4 mt-6 text-center"
          style={{ backgroundColor: "var(--nisu-banner-bg)" }}
        >
          <p className="text-sm font-medium text-gray-700">
            <span className="text-[var(--nisu-sky)]">&#10024;</span>{" "}
            <span className="font-bold">Consistency is your superpower.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
