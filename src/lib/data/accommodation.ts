import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AccommodationListing, AccommodationReview, AccommodationReviewReply, Business, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type AccommodationListingWithBusiness = AccommodationListing & { business: Pick<Business, "id" | "name"> | null };
export type AccommodationListingWithContext = AccommodationListingWithBusiness & {
  lister: Profile;
  space: Pick<Space, "id" | "name" | "slug">;
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Newest available listings across the whole community, for the feed.
export async function getCommunityRecentAccommodationListings(
  supabase: Client,
  communityId: string,
  limit = 6
): Promise<AccommodationListingWithContext[]> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name), lister:listed_by (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as AccommodationListingWithContext[];
}

export async function getSpaceAccommodationListings(supabase: Client, spaceId: string): Promise<AccommodationListingWithBusiness[]> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as AccommodationListingWithBusiness[];
}

// A listing plus the aggregates the card and filters need: its review score and
// the viewer's saved state. Mirrors BusinessWithStats.
export type AccommodationListingWithStats = AccommodationListingWithBusiness & {
  saved: boolean;
  avgRating: number | null;
  ratingCount: number;
};

export async function getSpaceAccommodationListingsWithStats(
  supabase: Client,
  spaceId: string,
  viewerId: string
): Promise<AccommodationListingWithStats[]> {
  const listings = await getSpaceAccommodationListings(supabase, spaceId);
  if (listings.length === 0) return [];

  const ids = listings.map((l) => l.id);
  const [{ data: reviews, error: reviewsError }, { data: saves, error: savesError }] = await Promise.all([
    supabase.from("accommodation_reviews").select("listing_id, rating").in("listing_id", ids),
    viewerId
      ? supabase.from("accommodation_saves").select("listing_id").in("listing_id", ids).eq("user_id", viewerId)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (reviewsError) throw reviewsError;
  if (savesError) throw savesError;

  const ratingsByListing = new Map<string, number[]>();
  for (const row of reviews ?? []) {
    const list = ratingsByListing.get(row.listing_id) ?? [];
    list.push(row.rating);
    ratingsByListing.set(row.listing_id, list);
  }
  const savedIds = new Set((saves ?? []).map((row) => row.listing_id));

  return listings.map((listing) => {
    const ratings = ratingsByListing.get(listing.id) ?? [];
    return { ...listing, saved: savedIds.has(listing.id), avgRating: average(ratings), ratingCount: ratings.length };
  });
}

export type AccommodationReviewWithAuthor = AccommodationReview & {
  author: Profile;
  reply: (AccommodationReviewReply & { author: Profile }) | null;
};

export type AccommodationDetail = {
  listing: AccommodationListingWithBusiness & { lister: Profile };
  saved: boolean;
  reviews: AccommodationReviewWithAuthor[];
  avgRating: number | null;
  ratingCount: number;
  viewerReview: AccommodationReview | null;
};

// One listing plus who posted it, any linked business, the viewer's saved state
// and its reviews (each with the host's reply), for its own page.
export async function getAccommodationDetail(supabase: Client, listingId: string, viewerId: string): Promise<AccommodationDetail | null> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name), lister:listed_by (*)")
    .eq("id", listingId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [{ data: reviews, error: reviewsError }, { data: replies, error: repliesError }, { data: saveRow, error: saveError }] = await Promise.all([
    supabase.from("accommodation_reviews").select("*, author:author_id (*)").eq("listing_id", listingId).order("created_at", { ascending: false }),
    supabase.from("accommodation_review_replies").select("*, author:author_id (*)").eq("listing_id", listingId),
    viewerId
      ? supabase.from("accommodation_saves").select("id").eq("listing_id", listingId).eq("user_id", viewerId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (reviewsError) throw reviewsError;
  if (repliesError) throw repliesError;
  if (saveError) throw saveError;

  const replyByReviewId = new Map<string, AccommodationReviewReply & { author: Profile }>();
  for (const reply of (replies ?? []) as unknown as (AccommodationReviewReply & { author: Profile })[]) {
    replyByReviewId.set(reply.review_id, reply);
  }

  const reviewRows = (reviews ?? []) as unknown as (AccommodationReview & { author: Profile })[];
  const withReplies: AccommodationReviewWithAuthor[] = reviewRows.map((review) => ({
    ...review,
    reply: replyByReviewId.get(review.id) ?? null,
  }));

  const ratingValues = reviewRows.map((r) => r.rating);

  return {
    listing: data as unknown as AccommodationListingWithBusiness & { lister: Profile },
    saved: Boolean(saveRow),
    reviews: withReplies,
    avgRating: average(ratingValues),
    ratingCount: ratingValues.length,
    viewerReview: reviewRows.find((r) => r.author_id === viewerId) ?? null,
  };
}
