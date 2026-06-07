"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader, { PageActionRow } from "@/components/PageHeader";
import { NISU_ASSETS } from "@/lib/nisu-assets";
import type { WorkoutWithExercises, WorkoutExercise } from "@/lib/types";
import { formatDuration } from "@/lib/helpers";
import {
  fetchWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  replaceExercises,
} from "@/lib/fitness-actions";

type ExerciseDraft = {
  tempId: string;
  name: string;
  type: "sets_reps" | "timed";
  sets: number;
  reps: number;
  duration_seconds: number;
};

function newExerciseDraft(): ExerciseDraft {
  return {
    tempId: crypto.randomUUID(),
    name: "",
    type: "sets_reps",
    sets: 3,
    reps: 10,
    duration_seconds: 60,
  };
}

function exercisesToDrafts(exercises: WorkoutExercise[]): ExerciseDraft[] {
  return exercises.map((e) => ({
    tempId: e.id,
    name: e.name,
    type: e.type,
    sets: e.sets ?? 3,
    reps: e.reps ?? 10,
    duration_seconds: e.duration_seconds ?? 60,
  }));
}

export default function FitnessManagementPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formMode, setFormMode] = useState<"idle" | "create" | "edit">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWorkouts();
      setWorkouts(data);
    } catch {
      setError("Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const resetForm = () => {
    setFormMode("idle");
    setEditingId(null);
    setWorkoutName("");
    setExercises([]);
    setSaving(false);
  };

  const startCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setWorkoutName("");
    setExercises([newExerciseDraft()]);
  };

  const startEdit = (w: WorkoutWithExercises) => {
    setFormMode("edit");
    setEditingId(w.id);
    setWorkoutName(w.name);
    setExercises(
      w.workout_exercises.length > 0
        ? exercisesToDrafts(w.workout_exercises)
        : [newExerciseDraft()]
    );
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, newExerciseDraft()]);
  };

  const removeExercise = (tempId: string) => {
    setExercises((prev) => prev.filter((e) => e.tempId !== tempId));
  };

  const updateExerciseDraft = (
    tempId: string,
    field: keyof ExerciseDraft,
    value: string | number
  ) => {
    setExercises((prev) =>
      prev.map((e) => (e.tempId === tempId ? { ...e, [field]: value } : e))
    );
  };

  const handleSave = async () => {
    if (!workoutName.trim()) return;
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) return;

    setSaving(true);
    setError(null);

    try {
      let workoutId: string;

      if (formMode === "create") {
        const w = await createWorkout(workoutName.trim());
        workoutId = w.id;
      } else {
        await updateWorkout(editingId!, workoutName.trim());
        workoutId = editingId!;
      }

      await replaceExercises(
        workoutId,
        validExercises.map((e, i) => ({
          name: e.name.trim(),
          type: e.type,
          sets: e.type === "sets_reps" ? e.sets : null,
          reps: e.type === "sets_reps" ? e.reps : null,
          duration_seconds: e.type === "timed" ? e.duration_seconds : null,
          order_index: i,
        }))
      );

      await loadWorkouts();
      resetForm();
    } catch {
      setError("Failed to save workout.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setError(null);
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch {
      setError("Failed to delete workout.");
    } finally {
      setDeleting(null);
    }
  };

  const previewWorkout = workouts.find((w) => w.id === previewId);

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PageHeader
          title="Fitness"
          section="fitness"
          subtitle="Create and manage your designated workouts."
        />

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {formMode === "idle" && (
          <PageActionRow
            cta={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={startCreate}
                  className="nisu-cta-bold text-sm px-6 py-2.5 cursor-pointer"
                >
                  + Create new workout
                </button>
                <Link
                  href="/fitness/history"
                  className="text-sm font-semibold text-[var(--nisu-sky)] px-4 py-2.5 rounded-xl border-2 border-[var(--nisu-border)] bg-white hover:bg-[var(--nisu-pale-blue)] transition-colors"
                >
                  Workout history
                </Link>
              </div>
            }
          />
        )}

        {/* Create / Edit Form */}
        {formMode !== "idle" && (
          <div className="nisu-card p-5 mb-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">
              {formMode === "create" ? "Create Workout" : "Edit Workout"}
            </h2>

            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g. Full Body Starter"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)] mb-5"
            />

            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Exercises
            </label>

            <div className="space-y-3 mb-4">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.tempId}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xs text-gray-400 font-bold mt-2.5 min-w-[20px]">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) =>
                        updateExerciseDraft(ex.tempId, "name", e.target.value)
                      }
                      placeholder="Exercise name"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
                    />
                    {exercises.length > 1 && (
                      <button
                        onClick={() => removeExercise(ex.tempId)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 ml-7">
                    <select
                      value={ex.type}
                      onChange={(e) =>
                        updateExerciseDraft(
                          ex.tempId,
                          "type",
                          e.target.value as "sets_reps" | "timed"
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)] cursor-pointer"
                    >
                      <option value="sets_reps">Sets &amp; Reps</option>
                      <option value="timed">Timed</option>
                    </select>

                    {ex.type === "sets_reps" ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            value={ex.sets}
                            onChange={(e) =>
                              updateExerciseDraft(
                                ex.tempId,
                                "sets",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 px-2 py-2 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
                          />
                          <span className="text-xs text-gray-400">sets</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            value={ex.reps}
                            onChange={(e) =>
                              updateExerciseDraft(
                                ex.tempId,
                                "reps",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 px-2 py-2 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
                          />
                          <span className="text-xs text-gray-400">reps</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          value={ex.duration_seconds}
                          onChange={(e) =>
                            updateExerciseDraft(
                              ex.tempId,
                              "duration_seconds",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20 px-2 py-2 rounded-lg border border-gray-200 text-sm text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)]"
                        />
                        <span className="text-xs text-gray-400">seconds</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addExercise}
              className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors mb-5 cursor-pointer"
            >
              + Add Exercise
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !workoutName.trim() ||
                  exercises.filter((e) => e.name.trim()).length === 0
                }
                className="nisu-cta-bold text-sm px-6 py-2.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : formMode === "create"
                  ? "Save Workout"
                  : "Save Changes"}
              </button>
              <button
                onClick={resetForm}
                disabled={saving}
                className="text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Workouts List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
          </div>
        ) : workouts.length === 0 ? (
          <div className="nisu-empty-fitness p-8 text-center">
            <Image
              src={NISU_ASSETS.penguins.fitness}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 object-contain mx-auto mb-3"
            />
            <p className="text-gray-900 font-bold mb-1">
              No workouts yet
            </p>
            <p className="text-gray-800 text-sm mb-4 font-medium">
              Create your first workout to get started.
            </p>
            {formMode === "idle" && (
              <button
                onClick={startCreate}
                className="nisu-cta-secondary text-sm px-6 py-2.5 cursor-pointer"
              >
                + Create new workout
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="nisu-card p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{w.name}</h3>
                    <p className="text-xs text-gray-400">
                      {w.workout_exercises.length} exercise
                      {w.workout_exercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() =>
                        setPreviewId(previewId === w.id ? null : w.id)
                      }
                      className="text-xs font-medium text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {previewId === w.id ? "Hide" : "Preview"}
                    </button>
                    <button
                      onClick={() => startEdit(w)}
                      className="text-xs font-medium text-[var(--nisu-coral)] px-3 py-1.5 rounded-lg hover:bg-[var(--nisu-pale-pink)] transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${w.name}"? This cannot be undone.`
                          )
                        ) {
                          handleDelete(w.id);
                        }
                      }}
                      disabled={deleting === w.id}
                      className="text-xs font-medium text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {deleting === w.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {previewId === w.id && previewWorkout && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {previewWorkout.workout_exercises.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">
                        No exercises. Edit to add some.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {previewWorkout.workout_exercises.map((ex, i) => (
                          <div
                            key={ex.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-xs text-gray-400 font-mono min-w-[20px]">
                              {i + 1}.
                            </span>
                            <span className="font-medium text-gray-700">
                              {ex.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {ex.type === "sets_reps"
                                ? `${ex.sets}×${ex.reps}`
                                : formatDuration(ex.duration_seconds ?? 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
