import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Event, EventRsvp, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCommunityEvents(supabase: Client, communityId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("community_id", communityId)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type EventRsvpWithAttendee = EventRsvp & { attendee: Profile };

export async function getRsvpsForEvents(supabase: Client, eventIds: string[]): Promise<EventRsvpWithAttendee[]> {
  if (eventIds.length === 0) return [];

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("*, attendee:user_id (*)")
    .in("event_id", eventIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as EventRsvpWithAttendee[];
}

export function groupRsvpsByEvent(rsvps: EventRsvpWithAttendee[]): Map<string, EventRsvpWithAttendee[]> {
  const map = new Map<string, EventRsvpWithAttendee[]>();
  for (const rsvp of rsvps) {
    const list = map.get(rsvp.event_id) ?? [];
    list.push(rsvp);
    map.set(rsvp.event_id, list);
  }
  return map;
}

export function splitUpcomingPast(events: Event[]) {
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.start_time).getTime() >= now);
  const past = events
    .filter((e) => new Date(e.start_time).getTime() < now)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  return { upcoming, past };
}
