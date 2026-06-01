"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecipeCategory, RecipeWithDetails } from "@/lib/types";
import {
  recipeMatchesSearch,
  recipeTotalMinutes,
} from "@/lib/fuel-actions";

const CATEGORIES: { id: RecipeCategory | "all" | "quick" | "vegetarian"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "dal", label: "Dal" },
  { id: "rice", label: "Rice" },
  { id: "curry", label: "Curry" },
  { id: "bread", label: "Bread" },
  { id: "snack", label: "Snacks" },
  { id: "dessert", label: "Desserts" },
  { id: "drink", label: "Drinks" },
  { id: "quick", label: "Quick" },
  { id: "vegetarian", label: "Vegetarian" },
];

function filterRecipe(
  r: RecipeWithDetails,
  category: string,
  query: string
): boolean {
  if (!recipeMatchesSearch(r, query)) return false;
  if (category === "all") return true;
  if (category === "quick") return recipeTotalMinutes(r) < 30;
  if (category === "vegetarian")
    return (r.tags ?? []).some((t) => t.toLowerCase() === "vegetarian");
  return r.category === category;
}

function RecipeCard({
  recipe,
  onFork,
  onEdit,
  onDelete,
  previewId,
  setPreviewId,
}: {
  recipe: RecipeWithDetails;
  onFork?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  previewId: string | null;
  setPreviewId: (id: string | null) => void;
}) {
  const img =
    recipe.image_url ?? `/recipes/indian/${recipe.category ?? "curry"}.svg`;
  const isOpen = previewId === recipe.id;

  return (
    <div className="nisu-card overflow-hidden flex flex-col">
      <div className="relative w-full h-32 border-b-2 border-[var(--nisu-border)]">
        <Image src={img} alt="" fill className="object-cover" sizes="200px" />
        {recipe.is_builtin && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border-2 border-[var(--nisu-border)]">
            NISU Kitchen
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-0.5">{recipe.name}</h3>
        {recipe.description && (
          <p className="text-xs nisu-text-muted mb-2 line-clamp-2">
            {recipe.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--nisu-cream)] border border-[var(--nisu-border)]">
            {recipeTotalMinutes(recipe)} min
          </span>
          {recipe.difficulty && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--nisu-pale-blue)] border border-[var(--nisu-border)] capitalize">
              {recipe.difficulty}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-auto flex-wrap">
          <Link
            href={`/fuel/cook/${recipe.id}`}
            className="nisu-cta-bold text-xs px-4 py-2"
          >
            Cook
          </Link>
          <button
            onClick={() => setPreviewId(isOpen ? null : recipe.id)}
            className="text-xs font-bold nisu-text-muted px-2 py-2 cursor-pointer"
          >
            {isOpen ? "Hide" : "Preview"}
          </button>
          {recipe.is_builtin && onFork && (
            <button
              onClick={onFork}
              className="text-xs font-bold text-[var(--nisu-coral)] px-2 py-2 cursor-pointer"
            >
              Save copy
            </button>
          )}
          {!recipe.is_builtin && onEdit && (
            <button
              onClick={onEdit}
              className="text-xs font-bold text-[var(--nisu-coral)] px-2 py-2 cursor-pointer"
            >
              Edit
            </button>
          )}
          {!recipe.is_builtin && onDelete && (
            <button
              onClick={onDelete}
              className="text-xs font-bold text-red-500 px-2 py-2 cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
        {isOpen && (
          <div className="mt-3 pt-3 border-t-2 border-[var(--nisu-pale-pink-2)] text-xs space-y-2">
            <p className="font-bold text-gray-900">
              {recipe.recipe_ingredients.length} ingredients ·{" "}
              {recipe.recipe_steps.length} steps
            </p>
            <ul className="space-y-0.5 nisu-text-muted">
              {recipe.recipe_ingredients.slice(0, 5).map((i) => (
                <li key={i.id}>• {i.text}</li>
              ))}
              {recipe.recipe_ingredients.length > 5 && (
                <li>…and {recipe.recipe_ingredients.length - 5} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

interface RecipeBrowserProps {
  recipes: RecipeWithDetails[];
  onFork: (id: string) => Promise<void>;
  onEdit: (r: RecipeWithDetails) => void;
  onDelete: (id: string, name: string) => void;
}

export default function RecipeBrowser({
  recipes,
  onFork,
  onEdit,
  onDelete,
}: RecipeBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = useMemo(
    () => recipes.filter((r) => filterRecipe(r, category, query)),
    [recipes, category, query]
  );

  const builtins = filtered.filter((r) => r.is_builtin);
  const mine = filtered.filter((r) => !r.is_builtin);

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes, ingredients, tags…"
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--nisu-border)] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)] bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-full border-2 transition-colors cursor-pointer ${
              category === c.id
                ? "bg-[var(--nisu-coral)] text-white border-[var(--nisu-border)]"
                : "bg-white border-[var(--nisu-border)] text-gray-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {builtins.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-1">
            NISU Kitchen
          </h2>
          <p className="text-sm nisu-text-muted mb-4">
            {builtins.length} Indian home recipes — shared for you and your partner.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {builtins.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                previewId={previewId}
                setPreviewId={setPreviewId}
                onFork={() => onFork(r.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-extrabold text-gray-900 mb-1">My Recipes</h2>
        <p className="text-sm nisu-text-muted mb-4">
          Your custom recipes and saved copies.
        </p>
        {mine.length === 0 ? (
          <div className="nisu-empty-fuel p-8 text-center">
            <p className="font-bold text-gray-900 mb-1">No personal recipes yet</p>
            <p className="text-sm nisu-text-muted">
              Add your own or save a copy from NISU Kitchen.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {mine.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                previewId={previewId}
                setPreviewId={setPreviewId}
                onEdit={() => onEdit(r)}
                onDelete={() => onDelete(r.id, r.name)}
              />
            ))}
          </div>
        )}
      </section>

      {filtered.length === 0 && (
        <p className="text-center text-sm nisu-text-muted py-8">
          No recipes match your search. Try another filter.
        </p>
      )}
    </div>
  );
}
