/**
 * Build slug → jsDelivr GIF URL map from omercotkd/exercises-gifs CSV.
 * Run: npx tsx scripts/build-exercise-gif-map.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { EXERCISE_CATALOG } from "../src/data/workout-library/exercise-catalog";

const CSV_URL =
  "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/exercises.csv";
const GIF_BASE =
  "https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@main/assets";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseCsvRows(raw: string): Array<{ id: string; name: string }> {
  const lines = raw.split(/\r?\n/).slice(1);
  const rows: Array<{ id: string; name: string }> = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const m = line.match(/^([^,]*),([^,]*),(\d+),([^,]+),/);
    if (!m) continue;
    rows.push({ id: m[3], name: m[4].trim() });
  }
  return rows;
}

/** Manual aliases when ExerciseDB slug ≠ Kaggle dataset name */
const SEARCH_ALIASES: Record<string, string[]> = {
  "bodyweight-squat": ["potty squat", "bodyweight drop jump squat"],
  "forward-lunge": ["forward lunge (male)", "forward lunge"],
  "reverse-lunge": ["reverse lunge", "rear lunge"],
  "glute-bridge": ["glute bridge march", "glute bridge two legs on bench"],
  "single-leg-glute-bridge": ["single leg glute bridge"],
  plank: ["front plank with twist", "forearm plank", "plank"],
  "side-plank": ["side plank hip adduction", "side plank"],
  "jumping-jack": ["jumping jack", "star jump"],
  "high-knees": ["high knee against wall", "high knees"],
  superman: ["superman", "superman hold"],
  "bird-dog": ["bird dog"],
  crunch: ["crunch floor", "crunch (hands overhead)"],
  "bicycle-crunch": ["bicycle crunch", "band bicycle crunch"],
  "lying-leg-raise": ["lying leg raise flat bench", "lying leg raise"],
  "v-up": ["v-up", "band v-up"],
  "wall-sit": ["wall sit", "wall squat"],
  "standing-calf-raise": ["standing calf raise", "calf raise"],
  "pike-push-up": ["pike push-up", "pike push up"],
  "goblet-squat": ["goblet squat", "kettlebell goblet squat"],
  "dumbbell-row": ["dumbbell row", "dumbbell bent over row"],
  "dumbbell-shoulder-press": ["dumbbell shoulder press", "dumbbell seated shoulder press"],
  "dumbbell-bicep-curl": ["dumbbell bicep curl", "dumbbell curl"],
  "dumbbell-overhead-tricep-extension": [
    "dumbbell overhead triceps extension",
    "dumbbell standing triceps extension",
  ],
  "barbell-squat": ["barbell full squat", "barbell squat"],
  "barbell-shoulder-press": ["barbell seated overhead press", "barbell shoulder press"],
  "barbell-hip-thrust": ["barbell glute bridge", "barbell hip thrust"],
  "scissor-kicks": ["scissor kicks", "flutter kicks"],
  "cobra-push-up": ["cobra push-up", "upward facing dog"],
  "seated-side-bend": ["seated side bend"],
  "cat-cow": ["cat cow", "cat stretch"],
  "child-pose": ["child pose", "child's pose"],
  "downward-dog": ["downward dog", "downward facing dog"],
  "worlds-greatest-stretch": ["world greatest stretch", "world's greatest stretch"],
  "kneeling-hip-flexor-stretch": ["kneeling hip flexor stretch"],
  "standing-hamstring-stretch": ["standing hamstring stretch"],
  "shoulder-stretch": ["shoulder stretch"],
  "spine-rotation": ["spine rotation", "thoracic rotation"],
  "figure-four-stretch": ["figure four stretch"],
  "neck-stretch": ["neck stretch"],
};

/** Closest visual fallback when no dataset match exists */
const MANUAL_SLUG_FALLBACK: Record<string, string> = {
  "single-leg-glute-bridge": "glute-bridge",
  "bird-dog": "dead-bug",
  "wall-sit": "bodyweight-squat",
  "cat-cow": "superman",
  "child-pose": "hamstring-stretch",
  "downward-dog": "inchworm",
  "thoracic-rotation": "russian-twist",
  "figure-four-stretch": "hip-flexor-stretch",
};

function findId(
  rows: Array<{ id: string; name: string }>,
  keys: string[]
): string | null {
  const byNorm = new Map(rows.map((r) => [normalize(r.name), r.id]));
  for (const key of keys) {
    const hit = byNorm.get(normalize(key));
    if (hit) return hit;
  }
  for (const key of keys) {
    const kn = normalize(key).replace(/\s/g, "");
    for (const r of rows) {
      if (normalize(r.name).replace(/\s/g, "") === kn) return r.id;
    }
  }
  for (const key of keys) {
    const kn = normalize(key);
    for (const r of rows) {
      const rn = normalize(r.name);
      if (rn === kn || rn.startsWith(kn) || rn.includes(kn)) return r.id;
    }
  }
  return null;
}

async function main() {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const rows = parseCsvRows(await res.text());

  const map: Record<string, string> = {};
  const missing: string[] = [];

  for (const ex of EXERCISE_CATALOG) {
    const keys = [
      ...(SEARCH_ALIASES[ex.slug] ?? []),
      ...(ex.exercisedb_name ? SEARCH_ALIASES[ex.exercisedb_name] ?? [] : []),
      ex.exercisedb_name ?? ex.slug,
      ex.slug,
      ex.name,
    ].filter(Boolean) as string[];
    const id = findId(rows, keys);
    if (id) {
      map[ex.slug] = `${GIF_BASE}/${id}.gif`;
      if (ex.exercisedb_name && ex.exercisedb_name !== ex.slug) {
        map[ex.exercisedb_name] = `${GIF_BASE}/${id}.gif`;
      }
    } else {
      missing.push(ex.slug);
    }
  }

  for (const [slug, fallbackSlug] of Object.entries(MANUAL_SLUG_FALLBACK)) {
    if (!map[slug] && map[fallbackSlug]) {
      map[slug] = map[fallbackSlug];
    }
  }

  for (const ex of EXERCISE_CATALOG) {
    if (ex.exercisedb_name && map[ex.exercisedb_name] && !map[ex.slug]) {
      map[ex.slug] = map[ex.exercisedb_name];
    }
  }

  const outPath = resolve(
    process.cwd(),
    "src/data/exercises/gif-url-map.json"
  );
  writeFileSync(outPath, JSON.stringify(map, null, 2) + "\n");

  const stillMissing = EXERCISE_CATALOG.filter((ex) => !map[ex.slug]).map(
    (ex) => ex.slug
  );

  console.log(`Wrote ${Object.keys(map).length} URLs to ${outPath}`);
  if (stillMissing.length) {
    console.log("Missing:", stillMissing.join(", "));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
