/**
 * Seed NISU Kitchen built-in Indian recipes.
 * Run: npm run seed:recipes
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { INDIAN_RECIPES } from "../src/data/indian-recipes/index";
import type { SeedRecipe } from "../src/lib/types";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* env may already be set */
  }
}

async function seedRecipe(supabase: SupabaseClient, recipe: SeedRecipe) {
  const { data: row, error: rErr } = await supabase
    .from("recipes")
    .insert({
      name: recipe.name,
      user_id: null,
      is_builtin: true,
      category: recipe.category,
      region: recipe.region,
      description: recipe.description,
      image_url: recipe.image_url,
      prep_minutes: recipe.prep_minutes,
      cook_minutes: recipe.cook_minutes,
      difficulty: recipe.difficulty,
      tags: recipe.tags,
      servings: recipe.servings,
    })
    .select("id")
    .single();
  if (rErr) throw rErr;

  const recipeId = row.id as string;

  const { error: iErr } = await supabase.from("recipe_ingredients").insert(
    recipe.ingredients.map((text, order_index) => ({
      recipe_id: recipeId,
      text,
      order_index,
    }))
  );
  if (iErr) throw iErr;

  const { error: sErr } = await supabase.from("recipe_steps").insert(
    recipe.steps.map((step, order_index) => ({
      recipe_id: recipeId,
      instruction: step.instruction,
      timer_seconds: step.timer_seconds ?? null,
      order_index,
      step_ingredients: step.step_ingredients ?? [],
      image_url: step.image_url ?? null,
      youtube_url: step.youtube_url ?? null,
      tip: step.tip ?? null,
    }))
  );
  if (sErr) throw sErr;
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a Supabase key in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count, error: countErr } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true })
    .eq("is_builtin", true);
  if (countErr) {
    console.error("Count failed:", countErr.message);
    console.error(
      "Run the recipe_kitchen migration first (supabase/migrations/20260531120000_recipe_kitchen.sql)"
    );
    process.exit(1);
  }

  if ((count ?? 0) >= 50) {
    console.log(`Already seeded (${count} built-in recipes). Skipping.`);
    return;
  }

  console.log(`Seeding ${INDIAN_RECIPES.length} NISU Kitchen recipes...`);
  let ok = 0;
  for (const recipe of INDIAN_RECIPES) {
    try {
      await seedRecipe(supabase, recipe);
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${INDIAN_RECIPES.length}...`);
    } catch (e) {
      console.error(`Failed: ${recipe.name}`, e);
    }
  }
  console.log(`Done. Seeded ${ok} recipes.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
