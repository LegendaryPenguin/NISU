"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { NISU_ASSETS, type NisuSection } from "@/lib/nisu-assets";

function getSectionImage(section: NisuSection): string {
  if (section === "streaks") return NISU_ASSETS.penguins.streak;
  if (section === "journal") return NISU_ASSETS.icons.journal;
  return NISU_ASSETS.penguins[section];
}

interface PageHeaderProps {
  title: string;
  section?: NisuSection;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  section,
  showBack = true,
  backHref = "/daily",
  backLabel = "Daily Routine",
  subtitle,
  children,
}: PageHeaderProps) {
  const { displayName } = useAuth();
  const penguinSrc = section ? getSectionImage(section) : null;

  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={NISU_ASSETS.logoTransparent}
            alt="NISU"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <span className="text-sm font-bold text-gray-800">{displayName}</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        {penguinSrc && (
          <Image
            src={penguinSrc}
            alt=""
            width={56}
            height={56}
            className="w-14 h-14 object-contain flex-shrink-0"
          />
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
          {children}
        </div>
      </div>

      {showBack && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--nisu-coral)] hover:opacity-80 transition-opacity mt-1"
        >
          ← {backLabel}
        </Link>
      )}
    </header>
  );
}
