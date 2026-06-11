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
  className = "object-cover",
  sizes = "400px",
}: WorkoutCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const fallback = categoryCoverUrl(category ?? "home");
  const brokenCdn = src.includes("static.exercisedb.dev");
  const active = failed || brokenCdn ? fallback : src;
  const isExternal = active.startsWith("http");

  return (
    <div className="absolute inset-0">
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={active}
          alt={alt}
          className={`w-full h-full ${className}`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src={active}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
