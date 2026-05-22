"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { RecipeWithDetails } from "@/lib/types";
import { formatDuration } from "@/lib/helpers";
import {
  fetchRecipes,
  saveFullRecipe,
  updateFullRecipe,
  deleteRecipe,
} from "@/lib/fuel-actions";

// ----- Draft types for the form -----

interface IngredientDraft {
  id: string;
  text: string;
}

interface StepDraft {
  id: string;
  instruction: string;
  timerMin: string;
  timerSec: string;
}

function newIngredient(): IngredientDraft {
  return { id: crypto.randomUUID(), text: "" };
}

function newStep(): StepDraft {
  return { id: crypto.randomUUID(), instruction: "", timerMin: "", timerSec: "" };
}

function stepDraftsFromRecipe(
  steps: RecipeWithDetails["recipe_steps"]
): StepDraft[] {
  return steps.map((s) => ({
    id: s.id,
    instruction: s.instruction,
    timerMin: s.timer_seconds ? String(Math.floor(s.timer_seconds / 60)) : "",
    timerSec: s.timer_seconds ? String(s.timer_seconds % 60) : "",
  }));
}

function ingredientDraftsFromRecipe(
  ings: RecipeWithDetails["recipe_ingredients"]
): IngredientDraft[] {
  return ings.map((i) => ({ id: i.id, text: i.text }));
}

function draftToTimerSeconds(d: StepDraft): number | null {
  const m = parseInt(d.timerMin) || 0;
  const s = parseInt(d.timerSec) || 0;
  if (m === 0 && s === 0) return null;
  return m * 60 + s;
}

// ===== PAGE =====

export default function FuelPage() {
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<"idle" | "create" | "edit">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([
    newIngredient(),
  ]);
  const [steps, setSteps] = useState<StepDraft[]>([newStep()]);
  const [saving, setSaving] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setRecipes(await fetchRecipes());
    } catch {
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setFormMode("idle");
    setEditingId(null);
    setRecipeName("");
    setIngredients([newIngredient()]);
    setSteps([newStep()]);
  };

  const startCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setRecipeName("");
    setIngredients([newIngredient()]);
    setSteps([newStep()]);
  };

  const startEdit = (r: RecipeWithDetails) => {
    setFormMode("edit");
    setEditingId(r.id);
    setRecipeName(r.name);
    setIngredients(
      r.recipe_ingredients.length > 0
        ? ingredientDraftsFromRecipe(r.recipe_ingredients)
        : [newIngredient()]
    );
    setSteps(
      r.recipe_steps.length > 0
        ? stepDraftsFromRecipe(r.recipe_steps)
        : [newStep()]
    );
  };

  const handleSave = async () => {
    const name = recipeName.trim();
    const validIngs = ingredients.filter((i) => i.text.trim());
    const validSteps = steps.filter((s) => s.instruction.trim());
    if (!name || validIngs.length === 0 || validSteps.length === 0) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        ingredients: validIngs.map((i) => i.text.trim()),
        steps: validSteps.map((s) => ({
          instruction: s.instruction.trim(),
          timer_seconds: draftToTimerSeconds(s),
        })),
      };

      if (formMode === "create") {
        await saveFullRecipe(payload);
      } else if (editingId) {
        await updateFullRecipe(editingId, payload);
      }
      await load();
      resetForm();
    } catch {
      setError("Failed to save recipe.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setError(null);
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete recipe.");
    }
  };

  const preview = recipes.find((r) => r.id === previewId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white pb-28 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🥗</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Fuel
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Recipes you can actually cook.
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Pick a recipe, follow the steps, and make eating better easier.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {formMode === "idle" && (
            <button
              onClick={startCreate}
              className="bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              + Add Recipe
            </button>
          )}
          <Link
            href="/daily"
            className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            ← Daily Routine
          </Link>
        </div>

        {/* Form */}
        {formMode !== "idle" && (
          <RecipeForm
            mode={formMode}
            recipeName={recipeName}
            setRecipeName={setRecipeName}
            ingredients={ingredients}
            setIngredients={setIngredients}
            steps={steps}
            setSteps={setSteps}
            saving={saving}
            onSave={handleSave}
            onCancel={resetForm}
          />
        )}

        {/* Recipes */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <span className="text-5xl mb-4 block">🍳</span>
            <p className="text-gray-700 font-semibold text-lg mb-1">
              No recipes yet
            </p>
            <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
              Add your first recipe so Future You has something easy to cook.
            </p>
            {formMode === "idle" && (
              <button
                onClick={startCreate}
                className="bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                + Add Recipe
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recipes.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col"
              >
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {r.name}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  {r.recipe_ingredients.length} ingredient
                  {r.recipe_ingredients.length !== 1 ? "s" : ""} ·{" "}
                  {r.recipe_steps.length} step
                  {r.recipe_steps.length !== 1 ? "s" : ""}
                </p>

                <div className="flex gap-2 mt-auto flex-wrap">
                  <Link
                    href={`/fuel/cook/${r.id}`}
                    className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Cook
                  </Link>
                  <button
                    onClick={() =>
                      setPreviewId(previewId === r.id ? null : r.id)
                    }
                    className="text-xs font-medium text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {previewId === r.id ? "Hide" : "Preview"}
                  </button>
                  <button
                    onClick={() => startEdit(r)}
                    className="text-xs font-medium text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.name)}
                    className="text-xs font-medium text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>

                {/* Preview */}
                {previewId === r.id && preview && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1.5">
                        Ingredients
                      </p>
                      <ul className="space-y-0.5">
                        {preview.recipe_ingredients.map((ing) => (
                          <li
                            key={ing.id}
                            className="text-sm text-gray-600 flex items-start gap-1.5"
                          >
                            <span className="text-emerald-400 mt-0.5">•</span>
                            {ing.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1.5">
                        Steps
                      </p>
                      <ol className="space-y-1">
                        {preview.recipe_steps.map((s, i) => (
                          <li
                            key={s.id}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-xs text-gray-400 font-mono min-w-[18px] mt-0.5">
                              {i + 1}.
                            </span>
                            <span>
                              {s.instruction}
                              {s.timer_seconds && (
                                <span className="ml-1.5 text-xs text-emerald-500 font-medium">
                                  ⏱ {formatDuration(s.timer_seconds)}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== FORM COMPONENT =====

function RecipeForm({
  mode,
  recipeName,
  setRecipeName,
  ingredients,
  setIngredients,
  steps,
  setSteps,
  saving,
  onSave,
  onCancel,
}: {
  mode: "create" | "edit";
  recipeName: string;
  setRecipeName: (v: string) => void;
  ingredients: IngredientDraft[];
  setIngredients: React.Dispatch<React.SetStateAction<IngredientDraft[]>>;
  steps: StepDraft[];
  setSteps: React.Dispatch<React.SetStateAction<StepDraft[]>>;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const validIngs = ingredients.filter((i) => i.text.trim());
  const validSteps = steps.filter((s) => s.instruction.trim());
  const canSave =
    recipeName.trim() && validIngs.length > 0 && validSteps.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100">
      <h2 className="font-bold text-gray-800 text-lg mb-4">
        {mode === "create" ? "Add Recipe" : "Edit Recipe"}
      </h2>

      {/* Name */}
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        Recipe Name
      </label>
      <input
        type="text"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        placeholder="e.g. Chicken Rice Bowl"
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 mb-5"
      />

      {/* Ingredients */}
      <label className="block text-xs font-semibold text-gray-500 mb-2">
        Ingredients
      </label>
      <div className="space-y-2 mb-2">
        {ingredients.map((ing, idx) => (
          <div key={ing.id} className="flex gap-2">
            <input
              type="text"
              value={ing.text}
              onChange={(e) =>
                setIngredients((prev) =>
                  prev.map((i) =>
                    i.id === ing.id ? { ...i, text: e.target.value } : i
                  )
                )
              }
              placeholder={`Ingredient ${idx + 1}`}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            {ingredients.length > 1 && (
              <button
                onClick={() =>
                  setIngredients((prev) =>
                    prev.filter((i) => i.id !== ing.id)
                  )
                }
                className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => setIngredients((p) => [...p, newIngredient()])}
        className="text-sm font-semibold text-emerald-500 hover:text-emerald-700 mb-5 cursor-pointer"
      >
        + Add Ingredient
      </button>

      {/* Steps */}
      <label className="block text-xs font-semibold text-gray-500 mb-2">
        Steps
      </label>
      <div className="space-y-3 mb-2">
        {steps.map((st, idx) => (
          <div
            key={st.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xs text-gray-400 font-bold mt-2.5 min-w-[42px]">
                Step {idx + 1}
              </span>
              <input
                type="text"
                value={st.instruction}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((s) =>
                      s.id === st.id
                        ? { ...s, instruction: e.target.value }
                        : s
                    )
                  )
                }
                placeholder="Instruction"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              {steps.length > 1 && (
                <button
                  onClick={() =>
                    setSteps((prev) => prev.filter((s) => s.id !== st.id))
                  }
                  className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 ml-[50px]">
              <span className="text-xs text-gray-400">Timer:</span>
              <input
                type="number"
                min={0}
                value={st.timerMin}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((s) =>
                      s.id === st.id ? { ...s, timerMin: e.target.value } : s
                    )
                  )
                }
                placeholder="0"
                className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <span className="text-xs text-gray-400">min</span>
              <input
                type="number"
                min={0}
                max={59}
                value={st.timerSec}
                onChange={(e) =>
                  setSteps((prev) =>
                    prev.map((s) =>
                      s.id === st.id ? { ...s, timerSec: e.target.value } : s
                    )
                  )
                }
                placeholder="0"
                className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <span className="text-xs text-gray-400">sec</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setSteps((p) => [...p, newStep()])}
        className="text-sm font-semibold text-emerald-500 hover:text-emerald-700 mb-5 cursor-pointer"
      >
        + Add Step
      </button>

      {/* Save / Cancel */}
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving || !canSave}
          className="bg-emerald-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving
            ? "Saving..."
            : mode === "create"
            ? "Save Recipe"
            : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
