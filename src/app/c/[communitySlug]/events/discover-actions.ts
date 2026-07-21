"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { buildDiscoveredEventRows } from "@/lib/data/events";
import { discoverEventsWithAI, type DiscoveredEvent } from "@/lib/ai/discover-events";
import type { Community, Database } from "@/types/database";

const STAFF_ROLES = new Set(["owner", "admin", "moderator"]);

type StaffContext = {
  supabase: SupabaseClient<Database>;
  user: User;
  community: Community;
};

async function requireStaff(communitySlug: string): Promise<StaffContext | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "Community not found." };

  const membership = await getMembership(supabase, community.id, user.id);
  if (!membership || membership.status !== "active" || !STAFF_ROLES.has(membership.role)) {
    return { error: "Only community staff can discover and add events." };
  }

  return { supabase, user, community };
}

// Asks the AI to web-search for upcoming events near the community's
// location and returns candidates for staff review — nothing is saved yet.
export async function discoverEvents(
  communitySlug: string,
): Promise<{ events: DiscoveredEvent[] } | { error: string }> {
  const ctx = await requireStaff(communitySlug);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, community } = ctx;

  const { data: upcoming, error } = await supabase
    .from("events")
    .select("title")
    .eq("community_id", community.id)
    .gte("start_time", new Date().toISOString());
  if (error) return { error: error.message };

  const existingTitles = (upcoming ?? []).map((e) => e.title);
  const locationName = community.location_name || community.name;

  const found = await discoverEventsWithAI({ locationName, existingTitles });
  if (found === null) {
    return {
      error: "AI discovery is unavailable right now. Check that ANTHROPIC_API_KEY is configured, then try again.",
    };
  }

  // Belt-and-braces dedupe in case the model ignored the skip list.
  const seen = new Set(existingTitles.map((t) => t.toLowerCase()));
  return { events: found.filter((e) => !seen.has(e.title.toLowerCase())) };
}

// Inserts the staff-approved subset of discovered events. RLS
// (events_insert_staff) enforces the staff requirement on each row too.
export async function importDiscoveredEvents(
  communitySlug: string,
  events: DiscoveredEvent[],
): Promise<{ imported: number } | { error: string }> {
  const ctx = await requireStaff(communitySlug);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, user, community } = ctx;

  const rows = buildDiscoveredEventRows(events, { communityId: community.id, createdBy: user.id });

  if (rows.length === 0) return { error: "No valid events selected." };

  const { error } = await supabase.from("events").insert(rows);
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/events`);
  return { imported: rows.length };
}
