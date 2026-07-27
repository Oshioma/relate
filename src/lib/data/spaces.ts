import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Space } from "@/types/database";
import { isImageUrl } from "@/lib/utils";

type Client = SupabaseClient<Database>;

export async function getCommunitySpaces(supabase: Client, communityId: string): Promise<Space[]> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSpaceBySlug(
  supabase: Client,
  communityId: string,
  spaceSlug: string
): Promise<Space | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .eq("slug", spaceSlug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// The farming template's "Growing Journey" is an ordinary discussion space
// identified by its name, not a dedicated space_type (the `growth_journey`
// type is the separate personal-timeline feature). Match case-insensitively
// on the name the template gives it, and only among discussion spaces so the
// timeline type never matches. Returns null when the community has no such
// space — which is how the feed's "Share your journey" card knows whether to
// render at all.
export async function getGrowingJourneySpace(supabase: Client, communityId: string): Promise<Space | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .eq("space_type", "discussion")
    .ilike("name", "%growing journey%")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type GrowingJourneyHighlight = {
  spaceSlug: string;
  spaceName: string;
  // The image from the most recently added post, so the card previews the
  // latest journey update. Null when the space has no posts with a photo yet.
  latestImageUrl: string | null;
};

// Everything the "Share your journey" card needs in one round-trip: the space
// to link the composer to, plus the newest post's photo to preview. Returns
// null when the community doesn't run a Growing Journey space.
export async function getGrowingJourneyHighlight(supabase: Client, communityId: string): Promise<GrowingJourneyHighlight | null> {
  const space = await getGrowingJourneySpace(supabase, communityId);
  if (!space) return null;

  // Pull a handful of the most recent posts that carry media and take the
  // first that's actually an image — media_url can also hold a video or a
  // document, which the preview thumbnail can't show.
  const { data, error } = await supabase
    .from("posts")
    .select("media_url")
    .eq("space_id", space.id)
    .not("media_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;

  const latestImageUrl = (data ?? []).map((p) => p.media_url).find((url): url is string => !!url && isImageUrl(url)) ?? null;

  return { spaceSlug: space.slug, spaceName: space.name, latestImageUrl };
}
