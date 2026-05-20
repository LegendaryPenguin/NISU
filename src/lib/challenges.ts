import { Challenge } from "./types";

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Practice coding for 25 minutes",
    time: "25 min",
    description: "Work on one coding problem or project task.",
    repeatable: true,
    active: true,
  },
  {
    id: "2",
    title: "Learn one Azure concept",
    time: "20 min",
    description: "Read or watch something and write 3 notes.",
    repeatable: true,
    active: true,
  },
  {
    id: "3",
    title: "Watch one useful tutorial",
    time: "15 min",
    description: "Watch one short tutorial and summarize the main idea.",
    repeatable: true,
    active: true,
  },
];
