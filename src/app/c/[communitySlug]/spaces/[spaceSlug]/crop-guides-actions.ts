"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCropDetail, getCropTips, getCropJournals, computeJournalStats, getCrops } from "@/lib/data/crop-guides";
import { buildCropContext, askCropAssistant } from "@/lib/ai/crop-assistant";
import { scanPlant, type PlantScanResult, type AnthropicImageMediaType } from "@/lib/ai/plant-scanner";
import { identifyPlant, type PlantIdResult } from "@/lib/ai/plant-id";

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

// --- AI Growing Assistant ---------------------------------------------------

export type CropAssistantState = { question?: string; answer?: string; error?: string } | undefined;

// Grounds the answer in the crop guide + this community's tips/journals + the
// current season and moon phase. Members only. Returns a friendly message when
// the assistant isn't configured (no ANTHROPIC_API_KEY) rather than erroring.
export async function askCropQuestion(_prevState: CropAssistantState, formData: FormData): Promise<CropAssistantState> {
  const cropSlug = String(formData.get("crop_slug") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const question = String(formData.get("question") ?? "").trim();

  if (!question) {
    return { error: "Type a question first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { question, error: "You need to be signed in." };
  }

  const detail = await getCropDetail(supabase, cropSlug);
  if (!detail) {
    return { question, error: "Crop not found." };
  }

  const [tips, journals] = await Promise.all([
    getCropTips(supabase, detail.crop.id, communityId),
    getCropJournals(supabase, detail.crop.id, communityId),
  ]);

  const approvedTips = tips.filter((t) => t.approved).map((t) => ({ region: t.region, body: t.body }));
  const context = buildCropContext(detail, approvedTips, computeJournalStats(journals), new Date());

  const answer = await askCropAssistant(detail.crop.common_name, question, context);
  if (!answer) {
    return { question, error: "The growing assistant isn't available right now." };
  }

  return { question, answer };
}

// --- Medicinal uses ---------------------------------------------------------

export type CropMedicinalFormState = { error: string } | undefined;

export async function addMedicinalUse(_prevState: CropMedicinalFormState, formData: FormData): Promise<CropMedicinalFormState> {
  const cropId = String(formData.get("crop_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");
  const ailment = String(formData.get("ailment") ?? "").trim();

  if (!ailment) {
    return { error: "Name the ailment or use." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  // approved is forced false for non-staff by the DB trigger.
  const { error } = await supabase.from("crop_medicinal_uses").insert({
    crop_id: cropId,
    community_id: communityId,
    created_by: user.id,
    ailment,
    part_used: optionalText(formData, "part_used"),
    preparation: optionalText(formData, "preparation"),
    description: optionalText(formData, "description"),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
  return undefined;
}

export async function setMedicinalUseApproved(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const approved = String(formData.get("approved") ?? "") === "true";
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("crop_medicinal_uses").update({ approved }).eq("id", id);

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
}

export async function deleteMedicinalUse(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const cropSlug = String(formData.get("crop_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("crop_medicinal_uses").delete().eq("id", id);

  revalidatePath(cropPath(communitySlug, spaceSlug, cropSlug));
}

// --- Plant Health Scanner ---------------------------------------------------

export type PlantScanState =
  | { imageUrl?: string; result?: PlantScanResult; matchedSlug?: string | null; matchedName?: string | null; error?: string }
  | undefined;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // Anthropic image limit ballpark

function normaliseMediaType(contentType: string | null): AnthropicImageMediaType | null {
  const ct = (contentType ?? "").toLowerCase();
  if (ct.includes("jpeg") || ct.includes("jpg")) return "image/jpeg";
  if (ct.includes("png")) return "image/png";
  if (ct.includes("webp")) return "image/webp";
  if (ct.includes("gif")) return "image/gif";
  return null;
}

// Diagnose an uploaded plant photo and, when the AI's crop guess matches a crop
// in the library, return that crop's slug so the UI can deep-link into its
// guide. Members only; grounded organic advice comes from the vision model.
export async function scanPlantAction(_prevState: PlantScanState, formData: FormData): Promise<PlantScanState> {
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  if (!imageUrl) {
    return { error: "Upload a photo first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  let base64: string;
  let mediaType: AnthropicImageMediaType;
  try {
    const res = await fetch(imageUrl, { cache: "no-store" });
    if (!res.ok) return { imageUrl, error: "Couldn't read that image." };
    const mt = normaliseMediaType(res.headers.get("content-type"));
    if (!mt) return { imageUrl, error: "Please upload a JPEG, PNG, WebP or GIF image." };
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_IMAGE_BYTES) return { imageUrl, error: "That image is too large — try one under 5MB." };
    base64 = Buffer.from(buf).toString("base64");
    mediaType = mt;
  } catch {
    return { imageUrl, error: "Couldn't read that image." };
  }

  const result = await scanPlant(base64, mediaType);
  if (!result) {
    return { imageUrl, error: "The plant scanner isn't available right now." };
  }

  // Deep-link: match the AI's crop guess to a crop in the library by name.
  let matchedSlug: string | null = null;
  let matchedName: string | null = null;
  if (result.crop_guess) {
    const guess = result.crop_guess.toLowerCase();
    const crops = await getCrops(supabase);
    const match = crops.find((c) => {
      const name = c.common_name.toLowerCase();
      return guess.includes(name) || name.includes(guess);
    });
    if (match) {
      matchedSlug = match.slug;
      matchedName = match.common_name;
    }
  }

  return { imageUrl, result, matchedSlug, matchedName };
}

// --- Plant ID ---------------------------------------------------------------

export type PlantIdState =
  | { imageUrl?: string; result?: PlantIdResult; matchedSlug?: string | null; matchedName?: string | null; error?: string }
  | undefined;

// Identify an uploaded plant photo and, when the AI's name matches a crop in the
// library, return that crop's slug so the UI can deep-link into its guide.
export async function identifyPlantAction(_prevState: PlantIdState, formData: FormData): Promise<PlantIdState> {
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  if (!imageUrl) {
    return { error: "Upload a photo first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  let base64: string;
  let mediaType: AnthropicImageMediaType;
  try {
    const res = await fetch(imageUrl, { cache: "no-store" });
    if (!res.ok) return { imageUrl, error: "Couldn't read that image." };
    const mt = normaliseMediaType(res.headers.get("content-type"));
    if (!mt) return { imageUrl, error: "Please upload a JPEG, PNG, WebP or GIF image." };
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_IMAGE_BYTES) return { imageUrl, error: "That image is too large — try one under 5MB." };
    base64 = Buffer.from(buf).toString("base64");
    mediaType = mt;
  } catch {
    return { imageUrl, error: "Couldn't read that image." };
  }

  const result = await identifyPlant(base64, mediaType);
  if (!result) {
    return { imageUrl, error: "Plant identification isn't available right now." };
  }

  let matchedSlug: string | null = null;
  let matchedName: string | null = null;
  if (result.common_name) {
    const guess = result.common_name.toLowerCase();
    const crops = await getCrops(supabase);
    const match = crops.find((c) => {
      const name = c.common_name.toLowerCase();
      return guess.includes(name) || name.includes(guess);
    });
    if (match) {
      matchedSlug = match.slug;
      matchedName = match.common_name;
    }
  }

  return { imageUrl, result, matchedSlug, matchedName };
}

// --- Community crop proposals ------------------------------------------------

export type CropProposalFormState = { error: string } | undefined;

function spacePath(communitySlug: string, spaceSlug: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}`;
}

export async function proposeCrop(_prevState: CropProposalFormState, formData: FormData): Promise<CropProposalFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const commonName = String(formData.get("common_name") ?? "").trim();

  if (!commonName) {
    return { error: "Give the crop a name." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  const bool = (key: string) => formData.get(key) === "on" || formData.get(key) === "true";

  const { error } = await supabase.from("crop_proposals").insert({
    community_id: communityId,
    created_by: user.id,
    common_name: commonName,
    scientific_name: optionalText(formData, "scientific_name"),
    family: optionalText(formData, "family"),
    category: String(formData.get("category") ?? "vegetable") || "vegetable",
    difficulty: optionalText(formData, "difficulty"),
    lifecycle: optionalText(formData, "lifecycle"),
    overview: optionalText(formData, "overview"),
    preferred_climate: optionalText(formData, "preferred_climate"),
    sun: optionalText(formData, "sun"),
    water_need: optionalText(formData, "water_need"),
    edible_part: optionalText(formData, "edible_part"),
    time_to_maturity_days: optionalNumber(formData, "time_to_maturity_days"),
    beginner_friendly: bool("beginner_friendly"),
    pollinator_friendly: bool("pollinator_friendly"),
    nitrogen_fixer: bool("nitrogen_fixer"),
    drought_tolerant: bool("drought_tolerant"),
    organic_favourite: bool("organic_favourite"),
    image_url: optionalText(formData, "image_url"),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(spacePath(communitySlug, spaceSlug));
  return undefined;
}

// Super admin: set or clear a crop's hero photo from its guide page. The crops
// table is super-admin-write (RLS), so this update simply no-ops for anyone
// else; we still check up front to return a clear message rather than a silent
// success. Pass an empty imageUrl to remove the photo.
export async function setCropImageUrl(input: {
  slug: string;
  imageUrl: string;
  communitySlug: string;
  spaceSlug: string;
}): Promise<{ error?: string }> {
  const slug = input.slug.trim();
  const imageUrl = input.imageUrl.trim();
  if (!slug) return { error: "Missing crop." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: profile } = await supabase.from("profiles").select("is_super_admin").eq("id", user.id).maybeSingle();
  if (!profile?.is_super_admin) return { error: "Only a super admin can change a crop photo." };

  const { error } = await supabase.from("crops").update({ image_url: imageUrl || null }).eq("slug", slug);
  if (error) return { error: error.message };

  revalidatePath(cropPath(input.communitySlug, input.spaceSlug, slug));
  return {};
}

// Staff: promote a proposal into the global crops library via the SECURITY
// DEFINER RPC (which re-checks staff and creates the published crop).
export async function approveCropProposal(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const supabase = await createClient();
  await supabase.rpc("approve_crop_proposal", { p_proposal_id: id });

  revalidatePath(spacePath(communitySlug, spaceSlug));
}

export async function rejectCropProposal(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const note = String(formData.get("reviewer_note") ?? "").trim() || null;

  const supabase = await createClient();
  await supabase.from("crop_proposals").update({ status: "rejected", reviewer_note: note }).eq("id", id);

  revalidatePath(spacePath(communitySlug, spaceSlug));
}

export async function deleteCropProposal(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const supabase = await createClient();
  await supabase.from("crop_proposals").delete().eq("id", id);

  revalidatePath(spacePath(communitySlug, spaceSlug));
}
