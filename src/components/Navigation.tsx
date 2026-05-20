"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/daily", label: "Daily Routine", emoji: "📋" },
  { href: "/fitness", label: "Fitness", emoji: "💪" },
  { href: "/fuel", label: "Fuel", emoji: "🥗" },
  { href: "/skill", label: "Skill", emoji: "🧠" },
  { href: "/journal", label: "Journal", emoji: "📝" },
  { href: "/accountability", label: "Streaks", emoji: "🔥" },
  { href: "/practice", label: "Practice", emoji: "🎯" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/") return null;

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent"
        >
          NISU
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="mr-1">{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile nav */}
      <nav className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent"
          >
            NISU
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {mobileOpen && (
          <div className="px-4 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-1.5">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
                pathname === item.href
                  ? "text-violet-600"
                  : "text-gray-400"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
