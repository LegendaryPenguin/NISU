"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  DailyProgress,
  FitnessActivityLog,
  SkillItem,
  SkillActivityLog,
  DailyWheelSelection,
} from "@/lib/types";
import {
  getTodayKey,
  getDefaultDailyProgress,
  loadAllProgress,
  saveDailyProgress,
  calculateFitnessCompletion,
  calculateFuelCompletion,
  calculateSkillCompletion,
  calculateResetCompletion,
  getWeeklyFunActiveCount,
  getRequiredSkillBlocks,
} from "@/lib/helpers";
import {
  getTodayFitnessLog,
  getWeeklyFunActiveCountFromDb,
  logFitnessActivity,
  deleteTodayFitnessLog,
} from "@/lib/fitness-actions";
import {
  getTodaySkillLogs,
  getTodayWheelSelection,
  spinWheelForToday as spinWheelAction,
  logSkillActivity,
  markWheelSelectionComplete,
  markItemInactiveIfNonRepeatable,
  deleteTodaySkillData,
} from "@/lib/skill-actions";
import { useAuth } from "./AuthContext";

interface DailyProgressContextValue {
  progress: DailyProgress;
  weeklyFunActiveCount: number;
  overallProgress: number;
  isLoaded: boolean;
  fitnessLog: FitnessActivityLog | null;

  completeFitnessViaWorkout: (
    workoutId: string,
    workoutName: string
  ) => Promise<void>;
  completeFitnessViaSteps: () => Promise<void>;
  completeFitnessViaFunActive: (description: string) => Promise<void>;
  refreshFitnessStatus: () => Promise<void>;

  toggleProtein: () => void;
  toggleWater: () => void;
  incrementSugar: () => void;
  decrementSugar: () => void;

  todaySkillLogs: SkillActivityLog[];
  todayWheelSelection: DailyWheelSelection | null;
  completeMainSkillActivity: (skillItem: SkillItem) => Promise<void>;
  spinWheelForToday: () => Promise<void>;
  completeWheelSkillActivity: () => Promise<void>;
  refreshSkillStatus: () => Promise<void>;

  toggleReading: () => void;
  toggleJournaling: () => void;
  completeJournaling: () => void;
  toggleMeditation: () => void;
  toggleOutside: () => void;

  resetToday: () => Promise<void>;
}

const DailyProgressContext = createContext<DailyProgressContextValue | null>(
  null
);

export function DailyProgressProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id;
  const todayKey = getTodayKey();

  const [allProgress, setAllProgress] = useState<
    Record<string, DailyProgress>
  >({});
  const [progress, setProgress] = useState<DailyProgress>(
    getDefaultDailyProgress(todayKey)
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const [fitnessLog, setFitnessLog] = useState<FitnessActivityLog | null>(
    null
  );
  const [weeklyFunActiveCount, setWeeklyFunActiveCount] = useState(0);

  const [todaySkillLogs, setTodaySkillLogs] = useState<SkillActivityLog[]>([]);
  const [todayWheelSelection, setTodayWheelSelection] =
    useState<DailyWheelSelection | null>(null);

  useEffect(() => {
    if (authLoading || !userId) return;

    const stored = loadAllProgress(userId);
    setAllProgress(stored);

    if (stored[todayKey]) {
      setProgress(stored[todayKey]);
    } else {
      setProgress(getDefaultDailyProgress(todayKey));
    }

    setIsLoaded(true);
  }, [todayKey, authLoading, userId]);

  const refreshFitnessStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const [log, funActiveCount] = await Promise.all([
        getTodayFitnessLog(todayKey),
        getWeeklyFunActiveCountFromDb(todayKey),
      ]);

      setFitnessLog(log);
      setWeeklyFunActiveCount(funActiveCount);

      if (log) {
        setProgress((prev) => ({
          ...prev,
          fitness: {
            designatedWorkout: log.type === "workout",
            stepCount: log.type === "steps",
            funActive: log.type === "fun_active",
            completed: true,
            completionType: log.type,
            completionDetail:
              log.workout_name || log.fun_active_description || null,
          },
        }));
      }
    } catch {
      // Supabase unavailable
    }
  }, [todayKey, userId]);

  const refreshSkillStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const [logs, wheelSel] = await Promise.all([
        getTodaySkillLogs(todayKey),
        getTodayWheelSelection(todayKey),
      ]);

      setTodaySkillLogs(logs);
      setTodayWheelSelection(wheelSel);

      const completedBlocks = logs.length;
      const requiredBlocks = getRequiredSkillBlocks(todayKey);

      setProgress((prev) => ({
        ...prev,
        skill: {
          ...prev.skill,
          completedBlocks,
          requiredBlocks,
          completed: completedBlocks >= requiredBlocks,
        },
      }));
    } catch {
      // Supabase unavailable
    }
  }, [todayKey, userId]);

  useEffect(() => {
    if (!isLoaded) return;
    refreshFitnessStatus();
    refreshSkillStatus();
  }, [isLoaded, refreshFitnessStatus, refreshSkillStatus]);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    const updated = { ...allProgress, [todayKey]: progress };
    setAllProgress(updated);
    saveDailyProgress(updated, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, isLoaded]);

  const localFunActiveCount = getWeeklyFunActiveCount(
    allProgress,
    todayKey,
    progress.fitness.funActive
  );
  const effectiveFunActiveCount =
    weeklyFunActiveCount > 0 ? weeklyFunActiveCount : localFunActiveCount;

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
  const completeFitnessViaWorkout = useCallback(
    async (workoutId: string, workoutName: string) => {
      const log = await logFitnessActivity({
        date_key: todayKey,
        type: "workout",
        workout_id: workoutId,
        workout_name: workoutName,
        description: null,
        steps_confirmed: null,
        fun_active_description: null,
      });
      setFitnessLog(log);
      setProgress((prev) =>
        recalcCompletion({
          ...prev,
          fitness: {
            ...prev.fitness,
            designatedWorkout: true,
            completed: true,
            completionType: "workout",
            completionDetail: workoutName,
          },
        })
      );
    },
    [todayKey, recalcCompletion]
  );

  const completeFitnessViaSteps = useCallback(async () => {
    const log = await logFitnessActivity({
      date_key: todayKey,
      type: "steps",
      workout_id: null,
      workout_name: null,
      description: null,
      steps_confirmed: true,
      fun_active_description: null,
    });
    setFitnessLog(log);
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        fitness: {
          ...prev.fitness,
          stepCount: true,
          completed: true,
          completionType: "steps",
          completionDetail: null,
        },
      })
    );
  }, [todayKey, recalcCompletion]);

  const completeFitnessViaFunActive = useCallback(
    async (description: string) => {
      const log = await logFitnessActivity({
        date_key: todayKey,
        type: "fun_active",
        workout_id: null,
        workout_name: null,
        description: null,
        steps_confirmed: null,
        fun_active_description: description,
      });
      setFitnessLog(log);
      setWeeklyFunActiveCount((prev) => prev + 1);
      setProgress((prev) =>
        recalcCompletion(
          {
            ...prev,
            fitness: {
              ...prev.fitness,
              funActive: true,
              completed: true,
              completionType: "fun_active",
              completionDetail: description,
            },
          },
          effectiveFunActiveCount + 1
        )
      );
    },
    [todayKey, recalcCompletion, effectiveFunActiveCount]
  );

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
  const completeMainSkillActivity = useCallback(
    async (skillItem: SkillItem) => {
      await logSkillActivity({
        date_key: todayKey,
        type: "main",
        skill_item_id: skillItem.id,
        skill_name: skillItem.name,
        skill_time: skillItem.time,
        skill_description: skillItem.description,
      });
      await markItemInactiveIfNonRepeatable(skillItem.id);

      setTodaySkillLogs((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          user_id: userId ?? null,
          date_key: todayKey,
          type: "main",
          skill_item_id: skillItem.id,
          skill_name: skillItem.name,
          skill_time: skillItem.time,
          skill_description: skillItem.description,
          completed_at: new Date().toISOString(),
        },
      ]);

      setProgress((prev) => {
        const newBlocks = prev.skill.completedBlocks + 1;
        return recalcCompletion({
          ...prev,
          skill: { ...prev.skill, completedBlocks: newBlocks },
        });
      });
    },
    [todayKey, recalcCompletion, userId]
  );

  const spinWheelForToday = useCallback(async () => {
    const selection = await spinWheelAction(todayKey);
    setTodayWheelSelection(selection);
  }, [todayKey]);

  const completeWheelSkillActivity = useCallback(async () => {
    if (!todayWheelSelection || todayWheelSelection.completed) return;

    await logSkillActivity({
      date_key: todayKey,
      type: "wheel",
      skill_item_id: todayWheelSelection.skill_item_id,
      skill_name: todayWheelSelection.skill_name,
      skill_time: todayWheelSelection.skill_time,
      skill_description: todayWheelSelection.skill_description,
    });

    const updated = await markWheelSelectionComplete(todayWheelSelection.id);
    setTodayWheelSelection(updated);

    await markItemInactiveIfNonRepeatable(
      todayWheelSelection.skill_item_id
    );

    setTodaySkillLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        user_id: userId ?? null,
        date_key: todayKey,
        type: "wheel",
        skill_item_id: todayWheelSelection.skill_item_id,
        skill_name: todayWheelSelection.skill_name,
        skill_time: todayWheelSelection.skill_time,
        skill_description: todayWheelSelection.skill_description,
        completed_at: new Date().toISOString(),
      },
    ]);

    setProgress((prev) => {
      const newBlocks = prev.skill.completedBlocks + 1;
      return recalcCompletion({
        ...prev,
        skill: { ...prev.skill, completedBlocks: newBlocks },
      });
    });
  }, [todayKey, todayWheelSelection, recalcCompletion, userId]);

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

  const completeJournaling = useCallback(() => {
    setProgress((prev) =>
      recalcCompletion({
        ...prev,
        reset: { ...prev.reset, journaling: true },
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

  // --- DEV RESET ---
  const resetToday = useCallback(async () => {
    const fresh = getDefaultDailyProgress(todayKey);
    setProgress(fresh);
    setFitnessLog(null);
    setWeeklyFunActiveCount(0);
    setTodaySkillLogs([]);
    setTodayWheelSelection(null);

    const updated = { ...allProgress };
    delete updated[todayKey];
    setAllProgress(updated);
    saveDailyProgress(updated, userId);

    try {
      await Promise.all([
        deleteTodayFitnessLog(todayKey),
        deleteTodaySkillData(todayKey),
      ]);
    } catch {
      // best-effort
    }
  }, [todayKey, allProgress, userId]);

  const overallProgress =
    (progress.fitness.completed ? 1 : 0) +
    (progress.fuel.completed ? 1 : 0) +
    (progress.skill.completed ? 1 : 0) +
    (progress.reset.completed ? 1 : 0);

  return (
    <DailyProgressContext.Provider
      value={{
        progress,
        weeklyFunActiveCount: effectiveFunActiveCount,
        overallProgress,
        isLoaded,
        fitnessLog,
        completeFitnessViaWorkout,
        completeFitnessViaSteps,
        completeFitnessViaFunActive,
        refreshFitnessStatus,
        toggleProtein,
        toggleWater,
        incrementSugar,
        decrementSugar,
        todaySkillLogs,
        todayWheelSelection,
        completeMainSkillActivity,
        spinWheelForToday,
        completeWheelSkillActivity,
        refreshSkillStatus,
        toggleReading,
        toggleJournaling,
        completeJournaling,
        toggleMeditation,
        toggleOutside,
        resetToday,
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
