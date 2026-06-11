"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import { formatDateDisplay } from "@/lib/helpers";
import { fetchWorkoutHistory } from "@/lib/fitness-actions";
import { fetchBuiltinWorkouts, workoutCoverUrl } from "@/lib/workout-library-actions";
import type { WorkoutWithExercises } from "@/lib/types";
import LoadingFade from "@/components/motion/LoadingFade";
import type { FitnessActivityLog } from "@/lib/types";

function formatCompletedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WorkoutHistoryPage() {
  const [entries, setEntries] = useState<FitnessActivityLog[]>([]);
  const [coverByWorkoutId, setCoverByWorkoutId] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, builtins] = await Promise.all([
        fetchWorkoutHistory(),
        fetchBuiltinWorkouts().catch(() => [] as WorkoutWithExercises[]),
      ]);
      setEntries(data);
      const covers: Record<string, string> = {};
      for (const w of builtins) {
        covers[w.id] = workoutCoverUrl(w);
      }
      setCoverByWorkoutId(covers);
    } catch {
      setError("Failed to load workout history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="Workout History"
          section="fitness"
          subtitle="Your completed designated workouts."
        />

        <div className="mb-4 ml-2">
          <Link
            href="/fitness"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--nisu-sky)] hover:opacity-80"
          >
            ← Back to Fitness
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <LoadingFade
          loading={loading}
          spinner={
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
            </div>
          }
        >
        {entries.length === 0 ? (
          <div className="nisu-empty-fitness p-8 text-center ml-2">
            <Image
              src={NISU_ASSETS.penguins.fitness}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 object-contain mx-auto mb-3"
            />
            <p className="text-gray-900 font-bold mb-1">No workouts logged yet</p>
            <p className="text-gray-800 text-sm mb-4 font-medium">
              Complete a saved workout from the task board to see it here.
            </p>
            <Link
              href="/fitness/start"
              className="nisu-cta-secondary text-sm px-6 py-2.5 inline-block"
            >
              Start a workout
            </Link>
          </div>
        ) : (
          <div className="space-y-3 ml-2">
            {entries.map((entry) => {
              const cover =
                (entry.workout_id && coverByWorkoutId[entry.workout_id]) ||
                "/workouts/full_body.svg";
              const isExternal = cover.startsWith("http");
              return (
              <div key={entry.id} className="nisu-card overflow-hidden flex">
                <div className="relative w-20 min-h-[72px] flex-shrink-0 bg-[var(--nisu-pale-blue)] border-r-2 border-[var(--nisu-border)]">
                  {isExternal ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="w-full h-full object-cover min-h-[72px]" />
                  ) : (
                    <Image src={cover} alt="" fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="p-4 flex-1 flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {entry.workout_name || "Workout"}
                    </p>
                    <p className="text-xs nisu-text-muted mt-0.5">
                      {formatDateDisplay(entry.date_key)} ·{" "}
                      {formatCompletedTime(entry.completed_at)}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "var(--nisu-pale-blue)",
                      color: "var(--nisu-sky)",
                    }}
                  >
                    Done
                  </span>
                </div>
              </div>
            );
            })}
          </div>
        )}
        </LoadingFade>
      </div>
    </div>
  );
}
