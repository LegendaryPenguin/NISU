"use client";

import type { ReactNode } from "react";

interface LoadingFadeProps {
  loading: boolean;
  spinner: ReactNode;
  children: ReactNode;
}

/** Crossfade spinner → content (functional continuity) */
export default function LoadingFade({
  loading,
  spinner,
  children,
}: LoadingFadeProps) {
  return (
    <div className="relative min-h-[120px]">
      <div
        className={[
          "nisu-loading-fade",
          loading ? "nisu-loading-fade-show" : "nisu-loading-fade-hide",
        ].join(" ")}
        aria-hidden={!loading}
      >
        {spinner}
      </div>
      <div
        className={[
          "nisu-loading-fade",
          loading ? "nisu-loading-fade-hide" : "nisu-loading-fade-show",
        ].join(" ")}
        aria-hidden={loading}
      >
        {children}
      </div>
    </div>
  );
}
