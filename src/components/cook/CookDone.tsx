"use client";

import Link from "next/link";
import Image from "next/image";
import type { RecipeWithDetails } from "@/lib/types";
import { NISU_ASSETS } from "@/lib/nisu-assets";

interface CookDoneProps {
  recipe: RecipeWithDetails;
  onCookAgain: () => void;
}

export default function CookDone({ recipe, onCookAgain }: CookDoneProps) {
  return (
    <div className="text-center py-6">
      <Image
        src={NISU_ASSETS.penguins.fuel}
        alt=""
        width={100}
        height={100}
        className="w-24 h-24 object-contain mx-auto mb-4"
      />
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
        You did it!
      </h2>
      <p className="text-[var(--nisu-coral)] font-bold text-lg mb-1">
        {recipe.name}
      </p>
      <p className="text-sm nisu-text-muted mb-8 max-w-xs mx-auto">
        Fresh home cooking beats takeout every time. Enjoy with your favorite person.
      </p>

      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <button
          onClick={onCookAgain}
          className="nisu-cta-bold py-3 cursor-pointer"
        >
          Cook again
        </button>
        <Link
          href="/daily"
          className="nisu-cta-bold py-3 inline-block"
        >
          Log protein on Daily Routine
        </Link>
        <Link
          href="/fuel"
          className="text-sm font-bold text-[var(--nisu-coral)] py-2 hover:opacity-80"
        >
          Back to NISU Kitchen
        </Link>
      </div>
    </div>
  );
}
