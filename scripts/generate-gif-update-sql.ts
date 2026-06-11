import { writeFileSync } from "fs";
import { resolve } from "path";
import map from "../src/data/exercises/gif-url-map.json";
import { EXERCISE_CATALOG } from "../src/data/workout-library/exercise-catalog";

const lines: string[] = [];
for (const ex of EXERCISE_CATALOG) {
  const url = (map as Record<string, string>)[ex.slug];
  if (!url) continue;
  lines.push(
    `UPDATE exercises SET gif_url = '${url}', image_url = '${url}', updated_at = now() WHERE slug = '${ex.slug}';`
  );
}
lines.push(`
UPDATE workouts w SET cover_image_url = sub.gif
FROM (
  SELECT we.workout_id, e.gif_url AS gif
  FROM workout_exercises we
  JOIN exercises e ON e.id = we.exercise_id
  WHERE we.order_index = 0
) sub
WHERE w.id = sub.workout_id AND w.is_builtin = true;
`);

writeFileSync(resolve(process.cwd(), "scripts/update-exercise-gifs.sql"), lines.join("\n") + "\n");

const values = EXERCISE_CATALOG.filter((ex) => (map as Record<string, string>)[ex.slug])
  .map((ex) => {
    const url = (map as Record<string, string>)[ex.slug];
    return `('${ex.slug}','${url}')`;
  })
  .join(",\n");

const compact = `UPDATE exercises e SET gif_url = v.url, image_url = v.url, updated_at = now()
FROM (VALUES
${values}
) AS v(slug, url)
WHERE e.slug = v.slug;

UPDATE workouts w SET cover_image_url = sub.gif
FROM (
  SELECT we.workout_id, e.gif_url AS gif
  FROM workout_exercises we
  JOIN exercises e ON e.id = we.exercise_id
  WHERE we.order_index = 0
) sub
WHERE w.id = sub.workout_id AND w.is_builtin = true;
`;

writeFileSync(resolve(process.cwd(), "scripts/update-gifs-compact.sql"), compact);
console.log(`Wrote ${EXERCISE_CATALOG.length} exercise updates`);
