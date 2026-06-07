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
      <header className="sticky top-0 z-50 bg-[var(--background)] border-b-2 border-[var(--nisu-border)] pt-[env(safe-area-inset-top)]">
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t-2 border-[var(--nisu-border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const iconSrc = NISU_ASSETS.icons[item.section];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nisu-focus-ring flex flex-col items-center justify-center py-1.5 px-1.5 rounded-2xl transition-[box-shadow] duration-[var(--nisu-motion-fast)] flex-1 max-w-[56px]"
                aria-label={item.label}
              >
                <span
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-[box-shadow,background-color] duration-[var(--nisu-motion-fast)] ${
                    active
                      ? "bg-white ring-2 ring-[var(--nisu-border)] shadow-[var(--nisu-shadow)]"
                      : ""
                  }`}
                >
                  <Image
                    src={iconSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain object-center"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
