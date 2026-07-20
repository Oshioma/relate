"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils";

export type NavLinkFormState = { error: string } | undefined;

export async function createNavLink(_prevState: NavLinkFormState, formData: FormData): Promise<NavLinkFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const url = normalizeUrl(String(formData.get("url") ?? ""));

  if (!label || !url) {
    return { error: "A label and a URL are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { count } = await supabase
    .from("community_nav_links")
    .select("id", { count: "exact", head: true })
    .eq("community_id", communityId);

  const { error } = await supabase.from("community_nav_links").insert({
    community_id: communityId,
    label,
    url,
    sort_order: count ?? 0,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return undefined;
}

export async function deleteNavLink(linkId: string, communitySlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("community_nav_links").delete().eq("id", linkId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
  return { error: null };
}
