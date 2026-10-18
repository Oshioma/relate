"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { navGroupKeyFor } from "@/lib/nav-groups";

// Sidebar sections. Every write here is also guarded by
// community_nav_groups_manage_admin, so a non-admin who reached these actions
// would simply have the write rejected.

export type NavGroupFormState = { error: string } | undefined;

const MAX_LABEL = 40;

function revalidate(communitySlug: string) {
  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}`, "layout");
}

function cleanLabel(raw: FormDataEntryValue | null): string {
  return String(raw ?? "").trim().replace(/\s+/g, " ");
}

export async function createNavGroup(_prevState: NavGroupFormState, formData: FormData): Promise<NavGroupFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const label = cleanLabel(formData.get("label"));

  if (!label) return { error: "Give the section a name." };
  if (label.length > MAX_LABEL) return { error: `Keep the name to ${MAX_LABEL} characters or fewer.` };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: existing, error: readError } = await supabase
    .from("community_nav_groups")
    .select("key, label, sort_order")
    .eq("community_id", communityId);
  if (readError) return { error: readError.message };

  const rows = existing ?? [];
  if (rows.some((row) => row.label.toLowerCase() === label.toLowerCase())) {
    return { error: `There is already a section called "${label}".` };
  }

  const { error } = await supabase.from("community_nav_groups").insert({
    community_id: communityId,
    key: navGroupKeyFor(label, rows.map((row) => row.key)),
    label,
    sort_order: rows.reduce((max, row) => Math.max(max, row.sort_order + 1), 0),
  });
  if (error) return { error: error.message };

  revalidate(communitySlug);
  return undefined;
}

// Renames change the label only. The key stays, so every space filed under the
// section stays filed under it.
export async function renameNavGroup(groupId: string, communitySlug: string, rawLabel: string) {
  const label = cleanLabel(rawLabel);
  if (!label) return { error: "Give the section a name." };
  if (label.length > MAX_LABEL) return { error: `Keep the name to ${MAX_LABEL} characters or fewer.` };

  const supabase = await createClient();
  const { error } = await supabase.from("community_nav_groups").update({ label }).eq("id", groupId);
  if (error) return { error: error.message };

  revalidate(communitySlug);
  return { error: null };
}

// Saves the whole order at once, as the ids in their new order.
export async function reorderNavGroups(communityId: string, communitySlug: string, orderedIds: string[]) {
  const supabase = await createClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("community_nav_groups").update({ sort_order: index }).eq("id", id).eq("community_id", communityId)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };

  revalidate(communitySlug);
  return { error: null };
}

// Removing a section ungroups its spaces (a database trigger does it, so it
// cannot be skipped). Nothing else is deleted.
export async function deleteNavGroup(groupId: string, communitySlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("community_nav_groups").delete().eq("id", groupId);
  if (error) return { error: error.message };

  revalidate(communitySlug);
  return { error: null };
}
