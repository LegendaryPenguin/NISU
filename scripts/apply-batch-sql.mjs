/**
 * Print one seed batch SQL file to stdout for MCP execute_sql.
 * Usage: node scripts/apply-batch-sql.mjs 08
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const n = process.argv[2];
if (!n || !/^\d{1,2}$/.test(n)) {
  console.error("Usage: node scripts/apply-batch-sql.mjs <01-26>");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = resolve(__dirname, "seed-batches", `batch-${n.padStart(2, "0")}.sql`);
process.stdout.write(readFileSync(file, "utf8"));
