"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { SkillItem } from "@/lib/types";
import {
  fetchSkillItems,
  createSkillItem,
  updateSkillItem,
  deleteSkillItem,
  setSkillItemActive,
} from "@/lib/skill-actions";

type FormMode = "idle" | "create" | "edit";

interface FormState {
  name: string;
  time: string;
  description: string;
  repeatable: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  time: "",
  description: "",
  repeatable: true,
};

export default function SkillManagementPage() {
  const [items, setItems] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [formMode, setFormMode] = useState<FormMode>("idle");
  const [formKind, setFormKind] = useState<"main" | "wheel">("main");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const mainItems = items.filter((i) => i.kind === "main");
  const wheelItems = items.filter((i) => i.kind === "wheel");

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSkillItems();
      setItems(data);
    } catch {
      setError("Failed to load skill items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const resetForm = () => {
    setFormMode("idle");
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const startCreate = (kind: "main" | "wheel") => {
    setFormMode("create");
    setFormKind(kind);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const startEdit = (item: SkillItem) => {
    setFormMode("edit");
    setFormKind(item.kind);
    setEditingId(item.id);
    setForm({
      name: item.name,
      time: item.time,
      description: item.description,
      repeatable: item.repeatable,
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.time.trim() || !form.description.trim())
      return;
    setSaving(true);
    setError(null);
    try {
      if (formMode === "create") {
        await createSkillItem({
          kind: formKind,
          name: form.name.trim(),
          time: form.time.trim(),
          description: form.description.trim(),
          repeatable: form.repeatable,
        });
      } else if (editingId) {
        await updateSkillItem(editingId, {
          name: form.name.trim(),
          time: form.time.trim(),
          description: form.description.trim(),
          repeatable: form.repeatable,
        });
      }
      await loadItems();
      resetForm();
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await deleteSkillItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete.");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setError(null);
    try {
      await setSkillItemActive(id, active);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, active } : i))
      );
    } catch {
      setError("Failed to update.");
    }
  };

  const formTitle =
    formMode === "create"
      ? `Add ${formKind === "main" ? "Main" : "Wheel"} Skill`
      : `Edit ${formKind === "main" ? "Main" : "Wheel"} Skill`;

  return (
    <div className="min-h-screen pb-28 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🧠</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Skills
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Manage your main skills and random wheel challenges.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <Link
          href="/daily"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Daily Routine
        </Link>

        {/* Create / Edit Form */}
        {formMode !== "idle" && (
          <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg mb-4">
              {formTitle}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Coding Practice"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, time: e.target.value }))
                  }
                  placeholder="e.g. 30 min"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="What does this involve?"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.repeatable}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, repeatable: e.target.checked }))
                  }
                  className="w-4 h-4 accent-violet-500"
                />
                <span className="text-sm text-gray-700">
                  Repeatable{" "}
                  <span className="text-xs text-gray-400">
                    (can be completed on multiple days)
                  </span>
                </span>
              </label>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !form.name.trim() ||
                  !form.time.trim() ||
                  !form.description.trim()
                }
                className="bg-violet-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : formMode === "create" ? "Add Skill" : "Save Changes"}
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Main Skills Section */}
            <SkillSection
              title="Main Skills"
              emoji="📚"
              description="Intentional skills you want to practice regularly."
              items={mainItems}
              onAdd={() => startCreate("main")}
              onEdit={startEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              formMode={formMode}
            />

            {/* Wheel Skills Section */}
            <SkillSection
              title="Wheel Skills"
              emoji="🎲"
              description="Random challenge-style activities for the skill wheel."
              items={wheelItems}
              onAdd={() => startCreate("wheel")}
              onEdit={startEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              formMode={formMode}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SkillSection({
  title,
  emoji,
  description,
  items,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  formMode,
}: {
  title: string;
  emoji: string;
  description: string;
  items: SkillItem[];
  onAdd: () => void;
  onEdit: (item: SkillItem) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  formMode: FormMode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">
            {emoji} {title}
          </h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
        {formMode === "idle" && (
          <button
            onClick={onAdd}
            className="bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-600 transition-colors cursor-pointer"
          >
            + Add
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            No {title.toLowerCase()} yet.
          </p>
          {formMode === "idle" && (
            <button
              onClick={onAdd}
              className="mt-2 text-xs font-semibold text-violet-500 hover:text-violet-700 cursor-pointer"
            >
              + Add your first one
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                item.active ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {item.name}
                    </h3>
                    {!item.active && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                    {item.repeatable && (
                      <span className="text-[10px] font-bold text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded">
                        Repeatable
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {item.time} · {item.description}
                  </p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-xs font-medium text-violet-500 px-2.5 py-1.5 rounded-lg hover:bg-violet-50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onToggleActive(item.id, !item.active)
                    }
                    className="text-xs font-medium text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {item.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.name)}
                    className="text-xs font-medium text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
