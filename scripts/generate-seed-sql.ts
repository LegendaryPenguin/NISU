/**
 * Generates SQL to seed NISU Kitchen recipes (for Supabase SQL editor / MCP).
 * Run: npx tsx scripts/generate-seed-sql.ts > scripts/seed-indian-recipes.sql
 */
import { INDIAN_RECIPES } from "../src/data/indian-recipes/index";
import type { SeedRecipe } from "../src/lib/types";

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

function arrLiteral(items: string[]): string {
  if (items.length === 0) return "ARRAY[]::text[]";
  return `ARRAY[${items.map((t) => `'${esc(t)}'`).join(", ")}]::text[]`;
}

function jsonArr(items: string[]): string {
  const inner = items.map((t) => `"${t.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",");
  return `'[${inner}]'::jsonb`;
}

function recipeBlock(recipe: SeedRecipe): string {
  const lines: string[] = [];
  lines.push(`  -- ${recipe.name}`);
  lines.push(`  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)`);
  lines.push(
    `  VALUES ('${esc(recipe.name)}', NULL, true, '${recipe.category}', '${recipe.region}', '${esc(recipe.description)}', '${esc(recipe.image_url)}', ${recipe.prep_minutes}, ${recipe.cook_minutes}, '${recipe.difficulty}', ${arrLiteral(recipe.tags)}, ${recipe.servings})`
  );
  lines.push(`  RETURNING id INTO rid;`);

  recipe.ingredients.forEach((text, order_index) => {
    lines.push(
      `  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '${esc(text)}', ${order_index});`
    );
  });

  recipe.steps.forEach((step, order_index) => {
    const timer = step.timer_seconds ?? null;
    const stepIng = jsonArr(step.step_ingredients ?? []);
    const img = step.image_url ? `'${esc(step.image_url)}'` : "NULL";
    const yt = step.youtube_url ? `'${esc(step.youtube_url)}'` : "NULL";
    const tip = step.tip ? `'${esc(step.tip)}'` : "NULL";
    lines.push(
      `  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, '${esc(step.instruction)}', ${timer}, ${order_index}, ${stepIng}, ${img}, ${yt}, ${tip});`
    );
  });

  return lines.join("\n");
}

console.log(`-- NISU Kitchen seed (${INDIAN_RECIPES.length} recipes)`);
console.log(`DO $$`);
console.log(`DECLARE`);
console.log(`  rid uuid;`);
console.log(`  n int;`);
console.log(`BEGIN`);
console.log(`  SELECT count(*) INTO n FROM recipes WHERE is_builtin = true;`);
console.log(`  IF n >= 50 THEN`);
console.log(`    RAISE NOTICE 'Already seeded (% built-in recipes)', n;`);
console.log(`    RETURN;`);
console.log(`  END IF;`);
console.log("");

for (const recipe of INDIAN_RECIPES) {
  console.log(recipeBlock(recipe));
  console.log("");
}

console.log(`END $$;`);
