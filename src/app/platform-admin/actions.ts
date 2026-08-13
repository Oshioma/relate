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
