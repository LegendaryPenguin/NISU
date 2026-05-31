"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { NAV_ITEMS, NISU_ASSETS } from "@/lib/nisu-assets";

function isActive(pathname: string, href: string) {
  if (href === "/daily") return pathname === "/daily";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navigation() {
  const pathname = usePathname();
  const { user, displayName, signOut } = useAuth();

  if (pathname === "/login") return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--nisu-pale-pink-2)] pt-[env(safe-area-inset-top)]">
      {/* Top bar: logo + user */}
      <div className="flex items-center justify-between px-4 py-2 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={NISU_ASSETS.logoTransparent}
            alt="NISU"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-extrabold tracking-tight text-[var(--nisu-coral)] hidden sm:inline">
            NISU
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-xs font-semibold text-gray-500 truncate max-w-[120px] sm:max-w-none">
                {displayName}
              </span>
              <button
                onClick={signOut}
                className="text-xs font-medium text-gray-400 hover:text-[var(--nisu-coral)] px-2 py-1 rounded-lg hover:bg-[var(--nisu-pale-pink)] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Horizontal icon nav — scrollable on mobile, centered on desktop */}
      <div className="overflow-x-auto scrollbar-hide px-2 pb-2 max-w-6xl mx-auto">
        <div className="flex items-end justify-start md:justify-center gap-1 sm:gap-2 min-w-max md:min-w-0 px-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const iconSrc = NISU_ASSETS.icons[item.section];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all duration-200 min-w-[52px] sm:min-w-[64px] ${
                  active
                    ? "bg-[var(--nisu-pale-pink)] ring-2 ring-[var(--nisu-coral)] ring-offset-1"
                    : "hover:bg-[var(--nisu-pale-pink)]/50"
                }`}
              >
                <Image
                  src={iconSrc}
                  alt=""
                  width={36}
                  height={36}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                />
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold leading-tight text-center ${
                    active ? "text-[var(--nisu-coral)]" : "text-gray-500"
                  }`}
                >
                  {item.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
