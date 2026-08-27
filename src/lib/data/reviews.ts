import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

// The listing a review's feed card links through to. Reviews belong to the
// place, which can have several facets (a hotel that is also a restaurant), so
// one is chosen to link to: the directory listing when there is one, since a
// review reached through the directory is the common case, otherwise the stay.
export type ReviewSubject = {
  kind: "business" | "stay";
  // The listing routes resolve either a slug or the UUID, and canonicalize to
  // the slug — so this is the slug wherever a row has one.
  slugOrId: string;
  spaceSlug: string;
  spaceName: string;
  // The facet's own name, not the place's: what the reviewer was looking at.
  name: string;
  imageUrl: string | null;
  imagePosition: string | null;
};

// One review, flattened into what a feed card needs. The id is the review
// row's, in whichever of the three tables it lives — feed_reactions and
// feed_comments address the card as ("review", id), and the three id spaces
// can't collide.
export type CommunityReview = {
  id: string;
  rating: number;
  body: string | null;
  created_at: string;
  author: Pick<Profile, "id" | "full_name" | "username" | "avatar_url"> | null;
  subject: ReviewSubject;
};

const AUTHOR_COLUMNS = "id, full_name, username, avatar_url";
const SPACE_COLUMNS = "name, slug";

type AuthorRow = { id: string; full_name: string | null; username: string; avatar_url: string | null } | null;
type SpaceRow = { name: string; slug: string } | null;

type BusinessFacetRow = {
  id: string;
  name: string;
  slug: string | null;
  image_url: string | null;
  image_position: string | null;
  place_id: string | null;
  space: SpaceRow;
};

type StayFacetRow = {
  id: string;
  name: string;
  slug: string | null;
  photo_urls: string[] | null;
  place_id: string | null;
  space: SpaceRow;
};

// A facet with no space the viewer can see has nowhere to link to, so it can't
// carry a card — RLS having hidden the space is the same as the listing being
// gone as far as this feed is concerned.
function businessSubject(row: BusinessFacetRow): ReviewSubject | null {
  if (!row.space) return null;
  return {
    kind: "business",
    slugOrId: row.slug ?? row.id,
    spaceSlug: row.space.slug,
    spaceName: row.space.name,
    name: row.name,
    imageUrl: row.image_url,
    imagePosition: row.image_position,
  };
}

function staySubject(row: StayFacetRow): ReviewSubject | null {
  if (!row.space) return null;
  return {
    kind: "stay",
    slugOrId: row.slug ?? row.id,
    spaceSlug: row.space.slug,
    spaceName: row.space.name,
    name: row.name,
    imageUrl: row.photo_urls?.[0] ?? null,
    imagePosition: null,
  };
}

/**
 * The community's newest reviews, ready to interleave with the rest of the
 * feed. Reviews live in place_reviews now; the per-facet tables they replaced
 * still hold reviews of listings that never got a place, so those are read too
 * — filtered to `place_id is null` so a review that was backfilled into
 * place_reviews isn't also counted here under its old id.
 *
 * RLS does the access control: a review is readable wherever its listing is,
 * including by signed-out visitors when the listing's space is public — see
 * the review_visibility_for_guests migration.
 */
export async function getCommunityRecentReviews(
  supabase: Client,
  communityId: string,
  limit = 6
): Promise<CommunityReview[]> {
  const [placeReviews, businessReviews, stayReviews] = await Promise.all([
    supabase
      .from("place_reviews")
      .select(`id, rating, body, created_at, place_id, author:author_id (${AUTHOR_COLUMNS}), place:place_id!inner (community_id)`)
      .eq("place.community_id", communityId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("business_reviews")
      .select(
        `id, rating, body, created_at, author:author_id (${AUTHOR_COLUMNS}), business:business_id!inner (id, name, slug, image_url, image_position, place_id, space:space_id (${SPACE_COLUMNS}))`
      )
      .eq("business.community_id", communityId)
      .is("business.place_id", null)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("accommodation_reviews")
      .select(
        `id, rating, body, created_at, author:author_id (${AUTHOR_COLUMNS}), listing:listing_id!inner (id, name, slug, photo_urls, place_id, space:space_id (${SPACE_COLUMNS}))`
      )
      .eq("listing.community_id", communityId)
      .is("listing.place_id", null)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (placeReviews.error) throw placeReviews.error;
  if (businessReviews.error) throw businessReviews.error;
  if (stayReviews.error) throw stayReviews.error;

  type ReviewRow = { id: string; rating: number; body: string | null; created_at: string; author: AuthorRow };
  const placeRows = (placeReviews.data ?? []) as unknown as (ReviewRow & { place_id: string })[];
  const businessRows = (businessReviews.data ?? []) as unknown as (ReviewRow & { business: BusinessFacetRow })[];
  const stayRows = (stayReviews.data ?? []) as unknown as (ReviewRow & { listing: StayFacetRow })[];

  // Which listing each place review's card should point at. Two queries for the
  // whole batch rather than one per review.
  const subjectByPlace = new Map<string, ReviewSubject>();
  const placeIds = [...new Set(placeRows.map((r) => r.place_id))];
  if (placeIds.length > 0) {
    const [{ data: businesses }, { data: stays }] = await Promise.all([
      supabase
        .from("businesses")
        .select(`id, name, slug, image_url, image_position, place_id, space:space_id (${SPACE_COLUMNS})`)
        .in("place_id", placeIds),
      supabase
        .from("accommodation_listings")
        .select(`id, name, slug, photo_urls, place_id, space:space_id (${SPACE_COLUMNS})`)
        .in("place_id", placeIds),
    ]);

    // Stays first, so a directory listing for the same place overwrites them —
    // the directory is where a review is most likely to have been written.
    for (const row of (stays ?? []) as unknown as StayFacetRow[]) {
      const subject = staySubject(row);
      if (subject && row.place_id) subjectByPlace.set(row.place_id, subject);
    }
    for (const row of (businesses ?? []) as unknown as BusinessFacetRow[]) {
      const subject = businessSubject(row);
      if (subject && row.place_id) subjectByPlace.set(row.place_id, subject);
    }
  }

  const reviews: CommunityReview[] = [
    // A place whose every facet has been deleted (or is hidden from this
    // viewer) has no page left to link to, so its reviews drop out.
    ...placeRows.flatMap((row) => {
      const subject = subjectByPlace.get(row.place_id);
      return subject ? [{ id: row.id, rating: row.rating, body: row.body, created_at: row.created_at, author: row.author, subject }] : [];
    }),
    ...businessRows.flatMap((row) => {
      const subject = businessSubject(row.business);
      return subject ? [{ id: row.id, rating: row.rating, body: row.body, created_at: row.created_at, author: row.author, subject }] : [];
    }),
    ...stayRows.flatMap((row) => {
      const subject = staySubject(row.listing);
      return subject ? [{ id: row.id, rating: row.rating, body: row.body, created_at: row.created_at, author: row.author, subject }] : [];
    }),
  ];

  return reviews.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit);
}

// The rating as filled and empty stars, so a card carries the score visually
// even when the reviewer left no words.
export function ratingStars(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}
