import { createClient } from "@/utils/supabase/client";
import type {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeWithDetails,
} from "./types";

const supabase = () => createClient();

// ----- Recipes -----

export async function fetchRecipes(): Promise<RecipeWithDetails[]> {
  const { data, error } = await supabase()
    .from("recipes")
    .select("*, recipe_ingredients(*), recipe_steps(*)")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(normalize);
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

function normalize(r: Record<string, unknown>): RecipeWithDetails {
  return {
    ...(r as unknown as Recipe),
    recipe_ingredients: (
      (r.recipe_ingredients ?? []) as RecipeIngredient[]
    ).sort((a, b) => a.order_index - b.order_index),
    recipe_steps: ((r.recipe_steps ?? []) as RecipeStep[]).sort(
      (a, b) => a.order_index - b.order_index
    ),
  };
}

export async function createRecipe(name: string): Promise<Recipe> {
  const { data, error } = await supabase()
    .from("recipes")
    .insert({ name })
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
  const { error } = await supabase().from("recipes").delete().eq("id", id);
  if (error) throw error;
}

// ----- Ingredients -----

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

// ----- Steps -----

async function deleteStepsByRecipe(recipeId: string): Promise<void> {
  const { error } = await supabase()
    .from("recipe_steps")
    .delete()
    .eq("recipe_id", recipeId);
  if (error) throw error;
}

async function insertSteps(
  recipeId: string,
  items: { instruction: string; timer_seconds: number | null; order_index: number }[]
): Promise<void> {
  if (items.length === 0) return;
  const rows = items.map((s) => ({ ...s, recipe_id: recipeId }));
  const { error } = await supabase().from("recipe_steps").insert(rows);
  if (error) throw error;
}

export async function replaceRecipeSteps(
  recipeId: string,
  items: { instruction: string; timer_seconds: number | null; order_index: number }[]
): Promise<void> {
  await deleteStepsByRecipe(recipeId);
  await insertSteps(recipeId, items);
}

// ----- Full recipe helpers -----

export async function saveFullRecipe(input: {
  name: string;
  ingredients: string[];
  steps: { instruction: string; timer_seconds: number | null }[];
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
    steps: { instruction: string; timer_seconds: number | null }[];
  }
): Promise<void> {
  await updateRecipe(id, input.name);
  await replaceRecipeIngredients(
    id,
    input.ingredients.map((text, i) => ({ text, order_index: i }))
  );
  await replaceRecipeSteps(
    id,
    input.steps.map((s, i) => ({ ...s, order_index: i }))
  );
}
