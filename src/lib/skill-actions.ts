import { createClient } from "@/utils/supabase/client";
import { getAuthUserId } from "./auth-helpers";
import type {
  SkillItem,
  SkillActivityLog,
  DailyWheelSelection,
} from "./types";

const supabase = () => createClient();

// ----- Skill Items -----

export async function fetchSkillItems(
  kind?: "main" | "wheel"
): Promise<SkillItem[]> {
  let query = supabase()
    .from("skill_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveSkillItems(
  kind?: "main" | "wheel"
): Promise<SkillItem[]> {
  let query = supabase()
    .from("skill_items")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createSkillItem(
  input: Pick<SkillItem, "kind" | "name" | "time" | "description" | "repeatable">
): Promise<SkillItem> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("skill_items")
    .insert({ ...input, active: true, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSkillItem(
  id: string,
  input: Partial<Pick<SkillItem, "name" | "time" | "description" | "repeatable">>
): Promise<SkillItem> {
  const { data, error } = await supabase()
    .from("skill_items")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSkillItem(id: string): Promise<void> {
  const { error } = await supabase().from("skill_items").delete().eq("id", id);
  if (error) throw error;
}

export async function setSkillItemActive(
  id: string,
  active: boolean
): Promise<void> {
  const { error } = await supabase()
    .from("skill_items")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ----- Skill Activity Log -----

export async function getTodaySkillLogs(
  dateKey: string
): Promise<SkillActivityLog[]> {
  const { data, error } = await supabase()
    .from("skill_activity_log")
    .select("*")
    .eq("date_key", dateKey)
    .order("completed_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function logSkillActivity(
  entry: Omit<SkillActivityLog, "id" | "completed_at" | "user_id">
): Promise<SkillActivityLog> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("skill_activity_log")
    .insert({ ...entry, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ----- Daily Wheel Selection -----

export async function getTodayWheelSelection(
  dateKey: string
): Promise<DailyWheelSelection | null> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("daily_wheel_selection")
    .select("*")
    .eq("date_key", dateKey)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function spinWheelForToday(
  dateKey: string
): Promise<DailyWheelSelection> {
  const existing = await getTodayWheelSelection(dateKey);
  if (existing) return existing;

  const activeItems = await fetchActiveSkillItems("wheel");
  if (activeItems.length === 0) {
    throw new Error("No active wheel skills available.");
  }

  const pick = activeItems[Math.floor(Math.random() * activeItems.length)];
  const userId = await getAuthUserId();

  const { data, error } = await supabase()
    .from("daily_wheel_selection")
    .insert({
      user_id: userId,
      date_key: dateKey,
      skill_item_id: pick.id,
      skill_name: pick.name,
      skill_time: pick.time,
      skill_description: pick.description,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markWheelSelectionComplete(
  id: string
): Promise<DailyWheelSelection> {
  const { data, error } = await supabase()
    .from("daily_wheel_selection")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ----- Dev Reset -----

export async function deleteTodaySkillData(dateKey: string): Promise<void> {
  const client = supabase();
  const { error: logErr } = await client
    .from("skill_activity_log")
    .delete()
    .eq("date_key", dateKey);
  if (logErr) throw logErr;
  const { error: wheelErr } = await client
    .from("daily_wheel_selection")
    .delete()
    .eq("date_key", dateKey);
  if (wheelErr) throw wheelErr;
}

// ----- Helpers -----

export async function markItemInactiveIfNonRepeatable(
  skillItemId: string
): Promise<void> {
  const { data } = await supabase()
    .from("skill_items")
    .select("repeatable")
    .eq("id", skillItemId)
    .maybeSingle();
  if (data && !data.repeatable) {
    await setSkillItemActive(skillItemId, false);
  }
}
