export interface FitnessState {
  designatedWorkout: boolean;
  stepCount: boolean;
  funActive: boolean;
  completed: boolean;
}

export interface FuelState {
  protein: boolean;
  water: boolean;
  sugaryFoods: number;
  completed: boolean;
}

export interface SkillState {
  requiredBlocks: number;
  completedBlocks: number;
  selectedChallenge: Challenge | null;
  completedChallengeIds: string[];
  completed: boolean;
}

export interface ResetState {
  reading: boolean;
  journaling: boolean;
  meditation: boolean;
  outside: boolean;
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  fitness: FitnessState;
  fuel: FuelState;
  skill: SkillState;
  reset: ResetState;
}

export interface Challenge {
  id: string;
  title: string;
  time: string;
  description: string;
  repeatable: boolean;
  active: boolean;
}

export type PillarName = "fitness" | "fuel" | "skill" | "reset";
