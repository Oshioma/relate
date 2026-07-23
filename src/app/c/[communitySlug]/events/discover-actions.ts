"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { buildDiscoveredEventRows, type DiscoveredEventWithImage } from "@/lib/data/events";
import { discoverEventsWithAI, type DiscoveredEvent } from "@/lib/ai/discover-events";
import { scrapeWebsiteImages } from "@/lib/scrape-website-image";
import type { Community, Database } from "@/types/database";

const STAFF_ROLES = new Set(["owner", "admin", "moderator"]);

const DISCOVERY_ERRORS: Record<string, string> = {
  unconfigured: "AI discovery isn't configured — set a valid ANTHROPIC_API_KEY, then try again.",
  billing:
    "Your Anthropic account is out of API credit. Add funds at console.anthropic.com (Plans & Billing), then try again.",
  search_limited:
    "Anthropic rejected the web searches (rate limit on your account tier). Wait 5-10 minutes and try once — repeated rapid attempts keep the limit tripped.",
  error: "AI discovery hit a temporary error. Wait a minute and try again.",
};

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

// Best-effort: try to find a cover image for each discovered event from its
// source listing page, so events found by AI discovery show up with a photo
// instead of a blank placeholder. Never throws — a failed scrape just leaves
// that event without an image.
async function attachImages(events: DiscoveredEvent[]): Promise<DiscoveredEventWithImage[]> {
  return Promise.all(
    events.map(async (event) => {
      if (!event.source_url) return event;
      const images = await scrapeWebsiteImages(event.source_url);
      return { ...event, image_url: images[0] ?? null };
    }),
  );
}

// Searches the web for upcoming events near the community's location and
// adds every new one straight to the calendar — no staff review step. RLS
// (events_insert_staff) enforces the staff requirement on the insert too.
export async function discoverAndAddEvents(
  communitySlug: string,
): Promise<{ imported: number; titles: string[] } | { error: string }> {
  const ctx = await requireStaff(communitySlug);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, user, community } = ctx;

  const { data: upcoming, error } = await supabase
    .from("events")
    .select("title")
    .eq("community_id", community.id)
    .gte("start_time", new Date().toISOString());
  if (error) return { error: error.message };

  const existingTitles = (upcoming ?? []).map((e) => e.title);
  const locationName = community.location_name || community.name;

  const result = await discoverEventsWithAI({ locationName, existingTitles });
  if (result.status !== "ok") {
    // This panel is staff-only, so include the raw diagnostic — it saves a
    // round-trip through the hosting provider's logs.
    const detail = result.detail ? ` (detail: ${result.detail})` : "";
    return { error: DISCOVERY_ERRORS[result.status] + detail };
  }

  // Belt-and-braces dedupe in case the model ignored the skip list.
  const seen = new Set(existingTitles.map((t) => t.toLowerCase()));
  const found = result.events.filter((e) => !seen.has(e.title.toLowerCase()));
  if (found.length === 0) return { imported: 0, titles: [] };

  const withImages = await attachImages(found);
  const rows = buildDiscoveredEventRows(withImages, { communityId: community.id, createdBy: user.id });
  if (rows.length === 0) return { imported: 0, titles: [] };

  const { error: insertError } = await supabase.from("events").insert(rows);
  if (insertError) return { error: insertError.message };

  revalidatePath(`/c/${communitySlug}/events`);
  return { imported: rows.length, titles: rows.map((r) => r.title) };
}
