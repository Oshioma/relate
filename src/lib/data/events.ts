import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Event, EventRsvp, Profile } from "@/types/database";
import type { DiscoveredEvent } from "@/lib/ai/discover-events";

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

export type EventRsvpWithEvent = EventRsvp & { event: Event };

// Every event a member has RSVPed to within a community, for the Growth
// Journey timeline. `!inner` makes the embedded `event` filterable — it
// turns the left join into an inner join so `.eq("event.community_id", …)`
// actually restricts rows instead of being silently ignored by PostgREST.
export async function getMemberEventAttendance(supabase: Client, communityId: string, userId: string): Promise<EventRsvpWithEvent[]> {
  const { data, error } = await supabase
    .from("event_rsvps")
    .select("*, event:event_id!inner (*)")
    .eq("user_id", userId)
    .eq("event.community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as EventRsvpWithEvent[];
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

// Shapes AI-discovered event candidates into rows ready for insertion into
// public.events, dropping anything without a title or parseable start time.
// Shared by the staff-facing import action and the scheduled cron import.
export function buildDiscoveredEventRows(
  events: DiscoveredEvent[],
  opts: { communityId: string; createdBy: string; max?: number },
) {
  return events
    .filter((e) => e.title?.trim() && !Number.isNaN(Date.parse(e.start_time)))
    .slice(0, opts.max ?? 20)
    .map((e) => {
      const startTime = new Date(e.start_time).toISOString();
      const endMs = e.end_time ? Date.parse(e.end_time) : NaN;
      const endTime = !Number.isNaN(endMs) && endMs > Date.parse(startTime) ? new Date(endMs).toISOString() : null;
      const description = [e.description?.trim(), e.source_url ? `Source: ${e.source_url}` : null]
        .filter(Boolean)
        .join("\n\n");

      return {
        community_id: opts.communityId,
        title: e.title.trim().slice(0, 200),
        description: description || null,
        start_time: startTime,
        end_time: endTime,
        location: e.location?.trim().slice(0, 300) || null,
        online_url: null,
        created_by: opts.createdBy,
      };
    });
}

export function splitUpcomingPast(events: Event[]) {
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.start_time).getTime() >= now);
  const past = events
    .filter((e) => new Date(e.start_time).getTime() < now)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  return { upcoming, past };
}
