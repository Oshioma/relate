"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TierFormState = { error: string } | undefined;

// Whole currency units from the form → integer cents. Non-positive/blank = 0.
function parsePriceCents(raw: FormDataEntryValue | null): number {
  const amount = Number(String(raw ?? "").trim());
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : 0;
}

function parseCurrency(raw: FormDataEntryValue | null): string {
  return (String(raw ?? "usd").trim().toLowerCase() || "usd").slice(0, 3);
}

// Charging members is a paid-plan capability — the same gate the per-space price
// uses (community_can_charge). RLS already restricts these writes to admins.
async function planAllowsCharging(supabase: Awaited<ReturnType<typeof createClient>>, communityId: string): Promise<boolean> {
  const { data } = await supabase.rpc("community_can_charge", { p_community_id: communityId });
  return Boolean(data);
}

export async function createTier(_prevState: TierFormState, formData: FormData): Promise<TierFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = parsePriceCents(formData.get("price"));
  const currency = parseCurrency(formData.get("currency"));

  if (!name) return { error: "Give the tier a name." };
  if (priceCents <= 0) return { error: "Set a monthly price above zero." };

  const supabase = await createClient();
  if (!(await planAllowsCharging(supabase, communityId))) {
    return { error: "Charging members is a paid-plan feature. Upgrade your plan first." };
  }

  const { data: maxSort } = await supabase
    .from("community_tiers")
    .select("sort_order")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("community_tiers").insert({
    community_id: communityId,
    name,
    description: description || null,
    price_cents: priceCents,
    currency,
    sort_order: (maxSort?.sort_order ?? -1) + 1,
  });
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}

export async function updateTier(_prevState: TierFormState, formData: FormData): Promise<TierFormState> {
  const tierId = String(formData.get("tier_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = parsePriceCents(formData.get("price"));
  const currency = parseCurrency(formData.get("currency"));

  if (!name) return { error: "Give the tier a name." };
  if (priceCents <= 0) return { error: "Set a monthly price above zero." };

  const supabase = await createClient();
  const { data: tier } = await supabase.from("community_tiers").select("community_id").eq("id", tierId).maybeSingle();
  if (!tier) return { error: "Tier not found." };
  if (!(await planAllowsCharging(supabase, tier.community_id))) {
    return { error: "Charging members is a paid-plan feature. Upgrade your plan first." };
  }

  const { error } = await supabase
    .from("community_tiers")
    .update({ name, description: description || null, price_cents: priceCents, currency })
    .eq("id", tierId);
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}

// Archive/unarchive: archived tiers stop accepting new subscribers but keep
// granting access to anyone already subscribed. Preferred over delete when a
// tier has members.
export async function setTierArchived(tierId: string, archived: boolean, communitySlug: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("community_tiers")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", tierId);
  if (error) return { error: error.message };
  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}

export async function deleteTier(tierId: string, communitySlug: string): Promise<{ error: string | null }> {
  const supabase = await createClient();

  // Refuse to delete a tier that still has paid-up subscribers — deleting it
  // would revoke their access and orphan their Stripe subscriptions. Archive it
  // instead (hidden from new joiners, existing access preserved).
  const { count } = await supabase
    .from("tier_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("tier_id", tierId)
    .in("status", ["active", "trialing"]);
  if ((count ?? 0) > 0) {
    return { error: "This tier has active subscribers — archive it instead of deleting." };
  }

  const { error } = await supabase.from("community_tiers").delete().eq("id", tierId);
  if (error) return { error: error.message };
  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}

// Replace the full set of spaces a tier unlocks. Public spaces are never
// tier-gated (they're always open), so they're filtered out; spaces must belong
// to the tier's own community.
export async function setTierSpaces(tierId: string, spaceIds: string[], communitySlug: string): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { data: tier } = await supabase.from("community_tiers").select("community_id").eq("id", tierId).maybeSingle();
  if (!tier) return { error: "Tier not found." };

  // Keep only real, non-public spaces in this community.
  let validIds: string[] = [];
  if (spaceIds.length > 0) {
    const { data: valid } = await supabase
      .from("spaces")
      .select("id")
      .eq("community_id", tier.community_id)
      .neq("visibility", "public")
      .in("id", spaceIds);
    validIds = (valid ?? []).map((s) => s.id);
  }

  const { error: delError } = await supabase.from("tier_spaces").delete().eq("tier_id", tierId);
  if (delError) return { error: delError.message };

  if (validIds.length > 0) {
    const { error: insError } = await supabase
      .from("tier_spaces")
      .insert(validIds.map((space_id) => ({ tier_id: tierId, space_id })));
    if (insError) return { error: insError.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}
