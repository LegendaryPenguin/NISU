/** Pillars completed needed to count a successful streak day */
export const STREAK_PILLAR_THRESHOLD = 3;

const PARTNER_BY_EMAIL: Record<string, string> = {
  "nisch.rawal@gmail.com": "suprithachak@gmail.com",
  "suprithachak@gmail.com": "nisch.rawal@gmail.com",
};

export function getPartnerEmail(email: string | undefined): string | null {
  if (!email) return null;
  return PARTNER_BY_EMAIL[email.toLowerCase()] ?? null;
}

export function isCoupleMember(email: string | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() in PARTNER_BY_EMAIL;
}
