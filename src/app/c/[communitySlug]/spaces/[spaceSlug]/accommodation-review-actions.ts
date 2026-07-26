"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AccommodationReviewFormState = { error: string } | undefined;

function detailPath(communitySlug: string, spaceSlug: string, listingId: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}/stays/${listingId}`;
}

// Add or update the current member's review (rating + optional text). One row
// per member per listing, enforced by the accommodation_reviews unique
// constraint and upserted here. A member can't review their own listing —
// checked before the write so they get a clear message instead of a silent allow.
export async function submitAccommodationReview(_prevState: AccommodationReviewFormState, formData: FormData): Promise<AccommodationReviewFormState> {
  const listingId = String(formData.get("listing_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const body = String(formData.get("body") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Pick a star rating from 1 to 5." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: listing, error: listingError } = await supabase.from("accommodation_listings").select("listed_by").eq("id", listingId).maybeSingle();
  if (listingError || !listing) {
    return { error: listingError?.message ?? "Listing not found." };
  }
  if (listing.listed_by === user.id) {
    return { error: "You can't review your own listing." };
  }

  const { error } = await supabase
    .from("accommodation_reviews")
    .upsert({ listing_id: listingId, author_id: user.id, rating, body: body || null }, { onConflict: "listing_id,author_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, listingId));
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteAccommodationReview(reviewId: string, listingId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accommodation_reviews").delete().eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, listingId));
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// Post or update the host's reply to a review. One reply per review (unique
// constraint); the insert policy restricts the author to the host or staff.
export async function replyToAccommodationReview(_prevState: AccommodationReviewFormState, formData: FormData): Promise<AccommodationReviewFormState> {
  const reviewId = String(formData.get("review_id") ?? "");
  const listingId = String(formData.get("listing_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { error: "Write a reply first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("accommodation_review_replies")
    .upsert({ review_id: reviewId, listing_id: listingId, author_id: user.id, body }, { onConflict: "review_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, listingId));
  return undefined;
}

export async function deleteAccommodationReviewReply(replyId: string, listingId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accommodation_review_replies").delete().eq("id", replyId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, listingId));
  return { error: null };
}
