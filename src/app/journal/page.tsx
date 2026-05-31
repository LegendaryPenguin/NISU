"use client";

import Image from "next/image";
import { NISU_ASSETS } from "@/lib/nisu-assets";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import type { JournalEntry } from "@/lib/types";
import { getTodayKey } from "@/lib/helpers";
import { useDailyProgress } from "@/context/DailyProgressContext";
import {
  fetchJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/lib/journal-actions";

const STICKY_NOTE_CLASS = "nisu-sticky-note";

function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

// ===== PAGE =====

export default function JournalPage() {
  const { progress, completeJournaling } = useDailyProgress();
  const journalingDoneToday = progress.reset.journaling;

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [mind, setMind] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [avoiding, setAvoiding] = useState("");
  const [goodThing, setGoodThing] = useState("");
  const [extraDump, setExtraDump] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Expand state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setEntries(await fetchJournalEntries());
    } catch {
      setError("Could not load journal entries. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const clearForm = () => {
    setMind("");
    setNextAction("");
    setAvoiding("");
    setGoodThing("");
    setExtraDump("");
    setEditingId(null);
    setShowForm(false);
  };

  const canSubmit =
    mind.trim() &&
    nextAction.trim() &&
    avoiding.trim() &&
    goodThing.trim() &&
    !saving;

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        mind: mind.trim(),
        next_action: nextAction.trim(),
        avoiding: avoiding.trim(),
        good_thing: goodThing.trim(),
        extra_dump: extraDump.trim() || null,
      };

      if (editingId) {
        await updateJournalEntry(editingId, payload);
        setSuccessMsg("Brain dump updated.");
      } else {
        await createJournalEntry({ ...payload, date_key: getTodayKey() });
        completeJournaling();
        setSuccessMsg("Nice. That thought is out of your head now. ✓ Journaling marked done.");
      }
      clearForm();
      await load();
    } catch {
      setError("Failed to save brain dump.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (e: JournalEntry) => {
    setEditingId(e.id);
    setMind(e.mind);
    setNextAction(e.next_action);
    setAvoiding(e.avoiding);
    setGoodThing(e.good_thing);
    setExtraDump(e.extra_dump ?? "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brain dump? This cannot be undone.")) return;
    setError(null);
    try {
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) clearForm();
      setSuccessMsg("Brain dump deleted.");
    } catch {
      setError("Failed to delete entry.");
    }
  };

  const todayEntries = entries.filter((e) => e.date_key === getTodayKey());
  const pastEntries = entries.filter((e) => e.date_key !== getTodayKey());

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Brain Dump"
          section="journal"
          subtitle="Get it out of your head in under 5 minutes."
        >
          <p className="text-xs text-gray-400 mt-0.5">
            No perfect answers. Just dump it, save it, and move on.
          </p>
        </PageHeader>

        <div className="flex gap-3 mb-6 flex-wrap items-center">
          {journalingDoneToday && (
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                color: "var(--nisu-coral)",
                backgroundColor: "var(--nisu-pale-pink)",
                border: "1px solid var(--nisu-pale-pink-2)",
              }}
            >
              ✓ Journaling done today
            </span>
          )}
        </div>

        {/* Success message */}
        {successMsg && (
          <div
            className="text-sm px-4 py-3 rounded-xl mb-4 border"
            style={{
              backgroundColor: "var(--nisu-pale-pink)",
              color: "var(--nisu-coral)",
              borderColor: "var(--nisu-pale-pink-2)",
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* New Entry Prompt / Form */}
        {!showForm && !editingId ? (
          <div className="nisu-card p-6 sm:p-7 mb-8 text-center">
            {journalingDoneToday && todayEntries.length > 0 ? (
              <>
                <span className="text-4xl block mb-3">✅</span>
                <p className="text-gray-700 font-semibold mb-1">
                  You already dumped today
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Want to dump again? Go for it.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="nisu-cta text-sm px-6 py-2.5 cursor-pointer"
                >
                  + Another Brain Dump
                </button>
              </>
            ) : (
              <>
                <span className="text-4xl block mb-3">🧠</span>
                <p className="text-gray-700 font-semibold mb-1">
                  Ready to clear your head?
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Answer 4 quick questions. Takes less than 5 minutes.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="nisu-cta text-sm px-6 py-2.5 cursor-pointer"
                >
                  Start Brain Dump
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="nisu-card p-5 sm:p-7 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">
                {editingId ? "Edit Brain Dump" : "Guided Brain Dump"}
              </h2>
              <span className="text-xs text-[var(--nisu-coral)] font-medium">
                ~5 min
              </span>
            </div>

            <div className="space-y-5">
              <FormField
                label="What is taking up the most space in your head?"
                value={mind}
                onChange={setMind}
                placeholder="Random thoughts, stress, ideas, worries, anything…"
                required
              />
              <FormField
                label="What do you need to do next?"
                value={nextAction}
                onChange={setNextAction}
                placeholder="One tiny next step…"
                required
              />
              <FormField
                label="What are you avoiding?"
                value={avoiding}
                onChange={setAvoiding}
                placeholder="The thing you keep pushing off…"
                required
              />
              <FormField
                label="What is one thing that went okay today?"
                value={goodThing}
                onChange={setGoodThing}
                placeholder="Something small that went okay…"
                required
              />
              <FormField
                label="Anything else you need to dump?"
                value={extraDump}
                onChange={setExtraDump}
                placeholder="Anything else…"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!canSubmit}
                className="nisu-cta text-sm px-6 py-2.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Save Brain Dump"}
              </button>
              <button
                onClick={clearForm}
                className="text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sticky Notes Section */}
        <div className="mb-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Image
              src={NISU_ASSETS.icons.journal}
              alt=""
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
            Your Sticky Notes
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-[var(--nisu-pale-pink-2)] border-t-[var(--nisu-coral)] rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="nisu-card p-10 text-center">
            <Image
              src={NISU_ASSETS.icons.journal}
              alt=""
              width={64}
              height={64}
              className="w-16 h-16 object-contain mx-auto mb-4 opacity-60"
            />
            <p className="text-gray-700 font-semibold text-lg mb-1">
              No sticky notes yet
            </p>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-1">
              Your first brain dump will show up here as a dated note.
            </p>
            <p className="text-gray-400 text-xs italic">
              Start with whatever is in your head right now.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today's entries */}
            {todayEntries.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[var(--nisu-coral)] uppercase tracking-wide mb-3">
                  Today
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todayEntries.map((entry) => (
                    <StickyNote
                      key={entry.id}
                      entry={entry}
                      colorClass={STICKY_NOTE_CLASS}
                      expanded={expandedId === entry.id}
                      onToggle={() =>
                        setExpandedId(
                          expandedId === entry.id ? null : entry.id
                        )
                      }
                      onEdit={() => startEdit(entry)}
                      onDelete={() => handleDelete(entry.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past entries */}
            {pastEntries.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Past Entries
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastEntries.map((entry) => (
                    <StickyNote
                      key={entry.id}
                      entry={entry}
                      colorClass={STICKY_NOTE_CLASS}
                      expanded={expandedId === entry.id}
                      onToggle={() =>
                        setExpandedId(
                          expandedId === entry.id ? null : entry.id
                        )
                      }
                      onEdit={() => startEdit(entry)}
                      onDelete={() => handleDelete(entry.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== FORM FIELD =====

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-[var(--nisu-coral)] ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--nisu-pale-pink-2)] text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--nisu-pink)] resize-none"
      />
    </div>
  );
}

// ===== STICKY NOTE =====

function StickyNote({
  entry,
  colorClass,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  colorClass: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`${colorClass} rounded-2xl shadow-md border p-5 flex flex-col transition-all duration-200`}
    >
      {/* Date */}
      <p className="text-xs text-gray-500 font-medium mb-3">
        {formatNoteDate(entry.created_at)}
      </p>

      {/* Preview (always visible) */}
      <div className="mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">
          Taking up space
        </p>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
          {entry.mind}
        </p>
      </div>

      {!expanded && (
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">
            Next
          </p>
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-1">
            {entry.next_action}
          </p>
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="space-y-3 mb-3">
          <NoteSection label="Next action" text={entry.next_action} />
          <NoteSection label="Avoiding" text={entry.avoiding} />
          <NoteSection label="Good thing" text={entry.good_thing} />
          {entry.extra_dump && (
            <NoteSection label="Extra dump" text={entry.extra_dump} />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-black/5">
        <button
          onClick={onToggle}
          className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
        >
          {expanded ? "Collapse" : "Open"}
        </button>
        <button
          onClick={onEdit}
          className="text-xs font-medium text-gray-700 px-3 py-1.5 rounded-lg hover:bg-[var(--nisu-pale-pink)] transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-medium text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function NoteSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
