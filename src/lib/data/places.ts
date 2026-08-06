import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Place } from "@/types/database";

type Client = SupabaseClient<Database>;

// A place already in the community that looks like the one someone is about to
// add, with what it's already listed as so the member can tell at a glance
// whether it's really the same thing.
export type PlaceMatch = {
  place: Pick<Place, "id" | "name" | "location_label" | "address" | "cover_url">;
  // Where it already appears, e.g. ["Restaurant in the directory", "A stay"].
  facets: string[];
  business: { id: string; spaceSlug: string } | null;
  stay: { id: string; spaceSlug: string } | null;
};

// Names differ in punctuation and case far more often than in substance, and
// leading articles are noise: "The Rock" and "Rock Restaurant" should meet.
function normalise(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|a|an|hotel|restaurant|cafe|bar|lodge|guesthouse|resort)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Two names match when what's left after normalising is the same, or when one
// contains the other and the shorter is substantial enough not to match
// everything ("Rock" would otherwise hit every listing with Rock in it).
function namesMatch(a: string, b: string): boolean {
  const x = normalise(a);
  const y = normalise(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const [shorter, longer] = x.length <= y.length ? [x, y] : [y, x];
  return shorter.length >= 5 && longer.includes(shorter);
}

// Roughly 500m, in degrees. Only used to break ties between same-named places
// in one community — precision beyond "is it round here" isn't the point.
const NEAR_DEGREES = 0.005;

function isNear(
  a: { lat: number | null; lng: number | null },
  b: { lat: number | null; lng: number | null }
): boolean {
  if (a.lat === null || a.lng === null || b.lat === null || b.lng === null) return false;
  return Math.abs(a.lat - b.lat) < NEAR_DEGREES && Math.abs(a.lng - b.lng) < NEAR_DEGREES;
}

const MAX_MATCHES = 3;

// Places in this community that look like `name` — so a member adding a hotel
// that's already in the directory (or vice versa) is told before they create a
// second copy of it. Advisory only: it never blocks the add.
//
// Matching happens in memory over the community's places rather than in SQL.
// A community's place count is small, and the normalisation above is well
// beyond what ILIKE could express.
export async function findPlaceMatches(
  supabase: Client,
  communityId: string,
  name: string,
  near?: { lat: number | null; lng: number | null }
): Promise<PlaceMatch[]> {
  if (!name.trim()) return [];

  const { data: places } = await supabase
    .from("places")
    .select("id, name, location_label, address, cover_url, lat, lng")
    .eq("community_id", communityId)
    .limit(500);
  if (!places || places.length === 0) return [];

  const candidates = places.filter((p) => namesMatch(p.name, name));
  if (candidates.length === 0) return [];

  // A coordinate agreement is corroboration, not a requirement — most listings
  // have no pin, and those still match on name alone.
  const ranked = near
    ? [...candidates].sort((a, b) => Number(isNear(b, near)) - Number(isNear(a, near)))
    : candidates;
  const top = ranked.slice(0, MAX_MATCHES);
  const ids = top.map((p) => p.id);

  const [{ data: businesses }, { data: stays }] = await Promise.all([
    supabase.from("businesses").select("id, place_id, category, space:space_id (slug)").in("place_id", ids),
    supabase.from("accommodation_listings").select("id, place_id, space:space_id (slug)").in("place_id", ids),
  ]);

  type Row = { id: string; place_id: string | null; category?: string; space: { slug: string } | null };
  const bizRows = (businesses ?? []) as unknown as Row[];
  const stayRows = (stays ?? []) as unknown as Row[];

  return top.map((place) => {
    const biz = bizRows.find((b) => b.place_id === place.id) ?? null;
    const stay = stayRows.find((s) => s.place_id === place.id) ?? null;
    const facets: string[] = [];
    if (biz) facets.push("in the directory");
    if (stay) facets.push("as a place to stay");
    return {
      place: {
        id: place.id,
        name: place.name,
        location_label: place.location_label,
        address: place.address,
        cover_url: place.cover_url,
      },
      facets,
      business: biz?.space?.slug ? { id: biz.id, spaceSlug: biz.space.slug } : null,
      stay: stay?.space?.slug ? { id: stay.id, spaceSlug: stay.space.slug } : null,
    };
  });
}

// Creates the place a new listing is a facet of, or reuses one the caller
// already matched. Returns null rather than throwing: a listing that fails to
// get a place is still a valid listing, and the next stage backfills it.
export async function createPlaceForListing(
  supabase: Client,
  input: {
    communityId: string;
    createdBy: string;
    name: string;
    description?: string | null;
    address?: string | null;
    locationLabel?: string | null;
    website?: string | null;
    phone?: string | null;
    lat?: number | null;
    lng?: number | null;
    coverUrl?: string | null;
  }
): Promise<string | null> {
  const { data } = await supabase
    .from("places")
    .insert({
      community_id: input.communityId,
      created_by: input.createdBy,
      name: input.name,
      description: input.description ?? null,
      address: input.address ?? null,
      location_label: input.locationLabel ?? null,
      website: input.website ?? null,
      phone: input.phone ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      cover_url: input.coverUrl ?? null,
    })
    .select("id")
    .single();
  return data?.id ?? null;
}

// Keeps the place in step when one of its facets is edited.
//
// Stage 1 created the place from the listing and then never looked at it again,
// so changing a listing's phone number left the place holding the old one — and
// duplicate detection matches on the place's name, so a stale name quietly
// stops catching duplicates.
//
// Location and contact details are the place's, so a facet editing them is
// editing the place. The name is only taken when this facet is the place's
// *only* one: once a hotel has a restaurant, the two legitimately carry
// different names ("Kendwa Rocks" and "The Rock at Kendwa Rocks") and neither
// should overwrite the other. Description and photos stay per-facet throughout —
// a restaurant and a hotel describe themselves differently.
export async function syncPlaceIdentity(
  supabase: Client,
  placeId: string | null,
  input: {
    name: string;
    address?: string | null;
    locationLabel?: string | null;
    website?: string | null;
    phone?: string | null;
    lat?: number | null;
    lng?: number | null;
  }
): Promise<void> {
  if (!placeId) return;

  const [{ count: businessCount }, { count: stayCount }] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("place_id", placeId),
    supabase.from("accommodation_listings").select("id", { count: "exact", head: true }).eq("place_id", placeId),
  ]);
  const onlyFacet = (businessCount ?? 0) + (stayCount ?? 0) <= 1;

  await supabase
    .from("places")
    .update({
      ...(onlyFacet ? { name: input.name } : {}),
      address: input.address ?? null,
      location_label: input.locationLabel ?? null,
      website: input.website ?? null,
      phone: input.phone ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
    })
    .eq("id", placeId);
}
