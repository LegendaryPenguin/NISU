import { createClient } from "@/utils/supabase/client";
import { getAuthUserId } from "./auth-helpers";
import { getPartnerEmail } from "./streak-config";

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
  const { error } = await supabase()
    .from("nisu_couple_members")
    .upsert(
      { user_id: userId, email: email.toLowerCase(), updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) throw error;
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data } = await supabase()
    .from("nisu_couple_members")
    .select("user_id")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return data?.user_id ?? null;
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
  const partnerEmail = getPartnerEmail(userEmail);
  const partnerId = partnerEmail
    ? await getUserIdByEmail(partnerEmail)
    : null;

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
