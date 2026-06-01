"use client";

import { useState } from "react";
import type { RecipeWithDetails } from "@/lib/types";

interface PrepChecklistProps {
  recipe: RecipeWithDetails;
  onContinue: () => void;
  onBack: () => void;
}

export default function PrepChecklist({
  recipe,
  onContinue,
  onBack,
}: PrepChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((p) => ({ ...p, [id]: !p[id] }));

  const allChecked = recipe.recipe_ingredients.every((i) => checked[i.id]);
  const checkedCount = recipe.recipe_ingredients.filter(
    (i) => checked[i.id]
  ).length;

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900 mb-1">
        Mise en place
      </h2>
      <p className="text-sm nisu-text-muted mb-5">
        Gather everything before you turn on the heat. Check off as you go.
      </p>

      <div className="nisu-card p-4 mb-4 space-y-2">
        {recipe.recipe_ingredients.map((ing) => (
          <button
            key={ing.id}
            onClick={() => toggle(ing.id)}
            className={`flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
              checked[ing.id]
                ? "border-[var(--nisu-coral)] bg-[var(--nisu-pale-pink)]"
                : "border-[var(--nisu-border)] bg-white"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                checked[ing.id]
                  ? "bg-[var(--nisu-coral)] border-transparent text-white text-xs"
                  : "border-gray-300 bg-white"
              }`}
            >
              {checked[ing.id] ? "✓" : ""}
            </span>
            <span
              className={`text-sm font-semibold ${
                checked[ing.id] ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {ing.text}
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs font-bold text-gray-900 mb-4 text-center">
        {checkedCount} / {recipe.recipe_ingredients.length} ready
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-full border-2 border-[var(--nisu-border)] font-bold text-sm cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!allChecked}
          className="flex-[2] nisu-cta-bold py-3 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {allChecked ? "Let's cook!" : "Check all items first"}
        </button>
      </div>
    </div>
  );
}
