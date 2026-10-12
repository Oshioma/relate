import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, EditorialGuide, EditorialGuideUpdate } from "@/types/database";
import type { ListingRef } from "@/lib/guides/where-to-stay/types";

type Client = SupabaseClient<Database>;

// Editorial guides: a community's curated long-form guides (see the
// editorial_guides migration). RLS returns published guides to everyone and
// drafts to staff only, so these reads need no visibility logic of their own.

export async function getEditorialGuide(supabase: Client, communityId: string, slug: string): Promise<EditorialGuide | null> {
  const { data, error } = await supabase
    .from("editorial_guides")
    .select("*")
    .eq("community_id", communityId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getCommunityEditorialGuides(supabase: Client, communityId: string): Promise<EditorialGuide[]> {
  const { data, error } = await supabase
    .from("editorial_guides")
    .select("*")
    .eq("community_id", communityId)
    .order("title", { ascending: true });
  // The nav asks on every page; a missing table (migration not yet applied)
  // must not take the community shell down with it.
  if (error) return [];
  return data ?? [];
}

export async function getEditorialGuideUpdates(supabase: Client, guideId: string): Promise<EditorialGuideUpdate[]> {
  const { data, error } = await supabase
    .from("editorial_guide_updates")
    .select("*")
    .eq("guide_id", guideId)
    .order("noted_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// --- Directory links ---------------------------------------------------------

// What a guide card needs from a matched directory or accommodation listing.
// Everything here is the listing's own data; ratings are the community's real
// reviews (place_reviews), shown only when there are some.
export type GuideListing = {
  kind: "business" | "stay";
  slug: string;
  name: string;
  href: string;
  imageUrl: string | null;
  locationLabel: string | null;
  lat: number | null;
  lng: number | null;
  website: string | null;
  mapsUrl: string | null;
  avgRating: number | null;
  ratingCount: number;
  category: string | null;
};

export type GuideDirectory = {
  // Keyed `${kind}:${slug}` — the shape of a recommendation's ListingRef.
  bySlug: Map<string, GuideListing>;
  restaurants: GuideListing[];
  stays: GuideListing[];
  directorySpaceSlug: string | null;
  accommodationSpaceSlug: string | null;
};

export function listingKey(ref: ListingRef): string {
  return `${ref.kind}:${ref.slug}`;
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

// Every restaurant and stay this community lists, once per page view. RLS
// limits it to spaces the viewer may see (the directory and accommodation
// spaces are public on Mzungu Zanzibar, so guests see them too). A
// recommendation is matched to a listing by slug at render time, so a
// deleted or renamed listing simply stops matching and the card falls back
// to the recommendation's own details — no dangling ids, no broken links.
export async function getGuideDirectory(supabase: Client, communityId: string, communitySlug: string): Promise<GuideDirectory> {
  const { data: spaces } = await supabase
    .from("spaces")
    .select("id, slug, space_type")
    .eq("community_id", communityId)
    .in("space_type", ["business_directory", "accommodation"]);

  const spaceSlugById = new Map((spaces ?? []).map((s) => [s.id, s.slug]));
  const directorySpace = (spaces ?? []).find((s) => s.space_type === "business_directory") ?? null;
  const accommodationSpace = (spaces ?? []).find((s) => s.space_type === "accommodation") ?? null;
  const base = `/c/${communitySlug}/spaces`;

  const [{ data: businesses }, { data: stays }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, space_id, slug, name, category, image_url, location_label, lat, lng, website, google_maps_url, place_id")
      .eq("community_id", communityId),
    supabase
      .from("accommodation_listings")
      .select("id, space_id, slug, name, photo_urls, location_label, lat, lng, website, booking_url, place_id")
      .eq("community_id", communityId),
  ]);

  const placeIds = [
    ...new Set([...(businesses ?? []), ...(stays ?? [])].map((row) => row.place_id).filter((id): id is string => Boolean(id))),
  ];
  const { data: reviews } = placeIds.length
    ? await supabase.from("place_reviews").select("place_id, rating").in("place_id", placeIds)
    : { data: [] as { place_id: string; rating: number }[] };
  const ratingsByPlace = new Map<string, number[]>();
  for (const row of reviews ?? []) {
    const list = ratingsByPlace.get(row.place_id) ?? [];
    list.push(row.rating);
    ratingsByPlace.set(row.place_id, list);
  }
  const ratingsFor = (placeId: string | null) => (placeId ? ratingsByPlace.get(placeId) ?? [] : []);

  const bySlug = new Map<string, GuideListing>();
  const restaurants: GuideListing[] = [];
  const stayListings: GuideListing[] = [];

  for (const b of businesses ?? []) {
    const spaceSlug = spaceSlugById.get(b.space_id);
    if (!spaceSlug || !b.slug) continue;
    const ratings = ratingsFor(b.place_id);
    const listing: GuideListing = {
      kind: "business",
      slug: b.slug,
      name: b.name,
      href: `${base}/${spaceSlug}/businesses/${b.slug}`,
      imageUrl: b.image_url,
      locationLabel: b.location_label,
      lat: b.lat,
      lng: b.lng,
      website: b.website,
      mapsUrl: b.google_maps_url,
      avgRating: average(ratings),
      ratingCount: ratings.length,
      category: b.category,
    };
    bySlug.set(`business:${b.slug}`, listing);
    if (b.category === "restaurant") restaurants.push(listing);
  }

  for (const s of stays ?? []) {
    const spaceSlug = spaceSlugById.get(s.space_id);
    if (!spaceSlug || !s.slug) continue;
    const ratings = ratingsFor(s.place_id);
    const listing: GuideListing = {
      kind: "stay",
      slug: s.slug,
      name: s.name,
      href: `${base}/${spaceSlug}/stays/${s.slug}`,
      imageUrl: s.photo_urls?.[0] ?? null,
      locationLabel: s.location_label,
      lat: s.lat,
      lng: s.lng,
      website: s.website ?? s.booking_url,
      mapsUrl: null,
      avgRating: average(ratings),
      ratingCount: ratings.length,
      category: null,
    };
    bySlug.set(`stay:${s.slug}`, listing);
    stayListings.push(listing);
  }

  return {
    bySlug,
    restaurants,
    stays: stayListings,
    directorySpaceSlug: directorySpace?.slug ?? null,
    accommodationSpaceSlug: accommodationSpace?.slug ?? null,
  };
}

// Listing location labels are free text typed by members ("Stonetown",
// "Kendwa", "Paje beach"), so compare them squashed: lower case, letters only.
export function squashPlaceName(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[^a-z]/g, "");
}

export function listingsInArea(listings: GuideListing[], areaName: string, exclude: Set<string>): GuideListing[] {
  const target = squashPlaceName(areaName);
  if (!target) return [];
  return listings
    .filter((l) => !exclude.has(`${l.kind}:${l.slug}`))
    .filter((l) => {
      const label = squashPlaceName(l.locationLabel);
      return label.length > 0 && (label === target || label.startsWith(target) || label.includes(target));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
