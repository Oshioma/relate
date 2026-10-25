"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { storeExternalImage } from "@/lib/timeline/bring-in-image";
import { circlePictureKey, circlePicturesInHtml, isCirclePictureUrl, withCopiedPictures } from "@/lib/circle-pictures";

// Copies the pictures a Circle import left on Circle's servers (members'
// profile photos, pictures inside guides and posts) into our own storage and points the
// rows at the copies. See src/lib/circle-pictures.ts for why.
//
// Profile photos belong to other people, so the writes use the service role;
// that is why only the owner or an admin may press it, and why it only ever
// touches the avatars of this community's own active members and this
// community's own guides and posts. Each copy is filed under its owner's folder in the
// uploads bucket, the same place their own uploads go.

export type CirclePicturesResult =
  | { error: string }
  | { ok: true; copied: number; stillToDo: number; failures: string[] };

/** Leave room inside the request's time limit; whatever is left waits for the next press. */
const TIME_BUDGET_MS = 45_000;

export async function bringCirclePicturesIn(communitySlug: string): Promise<CirclePicturesResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "That community no longer exists." };
  const membership = await getMembership(supabase, community.id, user.id);
  if (!isCommunityAdmin(community, membership, user.id)) return { error: "Only the owner or an admin can bring pictures in." };

  const admin = createAdminClient();
  const startedAt = Date.now();
  const outOfTime = () => Date.now() - startedAt > TIME_BUDGET_MS;
  let copied = 0;
  let stillToDo = 0;
  const failures: string[] = [];

  // Members' profile photos.
  const { data: members, error: membersError } = await admin
    .from("community_memberships")
    .select("user_id, profile:user_id (full_name, avatar_url)")
    .eq("community_id", community.id)
    .eq("status", "active");
  if (membersError) return { error: membersError.message };

  for (const row of (members ?? []) as unknown as { user_id: string; profile: { full_name: string | null; avatar_url: string | null } | null }[]) {
    const url = row.profile?.avatar_url;
    if (!isCirclePictureUrl(url)) continue;
    if (outOfTime()) {
      stillToDo++;
      continue;
    }
    const result = await storeExternalImage(admin, { url, userId: row.user_id, folder: "avatars", key: "from-circle" });
    if ("reason" in result) {
      failures.push(`${row.profile?.full_name || "A member"}'s photo: ${result.reason}`);
      continue;
    }
    const { error } = await admin.from("profiles").update({ avatar_url: result.url }).eq("id", row.user_id);
    if (error) failures.push(`${row.profile?.full_name || "A member"}'s photo was copied but not saved: ${error.message}`);
    else copied++;
  }

  // Pictures inside this community's guides and posts.
  const [guidesResult, postsResult] = await Promise.all([
    admin.from("guides").select("id, title, body, created_by").eq("community_id", community.id),
    admin.from("posts").select("id, title, body, author_id").eq("community_id", community.id),
  ]);
  if (guidesResult.error) return { error: guidesResult.error.message };
  if (postsResult.error) return { error: postsResult.error.message };
  const pieces = [
    ...(guidesResult.data ?? []).map((g) => ({ table: "guides" as const, id: g.id, title: g.title, body: g.body, ownerId: g.created_by })),
    ...(postsResult.data ?? []).map((p) => ({ table: "posts" as const, id: p.id, title: p.title, body: p.body, ownerId: p.author_id })),
  ];

  for (const piece of pieces) {
    const urls = circlePicturesInHtml(piece.body);
    if (urls.length === 0) continue;
    const swaps = new Map<string, string>();
    for (const [index, url] of urls.entries()) {
      if (outOfTime()) {
        stillToDo++;
        continue;
      }
      const result = await storeExternalImage(admin, {
        url,
        userId: piece.ownerId ?? user.id,
        folder: piece.table,
        key: circlePictureKey(`circle-${piece.id}`, index),
      });
      if ("url" in result) swaps.set(url, result.url);
      else failures.push(`A picture in "${piece.title}": ${result.reason}`);
    }
    if (swaps.size === 0) continue;
    const { error } = await admin
      .from(piece.table)
      .update({ body: withCopiedPictures(piece.body ?? "", swaps) })
      .eq("id", piece.id);
    if (error) failures.push(`"${piece.title}" had pictures copied but couldn't be saved: ${error.message}`);
    else copied += swaps.size;
  }

  if (copied > 0) {
    revalidatePath(`/c/${community.slug}`, "layout");
  }
  return { ok: true, copied, stillToDo, failures: failures.slice(0, 20) };
}
