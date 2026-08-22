"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AccommodationReviewFormState = { error: string } | undefined;

// A stay renders at its slug URL but may also be reached by UUID, so revalidate
// the dynamic route itself (with "page") rather than one concrete path — that
// invalidates the stay regardless of which form was requested.
const DETAIL_ROUTE = "/c/[communitySlug]/spaces/[spaceSlug]/stays/[listingId]";

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

  const { data: listing, error: listingError } = await supabase
    .from("accommodation_listings")
    .select("listed_by, claimed_by, place_id")
    .eq("id", listingId)
    .maybeSingle();
  if (listingError || !listing) {
    return { error: listingError?.message ?? "Listing not found." };
  }
  // You can't review a stay you speak for: its host, or — while it's unclaimed —
  // whoever listed it. Once a host claims it, the original lister was only a
  // curator and may review like anyone else.
  if (listing.claimed_by ? listing.claimed_by === user.id : listing.listed_by === user.id) {
    return { error: "You can't review your own listing." };
  }

  // Reviews are written against the place, so one review covers every facet of
  // it. A listing with no place still takes reviews the old way.
  const { error } = listing.place_id
    ? await supabase
        .from("place_reviews")
        .upsert({ place_id: listing.place_id, author_id: user.id, rating, body: body || null }, { onConflict: "place_id,author_id" })
    : await supabase
        .from("accommodation_reviews")
        .upsert({ listing_id: listingId, author_id: user.id, rating, body: body || null }, { onConflict: "listing_id,author_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  // Reviews appear on the community feed too, so it holds a stale card until
  // this refreshes it.
  revalidatePath(`/c/${communitySlug}`);
  return undefined;
}

export async function deleteAccommodationReview(reviewId: string, listingId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  // The id may belong to either store while listings without a place remain;
  // deleting from both is harmless, as only one can match.
  await supabase.from("place_reviews").delete().eq("id", reviewId);
  const { error } = await supabase.from("accommodation_reviews").delete().eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  // Reviews appear on the community feed too, so it holds a stale card until
  // this refreshes it.
  revalidatePath(`/c/${communitySlug}`);
  return { error: null };
}

// Post or update the host's reply to a review. One reply per review (unique
// constraint); the insert policy restricts the author to the host or staff.
export async function replyToAccommodationReview(_prevState: AccommodationReviewFormState, formData: FormData): Promise<AccommodationReviewFormState> {
  const reviewId = String(formData.get("review_id") ?? "");
  const listingId = String(formData.get("listing_id") ?? "");
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

  // A reply belongs to the place, alongside the review it answers.
  const { data: listing } = await supabase.from("accommodation_listings").select("place_id").eq("id", listingId).maybeSingle();

  const { error } = listing?.place_id
    ? await supabase
        .from("place_review_replies")
        .upsert({ review_id: reviewId, place_id: listing.place_id, author_id: user.id, body }, { onConflict: "review_id" })
    : await supabase
        .from("accommodation_review_replies")
        .upsert({ review_id: reviewId, listing_id: listingId, author_id: user.id, body }, { onConflict: "review_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  return undefined;
}

export async function deleteAccommodationReviewReply(replyId: string) {
  const supabase = await createClient();
  await supabase.from("place_review_replies").delete().eq("id", replyId);
  const { error } = await supabase.from("accommodation_review_replies").delete().eq("id", replyId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  return { error: null };
}
