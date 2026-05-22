import { createClient } from "@/utils/supabase/client";
import { getAuthUserId } from "./auth-helpers";
import type { JournalEntry } from "./types";

const supabase = () => createClient();

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase()
    .from("journal_entries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createJournalEntry(input: {
  date_key: string;
  mind: string;
  next_action: string;
  avoiding: string;
  good_thing: string;
  extra_dump: string | null;
}): Promise<JournalEntry> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase()
    .from("journal_entries")
    .insert({ ...input, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateJournalEntry(
  id: string,
  input: {
    mind: string;
    next_action: string;
    avoiding: string;
    good_thing: string;
    extra_dump: string | null;
  }
): Promise<JournalEntry> {
  const { data, error } = await supabase()
    .from("journal_entries")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase()
    .from("journal_entries")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
