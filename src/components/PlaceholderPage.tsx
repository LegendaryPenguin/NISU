"use client";

import Image from "next/image";
import Link from "next/link";

interface PlaceholderPageProps {
  title: string;
  section: "streaks" | "practice";
  description: string;
}

export default function PlaceholderPage({
  title,
  section,
  description,
}: PlaceholderPageProps) {
  const penguinSrc =
    section === "streaks"
      ? "/nisu/penguins/streak.png"
      : "/nisu/penguins/practice.png";

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <Image
            src={penguinSrc}
            alt=""
            width={120}
            height={120}
            className="w-28 h-28 object-contain mx-auto mb-4"
          />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[var(--nisu-coral)]">
            {title}
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {description}
          </p>

          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full mb-8"
            style={{
              backgroundColor: "var(--nisu-pale-pink)",
              color: "var(--nisu-coral)",
              border: "1px solid var(--nisu-pale-pink-2)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--nisu-amber)" }}
            />
            Coming soon
          </div>

          <div className="block">
            <Link
              href="/daily"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--nisu-coral)] hover:opacity-80 transition-opacity"
            >
              ← Back to Daily Routine
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
