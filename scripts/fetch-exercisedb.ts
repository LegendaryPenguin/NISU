/**
 * Fetch exercise GIFs from ExerciseDB (RapidAPI) and mirror to Supabase Storage.
 * Run: npm run seed:exercises
 * Requires: EXERCISEDB_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { EXERCISE_CATALOG } from "../src/data/workout-library/exercise-catalog";
import { exercisedbGifUrl } from "../src/lib/exercise-media";

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

const API_HOST =
  process.env.EXERCISEDB_API_HOST ?? "exercisedb.p.rapidapi.com";

async function searchExercise(
  name: string,
  apiKey: string
): Promise<{ id: string; gifUrl?: string; imageUrl?: string } | null> {
  const url = `https://${API_HOST}/exercises/name/${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": API_HOST,
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{
    id: string;
    gifUrl?: string;
    imageUrl?: string;
  }>;
  return data[0] ?? null;
}

async function downloadBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function main() {
  loadEnv();
  const apiKey = process.env.EXERCISEDB_API_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("Missing Supabase URL/key in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  let ok = 0;
  let fail = 0;

  for (const ex of EXERCISE_CATALOG) {
    const searchName = ex.exercisedb_name ?? ex.slug;
    let gifUrl = ex.gif_url;
    let imageUrl = ex.image_url;
    let sourceId = ex.source_id;

    if (apiKey) {
      const hit = await searchExercise(searchName, apiKey);
      if (hit) {
        sourceId = hit.id;
        gifUrl = hit.gifUrl ?? gifUrl;
        imageUrl = hit.imageUrl ?? imageUrl;
      }
      await new Promise((r) => setTimeout(r, 350));
    }

    if (!gifUrl) gifUrl = exercisedbGifUrl(searchName);

    let storedGif = gifUrl;
    const buf = await downloadBuffer(gifUrl);
    if (buf) {
      const path = `${ex.slug}.gif`;
      const { error } = await supabase.storage
        .from("exercise-media")
        .upload(path, buf, { contentType: "image/gif", upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("exercise-media").getPublicUrl(path);
        storedGif = data.publicUrl;
      }
    }

    const { error: dbErr } = await supabase.from("exercises").upsert(
      {
        slug: ex.slug,
        name: ex.name,
        description: ex.description ?? null,
        instructions: ex.instructions ?? [],
        muscle_group: ex.muscle_group ?? null,
        equipment: ex.equipment ?? null,
        difficulty: ex.difficulty ?? "easy",
        mechanic: ex.mechanic ?? null,
        source: "exercisedb",
        source_id: sourceId ?? searchName,
        gif_url: storedGif,
        image_url: imageUrl ?? storedGif,
        is_builtin: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (dbErr) {
      console.warn(`✗ ${ex.slug}:`, dbErr.message);
      fail++;
    } else {
      console.log(`✓ ${ex.name}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (!apiKey) {
    console.log("Tip: set EXERCISEDB_API_KEY for richer GIF matching via RapidAPI.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
