"use client";

import { useState } from "react";
import Image from "next/image";
import { categoryCoverUrl } from "@/lib/exercise-media";

interface WorkoutCoverImageProps {
  src: string;
  alt?: string;
  category?: string | null;
  className?: string;
  sizes?: string;
}

export default function WorkoutCoverImage({
  src,
  alt = "",
  category = "home",
  className = "w-full h-full object-cover",
  sizes = "400px",
}: WorkoutCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const fallback = categoryCoverUrl(category ?? "home");
  const active = failed ? fallback : src;
  const isExternal = active.startsWith("http");

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={active}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={active}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
