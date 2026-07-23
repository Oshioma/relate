"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { buildDiscoveredEventRows, type DiscoveredEventWithImage } from "@/lib/data/events";
import { discoverEventsWithAI, type DiscoveredEvent } from "@/lib/ai/discover-events";
import { scrapeWebsiteImages } from "@/lib/scrape-website-image";
import type { Community, Database } from "@/types/database";

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

async function requireOwner(communitySlug: string): Promise<StaffContext | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "Community not found." };

  const membership = await getMembership(supabase, community.id, user.id);
  if (!membership || membership.status !== "active" || membership.role !== "owner") {
    return { error: "Only the community owner can discover and add events." };
  }

  return { supabase, user, community };
}

// Best-effort: try to find a cover image for each discovered event from its
// source listing page, so events found by AI discovery show up with a photo
// instead of a blank placeholder. Never throws — a failed scrape just leaves
// that event without an image.
//
// Many listing sites share one og:image (a site logo or banner) across every
// page, so naively taking the first candidate gives every event from that
// site the same picture. `usedImages` is shared across the whole batch (and
// seeded with the community's existing image_urls) so each event gets the
// first candidate that isn't already claimed, falling back to no image
// rather than a duplicate.
async function attachImages(events: DiscoveredEvent[], usedImages: Set<string>): Promise<DiscoveredEventWithImage[]> {
  const candidateLists = await Promise.all(
    events.map((event) => (event.source_url ? scrapeWebsiteImages(event.source_url) : Promise.resolve([]))),
  );

  return events.map((event, i) => {
    const unique = candidateLists[i].find((img) => !usedImages.has(img)) ?? null;
    if (unique) usedImages.add(unique);
    return { ...event, image_url: unique };
  });
}

// buildDiscoveredEventRows appends "Source: <url>" to the description, so
// events imported before image_url existed can still be traced back to a
// page worth scraping.
const SOURCE_LINE = /Source:\s*(https?:\/\/\S+)/i;

function candidateImageUrl(event: { description: string | null; online_url: string | null }): string | null {
  const fromDescription = event.description?.match(SOURCE_LINE)?.[1];
  return fromDescription ?? event.online_url ?? null;
}

// Finds this community's events that have no image yet but do have a
// traceable source or online link, and best-effort scrapes one for each.
// For events discovered before this feature existed, or added without a
// picture. Never fails the whole run over one bad page — a scrape that
// finds nothing just leaves that event as-is.
export async function backfillEventImages(
  communitySlug: string,
): Promise<{ updated: number; checked: number } | { error: string }> {
  const ctx = await requireOwner(communitySlug);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, community } = ctx;

  const [{ data: events, error }, { data: imaged, error: imagedError }] = await Promise.all([
    supabase.from("events").select("id, description, online_url").eq("community_id", community.id).is("image_url", null),
    supabase.from("events").select("image_url").eq("community_id", community.id).not("image_url", "is", null),
  ]);
  if (error) return { error: error.message };
  if (imagedError) return { error: imagedError.message };

  const candidates = (events ?? [])
    .map((event) => ({ id: event.id, url: candidateImageUrl(event) }))
    .filter((e): e is { id: string; url: string } => e.url !== null);
  if (candidates.length === 0) return { updated: 0, checked: events?.length ?? 0 };

  // Seeded with images already in use on this community's calendar so a
  // backfilled event never duplicates a picture another event already has.
  const usedImages = new Set((imaged ?? []).map((e) => e.image_url).filter((url): url is string => url !== null));
  const candidateLists = await Promise.all(candidates.map(({ url }) => scrapeWebsiteImages(url)));

  let updated = 0;
  for (let i = 0; i < candidates.length; i++) {
    const unique = candidateLists[i].find((img) => !usedImages.has(img));
    if (!unique) continue;
    usedImages.add(unique);
    const { error: updateError } = await supabase.from("events").update({ image_url: unique }).eq("id", candidates[i].id);
    if (!updateError) updated++;
  }

  if (updated > 0) revalidatePath(`/c/${communitySlug}/events`);
  return { updated, checked: events?.length ?? 0 };
}

export type AddedEvent = { title: string; source_url: string | null };

// Searches the web for upcoming events near the community's location and
// adds every new one straight to the calendar — no staff review step. RLS
// (events_insert_staff) enforces the staff requirement on the insert too.
export async function discoverAndAddEvents(
  communitySlug: string,
): Promise<{ imported: number; added: AddedEvent[] } | { error: string }> {
  const ctx = await requireOwner(communitySlug);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, user, community } = ctx;

  const [{ data: upcoming, error }, { data: imaged, error: imagedError }] = await Promise.all([
    supabase
      .from("events")
      .select("title")
      .eq("community_id", community.id)
      .gte("start_time", new Date().toISOString()),
    supabase.from("events").select("image_url").eq("community_id", community.id).not("image_url", "is", null),
  ]);
  if (error) return { error: error.message };
  if (imagedError) return { error: imagedError.message };

  const existingTitles = (upcoming ?? []).map((e) => e.title);
  const locationName = community.location_name || community.name;

  const result = await discoverEventsWithAI({ locationName, existingTitles });
  if (result.status !== "ok") {
    // This panel is owner-only, so include the raw diagnostic — it saves a
    // round-trip through the hosting provider's logs.
    const detail = result.detail ? ` (detail: ${result.detail})` : "";
    return { error: DISCOVERY_ERRORS[result.status] + detail };
  }

  // Belt-and-braces dedupe in case the model ignored the skip list.
  const seen = new Set(existingTitles.map((t) => t.toLowerCase()));
  const found = result.events.filter((e) => !seen.has(e.title.toLowerCase()));
  if (found.length === 0) return { imported: 0, added: [] };

  // Seeded with images already on this community's calendar so a freshly
  // discovered event never duplicates a picture another event already has.
  const usedImages = new Set((imaged ?? []).map((e) => e.image_url).filter((url): url is string => url !== null));
  const withImages = await attachImages(found, usedImages);
  const rows = buildDiscoveredEventRows(withImages, { communityId: community.id, createdBy: user.id });
  if (rows.length === 0) return { imported: 0, added: [] };

  const { error: insertError } = await supabase.from("events").insert(rows);
  if (insertError) return { error: insertError.message };

  revalidatePath(`/c/${communitySlug}/events`);
  return {
    imported: rows.length,
    added: rows.map((r) => ({ title: r.title, source_url: r.description?.match(SOURCE_LINE)?.[1] ?? null })),
  };
}
