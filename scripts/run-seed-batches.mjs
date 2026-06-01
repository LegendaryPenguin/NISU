/**
 * Reads seed batch SQL files and prints them for piping to Supabase SQL.
 * Usage: node scripts/run-seed-batches.mjs 1
 */
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = resolve(__dirname, "seed-batches");
const arg = process.argv[2];

if (arg === "list") {
  console.log(
    readdirSync(dir)
      .filter((f) => f.startsWith("batch-") && f.endsWith(".sql"))
      .sort()
      .join("\n")
  );
  process.exit(0);
}

const file = arg ? `batch-${arg}.sql` : null;
if (!file) {
  console.error("Usage: node scripts/run-seed-batches.mjs <1-7|list>");
  process.exit(1);
}

const path = resolve(dir, file);
console.log(readFileSync(path, "utf8"));
