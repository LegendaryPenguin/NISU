"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDailyProgress } from "@/context/DailyProgressContext";
import { isWeekend, getTodayKey } from "@/lib/helpers";
import { fetchActiveSkillItems } from "@/lib/skill-actions";
import type { SkillItem, DailyWheelSelection } from "@/lib/types";
import SkillWheel from "./SkillWheel";
import { NISU_ASSETS } from "@/lib/nisu-assets";

type CardFlow = "idle" | "mainSelect" | "wheelSpinning";

export default function SkillCard() {
  const {
    progress,
    todaySkillLogs,
    todayWheelSelection,
    completeMainSkillActivity,
    spinWheelForToday,
    completeWheelSkillActivity,
  } = useDailyProgress();

  const { skill } = progress;
  const weekend = isWeekend(getTodayKey());
  const done = skill.completed;

  const [flow, setFlow] = useState<CardFlow>("idle");
  const [mainSkills, setMainSkills] = useState<SkillItem[]>([]);
  const [wheelSkills, setWheelSkills] = useState<SkillItem[]>([]);
  const [loadingMain, setLoadingMain] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The skill the wheel needs to land on (set before animation starts)
  const [wheelTarget, setWheelTarget] = useState<SkillItem | null>(null);
  const [wheelAnimating, setWheelAnimating] = useState(false);

  // Fetch wheel skills on mount so the wheel has segment data
  useEffect(() => {
    fetchActiveSkillItems("wheel")
      .then(setWheelSkills)
      .catch(() => {});
  }, []);

  // Fetch main skills when panel opens
  useEffect(() => {
    if (flow !== "mainSelect") return;
    setLoadingMain(true);
    fetchActiveSkillItems("main")
      .then(setMainSkills)
      .catch(() => setError("Failed to load main skills."))
      .finally(() => setLoadingMain(false));
  }, [flow]);

  const handleCompleteMain = async (item: SkillItem) => {
    setSubmitting(true);
    setError(null);
    try {
      await completeMainSkillActivity(item);
      setFlow("idle");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpin = async () => {
    setFlow("wheelSpinning");
    setError(null);
    try {
      await spinWheelForToday();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to spin. Please try again."
      );
      setFlow("idle");
    }
  };

  // When todayWheelSelection arrives and we're in spinning flow, start the animation
  useEffect(() => {
    if (flow !== "wheelSpinning" || !todayWheelSelection || wheelAnimating) return;
    const target = wheelSkills.find(
      (s) => s.id === todayWheelSelection.skill_item_id
    );
    if (target) {
      setWheelTarget(target);
      setWheelAnimating(true);
    } else {
      // Skill not in local list (edge case) — skip animation
      setFlow("idle");
    }
  }, [flow, todayWheelSelection, wheelSkills, wheelAnimating]);

  const handleSpinComplete = () => {
    setWheelAnimating(false);
    setWheelTarget(null);
    setFlow("idle");
  };

  const handleCompleteWheel = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await completeWheelSkillActivity();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`nisu-pillar-skill ml-2 mt-2 ${done ? "opacity-95" : ""}`}>
      <div className="nisu-pillar-inner p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={NISU_ASSETS.penguins.skill}
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Skill</h3>
            <p className="text-xs text-gray-400 italic">
              Build something. Learn something. Stay sharp.
            </p>
          </div>
        </div>
        {done && (
          <span
            className="text-white text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--nisu-pink)" }}
          >
            Complete
          </span>
        )}
      </div>

      {/* Progress badge */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`text-xs px-3 py-2 rounded-lg font-medium ${
            done
              ? "bg-[var(--nisu-pale-pink)] text-gray-700"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          {weekend ? "Weekend Skill Goal" : "Today's Skill Goal"}:{" "}
          <span className="font-bold">
            {skill.completedBlocks} / {skill.requiredBlocks}
          </span>{" "}
          block{skill.requiredBlocks > 1 ? "s" : ""}
          {weekend && (
            <span className="ml-1.5 text-[var(--nisu-pink)]">(weekend)</span>
          )}
        </div>
      </div>

      {error && (
        <div className="text-xs bg-red-50 text-red-500 px-3 py-2 rounded-lg mb-3">
          {error}
        </div>
      )}

      {/* Completed logs summary */}
      {todaySkillLogs.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {todaySkillLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 bg-[var(--nisu-pale-pink)] rounded-lg px-3 py-2"
            >
              <span className="text-xs">
                {log.type === "main" ? "✅" : "🎲"}
              </span>
              <span className="text-xs font-semibold text-gray-700">
                {log.skill_name}
              </span>
              {log.skill_time && (
                <span className="text-xs text-gray-400">
                  · {log.skill_time}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons — only when more blocks are needed */}
      {!done && flow === "idle" && (
        <div className="space-y-2 mb-4">
          <button
            onClick={() => setFlow("mainSelect")}
            disabled={submitting}
            className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl nisu-row-action-skill text-left cursor-pointer hover:opacity-90"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Complete Main Skill
              </p>
              <p className="text-xs text-gray-400">
                Pick an intentional skill to practice.
              </p>
            </div>
            <span className="text-lg flex-shrink-0">📚</span>
          </button>

          {!todayWheelSelection ? (
            <button
              onClick={handleSpin}
              disabled={submitting}
              className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl nisu-cta-bold text-left cursor-pointer hover:opacity-90"
            >
              <div>
                <p className="text-sm font-semibold">Spin Skill Wheel</p>
                <p className="text-xs opacity-90">
                  Get a random challenge for today
                </p>
              </div>
              <span className="text-lg flex-shrink-0">🎲</span>
            </button>
          ) : !todayWheelSelection.completed ? (
            <WheelSelectionCard
              selection={todayWheelSelection}
              onComplete={handleCompleteWheel}
              submitting={submitting}
            />
          ) : null}
        </div>
      )}

      {/* Wheel spinning state — real animated wheel */}
      {flow === "wheelSpinning" && (
        <div className="mb-4">
          {wheelSkills.length > 0 ? (
            <>
              <SkillWheel
                skills={wheelSkills}
                targetSkill={wheelTarget}
                spinning={wheelAnimating}
                onSpinComplete={handleSpinComplete}
              />
              <p className="text-sm font-semibold text-[var(--nisu-coral)] text-center">
                Spinning...
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center py-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-[3px] border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
                <p className="text-sm font-semibold text-[var(--nisu-coral)]">
                  Spinning...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Skill Selection Panel */}
      {flow === "mainSelect" && (
        <div className="bg-[var(--nisu-pale-pink)] border border-[var(--nisu-pale-pink-2)] rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">
            Select a Main Skill
          </p>
          {loadingMain ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
            </div>
          ) : mainSkills.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-xs text-gray-500 mb-2">
                No main skills yet.
              </p>
              <Link
                href="/skill"
                className="text-xs font-semibold text-[var(--nisu-coral)] hover:opacity-80"
              >
                Add skills on the Skill page →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {mainSkills.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCompleteMain(item)}
                  disabled={submitting}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white hover:bg-[var(--nisu-pale-pink)] text-left transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="text-sm mt-0.5">📚</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.time} · {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setFlow("idle")}
            disabled={submitting}
            className="mt-3 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Wheel selection that persists after idle (when blocks remain and already spun) */}
      {!done &&
        flow === "idle" &&
        todayWheelSelection &&
        !todayWheelSelection.completed && (
          <div className="mb-4">
            <WheelSelectionCard
              selection={todayWheelSelection}
              onComplete={handleCompleteWheel}
              submitting={submitting}
            />
          </div>
        )}

      {/* Wheel result shown as completed */}
      {todayWheelSelection?.completed && !done && flow === "idle" && (
        <div className="bg-[var(--nisu-pale-pink)] rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-[var(--nisu-coral)] font-semibold mb-0.5">
            🎲 Wheel — completed
          </p>
          <p className="text-sm font-bold text-gray-700">
            {todayWheelSelection.skill_name}
          </p>
        </div>
      )}

      <Link
        href="/skill"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--nisu-coral)] hover:opacity-80 transition-opacity"
      >
        Manage Skills →
      </Link>
      </div>
    </div>
  );
}

function WheelSelectionCard({
  selection,
  onComplete,
  submitting,
}: {
  selection: DailyWheelSelection;
  onComplete: () => void;
  submitting: boolean;
}) {
  return (
    <div className="bg-[var(--nisu-pale-pink)] border border-[var(--nisu-pale-pink-2)] rounded-xl p-4">
      <p className="text-xs text-[var(--nisu-coral)] font-semibold mb-1 uppercase tracking-wide">
        Today&apos;s Wheel Challenge
      </p>
      <p className="text-sm font-bold text-gray-800 mb-1">
        {selection.skill_name}
      </p>
      {selection.skill_description && (
        <p className="text-xs text-gray-500 mb-1">
          {selection.skill_description}
        </p>
      )}
      {selection.skill_time && (
        <p className="text-xs text-gray-400 font-medium mb-3">
          ⏱ {selection.skill_time}
        </p>
      )}
      <button
        onClick={onComplete}
        disabled={submitting}
        className="w-full py-2.5 px-4 rounded-full nisu-cta-bold text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : "Mark Challenge Complete"}
      </button>
    </div>
  );
}
