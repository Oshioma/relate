"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_CATEGORIES, slugifyBusinessCategory, isBuiltInBusinessCategory } from "@/lib/business-categories";
import { scrapeWebsiteImages } from "@/lib/scrape-website-image";
import { scheduleToText } from "@/lib/opening-hours";
import type { Database, BusinessCategory, BusinessHoursSchedule } from "@/types/database";

export type BusinessFormState = { error: string } | undefined;

// A valid category is a built-in value or a custom category slug staff added
// to this space (business_custom_categories); anything else folds to 'other'.
async function resolveCategory(
  supabase: SupabaseClient<Database>,
  spaceId: string,
  raw: FormDataEntryValue | null
): Promise<BusinessCategory> {
  const value = String(raw ?? "other");
  if (BUSINESS_CATEGORIES.some((c) => c.value === value)) return value;
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(value)) return "other";
  const { data } = await supabase
    .from("business_custom_categories")
    .select("slug")
    .eq("space_id", spaceId)
    .eq("slug", value)
    .maybeSingle();
  return data ? value : "other";
}

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function parseImageUrl(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return /^https?:\/\//.test(value) ? value : null;
}

// How the image is panned inside its crop box, as a CSS object-position
// value like "50% 25%" — set by dragging the preview in the form.
function parseImagePosition(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return /^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(value) ? value : null;
}

function isValidPosition(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(value);
}

type ParsedImage = { url: string; position: string | null };

// The gallery editor sends its photos as a JSON array of {url, position} in a
// hidden `images` field. First entry is the cover. Bad rows are dropped and the
// list is capped so a listing can't attach an unbounded number of photos.
const MAX_IMAGES = 12;

function parseImages(raw: FormDataEntryValue | null): ParsedImage[] {
  const value = String(raw ?? "").trim();
  if (!value) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<string>();
  const images: ParsedImage[] = [];
  for (const entry of parsed) {
    if (images.length >= MAX_IMAGES) break;
    const url = typeof entry?.url === "string" ? entry.url.trim() : "";
    if (!/^https?:\/\//.test(url) || seen.has(url)) continue;
    seen.add(url);
    images.push({ url, position: isValidPosition(entry?.position) ? entry.position : null });
  }
  return images;
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

// The weekly hours editor sends a per-day schedule as JSON. We validate every
// day, keep only well-formed entries, and regenerate the human-readable
// opening_hours text from the schedule so legacy consumers keep a display value.
// Returns nulls when nothing usable is provided.
function parseSchedule(raw: FormDataEntryValue | null): { schedule: BusinessHoursSchedule | null; text: string | null } {
  const value = String(raw ?? "").trim();
  if (!value) return { schedule: null, text: null };
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { schedule: null, text: null };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { schedule: null, text: null };

  const source = parsed as Record<string, { closed?: unknown; open?: unknown; close?: unknown }>;
  const schedule: BusinessHoursSchedule = {};
  let hasOpen = false;
  for (const key of ["0", "1", "2", "3", "4", "5", "6"]) {
    const entry = source[key];
    if (!entry || typeof entry !== "object") continue;
    if (entry.closed) {
      schedule[key] = { closed: true, open: "09:00", close: "17:00" };
      continue;
    }
    const open = typeof entry.open === "string" && HHMM.test(entry.open) ? entry.open : null;
    const close = typeof entry.close === "string" && HHMM.test(entry.close) ? entry.close : null;
    if (!open || !close) continue;
    schedule[key] = { closed: false, open, close };
    hasOpen = true;
  }

  if (!hasOpen) return { schedule: null, text: null };
  const text = scheduleToText(schedule);
  return { schedule, text: text || null };
}

// Replace a listing's gallery with `images` (author/staff only, enforced by
// business_images RLS). We clear and re-insert rather than diff — the list is
// small and ordering is significant, so a rewrite keeps sort_order honest.
async function syncBusinessImages(
  supabase: SupabaseClient<Database>,
  businessId: string,
  userId: string,
  images: ParsedImage[]
) {
  await supabase.from("business_images").delete().eq("business_id", businessId);
  if (images.length === 0) return;
  await supabase.from("business_images").insert(
    images.map((image, index) => ({
      business_id: businessId,
      url: image.url,
      position: image.position,
      sort_order: index,
      created_by: userId,
    }))
  );
}

function parseBusinessFields(formData: FormData) {
  const imageUrl = parseImageUrl(formData.get("image_url"));
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    locationLabel: String(formData.get("location_label") ?? "").trim(),
    // Native checkbox: present in the payload only when ticked.
    isLocal: formData.get("is_local") != null,
    lat: parseCoordinate(formData.get("lat"), -90, 90),
    lng: parseCoordinate(formData.get("lng"), -180, 180),
    imageUrl,
    imagePosition: imageUrl ? parseImagePosition(formData.get("image_position")) : null,
  };
}

function validateBusinessFields(f: ReturnType<typeof parseBusinessFields>): string | null {
  if (!f.name) return "Give the business a name.";
  if ((f.lat === null) !== (f.lng === null)) return "Set both latitude and longitude, or leave both blank.";
  return null;
}

export async function fetchWebsiteImages(website: string): Promise<{ images: string[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { images: [], error: "You need to be signed in." };
  }

  const images = await scrapeWebsiteImages(website);
  return images.length > 0 ? { images } : { images: [], error: "Couldn't find an image on that website." };
}

export async function createBusiness(_prevState: BusinessFormState, formData: FormData): Promise<BusinessFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const f = parseBusinessFields(formData);

  const invalid = validateBusinessFields(f);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  // Gallery photos from the form. Empty? Pull the website's share image so
  // every listing still gets a cover, matching the old single-image behaviour.
  let images = parseImages(formData.get("images"));
  if (images.length === 0 && f.website) {
    const scraped = (await scrapeWebsiteImages(f.website))[0] ?? null;
    if (scraped) images = [{ url: scraped, position: null }];
  }
  const cover = images[0] ?? null;
  const { schedule: hoursSchedule, text: hoursText } = parseSchedule(formData.get("opening_hours_structured"));
  const category = await resolveCategory(supabase, spaceId, formData.get("category"));

  const { data: created, error } = await supabase
    .from("businesses")
    .insert({
      space_id: spaceId,
      community_id: communityId,
      created_by: user.id,
      name: f.name,
      category,
      is_local: f.isLocal,
      description: f.description || null,
      website: f.website || null,
      phone: f.phone || null,
      address: f.address || null,
      location_label: f.locationLabel || null,
      opening_hours: hoursText,
      opening_hours_structured: hoursSchedule,
      lat: f.lat,
      lng: f.lng,
      image_url: cover?.url ?? null,
      image_position: cover?.position ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await syncBusinessImages(supabase, created.id, user.id, images);

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

// RLS (businesses_update_author_or_staff) restricts this to the listing's
// creator or community staff — anyone else's update matches zero rows.
export async function updateBusiness(_prevState: BusinessFormState, formData: FormData): Promise<BusinessFormState> {
  const businessId = String(formData.get("business_id") ?? "");
  const spaceId = String(formData.get("space_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const f = parseBusinessFields(formData);

  const invalid = validateBusinessFields(f);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const category = await resolveCategory(supabase, spaceId, formData.get("category"));
  const images = parseImages(formData.get("images"));
  const cover = images[0] ?? null;
  const { schedule: hoursSchedule, text: hoursText } = parseSchedule(formData.get("opening_hours_structured"));

  const { error } = await supabase
    .from("businesses")
    .update({
      name: f.name,
      category,
      is_local: f.isLocal,
      description: f.description || null,
      website: f.website || null,
      phone: f.phone || null,
      address: f.address || null,
      location_label: f.locationLabel || null,
      opening_hours: hoursText,
      opening_hours_structured: hoursSchedule,
      lat: f.lat,
      lng: f.lng,
      image_url: cover?.url ?? null,
      image_position: cover?.position ?? null,
    })
    .eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  await syncBusinessImages(supabase, businessId, user.id, images);

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/businesses/${businessId}`);
  return undefined;
}

export async function deleteBusiness(businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").delete().eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// verified/featured are also enforced staff-only at the database level (see
// enforce_business_privileged_fields in supabase/business-directory.sql) —
// this check just gives a member a clear error instead of a silent no-op.
export async function setBusinessBadge(
  businessId: string,
  field: "verified" | "featured",
  value: boolean,
  communitySlug: string,
  spaceSlug: string
) {
  const supabase = await createClient();
  const patch = field === "verified" ? { verified: value } : { featured: value };
  const { error } = await supabase.from("businesses").update(patch).eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/businesses/${businessId}`);
  return { error: null };
}

// Bookmark or un-bookmark a listing for the current member. Returns the new
// saved state so the button can update without a full refresh. business_saves
// RLS scopes rows to auth.uid(), so a member only ever toggles their own.
export async function toggleSaveBusiness(businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("business_saves")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  if (existing) {
    const { error } = await supabase.from("business_saves").delete().eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
    return { saved: false };
  }

  const { error } = await supabase.from("business_saves").insert({ business_id: businessId, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { saved: true };
}

// Staff-only (enforced by RLS on featured_business_categories): feature a
// category so it appears as a nav sub-link under the directory, or remove it.
export async function setCategoryFeatured(
  spaceId: string,
  communityId: string,
  category: BusinessCategory,
  featured: boolean,
  communitySlug: string
) {
  const supabase = await createClient();

  if ((await resolveCategory(supabase, spaceId, category)) !== category) {
    return { error: "Unknown category." };
  }

  if (featured) {
    // New sub-links append to the end of this space's nav order (mirrors how a
    // new space picks up the next sort_order), so pinning never reshuffles the
    // links staff have already arranged.
    const { data: last } = await supabase
      .from("featured_business_categories")
      .select("sort_order")
      .eq("space_id", spaceId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (last?.sort_order ?? -1) + 1;
    const { error } = await supabase
      .from("featured_business_categories")
      .upsert(
        { space_id: spaceId, community_id: communityId, category, sort_order: sortOrder },
        { onConflict: "space_id,category" }
      );
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("featured_business_categories")
      .delete()
      .eq("space_id", spaceId)
      .eq("category", category);
    if (error) return { error: error.message };
  }

  // The sub-links live in the community layout's nav, so revalidate the layout.
  revalidatePath(`/c/${communitySlug}`, "layout");
  return { error: null };
}

// Staff-only (enforced by RLS on featured_business_categories): write a new
// order for a directory space's nav sub-links. `orderedCategories` is the full
// list of that space's featured categories in the desired order; each row's
// sort_order becomes its index, so the left nav renders them exactly this way.
export async function reorderFeaturedCategories(
  spaceId: string,
  orderedCategories: BusinessCategory[],
  communitySlug: string
) {
  const supabase = await createClient();

  const results = await Promise.all(
    orderedCategories.map((category, i) =>
      supabase
        .from("featured_business_categories")
        .update({ sort_order: i })
        .eq("space_id", spaceId)
        .eq("category", category)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  // The sub-links live in the community layout's nav, so revalidate the layout.
  revalidatePath(`/c/${communitySlug}`, "layout");
  return { error: null };
}

// Staff-only (enforced by RLS on business_custom_categories): add a category
// beyond the built-ins — "Fundi", "Boda Boda" — scoped to this directory space.
export async function addBusinessCategory(
  spaceId: string,
  communityId: string,
  label: string,
  communitySlug: string,
  spaceSlug: string
) {
  const trimmed = label.trim().slice(0, 40);
  const slug = slugifyBusinessCategory(trimmed);
  if (!trimmed || !slug) {
    return { error: "Give the category a name." };
  }
  if (BUSINESS_CATEGORIES.some((c) => c.value === slug)) {
    return { error: "That category already exists." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("business_custom_categories").insert({
    space_id: spaceId,
    community_id: communityId,
    created_by: user.id,
    slug,
    label: trimmed,
  });

  if (error) {
    // 23505 = the unique (space_id, slug) constraint.
    return { error: error.code === "23505" ? "That category already exists." : error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null, slug };
}

// Staff-only: rename a category's display label without touching the value
// stored on businesses. A built-in (Activity → Experiences) gets a per-space
// label override upserted into business_category_label_overrides; a custom
// category renames its own row. Renaming a built-in back to its shipped label
// clears the override. The labels live in the nav, so revalidate the layout.
export async function renameBusinessCategory(
  spaceId: string,
  communityId: string,
  category: BusinessCategory,
  label: string,
  communitySlug: string
) {
  const trimmed = label.trim().slice(0, 40);
  if (!trimmed) {
    return { error: "Give the category a name." };
  }

  const supabase = await createClient();

  if (isBuiltInBusinessCategory(category)) {
    const builtInDefault = BUSINESS_CATEGORIES.find((c) => c.value === category)?.label;
    if (builtInDefault && trimmed === builtInDefault) {
      // Back to the shipped label — drop the override rather than store a no-op.
      const { error } = await supabase
        .from("business_category_label_overrides")
        .delete()
        .eq("space_id", spaceId)
        .eq("category", category);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("business_category_label_overrides")
        .upsert(
          { space_id: spaceId, community_id: communityId, category, label: trimmed },
          { onConflict: "space_id,category" }
        );
      if (error) return { error: error.message };
    }
  } else {
    // Custom category: rename its own row (matched by its slug within the space).
    const { error } = await supabase
      .from("business_custom_categories")
      .update({ label: trimmed })
      .eq("space_id", spaceId)
      .eq("slug", category);
    if (error) return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}`, "layout");
  return { error: null };
}

// Staff-only. A DB trigger folds the category's listings back into 'other'
// and removes any nav sub-link featuring it, so revalidate the layout too.
export async function deleteBusinessCategory(categoryId: string, communitySlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("business_custom_categories").delete().eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}`, "layout");
  return { error: null };
}
