"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BusinessReviewFormState = { error: string } | undefined;

function detailPath(communitySlug: string, spaceSlug: string, businessId: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}/businesses/${businessId}`;
}

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

  const { data: business, error: businessError } = await supabase.from("businesses").select("created_by").eq("id", businessId).maybeSingle();
  if (businessError || !business) {
    return { error: businessError?.message ?? "Listing not found." };
  }
  if (business.created_by === user.id) {
    // Super admins may review their own listing (seeding/testing); everyone
    // else is blocked here, matching the hidden review form in the UI.
    const { data: profile } = await supabase.from("profiles").select("is_super_admin").eq("id", user.id).maybeSingle();
    if (!profile?.is_super_admin) {
      return { error: "You can't review your own listing." };
    }
  }

  const { error } = await supabase
    .from("business_reviews")
    .upsert({ business_id: businessId, author_id: user.id, rating, body: body || null }, { onConflict: "business_id,author_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, businessId));
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteReview(reviewId: string, businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("business_reviews").delete().eq("id", reviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, businessId));
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// Post or update the listing owner's / staff reply to a review. One reply per
// review (unique constraint), and the insert policy restricts the author to the
// listing's creator or community staff.
export async function replyToReview(_prevState: BusinessReviewFormState, formData: FormData): Promise<BusinessReviewFormState> {
  const reviewId = String(formData.get("review_id") ?? "");
  const businessId = String(formData.get("business_id") ?? "");
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
    .from("business_review_replies")
    .upsert({ review_id: reviewId, business_id: businessId, author_id: user.id, body }, { onConflict: "review_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, businessId));
  return undefined;
}

export async function deleteReviewReply(replyId: string, businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("business_review_replies").delete().eq("id", replyId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, businessId));
  return { error: null };
}
