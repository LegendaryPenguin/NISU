"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { DailyProgress, Challenge } from "@/lib/types";
import { DEFAULT_CHALLENGES } from "@/lib/challenges";
import {
  getTodayKey,
  getDefaultDailyProgress,
  loadAllProgress,
  saveDailyProgress,
  loadChallenges,
  saveChallenges,
  calculateFitnessCompletion,
  calculateFuelCompletion,
  calculateSkillCompletion,
  calculateResetCompletion,
  getWeeklyFunActiveCount,
} from "@/lib/helpers";

interface DailyProgressContextValue {
  progress: DailyProgress;
  challenges: Challenge[];
  weeklyFunActiveCount: number;
  overallProgress: number;
  isLoaded: boolean;

  toggleDesignatedWorkout: () => void;
  toggleStepCount: () => void;
  toggleFunActive: () => void;

  toggleProtein: () => void;
  toggleWater: () => void;
  incrementSugar: () => void;
  decrementSugar: () => void;

  completeMainSkill: () => void;
  spinChallenge: () => void;
  completeChallenge: () => void;
  clearSelectedChallenge: () => void;

  toggleReading: () => void;
  toggleJournaling: () => void;
  toggleMeditation: () => void;
  toggleOutside: () => void;
}

const DailyProgressContext = createContext<DailyProgressContextValue | null>(
  null
);

export function DailyProgressProvider({ children }: { children: ReactNode }) {
  const todayKey = getTodayKey();

  const [allProgress, setAllProgress] = useState<
    Record<string, DailyProgress>
  >({});
  const [progress, setProgress] = useState<DailyProgress>(
    getDefaultDailyProgress(todayKey)
  );
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadAllProgress();
    const storedChallenges = loadChallenges();

    setAllProgress(stored);

    if (stored[todayKey]) {
      setProgress(stored[todayKey]);
    } else {
      setProgress(getDefaultDailyProgress(todayKey));
    }

    if (storedChallenges.length > 0) {
      setChallenges(storedChallenges);
    } else {
      setChallenges(DEFAULT_CHALLENGES);
      saveChallenges(DEFAULT_CHALLENGES);
    }

    setIsLoaded(true);
  }, [todayKey]);

  // Persist on every progress change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    const updated = { ...allProgress, [todayKey]: progress };
    setAllProgress(updated);
    saveDailyProgress(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, isLoaded]);

  // Persist challenges
  useEffect(() => {
    if (!isLoaded) return;
    saveChallenges(challenges);
  }, [challenges, isLoaded]);

  const weeklyFunActiveCount = getWeeklyFunActiveCount(
    allProgress,
    todayKey,
    progress.fitness.funActive
  );

  const recalcCompletion = useCallback(
    (p: DailyProgress, funActiveCount?: number): DailyProgress => {
      const fac =
        funActiveCount ??
        getWeeklyFunActiveCount(allProgress, todayKey, p.fitness.funActive);
      return {
        ...p,
        fitness: {
          ...p.fitness,
          completed: calculateFitnessCompletion(p.fitness, fac),
        },
        fuel: { ...p.fuel, completed: calculateFuelCompletion(p.fuel) },
        skill: { ...p.skill, completed: calculateSkillCompletion(p.skill) },
        reset: { ...p.reset, completed: calculateResetCompletion(p.reset) },
      };
    },
    [allProgress, todayKey]
  );

  // --- FITNESS ---
  const toggleDesignatedWorkout = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fitness: {
          ...prev.fitness,
          designatedWorkout: !prev.fitness.designatedWorkout,
        },
      })
    );
  }, [recalcCompletion]);

  const toggleStepCount = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fitness: { ...prev.fitness, stepCount: !prev.fitness.stepCount },
      })
    );
  }, [recalcCompletion]);

  const toggleFunActive = useCallback(() => {
    setProgress((prev) => {
      const newFunActive = !prev.fitness.funActive;
      const newFac = getWeeklyFunActiveCount(
        allProgress,
        todayKey,
        newFunActive
      );
      return recalcCompletion(
        {
          ...prev,
          fitness: { ...prev.fitness, funActive: newFunActive },
        },
        newFac
      );
    });
  }, [recalcCompletion, allProgress, todayKey]);

  // --- FUEL ---
  const toggleProtein = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fuel: { ...prev.fuel, protein: !prev.fuel.protein },
      })
    );
  }, [recalcCompletion]);

  const toggleWater = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fuel: { ...prev.fuel, water: !prev.fuel.water },
      })
    );
  }, [recalcCompletion]);

  const incrementSugar = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fuel: { ...prev.fuel, sugaryFoods: prev.fuel.sugaryFoods + 1 },
      })
    );
  }, [recalcCompletion]);

  const decrementSugar = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fuel: {
          ...prev.fuel,
          sugaryFoods: Math.max(0, prev.fuel.sugaryFoods - 1),
        },
      })
    );
  }, [recalcCompletion]);

  // --- SKILL ---
  const completeMainSkill = useCallback(() => {
    setProgress((prev) => {
      const newBlocks = prev.skill.completedBlocks + 1;
      return recalcCompletion({
        ...prev,
        skill: { ...prev.skill, completedBlocks: newBlocks },
      });
    });
  }, [recalcCompletion]);

  const spinChallenge = useCallback(() => {
    const activeChallenges = challenges.filter((c) => c.active);
    if (activeChallenges.length === 0) return;
    const random =
      activeChallenges[Math.floor(Math.random() * activeChallenges.length)];
    setProgress((prev) => ({
      ...prev,
      skill: { ...prev.skill, selectedChallenge: random },
    }));
  }, [challenges]);

  const completeChallenge = useCallback(() => {
    setProgress((prev) => {
      if (!prev.skill.selectedChallenge) return prev;
      const challengeId = prev.skill.selectedChallenge.id;
      if (prev.skill.completedChallengeIds.includes(challengeId)) return prev;

      const newBlocks = prev.skill.completedBlocks + 1;
      const updated = recalcCompletion({
        ...prev,
        skill: {
          ...prev.skill,
          completedBlocks: newBlocks,
          completedChallengeIds: [
            ...prev.skill.completedChallengeIds,
            challengeId,
          ],
          selectedChallenge: null,
        },
      });

      // Remove non-repeatable challenges
      const challenge = challenges.find((c) => c.id === challengeId);
      if (challenge && !challenge.repeatable) {
        setChallenges((prev) =>
          prev.map((c) => (c.id === challengeId ? { ...c, active: false } : c))
        );
      }

      return updated;
    });
  }, [recalcCompletion, challenges]);

  const clearSelectedChallenge = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      skill: { ...prev.skill, selectedChallenge: null },
    }));
  }, []);

  // --- RESET ---
  const toggleReading = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        reset: { ...prev.reset, reading: !prev.reset.reading },
      })
    );
  }, [recalcCompletion]);

  const toggleJournaling = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        reset: { ...prev.reset, journaling: !prev.reset.journaling },
      })
    );
  }, [recalcCompletion]);

  const toggleMeditation = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        reset: { ...prev.reset, meditation: !prev.reset.meditation },
      })
    );
  }, [recalcCompletion]);

  const toggleOutside = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        reset: { ...prev.reset, outside: !prev.reset.outside },
      })
    );
  }, [recalcCompletion]);

  const overallProgress =
    (progress.fitness.completed ? 1 : 0) +
    (progress.fuel.completed ? 1 : 0) +
    (progress.skill.completed ? 1 : 0) +
    (progress.reset.completed ? 1 : 0);

  return (
    <DailyProgressContext.Provider
      value={{
        progress,
        challenges,
        weeklyFunActiveCount,
        overallProgress,
        isLoaded,
        toggleDesignatedWorkout,
        toggleStepCount,
        toggleFunActive,
        toggleProtein,
        toggleWater,
        incrementSugar,
        decrementSugar,
        completeMainSkill,
        spinChallenge,
        completeChallenge,
        clearSelectedChallenge,
        toggleReading,
        toggleJournaling,
        toggleMeditation,
        toggleOutside,
      }}
    >
      {children}
    </DailyProgressContext.Provider>
  );
}

export function useDailyProgress() {
  const ctx = useContext(DailyProgressContext);
  if (!ctx)
    throw new Error(
      "useDailyProgress must be used within DailyProgressProvider"
    );
  return ctx;
}
