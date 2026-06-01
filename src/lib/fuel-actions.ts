import { createClient } from "@/utils/supabase/client";
import { getAuthUserId } from "./auth-helpers";
import type {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeWithDetails,
} from "./types";

const supabase = () => createClient();

type StepInput = {
  instruction: string;
  timer_seconds: number | null;
  step_ingredients?: string[];
  image_url?: string | null;
  youtube_url?: string | null;
  tip?: string | null;
};

function normalizeStep(raw: Record<string, unknown>): RecipeStep {
  const step = raw as unknown as RecipeStep;
  let stepIngredients = step.step_ingredients;
  if (typeof stepIngredients === "string") {
    try {
      stepIngredients = JSON.parse(stepIngredients);
    } catch {
      stepIngredients = [];
    }
  }
  if (!Array.isArray(stepIngredients)) stepIngredients = [];
  return { ...step, step_ingredients: stepIngredients };
}

function normalize(r: Record<string, unknown>): RecipeWithDetails {
  return {
    ...(r as unknown as Recipe),
    tags: (r.tags as string[] | null) ?? [],
    is_builtin: Boolean(r.is_builtin),
    recipe_ingredients: (
      (r.recipe_ingredients ?? []) as RecipeIngredient[]
    ).sort((a, b) => a.order_index - b.order_index),
    recipe_steps: ((r.recipe_steps ?? []) as Record<string, unknown>[])
      .map(normalizeStep)
      .sort((a, b) => a.order_index - b.order_index),
  };
}

export async function fetchRecipes(): Promise<RecipeWithDetails[]> {
  const { data, error } = await supabase()
    .from("recipes")
    .select("*, recipe_ingredients(*), recipe_steps(*)");
  if (error) throw error;
  const recipes = (data ?? []).map(normalize);
  return recipes.sort((a, b) => {
    if (a.is_builtin && !b.is_builtin) return -1;
    if (!a.is_builtin && b.is_builtin) return 1;
    return a.name.localeCompare(b.name);
  });
}

export async function fetchRecipeById(
  id: string
): Promise<RecipeWithDetails | null> {
  const { data, error } = await supabase()
    .from("recipes")
    .select("*, recipe_ingredients(*), recipe_steps(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return normalize(data);
}

export async function createRecipe(name: string): Promise<Recipe> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("recipes")
    .insert({ name, user_id: userId, is_builtin: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRecipe(
  id: string,
  name: string
): Promise<Recipe> {
  const { data, error } = await supabase()
    .from("recipes")
    .update({ name })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRecipe(id: string): Promise<void> {
  const { data: existing } = await supabase()
    .from("recipes")
    .select("is_builtin")
    .eq("id", id)
    .maybeSingle();
  if (existing?.is_builtin) {
    throw new Error("Built-in recipes cannot be deleted.");
  }
  const { error } = await supabase().from("recipes").delete().eq("id", id);
  if (error) throw error;
}

async function deleteIngredientsByRecipe(recipeId: string): Promise<void> {
  const { error } = await supabase()
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", recipeId);
  if (error) throw error;
}

async function insertIngredients(
  recipeId: string,
  items: { text: string; order_index: number }[]
): Promise<void> {
  if (items.length === 0) return;
  const rows = items.map((i) => ({ ...i, recipe_id: recipeId }));
  const { error } = await supabase()
    .from("recipe_ingredients")
    .insert(rows);
  if (error) throw error;
}

export async function replaceRecipeIngredients(
  recipeId: string,
  items: { text: string; order_index: number }[]
): Promise<void> {
  await deleteIngredientsByRecipe(recipeId);
  await insertIngredients(recipeId, items);
}

async function deleteStepsByRecipe(recipeId: string): Promise<void> {
  const { error } = await supabase()
    .from("recipe_steps")
    .delete()
    .eq("recipe_id", recipeId);
  if (error) throw error;
}

async function insertSteps(
  recipeId: string,
  items: (StepInput & { order_index: number })[]
): Promise<void> {
  if (items.length === 0) return;
  const rows = items.map((s) => ({
    recipe_id: recipeId,
    instruction: s.instruction,
    timer_seconds: s.timer_seconds,
    order_index: s.order_index,
    step_ingredients: s.step_ingredients ?? [],
    image_url: s.image_url ?? null,
    youtube_url: s.youtube_url ?? null,
    tip: s.tip ?? null,
  }));
  const { error } = await supabase().from("recipe_steps").insert(rows);
  if (error) throw error;
}

export async function replaceRecipeSteps(
  recipeId: string,
  items: StepInput[]
): Promise<void> {
  await deleteStepsByRecipe(recipeId);
  await insertSteps(
    recipeId,
    items.map((s, i) => ({ ...s, order_index: i }))
  );
}

export async function saveFullRecipe(input: {
  name: string;
  ingredients: string[];
  steps: StepInput[];
}): Promise<Recipe> {
  const recipe = await createRecipe(input.name);
  await insertIngredients(
    recipe.id,
    input.ingredients.map((text, i) => ({ text, order_index: i }))
  );
  await insertSteps(
    recipe.id,
    input.steps.map((s, i) => ({ ...s, order_index: i }))
  );
  return recipe;
}

export async function updateFullRecipe(
  id: string,
  input: {
    name: string;
    ingredients: string[];
    steps: StepInput[];
  }
): Promise<void> {
  const { data: existing } = await supabase()
    .from("recipes")
    .select("is_builtin")
    .eq("id", id)
    .maybeSingle();
  if (existing?.is_builtin) {
    throw new Error("Built-in recipes cannot be edited. Save to My Recipes first.");
  }
  await updateRecipe(id, input.name);
  await replaceRecipeIngredients(
    id,
    input.ingredients.map((text, i) => ({ text, order_index: i }))
  );
  await replaceRecipeSteps(id, input.steps);
}

/** Copy a built-in (or any) recipe into the current user's library */
export async function forkRecipe(sourceId: string): Promise<Recipe> {
  const source = await fetchRecipeById(sourceId);
  if (!source) throw new Error("Recipe not found.");
  return saveFullRecipe({
    name: source.name,
    ingredients: source.recipe_ingredients.map((i) => i.text),
    steps: source.recipe_steps.map((s) => ({
      instruction: s.instruction,
      timer_seconds: s.timer_seconds,
      step_ingredients: s.step_ingredients ?? [],
      image_url: s.image_url,
      youtube_url: s.youtube_url,
      tip: s.tip,
    })),
  });
}

export function getYoutubeEmbedId(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export function recipeTotalMinutes(r: RecipeWithDetails): number {
  return (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);
}

export function recipeMatchesSearch(
  r: RecipeWithDetails,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    r.name,
    r.description ?? "",
    ...(r.tags ?? []),
    ...r.recipe_ingredients.map((i) => i.text),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
