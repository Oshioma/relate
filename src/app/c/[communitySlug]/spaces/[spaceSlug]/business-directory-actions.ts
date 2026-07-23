"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_CATEGORIES, slugifyBusinessCategory } from "@/lib/business-categories";
import { scrapeWebsiteImages } from "@/lib/scrape-website-image";
import type { Database, BusinessCategory } from "@/types/database";

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

function parseBusinessFields(formData: FormData) {
  const imageUrl = parseImageUrl(formData.get("image_url"));
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    locationLabel: String(formData.get("location_label") ?? "").trim(),
    openingHours: String(formData.get("opening_hours") ?? "").trim(),
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

  // No image picked? Pull the website's share image so every listing gets one.
  const imageUrl = f.imageUrl ?? (f.website ? (await scrapeWebsiteImages(f.website))[0] ?? null : null);
  const category = await resolveCategory(supabase, spaceId, formData.get("category"));

  const { error } = await supabase.from("businesses").insert({
    space_id: spaceId,
    community_id: communityId,
    created_by: user.id,
    name: f.name,
    category,
    description: f.description || null,
    website: f.website || null,
    phone: f.phone || null,
    address: f.address || null,
    location_label: f.locationLabel || null,
    opening_hours: f.openingHours || null,
    lat: f.lat,
    lng: f.lng,
    image_url: imageUrl,
    image_position: f.imagePosition,
  });

  if (error) {
    return { error: error.message };
  }

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

  const { error } = await supabase
    .from("businesses")
    .update({
      name: f.name,
      category,
      description: f.description || null,
      website: f.website || null,
      phone: f.phone || null,
      address: f.address || null,
      location_label: f.locationLabel || null,
      opening_hours: f.openingHours || null,
      lat: f.lat,
      lng: f.lng,
      image_url: f.imageUrl,
      image_position: f.imagePosition,
    })
    .eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
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
  return { error: null };
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
    const { error } = await supabase
      .from("featured_business_categories")
      .upsert({ space_id: spaceId, community_id: communityId, category }, { onConflict: "space_id,category" });
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
