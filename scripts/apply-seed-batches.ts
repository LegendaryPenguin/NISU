/**
 * Apply all seed batch SQL files via Supabase MCP-style HTTP if token available,
 * otherwise prints instructions.
 *
 * Run: npx tsx scripts/apply-seed-batches.ts
 */
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

const PROJECT_ID = "gkvqhcpemiexfcfsqtaw";
const dir = resolve(process.cwd(), "scripts/seed-batches");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* ignore */
  }
}

async function runSql(sql: string, label: string) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("SUPABASE_ACCESS_TOKEN not set");
  }
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  if (!res.ok) {
    throw new Error(`${label}: ${res.status} ${await res.text()}`);
  }
  console.log(`OK ${label}`);
}

async function main() {
  loadEnv();
  const files = readdirSync(dir)
    .filter((f) => /^batch-\d+\.sql$/.test(f))
    .sort();

  if (!process.env.SUPABASE_ACCESS_TOKEN) {
    console.log(
      `Found ${files.length} batch files. Set SUPABASE_ACCESS_TOKEN or run via Supabase MCP execute_sql.`
    );
    files.forEach((f) => console.log(`  scripts/seed-batches/${f}`));
    process.exit(1);
  }

  for (const file of files) {
    const sql = readFileSync(resolve(dir, file), "utf8");
    await runSql(sql, file);
  }

  await runSql(
    "SELECT count(*)::int AS n FROM recipes WHERE is_builtin = true;",
    "count"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
