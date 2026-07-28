"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { emailStaffOfNewClaim, emailClaimantsOfDecision } from "@/lib/data/claim-emails";

export type BusinessClaimFormState = { error: string } | undefined;

function detailPath(communitySlug: string, spaceSlug: string, businessId: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}/businesses/${businessId}`;
}

async function getSiteOrigin() {
  const headerList = await headers();
  return headerList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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

  // Email the community's staff (the bell notification is handled by a DB
  // trigger). Best-effort — the claim is already recorded either way.
  const [{ data: business }, { data: community }, { data: claimant }, origin] = await Promise.all([
    supabase.from("businesses").select("name").eq("id", businessId).maybeSingle(),
    supabase.from("communities").select("name").eq("id", communityId).maybeSingle(),
    supabase.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle(),
    getSiteOrigin(),
  ]);
  await emailStaffOfNewClaim({
    communityId,
    claimantId: user.id,
    claimantName: claimant?.full_name || claimant?.username || "A member",
    communityName: community?.name ?? null,
    businessName: business?.name ?? "a listing",
    message: message || null,
    url: `${origin}${detailPath(communitySlug, spaceSlug, businessId)}`,
  });

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
    .select("business_id, claimant_id, community_id")
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

  // Approving also turns down every other pending claim on the same listing —
  // those claimants are emailed a rejection too.
  const alsoRejected: string[] = [];
  if (approve) {
    const { error: ownerError } = await supabase.from("businesses").update({ claimed_by: claim.claimant_id }).eq("id", claim.business_id);
    if (ownerError) {
      return { error: ownerError.message };
    }

    const { data: others } = await supabase
      .from("business_claims")
      .select("claimant_id")
      .eq("business_id", claim.business_id)
      .eq("status", "pending")
      .neq("id", claimId);
    for (const other of others ?? []) alsoRejected.push(other.claimant_id);

    await supabase
      .from("business_claims")
      .update({ status: "rejected", resolved_by: user.id, resolved_at: new Date().toISOString() })
      .eq("business_id", claim.business_id)
      .eq("status", "pending")
      .neq("id", claimId);
  }

  // Email the outcome to the claimant (and any auto-rejected rivals). The bell
  // notifications are handled by a DB trigger; this is best-effort.
  const [{ data: business }, { data: community }, origin] = await Promise.all([
    supabase.from("businesses").select("name").eq("id", claim.business_id).maybeSingle(),
    supabase.from("communities").select("name").eq("id", claim.community_id).maybeSingle(),
    getSiteOrigin(),
  ]);
  const url = `${origin}${detailPath(communitySlug, spaceSlug, claim.business_id)}`;
  const businessName = business?.name ?? "a listing";
  const communityName = community?.name ?? null;
  await Promise.all([
    emailClaimantsOfDecision({
      claimantIds: [claim.claimant_id],
      communityName,
      businessName,
      status: approve ? "approved" : "rejected",
      url,
    }),
    emailClaimantsOfDecision({ claimantIds: alsoRejected, communityName, businessName, status: "rejected", url }),
  ]);

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
