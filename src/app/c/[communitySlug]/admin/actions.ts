"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { SPACE_TYPE_LIST, SPACE_TYPES as SPACE_TYPE_META } from "@/lib/space-types";
import { getCommunitySpaceTypePool } from "@/lib/data/space-type-pool";
import { getPlaceLocationType } from "@/lib/community-templates";
import { defaultNavItemSort } from "@/lib/nav-items";
import { normalizeCustomDomain, isPlatformHost, isUnderPlatformApex, verificationRecordName } from "@/lib/custom-domain";
import { addDomainToVercelProject, removeDomainFromVercelProject } from "@/lib/vercel-domains";
import { reorderFeaturedCategories } from "../spaces/[spaceSlug]/business-directory-actions";
import type { PostgrestError } from "@supabase/supabase-js";
import type { NavSubItemKind } from "./spaces-manager";
import type { SpaceVisibility, SpaceType, Community, CommunityPrivacy, FeatureKey, BusinessCategory } from "@/types/database";

export type SpaceFormState = { error: string } | undefined;

type WriteOutcome = { error: string } | undefined;

// RLS turns a refused write into a silent no-op: the rows are filtered out by
// the policy's USING clause, nothing is written, and Postgres reports success
// — an UPDATE that matches no rows is not an error. Checking only `error`
// therefore can't tell a rejected save from an accepted one, and the form
// re-renders from the row that never changed, so the setting appears to revert
// on its own with nothing on screen to explain it.
//
// Every write below made with the caller's own client therefore ends in
// .select() and passes its result here, so "wrote nothing" becomes a visible
// failure. This doesn't change who may write — RLS remains the only authority
// on that — only whether a refusal is legible.
//
// The custom-domain actions are deliberately not routed through this: they use
// the service-role client, which bypasses RLS altogether, and each verifies the
// row exists and is owned before writing, so there is no silent-refusal case
// for this to catch.
function requireWrite(
  result: { data: unknown[] | null; error: PostgrestError | null },
  subject: string
): WriteOutcome {
  if (result.error) {
    return { error: result.error.message };
  }
  if (!result.data || result.data.length === 0) {
    return {
      error: `Couldn't save ${subject} — the database rejected the change and nothing was updated. Your admin access to this community may have changed; reload the page and try again.`,
    };
  }
  return undefined;
}

const VISIBILITIES: SpaceVisibility[] = ["public", "members", "private"];
const SPACE_TYPES: SpaceType[] = SPACE_TYPE_LIST.map((t) => t.type);
const PRIVACY_LEVELS: CommunityPrivacy[] = ["public", "private", "invite_only"];

function parseVisibility(raw: FormDataEntryValue | null): SpaceVisibility {
  const value = String(raw ?? "members");
  return VISIBILITIES.includes(value as SpaceVisibility) ? (value as SpaceVisibility) : "members";
}

// Falls back to the most restrictive level rather than the most permissive: a
// malformed value must never quietly widen who can see the community.
function parsePrivacy(raw: FormDataEntryValue | null): CommunityPrivacy {
  const value = String(raw ?? "invite_only");
  return PRIVACY_LEVELS.includes(value as CommunityPrivacy) ? (value as CommunityPrivacy) : "invite_only";
}

function parseSpaceType(raw: FormDataEntryValue | null): SpaceType {
  const value = String(raw ?? "discussion");
  return SPACE_TYPES.includes(value as SpaceType) ? (value as SpaceType) : "discussion";
}

export async function createSpace(_prevState: SpaceFormState, formData: FormData): Promise<SpaceFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const visibility = parseVisibility(formData.get("visibility"));
  const spaceType = parseSpaceType(formData.get("space_type"));
  const showInNav = formData.get("show_in_nav") === "on";
  const staffPostOnly = formData.get("staff_post_only") === "on";
  // Only meaningful alongside staff_post_only; forced false when not one-way so
  // the flag never lingers on a space that isn't broadcast.
  const allowMemberComments = staffPostOnly && formData.get("allow_member_comments") === "on";

  if (!name) {
    return { error: "Give the space a name." };
  }

  const slug = slugify(name);
  if (!slug) {
    return { error: "That name can't be turned into a valid URL — try adding some letters or numbers." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  // The super admin can restrict which space types a community may add. Gate
  // creation on the resolved pool so a disallowed type can't slip through even
  // if the form is bypassed.
  const pool = await getCommunitySpaceTypePool(supabase, communityId);
  if (!pool[spaceType]) {
    return { error: `The ${SPACE_TYPE_META[spaceType].label} space type isn't available to this community.` };
  }

  const { data: existing } = await supabase
    .from("spaces")
    .select("id")
    .eq("community_id", communityId)
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return { error: "A space with a similar name already exists." };
  }

  const { data: maxSort } = await supabase
    .from("spaces")
    .select("sort_order")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("spaces").insert({
    community_id: communityId,
    name,
    slug,
    description: description || null,
    visibility,
    space_type: spaceType,
    sort_order: (maxSort?.sort_order ?? -1) + 1,
    show_in_nav: showInNav,
    staff_post_only: staffPostOnly,
    allow_member_comments: allowMemberComments,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

export async function updateSpace(_prevState: SpaceFormState, formData: FormData): Promise<SpaceFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const visibility = parseVisibility(formData.get("visibility"));
  const spaceType = parseSpaceType(formData.get("space_type"));
  const staffPostOnly = formData.get("staff_post_only") === "on";
  const allowMemberComments = staffPostOnly && formData.get("allow_member_comments") === "on";
  // Absent field ≠ empty field: only forms that render the location input
  // (resources spaces) may change it, so other edits can't silently wipe it.
  const rawLocationName = formData.get("location_name");
  const locationName = rawLocationName === null ? undefined : String(rawLocationName).trim().slice(0, 120) || null;

  // Cover image. Same absent-≠-empty rule as location: only the edit form that
  // renders the uploader submits the field, so an edit elsewhere can't wipe it.
  // The uploader stores a public URL and empty means "no cover" (→ null).
  const rawImageUrl = formData.get("image_url");
  const imageUrl = rawImageUrl === null ? undefined : String(rawImageUrl).trim() || null;

  // Paywall price, in whole currency units from the form. Absent field ≠ set to
  // free — only the edit form that renders the price input sends it, so other
  // edits can't silently un-price a space. An empty or non-positive value means
  // free (price_cents 0). A public space is always open, so it's forced free
  // regardless of what was submitted (mirrors the spaces_public_is_free DB
  // constraint) — switching a paid space to public un-prices it.
  const rawPrice = formData.get("price");
  let priceUpdate: { price_cents: number; currency?: string } | undefined;
  if (visibility === "public") {
    priceUpdate = { price_cents: 0 };
  } else if (rawPrice !== null) {
    const amount = Number(String(rawPrice).trim());
    const priceCents = Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : 0;
    const currency = (String(formData.get("currency") ?? "usd").trim().toLowerCase() || "usd").slice(0, 3);
    priceUpdate = { price_cents: priceCents, currency };
  }

  if (!name) {
    return { error: "Give the space a name." };
  }

  const supabase = await createClient();

  // Only enforce the pool when the type is actually changing — an existing
  // space of a now-disallowed type can still be edited, it just can't be
  // switched *into* a disallowed type.
  const { data: current } = await supabase
    .from("spaces")
    .select("community_id, space_type, price_cents")
    .eq("id", spaceId)
    .maybeSingle();
  if (current && spaceType !== current.space_type) {
    const pool = await getCommunitySpaceTypePool(supabase, current.community_id);
    if (!pool[spaceType]) {
      return { error: `The ${SPACE_TYPE_META[spaceType].label} space type isn't available to this community.` };
    }
  }

  // Charging members is a paid-plan capability. Gate ENABLING a price on a
  // currently-free space behind the community's plan — but don't block editing
  // an already-paid space (soft downgrade keeps existing paid spaces working).
  if (current && priceUpdate && priceUpdate.price_cents > 0 && current.price_cents === 0) {
    const { data: canCharge } = await supabase.rpc("community_can_charge", { p_community_id: current.community_id });
    if (!canCharge) {
      return { error: "Charging for a space is a paid-plan feature. Upgrade your community's plan to set a price." };
    }
  }

  const failure = requireWrite(
    await supabase
      .from("spaces")
      .update({
        name,
        description: description || null,
        visibility,
        space_type: spaceType,
        staff_post_only: staffPostOnly,
        allow_member_comments: allowMemberComments,
        ...(locationName !== undefined && { location_name: locationName }),
        ...(imageUrl !== undefined && { image_url: imageUrl }),
        ...(priceUpdate ?? {}),
      })
      .eq("id", spaceId)
      .select("id"),
    "this space"
  );
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

export async function deleteSpace(spaceId: string, communitySlug: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.from("spaces").delete().eq("id", spaceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

export async function duplicateSpace(spaceId: string, communitySlug: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const { data: original, error: fetchError } = await supabase.from("spaces").select("*").eq("id", spaceId).single();
  if (fetchError || !original) {
    return { error: fetchError?.message ?? "Space not found." };
  }

  const { data: maxSort } = await supabase
    .from("spaces")
    .select("sort_order")
    .eq("community_id", original.community_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let slug = slugify(`${original.name}-copy`);
  const { data: taken } = await supabase.from("spaces").select("slug").eq("community_id", original.community_id).like("slug", `${slug}%`);
  const takenSlugs = new Set((taken ?? []).map((s) => s.slug));
  if (takenSlugs.has(slug)) {
    let n = 2;
    while (takenSlugs.has(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }

  const { error } = await supabase.from("spaces").insert({
    community_id: original.community_id,
    name: `${original.name} (Copy)`,
    slug,
    description: original.description,
    visibility: original.visibility,
    space_type: original.space_type,
    sort_order: (maxSort?.sort_order ?? -1) + 1,
    show_in_nav: original.show_in_nav,
    staff_post_only: original.staff_post_only,
    allow_member_comments: original.allow_member_comments,
    location_name: original.location_name,
    image_url: original.image_url,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

// Reorders the sidebar as a single interleaved list of spaces and the
// built-in feature links (Events, Search). Spaces write their sort_order to
// the spaces table; built-in links upsert theirs into community_nav_item_order.
// The caller assigns a contiguous 0..n-1 sequence across the whole list, so
// after any drag both tables agree on one order (see src/lib/nav-items.ts and
// the sidebar merge in the community layout).
export async function reorderNavItems(
  order: { kind: "space" | "builtin"; ref: string; sort_order: number }[],
  communityId: string,
  communitySlug: string
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const results = await Promise.all(
    order.map((item) =>
      item.kind === "space"
        ? supabase.from("spaces").update({ sort_order: item.sort_order }).eq("id", item.ref).select("id")
        : supabase
            .from("community_nav_item_order")
            .upsert(
              { community_id: communityId, item_key: item.ref as FeatureKey, sort_order: item.sort_order },
              { onConflict: "community_id,item_key" }
            )
            .select("item_key")
    )
  );
  // A drag writes every row in the list, so one silently-refused row leaves the
  // sidebar in an order nobody chose — report the first failure rather than
  // letting the list snap back unexplained.
  for (const result of results) {
    const failure = requireWrite(result, "the new order");
    if (failure) return failure;
  }

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

// Reorders one space's nav sub-links. Each sub-link kind persists its order
// differently, so this dispatches on `kind` — `orderedRefs` is the full list of
// that space's sub-links (by ref) in the desired order. Adding a new kind of
// sub-link means adding a branch here; the manager UI needs no changes.
export async function reorderSpaceSubNav(
  spaceId: string,
  kind: NavSubItemKind,
  orderedRefs: string[],
  communitySlug: string
): Promise<{ error: string } | undefined> {
  switch (kind) {
    case "featured_category": {
      const result = await reorderFeaturedCategories(spaceId, orderedRefs as BusinessCategory[], communitySlug);
      return result?.error ? { error: result.error } : undefined;
    }
    default:
      return { error: "Unknown nav sub-link type." };
  }
}

// Shows or hides a built-in nav item (Events, Search) in the sidebar without
// disabling the feature itself — the same as a space's show_in_nav toggle. The
// item lives in community_nav_item_order; when no row exists yet we insert one
// carrying its default sort position, so hiding an item never accidentally
// moves it to the top (sort_order's column default is 0).
export async function setNavItemVisibility(
  itemKey: FeatureKey,
  showInNav: boolean,
  communityId: string,
  communitySlug: string
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("community_nav_item_order")
    .select("item_key")
    .eq("community_id", communityId)
    .eq("item_key", itemKey)
    .maybeSingle();

  if (readError) {
    return { error: readError.message };
  }

  const result = existing
    ? await supabase
        .from("community_nav_item_order")
        .update({ show_in_nav: showInNav })
        .eq("community_id", communityId)
        .eq("item_key", itemKey)
        .select("item_key")
    : await supabase
        .from("community_nav_item_order")
        .insert({
          community_id: communityId,
          item_key: itemKey,
          sort_order: defaultNavItemSort(itemKey),
          show_in_nav: showInNav,
        })
        .select("item_key");

  const failure = requireWrite(result, "the sidebar change");
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

export type CommunityDetailsState = { error: string } | undefined;

export async function updateCommunityDetails(
  _prevState: CommunityDetailsState,
  formData: FormData
): Promise<CommunityDetailsState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  // Absent field ≠ empty field: only place communities render the location and
  // "kind of place" inputs, so a generic community's edit must leave those
  // columns untouched rather than clearing them.
  const rawLocationName = formData.get("location_name");
  const rawLocationType = formData.get("location_type");
  const locationName = rawLocationName === null ? undefined : String(rawLocationName).trim().slice(0, 120) || null;
  const locationType =
    rawLocationType === null ? undefined : getPlaceLocationType(String(rawLocationType)) ? String(rawLocationType) : null;

  if (!name) {
    return { error: "Give your community a name." };
  }

  const supabase = await createClient();
  const failure = requireWrite(
    await supabase
      .from("communities")
      .update({
        name,
        description: description || null,
        ...(locationName !== undefined && { location_name: locationName }),
        ...(locationType !== undefined && { location_type: locationType }),
      })
      .eq("id", communityId)
      .select("id"),
    "these details"
  );
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  revalidatePath("/dashboard");
  return undefined;
}

export type CommunityGuidelinesState = { error: string } | { ok: true } | undefined;

// Save a community's guidelines (house rules / code of conduct). Stored as the
// same sanitised HTML/Markdown as space descriptions — rendered only through
// <RichText> on display. RLS restricts the update to the owner and admins; an
// empty submission clears the guidelines (so the read page and its links hide).
export async function updateCommunityGuidelines(
  _prevState: CommunityGuidelinesState,
  formData: FormData
): Promise<CommunityGuidelinesState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const guidelines = String(formData.get("guidelines") ?? "").trim();

  const supabase = await createClient();
  const failure = requireWrite(
    await supabase
      .from("communities")
      .update({ guidelines: guidelines || null })
      .eq("id", communityId)
      .select("id"),
    "these guidelines"
  );
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}/guidelines`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return { ok: true };
}

export type CommunityContactInfoState = { error: string } | { ok: true } | undefined;

// Save the contact details shown above a community's contact form. Same
// sanitised HTML/Markdown as guidelines, rendered through <RichText>. RLS
// restricts the update to the owner and admins; empty clears it.
export async function updateCommunityContactInfo(
  _prevState: CommunityContactInfoState,
  formData: FormData
): Promise<CommunityContactInfoState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const contactInfo = String(formData.get("contact_info") ?? "").trim();

  const supabase = await createClient();
  const failure = requireWrite(
    await supabase
      .from("communities")
      .update({ contact_info: contactInfo || null })
      .eq("id", communityId)
      .select("id"),
    "these contact details"
  );
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}/contact`);
  return { ok: true };
}

export type PublicAccessState = { error: string } | undefined;

// The community's pre-login / public-access controls, grouped into one place:
// its privacy level, whether guests see events, and who can see the members
// list. All live on the communities row and are admin-only via RLS
// (communities_update_admin).
//
// `privacy` was previously write-once — the creation wizard set it and nothing
// in the app could ever change it again, so a community created as private or
// invite_only was stuck out of the discovery lists (which filter on is_public)
// for good. Note we write `privacy`, never `is_public`: the latter is a
// generated column derived from it (privacy = 'public') and Postgres rejects
// any direct write.
export async function updatePublicAccess(
  _prevState: PublicAccessState,
  formData: FormData
): Promise<PublicAccessState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const privacy = parsePrivacy(formData.get("privacy"));
  const eventsPublic = formData.get("events_public") === "on";
  const membersVisibility = parseVisibility(formData.get("members_visibility"));

  const supabase = await createClient();
  const failure = requireWrite(
    await supabase
      .from("communities")
      .update({
        privacy,
        events_public: eventsPublic,
        members_visibility: membersVisibility,
      })
      .eq("id", communityId)
      .select("id"),
    "these settings"
  );
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  // Changing privacy moves the community in and out of the two discovery
  // surfaces, which are rendered on the platform root and cached separately
  // from anything under /c/<slug> — without these they'd keep showing the
  // stale list.
  revalidatePath("/");
  revalidatePath("/dashboard");
  return undefined;
}

export type CustomDomainState = { error: string } | undefined;

type OwnedCommunity = Pick<Community, "id" | "slug" | "owner_id" | "custom_domain" | "custom_domain_token">;

// The trigger in supabase/custom-domains.sql blocks anon/authenticated
// writes to the domain columns, so every mutation below goes: verify the
// caller is the community's owner with their own RLS-bound client, then
// write with the service-role client. Owner-only (not admin) because a
// domain change redirects the entire community.
async function requireOwnedCommunity(
  communityId: string
): Promise<{ ok: false; error: string } | { ok: true; community: OwnedCommunity }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const { data: community } = await supabase
    .from("communities")
    .select("id, slug, owner_id, custom_domain, custom_domain_token")
    .eq("id", communityId)
    .maybeSingle();

  if (!community || community.owner_id !== user.id) {
    return { ok: false, error: "Only the owner can manage this community's domain." };
  }
  return { ok: true, community };
}

function adminClientOrError():
  | { ok: false; error: string }
  | { ok: true; admin: ReturnType<typeof createAdminClient> } {
  try {
    return { ok: true, admin: createAdminClient() };
  } catch {
    return {
      ok: false,
      error: "Custom domains need SUPABASE_SERVICE_ROLE_KEY configured on the server — ask the platform operator.",
    };
  }
}

// Looks up TXT records over DNS-over-HTTPS (Google, then Cloudflare) so
// verification behaves identically in dev and on any host, with no OS
// resolver in the loop. Returns the decoded record values; [] when the
// record doesn't exist; null when both resolvers were unreachable.
async function lookupTxtRecords(name: string): Promise<string[] | null> {
  const endpoints = [
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=TXT`,
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`,
  ];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: "application/dns-json" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const body = (await res.json()) as { Answer?: { type: number; data: string }[] };
      return (body.Answer ?? [])
        .filter((a) => a.type === 16)
        // Long TXT values arrive as multiple quoted chunks: "\"abc\" \"def\"".
        .map((a) => a.data.replace(/"\s+"/g, "").replace(/^"|"$/g, ""));
    } catch {
      continue;
    }
  }
  return null;
}

export async function setCustomDomain(_prevState: CustomDomainState, formData: FormData): Promise<CustomDomainState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");

  const domain = normalizeCustomDomain(String(formData.get("domain") ?? ""));
  if (!domain) {
    return { error: "Enter a bare domain like mzunguzanzibar.com — no https:// or slashes." };
  }
  if (isPlatformHost(domain) || isUnderPlatformApex(domain)) {
    return { error: "That domain belongs to the platform itself and can't be claimed — every community already gets its own platform subdomain automatically." };
  }

  const owned = await requireOwnedCommunity(communityId);
  if (!owned.ok) return { error: owned.error };

  const clientResult = adminClientOrError();
  if (!clientResult.ok) return { error: clientResult.error };
  const { admin } = clientResult;

  const { data: taken } = await admin
    .from("communities")
    .select("id")
    .eq("custom_domain", domain)
    .neq("id", communityId)
    .maybeSingle();
  if (taken) {
    return { error: "That domain is already connected to another community." };
  }

  // Changing the domain always restarts verification — a token proven for
  // one hostname says nothing about the next one.
  const tokenBytes = new Uint8Array(16);
  crypto.getRandomValues(tokenBytes);
  const token = `relate-verify-${Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;

  const { error } = await admin
    .from("communities")
    .update({ custom_domain: domain, custom_domain_token: token, custom_domain_verified_at: null })
    .eq("id", communityId);

  if (error) {
    // 23505 = unique_violation: someone claimed it between our check and now.
    return { error: error.code === "23505" ? "That domain is already connected to another community." : error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}

export async function verifyCustomDomain(_prevState: CustomDomainState, formData: FormData): Promise<CustomDomainState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");

  const owned = await requireOwnedCommunity(communityId);
  if (!owned.ok) return { error: owned.error };
  const { community } = owned;

  if (!community.custom_domain || !community.custom_domain_token) {
    return { error: "Connect a domain first." };
  }

  const records = await lookupTxtRecords(verificationRecordName(community.custom_domain));
  if (records === null) {
    return { error: "Couldn't reach a DNS resolver — try again in a moment." };
  }
  if (!records.includes(community.custom_domain_token)) {
    return {
      error: `We couldn't find your secret code on ${community.custom_domain} yet. DNS changes can take a few minutes (sometimes up to an hour) to travel — double-check record 1 (the TXT record at ${verificationRecordName(community.custom_domain)}) and try again in a bit.`,
    };
  }

  const clientResult = adminClientOrError();
  if (!clientResult.ok) return { error: clientResult.error };

  const { error } = await clientResult.admin
    .from("communities")
    .update({ custom_domain_verified_at: new Date().toISOString() })
    .eq("id", communityId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);

  // Ownership is proven and recorded at this point regardless of what the
  // hosting API says — a Vercel hiccup shouldn't force the owner to redo
  // DNS verification, so this failure is reported but doesn't roll back.
  const vercel = await addDomainToVercelProject(community.custom_domain);
  if ("ok" in vercel && !vercel.ok) {
    return {
      error: `Your domain is verified, but registering it with the hosting platform failed (${vercel.reason}). The platform operator may need to add it manually.`,
    };
  }

  return undefined;
}

export async function removeCustomDomain(_prevState: CustomDomainState, formData: FormData): Promise<CustomDomainState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");

  const owned = await requireOwnedCommunity(communityId);
  if (!owned.ok) return { error: owned.error };

  const clientResult = adminClientOrError();
  if (!clientResult.ok) return { error: clientResult.error };

  const { error } = await clientResult.admin
    .from("communities")
    .update({ custom_domain: null, custom_domain_token: null, custom_domain_verified_at: null })
    .eq("id", communityId);

  if (error) {
    return { error: error.message };
  }

  if (owned.community.custom_domain) {
    await removeDomainFromVercelProject(owned.community.custom_domain);
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}

export type DeleteCommunityState = { error: string } | undefined;

// Owner-only — mirrors the communities_delete_owner RLS policy in
// schema.sql (owner_id = auth.uid()), which is the real enforcement; this
// check just turns "the delete silently did nothing" into a clear error.
// Requires retyping the community's slug so this can't be a misclick.
export async function deleteCommunity(_prevState: DeleteCommunityState, formData: FormData): Promise<DeleteCommunityState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const confirmSlug = String(formData.get("confirm_slug") ?? "").trim();

  if (confirmSlug !== communitySlug) {
    return { error: "Type the community's URL exactly to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: community } = await supabase.from("communities").select("owner_id").eq("id", communityId).single();
  if (!community || community.owner_id !== user.id) {
    return { error: "Only the owner can delete this community." };
  }

  const { error } = await supabase.from("communities").delete().eq("id", communityId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Owner-only switch: whether non-owner admins may manage other staff. The
// owner check here gives a friendly error and hides the change from admins;
// the database trigger guard_admins_can_manage_staff is the real boundary and
// blocks the column for anyone but the owner regardless of entry point.
export async function setAdminsCanManageStaff(
  communityId: string,
  communitySlug: string,
  value: boolean
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: community } = await supabase.from("communities").select("owner_id").eq("id", communityId).single();
  if (!community || community.owner_id !== user.id) {
    return { error: "Only the owner can change this setting." };
  }

  const failure = requireWrite(
    await supabase.from("communities").update({ admins_can_manage_staff: value }).eq("id", communityId).select("id"),
    "this setting"
  );
  if (failure) return failure;

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}
