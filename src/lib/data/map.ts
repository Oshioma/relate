import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MapCategory, Landmark, Business } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getMapCategories(supabase: Client, communityId: string): Promise<MapCategory[]> {
  const { data, error } = await supabase
    .from("map_categories")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSpaceLandmarks(supabase: Client, spaceId: string): Promise<Landmark[]> {
  const { data, error } = await supabase
    .from("landmarks")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// A pinned business carries its own directory space's slug so the map can
// deep-link to the business detail page — which lives under that space, not
// the map space, and 404s under the wrong one.
export type MapPinnedBusiness = Business & { space_slug: string | null };

// Businesses live in their own 'business_directory' space, but any with a
// pin (lat/lng set) shows up on the community's map too — the "Living Map"
// idea: the map is another way to browse the whole community, not a
// separate silo. Community-scoped rather than space-scoped since a business
// and the map space are usually different spaces.
export async function getCommunityMapPinnedBusinesses(supabase: Client, communityId: string): Promise<MapPinnedBusiness[]> {
  const [{ data, error }, { data: linkRows, error: linkError }, { data: spaceRows, error: spaceError }] = await Promise.all([
    supabase.from("businesses").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null),
    // Businesses a stay is linked to are pinned by the (richer) stay instead —
    // same "don't stack a second pin" rule recommendations use for their
    // business/landmark links. Drop them from the business pins here.
    supabase.from("accommodation_listings").select("business_id").eq("community_id", communityId).not("business_id", "is", null),
    // Resolve each business's directory space slug for the detail-page link.
    supabase.from("spaces").select("id, slug").eq("community_id", communityId),
  ]);

  if (error) throw error;
  if (linkError) throw linkError;
  if (spaceError) throw spaceError;

  const linkedBusinessIds = new Set((linkRows ?? []).map((row) => row.business_id));
  const slugBySpace = new Map((spaceRows ?? []).map((s) => [s.id, s.slug]));
  return (data ?? [])
    .filter((business) => !linkedBusinessIds.has(business.id))
    .map((business) => ({ ...business, space_slug: slugBySpace.get(business.space_id) ?? null }));
}
