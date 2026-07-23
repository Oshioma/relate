"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { SPACE_TYPE_LIST } from "@/lib/space-types";
import { getPlaceLocationType } from "@/lib/community-templates";
import { defaultNavItemSort } from "@/lib/nav-items";
import { normalizeCustomDomain, isPlatformHost, isUnderPlatformApex, verificationRecordName } from "@/lib/custom-domain";
import { addDomainToVercelProject, removeDomainFromVercelProject } from "@/lib/vercel-domains";
import type { SpaceVisibility, SpaceType, Community, FeatureKey } from "@/types/database";

export type SpaceFormState = { error: string } | undefined;

const VISIBILITIES: SpaceVisibility[] = ["public", "members", "private"];
const SPACE_TYPES: SpaceType[] = SPACE_TYPE_LIST.map((t) => t.type);

function parseVisibility(raw: FormDataEntryValue | null): SpaceVisibility {
  const value = String(raw ?? "members");
  return VISIBILITIES.includes(value as SpaceVisibility) ? (value as SpaceVisibility) : "members";
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
  // Absent field ≠ empty field: only forms that render the location input
  // (resources spaces) may change it, so other edits can't silently wipe it.
  const rawLocationName = formData.get("location_name");
  const locationName = rawLocationName === null ? undefined : String(rawLocationName).trim().slice(0, 120) || null;

  if (!name) {
    return { error: "Give the space a name." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("spaces")
    .update({
      name,
      description: description || null,
      visibility,
      space_type: spaceType,
      ...(locationName !== undefined && { location_name: locationName }),
    })
    .eq("id", spaceId);

  if (error) {
    return { error: error.message };
  }

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
    location_name: original.location_name,
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
        ? supabase.from("spaces").update({ sort_order: item.sort_order }).eq("id", item.ref)
        : supabase
            .from("community_nav_item_order")
            .upsert(
              { community_id: communityId, item_key: item.ref as FeatureKey, sort_order: item.sort_order },
              { onConflict: "community_id,item_key" }
            )
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
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
    : await supabase.from("community_nav_item_order").insert({
        community_id: communityId,
        item_key: itemKey,
        sort_order: defaultNavItemSort(itemKey),
        show_in_nav: showInNav,
      });

  if (result.error) {
    return { error: result.error.message };
  }

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
  const locationName = String(formData.get("location_name") ?? "").trim();
  const rawLocationType = String(formData.get("location_type") ?? "");
  const locationType = getPlaceLocationType(rawLocationType) ? rawLocationType : null;
  const eventsPublic = formData.get("events_public") === "on";

  if (!name) {
    return { error: "Give your community a name." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("communities")
    .update({
      name,
      description: description || null,
      location_name: locationName.slice(0, 120) || null,
      location_type: locationType,
      events_public: eventsPublic,
    })
    .eq("id", communityId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
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
