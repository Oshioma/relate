"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getSpamCandidates } from "@/lib/data/platform-analytics";
import type { TemplateDefaultItem } from "@/lib/template-defaults";

// Replaces the whole default-spaces list for one community type. The control
// panel sends the full desired list on every edit; we delete this template's
// rows and re-insert in order. RLS also restricts writes to super admins, but
// the explicit check turns a silently-empty write into a clear error.
export async function saveTemplateDefaultSpaces(
  templateKey: string,
  items: TemplateDefaultItem[]
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can edit type defaults." };

  const del = await supabase.from("template_default_spaces").delete().eq("template_key", templateKey);
  if (del.error) return { error: del.error.message };

  if (items.length) {
    const ins = await supabase.from("template_default_spaces").insert(
      items.map((it, i) => ({
        template_key: templateKey,
        name: it.name,
        description: it.description,
        space_type: it.space_type,
        builtin_key: it.builtin_key,
        show_in_nav: it.show_in_nav,
        sort_order: i,
      }))
    );
    if (ins.error) return { error: ins.error.message };
  }

  revalidatePath("/platform-admin");
  return undefined;
}

// --- Legal documents (Terms & Privacy) ---------------------------------------
export type LegalFormState = { error: string } | { ok: true } | undefined;

// Save the platform's Terms and Privacy documents into the one-row
// platform_settings singleton. Content is stored as the same sanitised
// HTML/Markdown the rest of the app uses, rendered only through <RichText> on
// /terms and /privacy. RLS restricts the write to super admins; the explicit
// check turns a silently-blocked write into a clear message.
export async function savePlatformLegal(_prevState: LegalFormState, formData: FormData): Promise<LegalFormState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can edit legal documents." };

  const terms = String(formData.get("terms") ?? "").trim();
  const privacy = String(formData.get("privacy") ?? "").trim();

  // Upsert rather than update: if the singleton seed row is missing for any
  // reason, a bare UPDATE ... WHERE id = 1 matches zero rows and silently saves
  // nothing (the editor then reloads empty). Upserting the fixed id = 1 always
  // writes the row.
  const { error } = await supabase
    .from("platform_settings")
    .upsert({ id: 1, terms: terms || null, privacy: privacy || null }, { onConflict: "id" });
  if (error) return { error: error.message };

  revalidatePath("/platform-admin");
  revalidatePath("/terms");
  revalidatePath("/privacy");
  return { ok: true };
}

// --- Contact messages --------------------------------------------------------
// Flag a contact-form submission handled / unhandled from the super-admin inbox.
// contact_messages has no client write policy by design, so the update goes
// through the service-role client — gated here by an explicit super-admin check.
export async function setContactMessageHandled(id: string, handled: boolean): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can manage contact messages." };

  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").update({ handled }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/platform-admin");
  return undefined;
}

// --- Platform plans ----------------------------------------------------------
export type PlanFormState = { error: string } | { ok: true } | undefined;

// Update one plan's editable fields. Features are entered comma-separated and
// stored as a text[]; the Stripe price id is what lets owners actually check
// out, so it's the field operators most need to fill in. RLS also restricts
// writes to super admins; the explicit check gives a clear error.
export async function savePlatformPlan(_prevState: PlanFormState, formData: FormData): Promise<PlanFormState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can edit plans." };

  const planId = String(formData.get("plan_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!planId) return { error: "Missing plan." };
  if (!name) return { error: "The plan needs a name." };

  const priceAmount = Number(String(formData.get("price") ?? "").trim());
  const priceCents = Number.isFinite(priceAmount) && priceAmount > 0 ? Math.round(priceAmount * 100) : 0;
  const currency = (String(formData.get("currency") ?? "gbp").trim().toLowerCase() || "gbp").slice(0, 3);
  const stripePriceId = String(formData.get("stripe_price_id") ?? "").trim() || null;
  const features = String(formData.get("features") ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const isActive = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("platform_plans")
    .update({
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      price_cents: priceCents,
      currency,
      stripe_price_id: stripePriceId,
      features,
      is_active: isActive,
    })
    .eq("id", planId);
  if (error) return { error: error.message };

  revalidatePath("/platform-admin");
  return { ok: true };
}

// Update one feature pack's editable fields. space_types is entered
// comma-separated (space type keys) and stored as text[].
export async function saveFeaturePack(_prevState: PlanFormState, formData: FormData): Promise<PlanFormState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can edit packs." };

  const packId = String(formData.get("pack_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!packId) return { error: "Missing pack." };
  if (!name) return { error: "The pack needs a name." };

  const priceAmount = Number(String(formData.get("price") ?? "").trim());
  const priceCents = Number.isFinite(priceAmount) && priceAmount > 0 ? Math.round(priceAmount * 100) : 0;
  const currency = (String(formData.get("currency") ?? "gbp").trim().toLowerCase() || "gbp").slice(0, 3);
  const stripePriceId = String(formData.get("stripe_price_id") ?? "").trim() || null;
  const spaceTypes = String(formData.get("space_types") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isActive = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("feature_packs")
    .update({
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      price_cents: priceCents,
      currency,
      stripe_price_id: stripePriceId,
      space_types: spaceTypes,
      is_active: isActive,
    })
    .eq("id", packId);
  if (error) return { error: error.message };

  revalidatePath("/platform-admin");
  return { ok: true };
}

// --- Spam cleanup ------------------------------------------------------------
// Permanently delete suspected spam accounts. The caller sends the ids it wants
// removed, but this NEVER trusts them blindly: it recomputes the spam-candidate
// set server-side (unconfirmed email + no community + no content, super admins
// excluded) and deletes only ids that still match. A stale or tampered client
// therefore can't delete a legitimate user. Deleting the auth user cascades to
// the profile row (profiles.id references auth.users on delete cascade).
export async function deleteSpamAccounts(
  ids: string[]
): Promise<{ error: string } | { deleted: number; skipped: number }> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can delete accounts." };

  const requested = new Set((ids ?? []).filter((id) => typeof id === "string" && id.length > 0));
  if (requested.size === 0) return { deleted: 0, skipped: 0 };

  const admin = createAdminClient();
  // Re-derive who is genuinely eligible right now.
  const eligible = new Set((await getSpamCandidates(admin)).map((c) => c.id));

  let deleted = 0;
  let skipped = 0;
  for (const id of requested) {
    if (!eligible.has(id)) {
      skipped += 1;
      continue;
    }
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) {
      skipped += 1;
      continue;
    }
    deleted += 1;
  }

  revalidatePath("/platform-admin/communities");
  return { deleted, skipped };
}

// --- Homepage showcase -------------------------------------------------------
// Pick (or un-pick) a community for the showcase strip on relate.click. The
// timestamp doubles as the ordering, so featuring a community again moves it to
// the front of the strip.
//
// Written through the service-role client: the featured_at guard trigger
// refuses anon/authenticated writes precisely so an owner can't feature their
// own community, and a super admin's own session is still `authenticated`.
export async function setCommunityFeatured(
  communityId: string,
  featured: boolean
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can feature a community." };

  const admin = createAdminClient();
  const { data: community, error: readError } = await admin
    .from("communities")
    .select("id, is_public")
    .eq("id", communityId)
    .maybeSingle();
  if (readError) return { error: readError.message };
  if (!community) return { error: "Community not found." };
  // A private community would be featured into a strip that signed-out visitors
  // read under RLS, so the card would simply never render. Refuse it here
  // rather than storing a pick that does nothing.
  if (featured && !community.is_public) {
    return { error: "Only a public community can appear on the homepage." };
  }

  const { error } = await admin
    .from("communities")
    .update({ featured_at: featured ? new Date().toISOString() : null })
    .eq("id", communityId);
  if (error) return { error: error.message };

  revalidatePath("/platform-admin/communities");
  revalidatePath("/");
  return { ok: true };
}

// --- Complimentary plans -------------------------------------------------------
// Put a community on a paid plan with no Stripe subscription behind it — the
// super admin's own communities, partners, promos. Writes plan_status 'comped'
// through the service-role client (the plan columns are trigger-protected
// against ordinary API writes); community_effective_plan_id treats 'comped'
// as in force, so the plan's features and limits apply exactly as if paid.
export async function setComplimentaryPlan(_prevState: PlanFormState, formData: FormData): Promise<PlanFormState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can grant complimentary plans." };

  const communityId = String(formData.get("community_id") ?? "");
  // Empty = remove the comp (back to free).
  const planId = String(formData.get("plan_id") ?? "");
  if (!communityId) return { error: "Missing community." };

  const admin = createAdminClient();
  const { data: community, error: readError } = await admin
    .from("communities")
    .select("id, plan_status, plan_stripe_subscription_id")
    .eq("id", communityId)
    .maybeSingle();
  if (readError) return { error: readError.message };
  if (!community) return { error: "Community not found." };

  // A live Stripe subscription is the real source of truth for this row —
  // comping over it would leave Stripe charging for a plan the app no longer
  // shows, and the next webhook would overwrite the comp anyway.
  if (
    community.plan_stripe_subscription_id &&
    (community.plan_status === "active" || community.plan_status === "trialing")
  ) {
    return {
      error:
        "This community has a live paid subscription. Cancel it first (the owner's billing portal, or Stripe) before granting a complimentary plan.",
    };
  }

  if (!planId) {
    if (community.plan_status !== "comped") {
      return { error: "This community has no complimentary plan to remove." };
    }
    const { error } = await admin
      .from("communities")
      .update({ plan_id: null, plan_status: "none", plan_current_period_end: null })
      .eq("id", communityId);
    if (error) return { error: error.message };
  } else {
    const { data: plan } = await admin
      .from("platform_plans")
      .select("id, is_active, price_cents")
      .eq("id", planId)
      .maybeSingle();
    if (!plan || !plan.is_active) return { error: "That plan isn't available." };
    if (plan.price_cents === 0) return { error: "The free plan needs no comp — remove the complimentary plan instead." };

    const { error } = await admin
      .from("communities")
      .update({
        plan_id: plan.id,
        plan_status: "comped",
        // A comp never lapses into the grace window, and nothing in Stripe
        // backs it — clear any leftovers from an old canceled subscription.
        plan_current_period_end: null,
        plan_stripe_subscription_id: null,
      })
      .eq("id", communityId);
    if (error) return { error: error.message };
  }

  revalidatePath("/platform-admin/communities");
  return { ok: true };
}
