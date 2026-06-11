"use client";

import { useState } from "react";
import type { WorkoutWithExercises } from "@/lib/types";

interface WorkoutPrepChecklistProps {
  workout: WorkoutWithExercises;
  onStart: () => void;
  onBack: () => void;
}

export default function WorkoutPrepChecklist({
  workout,
  onStart,
  onBack,
}: WorkoutPrepChecklistProps) {
  const [space, setSpace] = useState(false);
  const [water, setWater] = useState(false);
  const [equipment, setEquipment] = useState(false);

  const needsEquipment = (workout.equipment_tags ?? []).some(
    (t) => t !== "body weight" && t !== "mat"
  );

  const ready = space && water && (!needsEquipment || equipment);

  return (
    <div className="nisu-card p-6">
      <h2 className="text-xl font-extrabold text-gray-900 mb-2">Quick prep</h2>
      <p className="text-sm nisu-text-muted mb-6">
        Two minutes now makes the workout smoother.
      </p>

      <ul className="space-y-3 mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={space}
            onChange={(e) => setSpace(e.target.checked)}
            className="mt-1 rounded"
          />
          <span className="text-sm font-medium text-gray-800">
            I have space to move safely (arms overhead, floor work if needed)
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={water}
            onChange={(e) => setWater(e.target.checked)}
            className="mt-1 rounded"
          />
          <span className="text-sm font-medium text-gray-800">
            Water nearby — stay hydrated
          </span>
        </label>
        {needsEquipment && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={equipment}
              onChange={(e) => setEquipment(e.target.checked)}
              className="mt-1 rounded"
            />
            <span className="text-sm font-medium text-gray-800">
              Equipment ready: {(workout.equipment_tags ?? []).join(", ")}
            </span>
          </label>
        )}
      </ul>

      <p className="text-xs nisu-text-muted mb-6 p-3 rounded-lg bg-[var(--nisu-cream)]">
        Tip: Warm up with 2–3 minutes of light movement before the first exercise.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm cursor-pointer hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onStart}
          disabled={!ready}
          className="flex-[2] nisu-cta-bold font-bold py-3 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Start workout
        </button>
      </div>
    </div>
  );
}
