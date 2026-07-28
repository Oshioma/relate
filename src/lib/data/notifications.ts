import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Notification, NotificationType, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type NotificationWithActor = Notification & { actor: Profile | null };

// The notification types a member can receive an email copy of. Order here is
// the order the settings toggles render in.
export const EMAILABLE_NOTIFICATION_TYPES: NotificationType[] = ["comment", "post", "membership", "claim"];

export type NotificationEmailPrefs = Record<NotificationType, boolean>;

// Per-type email preference for a member. Opt-out: a missing row means enabled,
// so the default is every type on.
export async function getNotificationEmailPrefs(supabase: Client, userId: string): Promise<NotificationEmailPrefs> {
  const { data, error } = await supabase
    .from("notification_email_preferences")
    .select("type, enabled")
    .eq("user_id", userId);
  if (error) throw error;

  const prefs = { comment: true, post: true, membership: true, claim: true } as NotificationEmailPrefs;
  for (const row of data ?? []) prefs[row.type] = row.enabled;
  return prefs;
}

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
