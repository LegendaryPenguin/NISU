/**
 * Run seed batches via direct Postgres (requires DATABASE_URL in .env.local).
 * Get connection string from Supabase Dashboard → Project Settings → Database.
 */
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import pg from "pg";

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

async function main() {
  loadEnv();
  const url = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error("Set DATABASE_URL in .env.local (Supabase → Database → Connection string)");
    process.exit(1);
  }

  const dir = resolve(process.cwd(), "scripts/seed-batches");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const { rows } = await client.query(
    "SELECT count(*)::int AS n FROM recipes WHERE is_builtin = true"
  );
  if (rows[0].n >= 50) {
    console.log(`Already seeded (${rows[0].n} built-in recipes).`);
    await client.end();
    return;
  }

  for (const file of files) {
    const sql = readFileSync(resolve(dir, file), "utf8");
    console.log(`Running ${file}...`);
    await client.query(sql);
    const { rows: c } = await client.query(
      "SELECT count(*)::int AS n FROM recipes WHERE is_builtin = true"
    );
    console.log(`  → ${c[0].n} built-in recipes so far`);
  }

  await client.end();
  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
