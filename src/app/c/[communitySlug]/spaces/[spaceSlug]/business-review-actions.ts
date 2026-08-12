"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BusinessReviewFormState = { error: string } | undefined;

// A listing renders at its slug URL but may also be reached by UUID, so
// revalidate the dynamic route itself (with "page") rather than one concrete
// path — that invalidates the listing regardless of which form was requested.
const DETAIL_ROUTE = "/c/[communitySlug]/spaces/[spaceSlug]/businesses/[businessId]";

// Add or update the current member's review (rating + optional text). One row
// per member per listing, enforced by the business_reviews unique constraint and
// upserted here. A member can't review their own listing — checked before the
// write so they get a clear message instead of a silent allow.
export async function submitReview(_prevState: BusinessReviewFormState, formData: FormData): Promise<BusinessReviewFormState> {
  const businessId = String(formData.get("business_id") ?? "");
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

  const { data: business, error: businessError } = await supabase.from("businesses").select("claimed_by, place_id").eq("id", businessId).maybeSingle();
  if (businessError || !business) {
    return { error: businessError?.message ?? "Listing not found." };
  }
  // A member can't review a business they own (a claim that was approved) —
  // matching the hidden review form in the UI. Adding a listing is curation, not
  // ownership, so the adder may still review it. Super admins may (seeding).
  if (business.claimed_by === user.id) {
    const { data: profile } = await supabase.from("profiles").select("is_super_admin").eq("id", user.id).maybeSingle();
    if (!profile?.is_super_admin) {
      return { error: "You can't review a business you own." };
    }
  }

  // Reviews are written against the place, so one review covers every facet of
  // it. A listing with no place (its place insert having failed) still takes
  // reviews the old way rather than refusing them.
  const { error } = business.place_id
    ? await supabase
        .from("place_reviews")
        .upsert({ place_id: business.place_id, author_id: user.id, rating, body: body || null }, { onConflict: "place_id,author_id" })
    : await supabase
        .from("business_reviews")
        .upsert({ business_id: businessId, author_id: user.id, rating, body: body || null }, { onConflict: "business_id,author_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteReview(reviewId: string, businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  // The id may belong to either store while listings without a place remain;
  // deleting from both is harmless, as only one can match.
  await supabase.from("place_reviews").delete().eq("id", reviewId);
  const { error } = await supabase.from("business_reviews").delete().eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// Post or update a reply to a review on the listing's behalf. One reply per
// review (unique constraint), and the insert policy restricts the author to
// whoever manages the listing (owner, or adder while unclaimed, or staff).
export async function replyToReview(_prevState: BusinessReviewFormState, formData: FormData): Promise<BusinessReviewFormState> {
  const reviewId = String(formData.get("review_id") ?? "");
  const businessId = String(formData.get("business_id") ?? "");
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
  const { data: business } = await supabase.from("businesses").select("place_id").eq("id", businessId).maybeSingle();

  const { error } = business?.place_id
    ? await supabase
        .from("place_review_replies")
        .upsert({ review_id: reviewId, place_id: business.place_id, author_id: user.id, body }, { onConflict: "review_id" })
    : await supabase
        .from("business_review_replies")
        .upsert({ review_id: reviewId, business_id: businessId, author_id: user.id, body }, { onConflict: "review_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  return undefined;
}

export async function deleteReviewReply(replyId: string) {
  const supabase = await createClient();
  await supabase.from("place_review_replies").delete().eq("id", replyId);
  const { error } = await supabase.from("business_review_replies").delete().eq("id", replyId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  return { error: null };
}
