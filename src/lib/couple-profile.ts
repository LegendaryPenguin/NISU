/** Shared couple identity — used for display names and partner lookup */

export function normalizeEmail(email: string | undefined): string {
  return email?.trim().toLowerCase() ?? "";
}

const USER_MAP: Record<string, { displayName: string; partnerName: string }> = {
  "nisch.rawal@gmail.com": { displayName: "Nischay", partnerName: "Supritha" },
  "suprithachak@gmail.com": { displayName: "Supritha", partnerName: "Nischay" },
};

export const PARTNER_BY_EMAIL: Record<string, string> = {
  "nisch.rawal@gmail.com": "suprithachak@gmail.com",
  "suprithachak@gmail.com": "nisch.rawal@gmail.com",
};

export function getStaticCoupleNames(
  email: string | undefined
): { displayName: string; partnerName: string } | null {
  const key = normalizeEmail(email);
  if (!key) return null;

  const direct = USER_MAP[key];
  if (direct) return direct;

  for (const [primary, partner] of Object.entries(PARTNER_BY_EMAIL)) {
    if (partner === key && USER_MAP[primary]) {
      return {
        displayName: USER_MAP[primary].partnerName,
        partnerName: USER_MAP[primary].displayName,
      };
    }
  }

  return null;
}

export function getPartnerEmailFromConfig(email: string | undefined): string | null {
  const key = normalizeEmail(email);
  if (!key) return null;
  return PARTNER_BY_EMAIL[key] ?? null;
}

export function isKnownCoupleEmail(email: string | undefined): boolean {
  const key = normalizeEmail(email);
  if (!key) return false;
  if (key in PARTNER_BY_EMAIL || key in USER_MAP) return true;
  return Object.values(PARTNER_BY_EMAIL).includes(key);
}

export function displayNameFromUser(
  email: string,
  metadata?: { full_name?: string }
): string {
  const staticNames = getStaticCoupleNames(email);
  if (staticNames) return staticNames.displayName;
  const full = metadata?.full_name?.trim();
  if (full) return full.split(/\s+/)[0] ?? full;
  return email.split("@")[0] ?? "User";
}
