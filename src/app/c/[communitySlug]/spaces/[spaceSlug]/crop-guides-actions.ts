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
