"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Exercise } from "@/lib/types";
import {
  resolveExerciseGif,
  resolveExerciseStill,
  shouldUseStillImage,
} from "@/lib/exercise-media";

interface ExerciseMediaProps {
  exercise: Exercise | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ExerciseMedia({
  exercise,
  alt,
  className = "w-full h-full object-contain",
  priority = false,
}: ExerciseMediaProps) {
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setStill(shouldUseStillImage());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setStill(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved = still ? resolveExerciseStill(exercise) : resolveExerciseGif(exercise);
  const brokenCdn = resolved.includes("static.exercisedb.dev");
  const src = failed || brokenCdn ? "/workouts/home.svg" : resolved;
  const isExternal = src.startsWith("http");

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes="(max-width: 768px) 100vw, 480px"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
