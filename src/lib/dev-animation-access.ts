import { normalizeEmail } from "@/lib/couple-profile";

const ANIMATION_DEV_EMAIL = "nisch.rawal@gmail.com";

export const DEV_FORCE_MOTION_KEY = "nisu-dev-force-motion";

export function hasAnimationDevAccess(email: string | undefined): boolean {
  return normalizeEmail(email) === ANIMATION_DEV_EMAIL;
}

export function isDevForceMotionEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEV_FORCE_MOTION_KEY) === "1";
}

export function setDevForceMotion(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem(DEV_FORCE_MOTION_KEY, "1");
  } else {
    localStorage.removeItem(DEV_FORCE_MOTION_KEY);
  }
}
