import { DailyProgress } from "./types";

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isWeekend(dateStr?: string): boolean {
  const date = dateStr ? new Date(dateStr + "T12:00:00") : new Date();
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getRequiredSkillBlocks(dateStr?: string): number {
  return isWeekend(dateStr) ? 2 : 1;
}

export function getDefaultDailyProgress(dateStr: string): DailyProgress {
  return {
    date: dateStr,
    fitness: {
      designatedWorkout: false,
      stepCount: false,
      funActive: false,
      completed: false,
      completionType: null,
      completionDetail: null,
    },
    fuel: {
      protein: false,
      water: false,
      sugaryFoods: 0,
      completed: false,
    },
    skill: {
      requiredBlocks: getRequiredSkillBlocks(dateStr),
      completedBlocks: 0,
      completed: false,
    },
    reset: {
      reading: false,
      journaling: false,
      meditation: false,
      outside: false,
      completed: false,
    },
  };
}

export function calculateFitnessCompletion(
  fitness: DailyProgress["fitness"],
  weeklyFunActiveCount: number
): boolean {
  if (fitness.designatedWorkout || fitness.stepCount) return true;
  if (fitness.funActive && weeklyFunActiveCount <= 2) return true;
  return false;
}

export function calculateFuelCompletion(
  fuel: DailyProgress["fuel"]
): boolean {
  return fuel.protein && fuel.water;
}

export function calculateSkillCompletion(
  skill: DailyProgress["skill"]
): boolean {
  return skill.completedBlocks >= skill.requiredBlocks;
}

export function calculateResetCompletion(
  reset: DailyProgress["reset"]
): boolean {
  return reset.reading && (reset.journaling || reset.meditation);
}

export function calculateOverallProgress(progress: DailyProgress): number {
  let count = 0;
  if (progress.fitness.completed) count++;
  if (progress.fuel.completed) count++;
  if (progress.skill.completed) count++;
  if (progress.reset.completed) count++;
  return count;
}

/** Get the Monday of the week containing the given date */
function getWeekMonday(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().split("T")[0];
}

/** Get all date keys for the current week (Mon-Sun) */
export function getCurrentWeekDates(todayStr: string): string[] {
  const monday = getWeekMonday(todayStr);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday + "T12:00:00");
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

/** Count how many times Fun Active was used this week across all stored days (localStorage fallback) */
export function getWeeklyFunActiveCount(
  allProgress: Record<string, DailyProgress>,
  todayStr: string,
  todayFunActive: boolean
): number {
  const weekDates = getCurrentWeekDates(todayStr);
  let count = 0;
  for (const dateKey of weekDates) {
    if (dateKey === todayStr) {
      if (todayFunActive) count++;
    } else if (allProgress[dateKey]?.fitness.funActive) {
      count++;
    }
  }
  return count;
}

const STORAGE_KEY = "nisu_daily_progress";

export function loadAllProgress(): Record<string, DailyProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDailyProgress(
  allProgress: Record<string, DailyProgress>
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}
