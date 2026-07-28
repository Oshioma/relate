"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BusinessClaimFormState = { error: string } | undefined;

function detailPath(communitySlug: string, spaceSlug: string, businessId: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}/businesses/${businessId}`;
}

// A member opens a claim on an unclaimed listing. RLS blocks claims on already-
// claimed listings and enforces membership; staff resolve it afterwards.
export async function submitClaim(_prevState: BusinessClaimFormState, formData: FormData): Promise<BusinessClaimFormState> {
  const businessId = String(formData.get("business_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("business_claims")
    .insert({ business_id: businessId, community_id: communityId, claimant_id: user.id, message: message || null });

  if (error) {
    // The unique constraint means "you've already claimed this".
    if (error.code === "23505") return { error: "You already have a claim on this listing." };
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, businessId));
  return undefined;
}

// Staff approve or reject a claim. Approving sets businesses.claimed_by and
// rejects any other pending claims on the same listing. RLS restricts both the
// claim update and the businesses update to staff.
export async function resolveClaim(claimId: string, approve: boolean, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: claim, error: fetchError } = await supabase
    .from("business_claims")
    .select("business_id, claimant_id")
    .eq("id", claimId)
    .maybeSingle();
  if (fetchError || !claim) {
    return { error: fetchError?.message ?? "Claim not found." };
  }

  const { error: updateError } = await supabase
    .from("business_claims")
    .update({ status: approve ? "approved" : "rejected", resolved_by: user.id, resolved_at: new Date().toISOString() })
    .eq("id", claimId);
  if (updateError) {
    return { error: updateError.message };
  }

  if (approve) {
    const { error: ownerError } = await supabase.from("businesses").update({ claimed_by: claim.claimant_id }).eq("id", claim.business_id);
    if (ownerError) {
      return { error: ownerError.message };
    }
    // Turn down any other still-pending claims for the same listing.
    await supabase
      .from("business_claims")
      .update({ status: "rejected", resolved_by: user.id, resolved_at: new Date().toISOString() })
      .eq("business_id", claim.business_id)
      .eq("status", "pending")
      .neq("id", claimId);
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, claim.business_id));
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// A claimant withdraws their own pending claim (staff can also remove any).
export async function withdrawClaim(claimId: string, businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("business_claims").delete().eq("id", claimId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(detailPath(communitySlug, spaceSlug, businessId));
  return { error: null };
}
