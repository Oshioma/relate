import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Space, SpaceType } from "@/types/database";

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

export type SpaceTeaser = Database["public"]["Functions"]["space_teasers"]["Returns"][number];

// Members spaces this community shows, locked, to people who haven't joined
// (spaces.when_locked = 'teaser'). Only name, description, cover and position
// come back; the spaces table itself stays closed to visitors. Leaves out any
// space the viewer can already see, so callers can simply append these.
export async function getSpaceTeasers(supabase: Client, communityId: string, visibleIds: string[] = []): Promise<SpaceTeaser[]> {
  const { data, error } = await supabase.rpc("space_teasers", { p_community_id: communityId });
  // A teaser is a nice-to-have: never fail the page over it.
  if (error || !data) return [];
  const seen = new Set(visibleIds);
  return data.filter((t) => !seen.has(t.id));
}

// A teaser in the shape the space cards and lists draw, marked locked.
export type LockableSpace = Pick<Space, "id" | "name" | "slug" | "description" | "space_type" | "image_url"> & { locked?: boolean };

export function teaserAsSpace(t: SpaceTeaser): LockableSpace {
  return { id: t.id, name: t.name, slug: t.slug, description: t.description, space_type: t.space_type as SpaceType, image_url: t.image_url, locked: true };
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

// Space types that only make sense where people grow things.
const GROWING_SPACE_TYPES = ["crop_guides", "my_crops", "plant_scanner", "plant_id"] as const;

// Whether a community is about growing — farming, gardening, allotments — so
// the post composer should offer the crop photo pickers ("My Crops", "Choose a
// crop") and a crop-flavoured tags hint. True for the farming template, and for
// any other community (a gardening club set up as custom, say) that has added
// one of the growing spaces.
export async function isGrowingCommunity(
  supabase: Client,
  community: { id: string; template_key: string | null }
): Promise<boolean> {
  if (community.template_key === "farming") return true;
  const { count, error } = await supabase
    .from("spaces")
    .select("id", { count: "exact", head: true })
    .eq("community_id", community.id)
    .in("space_type", [...GROWING_SPACE_TYPES]);

  if (error) throw error;
  return (count ?? 0) > 0;
}
