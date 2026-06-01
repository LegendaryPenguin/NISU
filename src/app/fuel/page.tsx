"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader, { PageActionRow } from "@/components/PageHeader";
import type { RecipeWithDetails } from "@/lib/types";
import RecipeBrowser from "@/components/fuel/RecipeBrowser";
import {
  fetchRecipes,
  saveFullRecipe,
  updateFullRecipe,
  deleteRecipe,
  forkRecipe,
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
    if (r.is_builtin) return;
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete recipe.");
    }
  };

  const handleFork = async (id: string) => {
    setError(null);
    try {
      await forkRecipe(id);
      await load();
    } catch {
      setError("Failed to save a copy.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PageHeader
          title="Fuel"
          section="fuel"
          subtitle="Recipes you can actually cook."
        >
          <p className="text-xs text-gray-400 mt-1">
            Pick a recipe, follow the steps, and make eating better easier.
          </p>
        </PageHeader>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {formMode === "idle" && (
          <PageActionRow
            cta={
              <button
                onClick={startCreate}
                className="nisu-cta-bold text-sm px-6 py-2.5 cursor-pointer"
              >
                + Add recipe
              </button>
            }
          />
        )}

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
            <div className="w-8 h-8 border-3 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
          </div>
        ) : (
          <RecipeBrowser
            recipes={recipes}
            onEdit={startEdit}
            onDelete={handleDelete}
            onFork={handleFork}
          />
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
    <div className="nisu-card p-5 mb-6">
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
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)] mb-5"
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
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
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
        className="text-sm font-semibold text-[var(--nisu-coral)] hover:opacity-80 mb-5 cursor-pointer"
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
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
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
                className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
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
                className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
              />
              <span className="text-xs text-gray-400">sec</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setSteps((p) => [...p, newStep()])}
        className="text-sm font-semibold text-[var(--nisu-coral)] hover:opacity-80 mb-5 cursor-pointer"
      >
        + Add Step
      </button>

      {/* Save / Cancel */}
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving || !canSave}
          className="nisu-cta-bold text-sm px-6 py-2.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
