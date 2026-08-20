import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Meetup, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type MeetupWithContext = Meetup & { host: Profile; space: Pick<Space, "id" | "name" | "slug"> };

// The meetups a community feed card should show: what's on now or coming up,
// soonest first — not the newest rows. A meetup posted an hour ago for tomorrow
// morning matters less than one starting in twenty minutes.
export async function getCommunityUpcomingMeetups(supabase: Client, communityId: string, limit = 6): Promise<MeetupWithContext[]> {
  // Reach back far enough to keep a meetup that's currently underway (see
  // MEETUP_DEFAULT_DURATION_MINUTES); the caller drops anything already over.
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("meetups")
    .select("*, host:created_by (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .eq("status", "open")
    .gte("starts_at", since)
    .order("starts_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as MeetupWithContext[];
}

export type MeetupWithGoing = {
  meetup: Meetup;
  host: Profile | null;
  going: Profile[];
  goingCount: number;
  viewerGoing: boolean;
};

// Every meetup in a space, soonest first, each with who's coming. Past meetups
// are kept (the view shelves them under "Recent") — an activity community's
// history of walks done together is half the reason people join.
export async function getSpaceMeetups(supabase: Client, spaceId: string, viewerId: string): Promise<MeetupWithGoing[]> {
  const { data: meetups, error } = await supabase
    .from("meetups")
    .select("*, host:created_by (*)")
    .eq("space_id", spaceId)
    .order("starts_at", { ascending: true });

  if (error) throw error;
  if (!meetups || meetups.length === 0) return [];

  const meetupIds = meetups.map((m) => m.id);

  const { data: participants, error: participantsError } = await supabase
    .from("meetup_participants")
    .select("meetup_id, user_id, profile:user_id (*)")
    .in("meetup_id", meetupIds)
    .order("joined_at", { ascending: true });

  if (participantsError) throw participantsError;

  const byMeetupId = new Map<string, { profile: Profile; userId: string }[]>();
  for (const row of participants ?? []) {
    const list = byMeetupId.get(row.meetup_id) ?? [];
    if (row.profile) list.push({ profile: row.profile as unknown as Profile, userId: row.user_id });
    byMeetupId.set(row.meetup_id, list);
  }

  return meetups.map((row) => {
    const { host, ...meetup } = row as typeof row & { host: Profile | null };
    const going = byMeetupId.get(meetup.id) ?? [];
    return {
      meetup: meetup as Meetup,
      host: host ?? null,
      going: going.map((g) => g.profile),
      goingCount: going.length,
      viewerGoing: going.some((g) => g.userId === viewerId),
    };
  });
}

// How many people are already coming, read fresh — the capacity check in
// joinMeetup runs against this rather than the page's snapshot.
export async function countMeetupParticipants(supabase: Client, meetupId: string): Promise<number> {
  const { count, error } = await supabase
    .from("meetup_participants")
    .select("id", { count: "exact", head: true })
    .eq("meetup_id", meetupId);

  if (error) throw error;
  return count ?? 0;
}
