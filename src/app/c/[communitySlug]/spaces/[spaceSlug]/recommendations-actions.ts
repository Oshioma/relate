"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { RECOMMENDATION_CATEGORIES } from "@/lib/recommendation-categories";
import type { RecommendationCategory } from "@/types/database";

export type RecommendationFormState = { error: string } | undefined;

function parseCategory(raw: FormDataEntryValue | null): RecommendationCategory {
  const value = String(raw ?? "other");
  return RECOMMENDATION_CATEGORIES.some((c) => c.value === value) ? (value as RecommendationCategory) : "other";
}

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function createRecommendation(_prevState: RecommendationFormState, formData: FormData): Promise<RecommendationFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = parseCategory(formData.get("category"));
  const note = String(formData.get("note") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!title) {
    return { error: "Give your recommendation a title." };
  }
  if ((lat === null) !== (lng === null)) {
    return { error: "Set both latitude and longitude, or leave both blank." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("recommendations").insert({
    space_id: spaceId,
    community_id: communityId,
    recommended_by: user.id,
    category,
    title,
    note: note || null,
    location_label: locationLabel || null,
    lat,
    lng,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteRecommendation(recommendationId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("recommendations").delete().eq("id", recommendationId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function agreeWithRecommendation(recommendationId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("recommendation_votes").insert({ recommendation_id: recommendationId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function unagreeWithRecommendation(recommendationId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("recommendation_votes")
    .delete()
    .eq("recommendation_id", recommendationId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
