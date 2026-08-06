import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Notification, NotificationType, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type NotificationWithActor = Notification & { actor: Profile | null };

// The notification types a member can receive an email copy of. Order here is
// the order the settings toggles render in.
export const EMAILABLE_NOTIFICATION_TYPES: NotificationType[] = ["comment", "post", "membership", "claim", "live_event", "live_started", "live_reminder", "live_invite", "member_message", "direct_message"];

export type NotificationEmailPrefs = Record<NotificationType, boolean>;

// Default email preference per type when the member has no explicit row.
// 'post' is opt-in (a new post reaches every member, so emailing all of them by
// default is noisy); everything else is opt-out. Mirrors the effective-default
// logic in the email_notification() trigger — keep the two in sync.
export const DEFAULT_NOTIFICATION_EMAIL_PREFS: NotificationEmailPrefs = {
  comment: true,
  post: false,
  membership: true,
  claim: true,
  live_event: true,
  live_started: true,
  live_reminder: true,
  live_invite: true,
  member_message: true,
  contact: true,
  direct_message: true,
};

// Per-type email preference for a member, with the per-type defaults applied for
// any type they haven't explicitly set.
export async function getNotificationEmailPrefs(supabase: Client, userId: string): Promise<NotificationEmailPrefs> {
  const { data, error } = await supabase
    .from("notification_email_preferences")
    .select("type, enabled")
    .eq("user_id", userId);
  if (error) throw error;

  const prefs = { ...DEFAULT_NOTIFICATION_EMAIL_PREFS };
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
