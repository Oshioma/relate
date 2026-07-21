"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ClubFormState = { error: string } | undefined;

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function createClub(_prevState: ClubFormState, formData: FormData): Promise<ClubFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!name) {
    return { error: "Give the club a name." };
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

  const { data: club, error } = await supabase
    .from("clubs")
    .insert({
      space_id: spaceId,
      community_id: communityId,
      created_by: user.id,
      name,
      category: category || null,
      description: description || null,
      location_label: locationLabel || null,
      lat,
      lng,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // The creator joins their own club automatically — non-fatal if it fails.
  await supabase.from("club_members").insert({ club_id: club.id, user_id: user.id });

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteClub(clubId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clubs").delete().eq("id", clubId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function joinClub(clubId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("club_members").insert({ club_id: clubId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function leaveClub(clubId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("club_members").delete().eq("club_id", clubId).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
