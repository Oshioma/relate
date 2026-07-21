"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import type { BusinessCategory } from "@/types/database";

export type BusinessFormState = { error: string } | undefined;

function parseCategory(raw: FormDataEntryValue | null): BusinessCategory {
  const value = String(raw ?? "other");
  return BUSINESS_CATEGORIES.some((c) => c.value === value) ? (value as BusinessCategory) : "other";
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
    category: parseCategory(formData.get("category")),
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

// og:image / twitter:image in either attribute order, then plain <img> tags.
const META_IMAGE_PATTERNS = [
  /<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]+content=["']([^"']+)["']/gi,
  /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["']/gi,
  /<img[^>]+src=["']([^"']+)["']/gi,
];

const MAX_CANDIDATES = 12;

// Best-effort scrape of candidate images from a business's website: share
// images first (usually the best), then images on the page. Returns [] rather
// than throwing — an unreachable or imageless site just means the listing has
// no image until the member uploads one.
async function scrapeWebsiteImages(website: string): Promise<string[]> {
  let url: URL;
  try {
    url = new URL(website);
  } catch {
    return [];
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return [];

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; RelateBot/1.0; +https://relate.app)", accept: "text/html" },
    });
    if (!response.ok) return [];
    const html = (await response.text()).slice(0, 500_000);
    const base = response.url || url;

    const found: string[] = [];
    for (const pattern of META_IMAGE_PATTERNS) {
      for (const match of html.matchAll(pattern)) {
        const raw = match[1].replace(/&amp;/g, "&");
        if (raw.startsWith("data:") || /\.svg(\?|$)/i.test(raw)) continue;
        try {
          const resolved = new URL(raw, base).toString();
          if (/^https?:\/\//.test(resolved) && !found.includes(resolved)) {
            found.push(resolved);
            if (found.length >= MAX_CANDIDATES) return found;
          }
        } catch {
          // Malformed src attribute — skip it.
        }
      }
    }
    return found;
  } catch {
    // Timeout, DNS failure, TLS error — treat all as "no image found".
    return [];
  }
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

  const { error } = await supabase.from("businesses").insert({
    space_id: spaceId,
    community_id: communityId,
    created_by: user.id,
    name: f.name,
    category: f.category,
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

  const { error } = await supabase
    .from("businesses")
    .update({
      name: f.name,
      category: f.category,
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
