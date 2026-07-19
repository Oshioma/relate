import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Event } from "@/types/database";

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

export function splitUpcomingPast(events: Event[]) {
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.start_time).getTime() >= now);
  const past = events
    .filter((e) => new Date(e.start_time).getTime() < now)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  return { upcoming, past };
}
