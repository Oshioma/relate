"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AccommodationClaimFormState = { error: string } | undefined;

// The stay detail route is dynamic, so revalidate the route itself ("page")
// rather than one concrete path — the same reasoning as the directory's claims.
const DETAIL_ROUTE = "/c/[communitySlug]/spaces/[spaceSlug]/stays/[listingId]";

// Someone opens a claim on an unclaimed stay. RLS blocks claims on already-
// claimed listings; staff resolve it afterwards.
export async function submitAccommodationClaim(
  _prevState: AccommodationClaimFormState,
  formData: FormData
): Promise<AccommodationClaimFormState> {
  const listingId = String(formData.get("listing_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  // Re-claiming after a decline: the (listing_id, claimant_id) unique constraint
  // would reject the new row, so clear the old declined claim first — RLS lets a
  // claimant delete their own. Only 'rejected' rows go; a live pending/approved
  // claim is left alone and the insert below surfaces the duplicate.
  await supabase
    .from("accommodation_claims")
    .delete()
    .eq("listing_id", listingId)
    .eq("claimant_id", user.id)
    .eq("status", "rejected");

  const { error } = await supabase
    .from("accommodation_claims")
    .insert({ listing_id: listingId, community_id: communityId, claimant_id: user.id, message: message || null });

  if (error) {
    // The unique constraint means "you've already claimed this".
    if (error.code === "23505") return { error: "You already have a claim on this listing." };
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  return undefined;
}

// Staff approve or reject a claim. Approving sets accommodation_listings.claimed_by
// — which the privileged-fields trigger only lets staff do — and rejects any
// other pending claims on the same stay.
export async function resolveAccommodationClaim(claimId: string, approve: boolean, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: claim, error: fetchError } = await supabase
    .from("accommodation_claims")
    .select("listing_id, claimant_id")
    .eq("id", claimId)
    .maybeSingle();
  if (fetchError || !claim) {
    return { error: fetchError?.message ?? "Claim not found." };
  }

  const { error: updateError } = await supabase
    .from("accommodation_claims")
    .update({ status: approve ? "approved" : "rejected", resolved_by: user.id, resolved_at: new Date().toISOString() })
    .eq("id", claimId);
  if (updateError) {
    return { error: updateError.message };
  }

  if (approve) {
    const { data: owned, error: ownerError } = await supabase
      .from("accommodation_listings")
      .update({ claimed_by: claim.claimant_id })
      .eq("id", claim.listing_id)
      .select("id");
    if (ownerError) {
      return { error: ownerError.message };
    }
    // A silent no-op means the write was filtered out (not staff after all), so
    // say so instead of reporting an approval that granted nothing.
    if ((owned ?? []).length === 0) {
      return { error: "Couldn't hand the listing over — only community staff can approve a claim." };
    }
    // Turn down any other still-pending claims for the same stay.
    await supabase
      .from("accommodation_claims")
      .update({ status: "rejected", resolved_by: user.id, resolved_at: new Date().toISOString() })
      .eq("listing_id", claim.listing_id)
      .eq("status", "pending")
      .neq("id", claimId);
  }

  revalidatePath(DETAIL_ROUTE, "page");
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// A claimant withdraws their own claim (staff can also remove any).
export async function withdrawAccommodationClaim(claimId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accommodation_claims").delete().eq("id", claimId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(DETAIL_ROUTE, "page");
  return { error: null };
}
