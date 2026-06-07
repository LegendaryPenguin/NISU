/** NISU motion tokens and helpers — sticker-physics, warm ease-out, reduced-motion safe */

export const MOTION_DURATION = {
  fast: 150,
  standard: 280,
  slow: 420,
} as const;

export const MOTION_EASE = {
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
} as const;

/** Registry: why each animation exists (see motion plan) */
export const MOTION_PURPOSE = {
  pillarSummary: "State indication — streak earned",
  progressBar: "Feedback — forward momentum",
  workoutComplete: "Feedback + delight (rare)",
  streakNumber: "Orientation — value updated",
  calendarPenguin: "Orientation — win recorded",
  completeBadge: "State indication",
  loadingCrossfade: "Continuity — content ready",
  buttonPress: "Feedback — press heard",
  streakCelebration: "Delight — rare streak milestone earned",
} as const;

export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function motionTransition(
  properties: string,
  duration: keyof typeof MOTION_DURATION = "standard"
): string {
  const ms = MOTION_DURATION[duration];
  const ease = MOTION_EASE.out;
  return `${properties} ${ms}ms ${ease}`;
}
