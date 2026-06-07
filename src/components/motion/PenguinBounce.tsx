"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { shouldReduceMotion } from "@/lib/motion";

interface PenguinBounceProps {
  src: string;
  width: number;
  height: number;
  className?: string;
  alt?: string;
  /** Re-trigger bounce when this changes */
  bounceKey?: string | number;
}

export default function PenguinBounce({
  src,
  width,
  height,
  className = "",
  alt = "",
  bounceKey = 0,
}: PenguinBounceProps) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    setBounce(false);
    const id = requestAnimationFrame(() => setBounce(true));
    const t = setTimeout(() => setBounce(false), 420);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [bounceKey]);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={[className, bounce ? "nisu-penguin-bounce" : ""]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
