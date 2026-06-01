"use client";

import Image from "next/image";
import type { RecipeWithDetails } from "@/lib/types";
import { recipeTotalMinutes } from "@/lib/fuel-actions";

interface CookOverviewProps {
  recipe: RecipeWithDetails;
  onStart: () => void;
}

export default function CookOverview({ recipe, onStart }: CookOverviewProps) {
  const total = recipeTotalMinutes(recipe);
  const img =
    recipe.image_url ?? `/recipes/indian/${recipe.category ?? "curry"}.svg`;

  return (
    <div>
      <div className="relative w-full h-44 mb-5 rounded-2xl overflow-hidden border-2 border-[var(--nisu-border)]">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 480px"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.difficulty && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border-2 border-[var(--nisu-border)] capitalize">
            {recipe.difficulty}
          </span>
        )}
        {recipe.region && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--nisu-pale-pink)] border-2 border-[var(--nisu-border)] capitalize">
            {recipe.region.replace("-", " ")}
          </span>
        )}
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--nisu-cream)] border-2 border-[var(--nisu-border)]">
          {total} min total
        </span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--nisu-pale-blue)] border-2 border-[var(--nisu-border)]">
          Serves {recipe.servings ?? 2}
        </span>
      </div>

      {recipe.description && (
        <p className="text-sm nisu-text-muted mb-5">{recipe.description}</p>
      )}

      <div className="nisu-card p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">Full ingredient list</h2>
        <ul className="space-y-1.5">
          {recipe.recipe_ingredients.map((ing) => (
            <li
              key={ing.id}
              className="text-sm font-medium text-gray-800 flex gap-2"
            >
              <span className="text-[var(--nisu-coral)]">•</span>
              {ing.text}
            </li>
          ))}
        </ul>
        <p className="text-xs nisu-text-muted mt-3">
          {recipe.recipe_steps.length} cooking steps — we&apos;ll guide you through each one.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full nisu-cta-bold text-base py-3.5 cursor-pointer"
      >
        Start cooking
      </button>
    </div>
  );
}
