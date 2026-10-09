"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { scrapeWebsiteImages } from "@/lib/scrape-website-image";
import type { Community, Database } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { runEventDiscovery, SOURCE_LINE, type AddedEvent } from "@/lib/events/run-discovery";


type StaffContext = {
  supabase: SupabaseClient<Database>;
  user: User;
  community: Community;
};

const STAFF_ROLES = new Set(["owner", "admin", "moderator"]);

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

  // AI event discovery is a place-based feature — it searches the web for
  // what's happening in a real place. Only offered to place communities.
  if (community.template_key !== "place") {
    return { error: "AI event discovery is only available for place-based communities." };
  }

  return { supabase, user, community };
}

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
  const ctx = await requireStaff(communitySlug);
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

// The "Discover events" button. RLS (events_insert_staff) enforces the staff
// requirement on the insert too.
export async function discoverAndAddEvents(
  communitySlug: string,
): Promise<{ imported: number; added: AddedEvent[] } | { error: string }> {
  const ctx = await requireStaff(communitySlug);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, user, community } = ctx;

  const result = await runEventDiscovery(supabase, community, user.id);
  if ("imported" in result && result.imported > 0) revalidatePath(`/c/${communitySlug}/events`);
  return result;
}

// The "Add new events every week" switch: whether the weekly Supabase cron
// run searches for this community.
export async function setWeeklyEventDiscovery(communitySlug: string, on: boolean): Promise<string | null> {
  const ctx = await requireStaff(communitySlug);
  if ("error" in ctx) return ctx.error;
  const { error } = await createAdminClient()
    .from("communities")
    .update({ weekly_event_discovery: on })
    .eq("id", ctx.community.id);
  return error ? error.message : null;
}
