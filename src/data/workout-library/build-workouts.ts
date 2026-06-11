import type { SeedWorkout, SeedWorkoutExercise, WorkoutCategory, WorkoutDifficulty } from "@/lib/types";

type Block = SeedWorkoutExercise[];

function sr(
  slug: string,
  sets = 3,
  reps = 12,
  rest = 45
): SeedWorkoutExercise {
  return { exerciseSlug: slug, type: "sets_reps", sets, reps, rest_seconds: rest };
}

function timed(
  slug: string,
  seconds: number,
  rest = 30
): SeedWorkoutExercise {
  return {
    exerciseSlug: slug,
    type: "timed",
    duration_seconds: seconds,
    sets: 1,
    rest_seconds: rest,
  };
}

function w(
  name: string,
  category: WorkoutCategory,
  difficulty: WorkoutDifficulty,
  description: string,
  tags: string[],
  equipment_tags: string[],
  exercises: Block
): SeedWorkout {
  return { name, category, difficulty, description, tags, equipment_tags, exercises };
}

const PILATES_FLOWS: Block[] = [
  [timed("hundred", 60), timed("roll-up", 45), timed("single-leg-stretch", 45), timed("double-leg-stretch", 45), timed("scissors", 45), timed("pilates-bridge", 45)],
  [timed("pilates-bridge", 60), timed("clam", 45), timed("leg-circle", 45), timed("spine-twist", 45), timed("saw", 45), timed("mermaid", 45)],
  [timed("hundred", 45), timed("swan", 45), timed("swimming", 60), timed("teaser", 30), timed("pilates-bridge", 45), timed("spine-twist", 45)],
  [timed("roll-up", 45), timed("single-leg-stretch", 45), timed("scissors", 45), timed("plank-leg-lift", 45), timed("mermaid", 45), timed("child-pose", 60)],
  [timed("hundred", 60), timed("dead-bug", 45), timed("bird-dog", 45), timed("clam", 45), timed("pilates-bridge", 60), timed("saw", 45)],
];

const HOME_BLOCKS: Block[] = [
  [sr("jumping-jack", 3, 20), sr("bodyweight-squat", 3, 15), sr("push-up", 3, 12), sr("lunge", 3, 10), sr("plank", 3, 1, 30), timed("mountain-climber", 45)],
  [sr("high-knees", 3, 30), sr("glute-bridge", 3, 15), sr("tricep-dip", 3, 12), sr("reverse-lunge", 3, 10), sr("crunch", 3, 20), timed("wall-sit", 45)],
  [sr("bear-crawl", 3, 12), sr("inchworm", 3, 8), sr("pike-push-up", 3, 10), sr("bodyweight-squat", 4, 15), sr("side-plank", 2, 1, 30), sr("superman", 3, 12)],
  [sr("jump-squat", 3, 12), sr("wide-push-up", 3, 12), sr("walking-lunge", 3, 10), sr("bicycle-crunch", 3, 20), timed("plank", 60), sr("calf-raise", 3, 20)],
  [sr("burpee", 3, 8), sr("bodyweight-squat", 3, 15), sr("push-up", 3, 10), sr("glute-bridge", 3, 15), timed("mountain-climber", 60), sr("leg-raise", 3, 12)],
];

const WEIGHT_BLOCKS: Block[] = [
  [sr("goblet-squat", 4, 12), sr("dumbbell-row", 3, 12), sr("dumbbell-press", 3, 10), sr("romanian-deadlift", 3, 12), sr("lateral-raise", 3, 15), sr("bicep-curl", 3, 12)],
  [sr("barbell-squat", 4, 8), sr("bent-over-row", 3, 10), sr("barbell-bench-press", 3, 8), sr("barbell-shoulder-press", 3, 8), sr("hammer-curl", 3, 12), sr("overhead-tricep-extension", 3, 12)],
  [sr("dumbbell-lunge", 3, 10), sr("dumbbell-deadlift", 3, 12), sr("dumbbell-shoulder-press", 3, 10), sr("dumbbell-row", 3, 12), sr("front-raise", 3, 12), sr("tricep-kickback", 3, 12)],
  [sr("kettlebell-swing", 4, 15), sr("kettlebell-goblet-squat", 3, 12), sr("dumbbell-row", 3, 12), sr("dumbbell-press", 3, 10), sr("romanian-deadlift", 3, 12)],
  [sr("hip-thrust", 4, 12), sr("lat-pulldown", 3, 12), sr("leg-press", 3, 15), sr("leg-curl", 3, 12), sr("cable-row", 3, 12), sr("lateral-raise", 3, 15)],
];

const FULL_BODY_BLOCKS: Block[] = [
  [sr("burpee", 3, 10), sr("goblet-squat", 3, 12), sr("push-up", 3, 12), sr("dumbbell-row", 3, 12), timed("plank", 60), sr("jumping-jack", 3, 25)],
  [sr("kettlebell-swing", 4, 15), sr("dumbbell-lunge", 3, 10), sr("dumbbell-press", 3, 10), sr("romanian-deadlift", 3, 12), sr("mountain-climber", 3, 20)],
  [sr("barbell-deadlift", 3, 8), sr("barbell-bench-press", 3, 8), sr("barbell-squat", 3, 8), sr("pull-up", 3, 6), sr("plank", 3, 1, 30)],
  [sr("jump-squat", 3, 12), sr("dumbbell-shoulder-press", 3, 10), sr("walking-lunge", 3, 10), sr("bicycle-crunch", 3, 20), timed("bear-crawl", 45)],
  [sr("bodyweight-squat", 4, 15), sr("dumbbell-row", 3, 12), sr("push-up", 3, 12), sr("glute-bridge", 3, 15), sr("russian-twist", 3, 20)],
];

const HIIT_BLOCKS: Block[] = [
  [timed("burpee", 40), timed("high-knees", 40), timed("jump-squat", 40), timed("mountain-climber", 40), timed("jumping-jack", 40), timed("plank", 40)],
  [timed("bear-crawl", 45), timed("jump-squat", 30), timed("push-up", 40), timed("high-knees", 45), timed("bodyweight-squat", 40)],
  [timed("burpee", 30), timed("mountain-climber", 45), timed("jumping-jack", 45), timed("wall-sit", 40), timed("bicycle-crunch", 40)],
];

const UPPER_BLOCKS: Block[] = [
  [sr("dumbbell-press", 4, 10), sr("dumbbell-row", 3, 12), sr("dumbbell-shoulder-press", 3, 10), sr("lateral-raise", 3, 15), sr("bicep-curl", 3, 12), sr("overhead-tricep-extension", 3, 12)],
  [sr("barbell-bench-press", 4, 8), sr("bent-over-row", 3, 10), sr("barbell-shoulder-press", 3, 8), sr("pull-up", 3, 6), sr("hammer-curl", 3, 12), sr("tricep-dip", 3, 12)],
  [sr("dumbbell-press", 3, 12), sr("cable-row", 3, 12), sr("pike-push-up", 3, 10), sr("front-raise", 3, 12), sr("tricep-kickback", 3, 12)],
];

const LOWER_BLOCKS: Block[] = [
  [sr("goblet-squat", 4, 12), sr("romanian-deadlift", 3, 12), sr("walking-lunge", 3, 10), sr("hip-thrust", 3, 12), sr("calf-raise", 4, 15), sr("leg-curl", 3, 12)],
  [sr("barbell-squat", 4, 8), sr("barbell-deadlift", 3, 8), sr("leg-press", 3, 15), sr("leg-extension", 3, 12), sr("glute-bridge", 3, 15)],
  [sr("dumbbell-lunge", 3, 12), sr("dumbbell-squat", 4, 12), sr("single-leg-glute-bridge", 3, 10), sr("calf-raise", 4, 20), timed("wall-sit", 60)],
];

const MOBILITY_BLOCKS: Block[] = [
  [timed("cat-cow", 60), timed("child-pose", 60), timed("downward-dog", 45), timed("worlds-greatest-stretch", 45), timed("hip-flexor-stretch", 45), timed("hamstring-stretch", 45)],
  [timed("shoulder-stretch", 45), timed("thoracic-rotation", 45), timed("figure-four-stretch", 45), timed("neck-stretch", 30), timed("child-pose", 60)],
];

function expandSeries(
  prefix: string,
  category: WorkoutCategory,
  difficulty: WorkoutDifficulty,
  desc: string,
  tags: string[],
  equipment: string[],
  blocks: Block[],
  count: number,
  start = 1
): SeedWorkout[] {
  const out: SeedWorkout[] = [];
  for (let i = 0; i < count; i++) {
    const block = blocks[i % blocks.length];
    const n = start + i;
    out.push(
      w(
        `${prefix} ${n}`,
        category,
        difficulty,
        `${desc} Session ${n} — ${block.length} movements.`,
        [...tags, n <= 5 ? "beginner" : n <= 10 ? "intermediate" : "advanced"],
        equipment,
        block.map((e) => ({ ...e }))
      )
    );
  }
  return out;
}

/** 160+ distinct builtin workouts */
export function buildWorkoutLibrary(): SeedWorkout[] {
  const workouts: SeedWorkout[] = [];

  workouts.push(
    w("Morning Mat Pilates", "pilates", "easy", "Gentle core activation to start your day.", ["beginner", "morning", "core"], ["mat"], PILATES_FLOWS[0]),
    w("Pilates Core Burn", "pilates", "medium", "Classic Pilates series for deep core strength.", ["core", "intermediate"], ["mat"], PILATES_FLOWS[1]),
    w("Pilates Power Flow", "pilates", "hard", "Advanced flow with teaser and extension work.", ["advanced", "core"], ["mat"], PILATES_FLOWS[2]),
    w("Pilates Recovery Flow", "pilates", "easy", "Slow controlled movements and stretching.", ["recovery", "beginner"], ["mat"], PILATES_FLOWS[3]),
    w("Pilates Stability Series", "pilates", "medium", "Balance and anti-rotation focus.", ["stability", "core"], ["mat"], PILATES_FLOWS[4])
  );

  workouts.push(...expandSeries("Pilates Flow", "pilates", "easy", "Mat Pilates", ["pilates", "core"], ["mat"], PILATES_FLOWS, 30, 1));
  workouts.push(...expandSeries("Living Room Burn", "home", "easy", "No equipment home workout", ["home", "no-equipment"], ["body weight"], HOME_BLOCKS, 25, 1));
  workouts.push(...expandSeries("Dumbbell Strength", "weights", "medium", "Weight training session", ["weights", "strength"], ["dumbbell"], WEIGHT_BLOCKS, 30, 1));
  workouts.push(...expandSeries("Total Body Circuit", "full_body", "medium", "Full body compound circuit", ["full-body", "circuit"], ["mixed"], FULL_BODY_BLOCKS, 25, 1));
  workouts.push(...expandSeries("HIIT Blast", "hiit", "hard", "High intensity interval training", ["hiit", "cardio"], ["body weight"], HIIT_BLOCKS, 15, 1));
  workouts.push(...expandSeries("Upper Sculpt", "upper", "medium", "Upper body strength", ["upper", "strength"], ["dumbbell", "barbell"], UPPER_BLOCKS, 10, 1));
  workouts.push(...expandSeries("Lower Power", "lower", "medium", "Lower body strength", ["lower", "legs"], ["dumbbell", "barbell"], LOWER_BLOCKS, 10, 1));
  workouts.push(...expandSeries("Mobility Reset", "mobility", "easy", "Stretch and recover", ["mobility", "stretch"], ["mat"], MOBILITY_BLOCKS, 10, 1));

  // Named signature workouts
  workouts.push(
    w("Quick 15 Home Express", "home", "easy", "Fast full-body session when you're short on time.", ["quick", "15-min"], ["body weight"], [sr("jumping-jack", 2, 30), sr("bodyweight-squat", 3, 12), sr("push-up", 3, 10), sr("plank", 2, 1, 20), timed("high-knees", 45)]),
    w("Gym Day A — Push", "weights", "hard", "Heavy push day: chest, shoulders, triceps.", ["gym", "push"], ["barbell", "dumbbell"], [sr("barbell-bench-press", 4, 6), sr("barbell-shoulder-press", 4, 8), sr("dumbbell-press", 3, 10), sr("lateral-raise", 3, 15), sr("overhead-tricep-extension", 3, 12)]),
    w("Gym Day B — Pull", "weights", "hard", "Heavy pull day: back and biceps.", ["gym", "pull"], ["barbell", "cable"], [sr("barbell-deadlift", 4, 5), sr("bent-over-row", 4, 8), sr("lat-pulldown", 3, 12), sr("cable-row", 3, 12), sr("bicep-curl", 3, 12)]),
    w("Gym Day C — Legs", "weights", "hard", "Leg day with squats and hinges.", ["gym", "legs"], ["barbell", "machine"], [sr("barbell-squat", 4, 8), sr("romanian-deadlift", 3, 10), sr("leg-press", 3, 15), sr("leg-curl", 3, 12), sr("calf-raise", 4, 15)]),
    w("Partner HIIT", "hiit", "medium", "Short bursts — great before harbor streak night.", ["hiit", "partner"], ["body weight"], [timed("burpee", 35), timed("jump-squat", 35), timed("mountain-climber", 35), timed("plank", 40), timed("jumping-jack", 35)]),
    w("Pilates Hundred Challenge", "pilates", "medium", "Century-style core endurance.", ["pilates", "challenge"], ["mat"], [timed("hundred", 100), timed("roll-up", 45), timed("scissors", 45), timed("teaser", 30), timed("swimming", 60)]),
    w("Desk Break Mobility", "mobility", "easy", "Undo sitting — hips, shoulders, spine.", ["desk", "quick"], ["mat"], MOBILITY_BLOCKS[0]),
    w("Beginner Full Body", "full_body", "easy", "Perfect first NISU workout.", ["beginner"], ["body weight", "dumbbell"], [sr("goblet-squat", 3, 10), sr("push-up", 3, 8), sr("dumbbell-row", 3, 10), sr("glute-bridge", 3, 12), timed("plank", 30)])
  );

  // Deduplicate by name
  const seen = new Set<string>();
  return workouts.filter((wo) => {
    if (seen.has(wo.name)) return false;
    seen.add(wo.name);
    return true;
  });
}
