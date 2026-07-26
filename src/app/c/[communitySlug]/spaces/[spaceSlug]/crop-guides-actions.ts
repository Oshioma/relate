"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CropRegionFormState = { error: string } | undefined;

// Create a community-defined growing region (e.g. "Zanzibar", "Kenya
// Highlands"). Only community admins may do this — enforced by RLS on
// community_crop_regions; the action surfaces any error rather than assuming
// success.
export async function createCommunityRegion(_prevState: CropRegionFormState, formData: FormData): Promise<CropRegionFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const baseRegionId = String(formData.get("base_region_id") ?? "").trim();

  if (!name) {
    return { error: "Give the region a name." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("community_crop_regions").insert({
    community_id: communityId,
    name,
    base_region_id: baseRegionId || null,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteCommunityRegion(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("community_crop_regions").delete().eq("id", id);

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
}

// --- Growing journals -------------------------------------------------------

export type CropJournalFormState = { error: string } | undefined;

function cropPath(communitySlug: string, spaceSlug: string, cropSlug: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}/crop-guides/${cropSlug}`;
}

function optionalText(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v || null;
}

function optionalNumber(formData: FormData, key: string): number | null {
  const v = String(formData.get(key) ?? "").trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function addGrowingJournal(_prevState: CropJournalFormState, formData: FormData): Promise<CropJournalFormState> {
  const cropId = String(formData.get("crop_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  const rating = optionalNumber(formData, "success_rating");

  const { error } = await supabase.from("crop_growing_journals").insert({
    crop_id: cropId,
    community_id: communityId,
    user_id: user.id,
    variety: optionalText(formData, "variety"),
    planted_on: optionalText(formData, "planted_on"),
    harvested_on: optionalText(formData, "harvested_on"),
    climate: optionalText(formData, "climate"),
    location: optionalText(formData, "location"),
    yield_kg: optionalNumber(formData, "yield_kg"),
    problems: optionalText(formData, "problems"),
    solutions: optionalText(formData, "solutions"),
    weather: optionalText(formData, "weather"),
    success_rating: rating != null ? Math.min(5, Math.max(1, Math.round(rating))) : null,
    notes: optionalText(formData, "notes"),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
  return undefined;
}

export async function deleteGrowingJournal(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("crop_growing_journals").delete().eq("id", id);

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
}

// --- Regional tips ----------------------------------------------------------

export type CropTipFormState = { error: string } | undefined;

export async function addCommunityTip(_prevState: CropTipFormState, formData: FormData): Promise<CropTipFormState> {
  const cropId = String(formData.get("crop_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { error: "Write your tip before submitting it." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  // approved is forced false for non-staff by the DB trigger.
  const { error } = await supabase.from("crop_community_tips").insert({
    crop_id: cropId,
    community_id: communityId,
    created_by: user.id,
    region: optionalText(formData, "region"),
    body,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
  return undefined;
}

// Staff moderation: approve or unapprove a tip. RLS + the privileged-field
// trigger ensure only staff can actually flip `approved`.
export async function setCommunityTipApproved(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const approved = String(formData.get("approved") ?? "") === "true";
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("crop_community_tips").update({ approved }).eq("id", id);

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
}

export async function deleteCommunityTip(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("crop_community_tips").delete().eq("id", id);

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
}

// --- Saved crops ------------------------------------------------------------

export async function toggleSaveCrop(formData: FormData): Promise<void> {
  const cropId = String(formData.get("crop_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");
  const currentlySaved = String(formData.get("saved") ?? "") === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (currentlySaved) {
    await supabase.from("crop_saves").delete().eq("user_id", user.id).eq("crop_id", cropId);
  } else {
    await supabase.from("crop_saves").insert({ user_id: user.id, crop_id: cropId, community_id: communityId || null });
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  if (cropSlug) revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
}
