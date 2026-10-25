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
export type CommunityLiveSession = {
  id: string;
  title: string;
  spaceSlug: string;
  description: string | null;
  imageUrl: string | null;
  startedBy: string | null;
  starterName: string | null;
  starterAvatarUrl: string | null;
};

export async function getCommunityLiveSession(
  supabase: Client,
  communityId: string
): Promise<CommunityLiveSession | null> {
  const { data, error } = await supabase
    .from("live_sessions")
    .select("id, title, description, image_url, started_by, space:space_id (slug), starter:started_by (full_name, username, avatar_url)")
    .eq("community_id", communityId)
    .eq("status", "live")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    started_by: string | null;
    space: { slug: string } | null;
    starter: { full_name: string | null; username: string; avatar_url: string | null } | null;
  };
  if (!row.space?.slug) return null;
  return {
    id: row.id,
    title: row.title,
    spaceSlug: row.space.slug,
    description: row.description,
    imageUrl: row.image_url,
    startedBy: row.started_by,
    starterName: row.starter ? row.starter.full_name || row.starter.username : null,
    starterAvatarUrl: row.starter?.avatar_url ?? null,
  };
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

// A scheduled live session for the community home page's "Upcoming events"
// card, with the space it's in so the card can link there.
export type UpcomingLiveSession = Pick<LiveSession, "id" | "title" | "scheduled_start" | "scheduled_end" | "image_url"> & {
  space: { slug: string; name: string };
};

// The next few scheduled live sessions across a community, soonest first. RLS
// (live_sessions_select → can_view_space) limits it to spaces the viewer may
// see. One due within the last hour that hasn't gone live yet still counts —
// the reminder job treats it as current for that long too.
export async function getUpcomingCommunityLiveSessions(
  supabase: Client,
  communityId: string,
  limit = 4
): Promise<UpcomingLiveSession[]> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("live_sessions")
    .select("id, title, scheduled_start, scheduled_end, image_url, space:space_id (slug, name)")
    .eq("community_id", communityId)
    .eq("status", "scheduled")
    .gte("scheduled_start", since)
    .order("scheduled_start", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return ((data ?? []) as unknown as (UpcomingLiveSession & { space: UpcomingLiveSession["space"] | null })[]).filter(
    (s): s is UpcomingLiveSession => Boolean(s.space?.slug)
  );
}
