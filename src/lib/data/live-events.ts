import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LiveSession, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

// A live session together with the staff member who started it, for the card.
export type LiveSessionWithStarter = LiveSession & { starter: Profile | null };

// Every session in a 'live' space, newest first. The currently-running one (if
// any) has status 'live'; the rest are 'ended' history. RLS
// (live_sessions_select) already restricts this to viewers who can see the
// space, so no extra gating is needed here.
export async function getSpaceLiveSessions(supabase: Client, spaceId: string): Promise<LiveSessionWithStarter[]> {
  const { data, error } = await supabase
    .from("live_sessions")
    .select("*, starter:started_by (*)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as LiveSessionWithStarter[];
}

// Splits sessions into the single active one (if any) and the ended history.
export function splitLiveSessions(sessions: LiveSessionWithStarter[]) {
  const active = sessions.find((s) => s.status === "live") ?? null;
  const past = sessions.filter((s) => s.status === "ended");
  return { active, past };
}
