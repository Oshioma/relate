import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Business, BusinessImage, BusinessReview, BusinessReviewReply, BusinessClaim, FeaturedBusinessCategory, BusinessCustomCategory, BusinessCategoryLabelOverride, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type BusinessWithContext = Business & {
  creator: Profile;
  space: Pick<Space, "id" | "name" | "slug">;
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// A directory listing plus the aggregates the card and sort controls need:
// its review score, how many photos it has, and whether the viewer saved it.
export type BusinessWithStats = {
  business: Business;
  avgRating: number | null;
  ratingCount: number;
  imageCount: number;
  saved: boolean;
};

// Newest listings across the whole community, with who added them and which
// directory space they live in — the feed interleaves these with posts.
// RLS trims the result to spaces the viewer can see.
export async function getCommunityRecentBusinesses(
  supabase: Client,
  communityId: string,
  limit = 6
): Promise<BusinessWithContext[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*, creator:created_by (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as BusinessWithContext[];
}

export async function getSpaceBusinesses(supabase: Client, spaceId: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("space_id", spaceId)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// The directory listing enriched with review scores, photo counts and the
// viewer's saved state — one bulk query per aggregate, grouped in maps, mirroring
// getSpaceGuides. Ordering here is just a stable default; the client view offers
// Top rated / Newest / Name on top of it.
export async function getSpaceBusinessesWithStats(
  supabase: Client,
  spaceId: string,
  viewerId: string
): Promise<BusinessWithStats[]> {
  const businesses = await getSpaceBusinesses(supabase, spaceId);
  if (businesses.length === 0) return [];

  const ids = businesses.map((b) => b.id);

  const [{ data: reviews, error: reviewsError }, { data: images, error: imagesError }, { data: saves, error: savesError }] = await Promise.all([
    supabase.from("business_reviews").select("business_id, rating").in("business_id", ids),
    supabase.from("business_images").select("business_id").in("business_id", ids),
    viewerId
      ? supabase.from("business_saves").select("business_id").in("business_id", ids).eq("user_id", viewerId)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (reviewsError) throw reviewsError;
  if (imagesError) throw imagesError;
  if (savesError) throw savesError;

  const ratingsByBusiness = new Map<string, number[]>();
  for (const row of reviews ?? []) {
    const list = ratingsByBusiness.get(row.business_id) ?? [];
    list.push(row.rating);
    ratingsByBusiness.set(row.business_id, list);
  }

  const imageCountByBusiness = new Map<string, number>();
  for (const row of images ?? []) {
    imageCountByBusiness.set(row.business_id, (imageCountByBusiness.get(row.business_id) ?? 0) + 1);
  }

  const savedIds = new Set((saves ?? []).map((row) => row.business_id));

  return businesses.map((business) => {
    const ratings = ratingsByBusiness.get(business.id) ?? [];
    return {
      business,
      avgRating: average(ratings),
      ratingCount: ratings.length,
      imageCount: imageCountByBusiness.get(business.id) ?? 0,
      saved: savedIds.has(business.id),
    };
  });
}

export type BusinessReviewWithAuthor = BusinessReview & {
  author: Profile;
  reply: (BusinessReviewReply & { author: Profile }) | null;
};

export type BusinessClaimWithClaimant = BusinessClaim & { claimant: Profile };

export type BusinessDetail = {
  business: Business;
  images: BusinessImage[];
  reviews: BusinessReviewWithAuthor[];
  avgRating: number | null;
  ratingCount: number;
  viewerReview: BusinessReview | null;
  saved: boolean;
  // The viewer's own claim on this listing, if any (RLS shows a member only
  // their own). Staff additionally see every pending claim in pendingClaims.
  viewerClaim: BusinessClaim | null;
  pendingClaims: BusinessClaimWithClaimant[];
};

export async function getBusinessDetail(supabase: Client, businessId: string, viewerId: string): Promise<BusinessDetail | null> {
  const { data: business, error } = await supabase.from("businesses").select("*").eq("id", businessId).maybeSingle();
  if (error) throw error;
  if (!business) return null;

  const [{ data: images, error: imagesError }, { data: reviews, error: reviewsError }, { data: replies, error: repliesError }, { data: saveRow, error: saveError }, { data: claims, error: claimsError }] =
    await Promise.all([
      supabase.from("business_images").select("*").eq("business_id", businessId).order("sort_order", { ascending: true }),
      supabase.from("business_reviews").select("*, author:author_id (*)").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("business_review_replies").select("*, author:author_id (*)").eq("business_id", businessId),
      viewerId
        ? supabase.from("business_saves").select("id").eq("business_id", businessId).eq("user_id", viewerId).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      viewerId
        ? supabase.from("business_claims").select("*, claimant:claimant_id (*)").eq("business_id", businessId)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (imagesError) throw imagesError;
  if (reviewsError) throw reviewsError;
  if (repliesError) throw repliesError;
  if (saveError) throw saveError;
  if (claimsError) throw claimsError;

  const replyByReviewId = new Map<string, BusinessReviewReply & { author: Profile }>();
  for (const reply of (replies ?? []) as unknown as (BusinessReviewReply & { author: Profile })[]) {
    replyByReviewId.set(reply.review_id, reply);
  }

  const reviewRows = (reviews ?? []) as unknown as (BusinessReview & { author: Profile })[];
  const withReplies: BusinessReviewWithAuthor[] = reviewRows.map((review) => ({
    ...review,
    reply: replyByReviewId.get(review.id) ?? null,
  }));

  const ratingValues = reviewRows.map((r) => r.rating);
  const viewerReview = reviewRows.find((r) => r.author_id === viewerId) ?? null;

  const claimRows = (claims ?? []) as unknown as BusinessClaimWithClaimant[];
  const viewerClaim = claimRows.find((c) => c.claimant_id === viewerId) ?? null;
  const pendingClaims = claimRows.filter((c) => c.status === "pending");

  return {
    business,
    images: images ?? [],
    reviews: withReplies,
    avgRating: average(ratingValues),
    ratingCount: ratingValues.length,
    viewerReview: viewerReview ? { ...viewerReview } : null,
    saved: Boolean(saveRow),
    viewerClaim: viewerClaim ? { ...viewerClaim } : null,
    pendingClaims,
  };
}

// All custom categories across a community's directory spaces — community-
// scoped like featured categories below, so the left nav can label featured
// custom slugs and the directory page can filter to its own space_id.
export async function getCommunityBusinessCustomCategories(
  supabase: Client,
  communityId: string
): Promise<BusinessCustomCategory[]> {
  const { data, error } = await supabase
    .from("business_custom_categories")
    .select("*")
    .eq("community_id", communityId)
    .order("label", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Per-space label overrides for built-in categories across the community —
// community-scoped like custom/featured categories so the same one query feeds
// the left nav, the directory page and the admin nav manager, each filtering to
// its own space_id.
export async function getCommunityBusinessCategoryLabelOverrides(
  supabase: Client,
  communityId: string
): Promise<BusinessCategoryLabelOverride[]> {
  const { data, error } = await supabase
    .from("business_category_label_overrides")
    .select("*")
    .eq("community_id", communityId);

  if (error) throw error;
  return data ?? [];
}

// All featured categories across a community's directory spaces — one query
// for the left nav, which groups them under their space by space_id.
export async function getCommunityFeaturedBusinessCategories(
  supabase: Client,
  communityId: string
): Promise<FeaturedBusinessCategory[]> {
  const { data, error } = await supabase
    .from("featured_business_categories")
    .select("*")
    .eq("community_id", communityId)
    // Staff-chosen order; category is a stable tiebreaker for rows that share a
    // sort_order (all default to 0 until first reordered).
    .order("sort_order", { ascending: true })
    .order("category", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
