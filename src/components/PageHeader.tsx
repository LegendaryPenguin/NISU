"use client";

import Image from "next/image";
import Link from "next/link";
import { NISU_ASSETS, type NisuSection } from "@/lib/nisu-assets";

function getSectionPenguin(section: NisuSection): string {
  if (section === "streaks") return NISU_ASSETS.penguins.streak;
  if (section === "journal") return NISU_ASSETS.penguins.reset;
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
  actionRow?: React.ReactNode;
}

export default function PageHeader({
  title,
  section,
  showBack = false,
  backHref = "/daily",
  backLabel = "Daily Routine",
  subtitle,
  children,
  actionRow,
}: PageHeaderProps) {
  const penguinSrc = section ? getSectionPenguin(section) : null;

  return (
    <header className="mb-6">
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

      {actionRow}

      {showBack && !actionRow && (
        <Link
          href={backHref}
          className="inline-flex items-center text-sm font-semibold text-[var(--nisu-coral)] hover:opacity-80 transition-opacity mt-2"
        >
          {backLabel}
        </Link>
      )}
    </header>
  );
}

/** CTA + back link on same row (management pages) */
export function PageActionRow({
  cta,
  backHref = "/daily",
  backLabel = "Daily Routine",
}: {
  cta: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
      {cta}
      <Link
        href={backHref}
        className="text-sm font-semibold text-[var(--nisu-coral)] hover:opacity-80 transition-opacity whitespace-nowrap"
      >
        {backLabel}
      </Link>
    </div>
  );
}
