import { createClient } from "@/utils/supabase/client";
import { getAuthUserId } from "./auth-helpers";
import {
  getPartnerEmailFromConfig,
  normalizeEmail,
} from "./couple-profile";

const supabase = () => createClient();

export interface StreakDashboard {
  yourStreak: number;
  partnerStreak: number;
  togetherCount: number;
  togetherStreak: number;
  yourSuccessDates: string[];
  partnerSuccessDates: string[];
}

export async function registerCoupleMember(email: string): Promise<void> {
  const userId = await getAuthUserId();
  const normalized = normalizeEmail(email);
  const { error } = await supabase()
    .from("nisu_couple_members")
    .upsert(
      {
        user_id: userId,
        email: normalized,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  if (error) throw error;
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data } = await supabase()
    .from("nisu_couple_members")
    .select("user_id")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  return data?.user_id ?? null;
}

/** Partner id from config email, or the other row in nisu_couple_members */
async function resolvePartnerUserId(
  userId: string,
  userEmail: string | undefined
): Promise<string | null> {
  const partnerEmail = getPartnerEmailFromConfig(userEmail);
  if (partnerEmail) {
    const id = await getUserIdByEmail(partnerEmail);
    if (id) return id;
  }

  const { data, error } = await supabase()
    .from("nisu_couple_members")
    .select("user_id")
    .neq("user_id", userId)
    .limit(1);

  if (error) throw error;
  return data?.[0]?.user_id ?? null;
}

export async function syncDayStreak(
  dateKey: string,
  pillarsCompleted: number
): Promise<void> {
  const userId = await getAuthUserId();
  const { error } = await supabase().rpc("sync_user_streak", {
    p_user_id: userId,
    p_date_key: dateKey,
    p_pillars_completed: pillarsCompleted,
  });
  if (error) throw error;
}

async function getUserStreak(userId: string): Promise<number> {
  const { data } = await supabase()
    .from("user_streak_stats")
    .select("current_streak")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.current_streak ?? 0;
}

async function getSuccessDates(userId: string): Promise<string[]> {
  const { data } = await supabase()
    .from("daily_streak_days")
    .select("date_key")
    .eq("user_id", userId)
    .eq("day_success", true)
    .order("date_key", { ascending: true });
  return (data ?? []).map((r) => r.date_key as string);
}

export async function fetchStreakDashboard(
  userEmail: string | undefined
): Promise<StreakDashboard> {
  const userId = await getAuthUserId();
  const partnerId = await resolvePartnerUserId(userId, userEmail);

  const [yourStats, partnerStreak, coupleRow, yourDates, partnerDates] =
    await Promise.all([
      supabase()
        .from("user_streak_stats")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      partnerId ? getUserStreak(partnerId) : Promise.resolve(0),
      supabase().from("couple_streak_stats").select("*").eq("id", 1).maybeSingle(),
      getSuccessDates(userId),
      partnerId ? getSuccessDates(partnerId) : Promise.resolve([]),
    ]);

  if (yourStats.error) throw yourStats.error;
  if (coupleRow.error) throw coupleRow.error;

  const couple = coupleRow.data;

  return {
    yourStreak: yourStats.data?.current_streak ?? 0,
    partnerStreak,
    togetherCount: couple?.together_count ?? 0,
    togetherStreak: couple?.together_streak ?? 0,
    yourSuccessDates: yourDates,
    partnerSuccessDates: partnerDates,
  };
}
