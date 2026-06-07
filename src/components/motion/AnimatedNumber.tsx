"use client";

import { useEffect, useRef, useState } from "react";
import { shouldReduceMotion } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
  /** Skip animation on first render (e.g. loading placeholder → number) */
  animateOnMount?: boolean;
}

export default function AnimatedNumber({
  value,
  className = "",
  animateOnMount = false,
}: AnimatedNumberProps) {
  const prev = useRef<number | string | null>(null);
  const [settling, setSettling] = useState(false);
  const isNumeric =
    typeof value === "number" && typeof prev.current === "number";

  useEffect(() => {
    if (value === "—" || value === prev.current) return;
    if (!animateOnMount && prev.current === null) {
      prev.current = value;
      return;
    }
    if (shouldReduceMotion() || !isNumeric) {
      prev.current = value;
      return;
    }
    setSettling(true);
    prev.current = value;
    const t = setTimeout(() => setSettling(false), 280);
    return () => clearTimeout(t);
  }, [value, animateOnMount, isNumeric]);

  const display = value === "—" ? "—" : value;

  return (
    <span
      className={[
        settling ? "nisu-number-settle" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {display}
    </span>
  );
}
