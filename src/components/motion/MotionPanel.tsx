"use client";

import { useEffect, useState, type ReactNode } from "react";
import { shouldReduceMotion } from "@/lib/motion";

interface MotionPanelProps {
  /** Change to re-trigger enter animation */
  panelKey: string | number;
  children: ReactNode;
  className?: string;
  /** Sticker settle from top when expanding inside cards */
  origin?: "top" | "center";
  /** Skip enter animation (e.g. initial mount) */
  skipEnter?: boolean;
}

export default function MotionPanel({
  panelKey,
  children,
  className = "",
  origin = "top",
  skipEnter = false,
}: MotionPanelProps) {
  const [visible, setVisible] = useState(skipEnter || shouldReduceMotion());

  useEffect(() => {
    if (skipEnter || shouldReduceMotion()) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [panelKey, skipEnter]);

  const originClass = origin === "top" ? "origin-top" : "origin-center";

  return (
    <div
      key={panelKey}
      className={[
        "nisu-motion-enter",
        originClass,
        visible ? "nisu-motion-enter-active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
