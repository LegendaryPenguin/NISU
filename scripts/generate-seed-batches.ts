/**
 * Writes batched seed SQL files for MCP execute_sql (scripts/seed-batches/*.sql)
 */
import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { INDIAN_RECIPES } from "../src/data/indian-recipes/index";
import type { SeedRecipe } from "../src/lib/types";

const BATCH = 2;
const outDir = resolve(process.cwd(), "scripts/seed-batches");
mkdirSync(outDir, { recursive: true });

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

function arrLiteral(items: string[]): string {
  if (items.length === 0) return "ARRAY[]::text[]";
  return `ARRAY[${items.map((t) => `'${esc(t)}'`).join(", ")}]::text[]`;
}

function jsonArr(items: string[]): string {
  const inner = items
    .map((t) => `"${t.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)
    .join(",");
  return `'[${inner}]'::jsonb`;
}

function recipeBlock(recipe: SeedRecipe): string {
  const lines: string[] = [];
  lines.push(`  -- ${recipe.name}`);
  lines.push(`  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = '${esc(recipe.name)}') THEN`);
  lines.push(
    `  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)`
  );
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
  lines.push(`  END IF;`);
  return lines.join("\n");
}

for (let i = 0; i < INDIAN_RECIPES.length; i += BATCH) {
  const chunk = INDIAN_RECIPES.slice(i, i + BATCH);
  const idx = Math.floor(i / BATCH) + 1;
  const body = chunk.map(recipeBlock).join("\n\n");
  const sql = `DO $$
DECLARE
  rid uuid;
BEGIN
${body}
END $$;`;
  writeFileSync(resolve(outDir, `batch-${String(idx).padStart(2, "0")}.sql`), sql, "utf8");
  console.log(`Wrote batch-${String(idx).padStart(2, "0")}.sql (${chunk.length} recipes)`);
}
