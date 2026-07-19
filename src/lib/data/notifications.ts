import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Notification, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type NotificationWithActor = Notification & { actor: Profile | null };

export async function getNotifications(supabase: Client, userId: string, limit = 50): Promise<NotificationWithActor[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*, actor:actor_id (*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as NotificationWithActor[];
}

export async function getUnreadNotificationCount(supabase: Client, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
  return count ?? 0;
}
