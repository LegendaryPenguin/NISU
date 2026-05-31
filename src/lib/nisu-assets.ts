/** Central map of NISU design assets under /public/nisu */

export const NISU_ASSETS = {
  logo: "/nisu/logo.png",
  logoTransparent: "/nisu/logo-transparent.png",
  banner: "/nisu/banner.png",
  icons: {
    daily: "/nisu/penguins/daily.png",
    fitness: "/nisu/icons/fitness.png",
    fuel: "/nisu/icons/fuel.png",
    skill: "/nisu/icons/skill.png",
    journal: "/nisu/icons/journal.png",
    streaks: "/nisu/icons/streaks.png",
    practice: "/nisu/icons/practice.png",
  },
  penguins: {
    daily: "/nisu/penguins/daily.png",
    fitness: "/nisu/penguins/fitness.png",
    fuel: "/nisu/penguins/fuel.png",
    skill: "/nisu/penguins/skill.png",
    practice: "/nisu/penguins/practice.png",
    streak: "/nisu/penguins/streak.png",
    partnerStreak: "/nisu/penguins/partner-streak.png",
    reset: "/nisu/penguins/reset.png",
    hero: "/nisu/penguins/daily.png",
  },
  ui: {
    heart: "/nisu/ui/heart.png",
    plus: "/nisu/ui/plus.png",
    minus: "/nisu/ui/minus.png",
  },
} as const;

export type NisuSection =
  | "daily"
  | "fitness"
  | "fuel"
  | "skill"
  | "journal"
  | "streaks"
  | "practice";

export const NAV_ITEMS: {
  href: string;
  label: string;
  section: NisuSection;
  shortLabel: string;
}[] = [
  { href: "/daily", label: "Daily Routine", section: "daily", shortLabel: "Daily" },
  { href: "/fitness", label: "Fitness", section: "fitness", shortLabel: "Fitness" },
  { href: "/fuel", label: "Fuel", section: "fuel", shortLabel: "Fuel" },
  { href: "/skill", label: "Skill", section: "skill", shortLabel: "Skill" },
  { href: "/journal", label: "Journal", section: "journal", shortLabel: "Journal" },
  { href: "/accountability", label: "Streaks", section: "streaks", shortLabel: "Streaks" },
  { href: "/practice", label: "Practice", section: "practice", shortLabel: "Practice" },
];
