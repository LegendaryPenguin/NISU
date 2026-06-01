/**
 * Execute seed batch SQL files via Supabase Management API.
 * Requires SUPABASE_ACCESS_TOKEN (from `supabase login` or Cursor MCP auth).
 *
 * Alternative: run batches manually via Supabase SQL editor or MCP execute_sql.
 */
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = "gkvqhcpemiexfcfsqtaw";
const dir = resolve(__dirname, "seed-batches");

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

async function runBatch(file: string) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Set SUPABASE_ACCESS_TOKEN (run: supabase login)");
  }
  const sql = readFileSync(resolve(dir, file), "utf8");
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
    const text = await res.text();
    throw new Error(`${file}: ${res.status} ${text}`);
  }
  console.log(`OK ${file}`);
}

async function main() {
  loadEnv();
  const files = readdirSync(dir)
    .filter((f) => /^batch-\d+\.sql$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)![0]) - parseInt(b.match(/\d+/)![0]));

  for (const file of files) {
    await runBatch(file);
  }

  const countRes = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "SELECT count(*)::int AS n FROM recipes WHERE is_builtin = true;",
      }),
    }
  );
  const data = await countRes.json();
  console.log("Built-in recipe count:", data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
