import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDiscoveredEventRows, type DiscoveredEventWithImage } from "@/lib/data/events";
import { discoverEventsWithAI, type DiscoveredEvent } from "@/lib/ai/discover-events";
import { scrapeWebsiteImages } from "@/lib/scrape-website-image";
import type { Community, Database } from "@/types/database";
import { checkAiAllowance } from "@/lib/usage/ai-spend";
import { meteredFor } from "@/lib/usage/ai-meter";

// AI event discovery, shared by the staff "Discover events" button and the
// weekly Supabase cron run (/api/events/discover-weekly). The caller decides
// who is acting and which client to use; this does the search, dedupe,
// image-matching and insert.

const DISCOVERY_ERRORS: Record<string, string> = {
  unconfigured: "AI discovery isn't configured — set a valid ANTHROPIC_API_KEY, then try again.",
  billing:
    "Your Anthropic account is out of API credit. Add funds at console.anthropic.com (Plans & Billing), then try again.",
  search_limited:
    "Anthropic rejected the web searches (rate limit on your account tier). Wait 5-10 minutes and try once — repeated rapid attempts keep the limit tripped.",
  error: "AI discovery hit a temporary error. Wait a minute and try again.",
};

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
export const SOURCE_LINE = /Source:\s*(https?:\/\/\S+)/i;

export type AddedEvent = { title: string; source_url: string | null };

// Searches the web for upcoming events near the community's location and
// adds every new one straight to the calendar — no staff review step.
// `actorId` is charged for the AI spend and recorded as the events' creator.
export async function runEventDiscovery(
  supabase: SupabaseClient<Database>,
  community: Pick<Community, "id" | "name" | "location_name">,
  actorId: string,
): Promise<{ imported: number; added: AddedEvent[] } | { error: string }> {
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

  const allowance = await checkAiAllowance(community.id, actorId);
  if (!allowance.allowed) return { error: allowance.message };

  const result = await meteredFor({ communityId: community.id, userId: actorId }, () =>
    discoverEventsWithAI({ locationName, existingTitles })
  );
  if (result.status !== "ok") {
    // Shown to staff (or logged by the cron route), so include the raw
    // diagnostic — it saves a round-trip through the hosting provider's logs.
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
  const rows = buildDiscoveredEventRows(withImages, { communityId: community.id, createdBy: actorId });
  if (rows.length === 0) return { imported: 0, added: [] };

  const { error: insertError } = await supabase.from("events").insert(rows);
  if (insertError) return { error: insertError.message };

  return {
    imported: rows.length,
    added: rows.map((r) => ({ title: r.title, source_url: r.description?.match(SOURCE_LINE)?.[1] ?? null })),
  };
}
