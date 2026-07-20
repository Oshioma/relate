"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils";
import type { ResourceType } from "@/types/database";

export type ResourceFormState = { error: string } | undefined;

const RESOURCE_TYPES: ResourceType[] = ["link", "file", "video", "document"];

export async function createResource(_prevState: ResourceFormState, formData: FormData): Promise<ResourceFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = formData.get("space_slug") ? String(formData.get("space_slug")) : null;
  const spaceId = String(formData.get("space_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const typeRaw = String(formData.get("resource_type") ?? "link");
  const resourceType = RESOURCE_TYPES.includes(typeRaw as ResourceType) ? (typeRaw as ResourceType) : "link";

  if (!title || !url || !spaceId) {
    return { error: "A title, space, and URL are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("resources").insert({
    community_id: communityId,
    space_id: spaceId,
    title,
    description: description || null,
    url,
    resource_type: resourceType,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/resources`);
  if (spaceSlug) {
    revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  }
  return undefined;
}
