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
    <>
      {/* Slim top bar: logo + NISU + Name */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--nisu-pale-pink-2)] pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src={NISU_ASSETS.logoTransparent}
              alt=""
              width={36}
              height={36}
              className="w-9 h-9 object-contain flex-shrink-0"
            />
            <span className="text-base font-extrabold tracking-tight text-[var(--nisu-coral)]">
              NISU
            </span>
            {user && (
              <span className="text-sm font-semibold text-gray-700 truncate">
                {displayName}
              </span>
            )}
          </Link>

          {user && (
            <button
              onClick={signOut}
              className="text-xs font-medium text-gray-400 hover:text-[var(--nisu-coral)] px-2 py-1 rounded-lg hover:bg-[var(--nisu-pale-pink)] transition-colors cursor-pointer flex-shrink-0"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      {/* Fixed bottom icon tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[var(--nisu-pale-pink-2)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const iconSrc = NISU_ASSETS.icons[item.section];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 flex-1 max-w-[52px] ${
                  active ? "bg-[var(--nisu-pale-pink)]" : ""
                }`}
                aria-label={item.label}
              >
                <Image
                  src={iconSrc}
                  alt=""
                  width={32}
                  height={32}
                  className={`w-8 h-8 object-contain ${active ? "scale-105" : "opacity-80"}`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
