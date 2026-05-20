"use client";

import Link from "next/link";

interface PlaceholderPageProps {
  title: string;
  emoji: string;
  description: string;
  accentFrom: string;
  accentTo: string;
}

export default function PlaceholderPage({
  title,
  emoji,
  description,
  accentFrom,
  accentTo,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <span className="text-5xl mb-4 block">{emoji}</span>
          <h1
            className="text-3xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            }}
          >
            {title}
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {description}
          </p>

          <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-400 text-sm font-semibold px-5 py-2.5 rounded-full border border-gray-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Coming soon
          </div>

          <div className="block">
            <Link
              href="/daily"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Back to Daily Routine
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
