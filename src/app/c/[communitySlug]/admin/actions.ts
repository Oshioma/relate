"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { SPACE_TYPE_LIST } from "@/lib/space-types";
import type { SpaceVisibility, SpaceType } from "@/types/database";

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

  if (!name) {
    return { error: "Give the space a name." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("spaces")
    .update({ name, description: description || null, visibility, space_type: spaceType })
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
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces`);
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

export async function reorderSpaces(
  order: { id: string; sort_order: number }[],
  communitySlug: string
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const results = await Promise.all(order.map((s) => supabase.from("spaces").update({ sort_order: s.sort_order }).eq("id", s.id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { error: failed.error.message };
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
