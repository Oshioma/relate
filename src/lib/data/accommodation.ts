import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AccommodationClaim, AccommodationListing, AccommodationReview, AccommodationReviewReply, Business, Profile, Space } from "@/types/database";

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

// The community's accommodation space (the first, if several), used as the
// target when creating a stay from a directory business. Null when the community
// has no accommodation space to host one.
export async function getCommunityAccommodationSpace(supabase: Client, communityId: string): Promise<Pick<Space, "id" | "slug" | "name"> | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("id, slug, name")
    .eq("community_id", communityId)
    .eq("space_type", "accommodation")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

// The stay already linked to a business (if any), with its space slug so the
// directory can link straight to it instead of offering to create a duplicate.
export async function getStayLinkForBusiness(supabase: Client, businessId: string): Promise<{ id: string; spaceSlug: string } | null> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("id, space:space_id (slug)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  const row = data as unknown as { id: string; space: { slug: string } | null } | null;
  return row?.space?.slug ? { id: row.id, spaceSlug: row.space.slug } : null;
}

// Directory listings a stay can be linked to, for the form's picker. Community-
// scoped; RLS trims it to businesses in spaces the viewer can see.
export type BusinessLinkOption = { id: string; name: string };

export async function getCommunityBusinessLinkOptions(supabase: Client, communityId: string): Promise<BusinessLinkOption[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("community_id", communityId)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BusinessLinkOption[];
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
  // Ratings hang off the place, so a hotel's directory reviews count towards
  // its stay card too — it's one place with one rating.
  const placeIds = [...new Set(listings.map((l) => l.place_id).filter((id): id is string => id !== null))];
  const [{ data: reviews, error: reviewsError }, { data: saves, error: savesError }] = await Promise.all([
    supabase.from("place_reviews").select("place_id, rating").in("place_id", placeIds),
    viewerId
      ? supabase.from("accommodation_saves").select("listing_id").in("listing_id", ids).eq("user_id", viewerId)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (reviewsError) throw reviewsError;
  if (savesError) throw savesError;

  const ratingsByPlace = new Map<string, number[]>();
  for (const row of reviews ?? []) {
    const list = ratingsByPlace.get(row.place_id) ?? [];
    list.push(row.rating);
    ratingsByPlace.set(row.place_id, list);
  }
  const savedIds = new Set((saves ?? []).map((row) => row.listing_id));

  return listings.map((listing) => {
    const ratings = listing.place_id ? ratingsByPlace.get(listing.place_id) ?? [] : [];
    return { ...listing, saved: savedIds.has(listing.id), avgRating: average(ratings), ratingCount: ratings.length };
  });
}

export type AccommodationReviewWithAuthor = AccommodationReview & {
  author: Profile;
  reply: (AccommodationReviewReply & { author: Profile }) | null;
};

export type AccommodationClaimWithClaimant = AccommodationClaim & { claimant: Profile };

export type AccommodationDetail = {
  listing: AccommodationListingWithBusiness & { lister: Profile };
  saved: boolean;
  reviews: AccommodationReviewWithAuthor[];
  avgRating: number | null;
  ratingCount: number;
  viewerReview: AccommodationReview | null;
  // The linked directory listing (if any), with its space slug so the detail
  // page can link straight to the business's own page.
  linkedBusiness: { id: string; name: string; spaceSlug: string } | null;
  // The viewer's own ownership claim on this stay, if any (RLS shows a member
  // only their own). Staff additionally see every pending claim in pendingClaims.
  viewerClaim: AccommodationClaim | null;
  pendingClaims: AccommodationClaimWithClaimant[];
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

  const [{ data: reviews, error: reviewsError }, { data: replies, error: repliesError }, { data: saveRow, error: saveError }, { data: claims, error: claimsError }] = await Promise.all([
    // One conversation per place: this stay and any directory listing for the
    // same place show the same reviews. A listing with no place falls back to
    // its own rather than appearing to have none.
    data.place_id
      ? supabase.from("place_reviews").select("*, author:author_id (*)").eq("place_id", data.place_id).order("created_at", { ascending: false })
      : supabase.from("accommodation_reviews").select("*, author:author_id (*)").eq("listing_id", listingId).order("created_at", { ascending: false }),
    data.place_id
      ? supabase.from("place_review_replies").select("*, author:author_id (*)").eq("place_id", data.place_id)
      : supabase.from("accommodation_review_replies").select("*, author:author_id (*)").eq("listing_id", listingId),
    viewerId
      ? supabase.from("accommodation_saves").select("id").eq("listing_id", listingId).eq("user_id", viewerId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    // RLS narrows this to the viewer's own claim, or every claim on the stay
    // when the viewer is staff.
    viewerId
      ? supabase.from("accommodation_claims").select("*, claimant:claimant_id (*)").eq("listing_id", listingId)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (reviewsError) throw reviewsError;
  if (repliesError) throw repliesError;
  if (saveError) throw saveError;
  if (claimsError) throw claimsError;

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

  // Resolve the linked directory listing's space slug so the detail page can
  // link to it. One small extra query, only when a link is set.
  let linkedBusiness: { id: string; name: string; spaceSlug: string } | null = null;
  if (data.business_id) {
    const { data: biz, error: bizError } = await supabase
      .from("businesses")
      .select("id, name, space:space_id (slug)")
      .eq("id", data.business_id)
      .maybeSingle();
    if (bizError) throw bizError;
    const row = biz as unknown as { id: string; name: string; space: { slug: string } | null } | null;
    if (row?.space?.slug) linkedBusiness = { id: row.id, name: row.name, spaceSlug: row.space.slug };
  }

  const claimRows = (claims ?? []) as unknown as AccommodationClaimWithClaimant[];

  return {
    listing: data as unknown as AccommodationListingWithBusiness & { lister: Profile },
    saved: Boolean(saveRow),
    reviews: withReplies,
    avgRating: average(ratingValues),
    ratingCount: ratingValues.length,
    viewerReview: reviewRows.find((r) => r.author_id === viewerId) ?? null,
    linkedBusiness,
    viewerClaim: claimRows.find((c) => c.claimant_id === viewerId) ?? null,
    pendingClaims: claimRows.filter((c) => c.status === "pending"),
  };
}
