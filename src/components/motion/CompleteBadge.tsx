"use client";

import { useEffect, useState } from "react";
import { shouldReduceMotion } from "@/lib/motion";

interface CompleteBadgeProps {
  label?: string;
  backgroundColor: string;
}

/** Pill drops in with sticker shadow settle */
export default function CompleteBadge({
  label = "Complete",
  backgroundColor,
}: CompleteBadgeProps) {
  const [settled, setSettled] = useState(shouldReduceMotion());

  useEffect(() => {
    if (shouldReduceMotion()) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSettled(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span
      className={[
        "text-white text-xs font-bold px-3 py-1 rounded-full nisu-complete-badge",
        settled ? "nisu-complete-badge-settled" : "",
      ].join(" ")}
      style={{ backgroundColor }}
    >
      {label}
    </span>
  );
}
