import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LiveSession, LiveSessionRsvp, LiveSessionInvite, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

// A live session together with the staff member who started it, for the card.
export type LiveSessionWithStarter = LiveSession & { starter: Profile | null };

// Every session in a 'live' space, newest first. RLS (live_sessions_select)
// already restricts this to viewers who can see the space, so no extra gating
// is needed here.
export async function getSpaceLiveSessions(supabase: Client, spaceId: string): Promise<LiveSessionWithStarter[]> {
  const { data, error } = await supabase
    .from("live_sessions")
    .select("*, starter:started_by (*)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as LiveSessionWithStarter[];
}

// The session that's live right now in a community (if any), with the slug of
// the space hosting it so the header "Live now" badge can deep-link to it. RLS
// (live_sessions_select → can_view_space) means a viewer only sees a session in
// a space they're allowed into, so this is safe to call for anyone. If more
// than one space is live at once, the most recently started wins.
export type CommunityLiveSession = { id: string; title: string; spaceSlug: string };

export async function getCommunityLiveSession(
  supabase: Client,
  communityId: string
): Promise<CommunityLiveSession | null> {
  const { data, error } = await supabase
    .from("live_sessions")
    .select("id, title, space:space_id (slug)")
    .eq("community_id", communityId)
    .eq("status", "live")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const space = (data as unknown as { space: { slug: string } | null }).space;
  if (!space?.slug) return null;
  return { id: data.id, title: data.title, spaceSlug: space.slug };
}

// Splits sessions into the single active one (if any), the upcoming scheduled
// ones (soonest first), and the ended history.
export function splitLiveSessions(sessions: LiveSessionWithStarter[]) {
  const active = sessions.find((s) => s.status === "live") ?? null;
  const scheduled = sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => {
      const ta = a.scheduled_start ? new Date(a.scheduled_start).getTime() : Infinity;
      const tb = b.scheduled_start ? new Date(b.scheduled_start).getTime() : Infinity;
      return ta - tb;
    });
  const past = sessions.filter((s) => s.status === "ended");
  return { active, scheduled, past };
}

export type LiveRsvpWithAttendee = LiveSessionRsvp & { attendee: Profile | null };

// RSVPs for a set of scheduled sessions, for the "X going" row and the viewer's
// own going state. Returns [] fast when there are no sessions to look up.
export async function getLiveSessionRsvps(supabase: Client, sessionIds: string[]): Promise<LiveRsvpWithAttendee[]> {
  if (sessionIds.length === 0) return [];

  const { data, error } = await supabase
    .from("live_session_rsvps")
    .select("*, attendee:user_id (*)")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as LiveRsvpWithAttendee[];
}

export function groupRsvpsBySession(rsvps: LiveRsvpWithAttendee[]): Map<string, LiveRsvpWithAttendee[]> {
  const map = new Map<string, LiveRsvpWithAttendee[]>();
  for (const rsvp of rsvps) {
    const list = map.get(rsvp.session_id) ?? [];
    list.push(rsvp);
    map.set(rsvp.session_id, list);
  }
  return map;
}

export type LiveInviteWithMember = LiveSessionInvite & { invitee: Profile | null };

// Hand-picked invites for a set of sessions, for the "invited" row on the card
// and to pre-tick already-invited members in the picker. RLS
// (live_session_invites_select) limits rows to the invitee and staff, so a
// plain member only ever sees their own invite here. Returns [] fast when
// there's nothing to look up.
export async function getLiveSessionInvites(supabase: Client, sessionIds: string[]): Promise<LiveInviteWithMember[]> {
  if (sessionIds.length === 0) return [];

  const { data, error } = await supabase
    .from("live_session_invites")
    .select("*, invitee:user_id (*)")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as LiveInviteWithMember[];
}

export function groupInvitesBySession(invites: LiveInviteWithMember[]): Map<string, LiveInviteWithMember[]> {
  const map = new Map<string, LiveInviteWithMember[]>();
  for (const invite of invites) {
    const list = map.get(invite.session_id) ?? [];
    list.push(invite);
    map.set(invite.session_id, list);
  }
  return map;
}
