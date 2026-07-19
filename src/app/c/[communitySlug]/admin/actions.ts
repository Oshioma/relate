"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { SpaceVisibility } from "@/types/database";

export type SpaceFormState = { error: string } | undefined;

const VISIBILITIES: SpaceVisibility[] = ["public", "members", "private"];

export async function createSpace(_prevState: SpaceFormState, formData: FormData): Promise<SpaceFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const visibilityRaw = String(formData.get("visibility") ?? "members");
  const visibility = VISIBILITIES.includes(visibilityRaw as SpaceVisibility) ? (visibilityRaw as SpaceVisibility) : "members";
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

export type CommunityDetailsState = { error: string } | undefined;

export async function updateCommunityDetails(
  _prevState: CommunityDetailsState,
  formData: FormData
): Promise<CommunityDetailsState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    return { error: "Give your community a name." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("communities")
    .update({ name, description: description || null })
    .eq("id", communityId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  revalidatePath("/dashboard");
  return undefined;
}
