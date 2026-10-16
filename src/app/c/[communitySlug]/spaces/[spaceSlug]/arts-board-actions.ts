"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SIXTY_FOUR_ARTS, isArtNumber } from "@/lib/arts/sixty-four-arts";
import { getArtsShareTarget } from "@/lib/data/arts-board";
import { splitPostMedia } from "@/lib/post-media";

const MAX_PHOTOS = 4;

type Ctx =
  | { error: string }
  | { supabase: Awaited<ReturnType<typeof createClient>>; userId: string; communityId: string; isStaff: boolean };

// Every write re-checks that the caller is an active member of the board's
// community rather than trusting the UI; RLS refuses the write regardless.
async function boardMember(spaceId: string, artNumber: number): Promise<Ctx> {
  if (!isArtNumber(artNumber)) return { error: "That isn't one of the 64 arts." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: space } = await supabase.from("spaces").select("id, community_id, space_type").eq("id", spaceId).maybeSingle();
  if (!space || space.space_type !== "arts_board") return { error: "Board not found." };

  const { data: membership } = await supabase
    .from("community_memberships")
    .select("status, role")
    .eq("community_id", space.community_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (membership?.status !== "active") return { error: "Join this community to keep your family's board." };

  const isStaff = membership.role === "owner" || membership.role === "admin" || membership.role === "moderator";
  return { supabase, userId: user.id, communityId: space.community_id, isStaff };
}

// Photos must be the member's own uploads (see PhotoPicker): anything else is
// dropped rather than stored, so a board can't be made to show a stranger's
// image or an arbitrary link.
function ownPhotos(urls: string[], userId: string): string[] {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${userId}/`;
  return urls.filter((u) => typeof u === "string" && u.startsWith(prefix)).slice(0, MAX_PHOTOS);
}

// A family's tick, note and photos on one square of a 64 Arts board: one row
// per family per art, written over. A square with nothing left on it (no
// tick, note, photos or share) loses its row rather than keeping an empty one.
export async function setArtMark(
  spaceId: string,
  artNumber: number,
  mark: { done: boolean; note: string; photoUrls: string[] },
  communitySlug: string,
  spaceSlug: string
): Promise<{ error: string | null }> {
  const ctx = await boardMember(spaceId, artNumber);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, userId } = ctx;

  const note = mark.note.trim().slice(0, 1000) || null;
  const photoUrls = ownPhotos(mark.photoUrls, userId);

  const { data: existing } = await supabase
    .from("arts_board_marks")
    .select("shared_post_id")
    .eq("space_id", spaceId)
    .eq("user_id", userId)
    .eq("art_number", artNumber)
    .maybeSingle();

  const empty = !mark.done && !note && photoUrls.length === 0 && !existing?.shared_post_id;
  const { error } = empty
    ? await supabase.from("arts_board_marks").delete().eq("space_id", spaceId).eq("user_id", userId).eq("art_number", artNumber)
    : await supabase
        .from("arts_board_marks")
        .upsert(
          { space_id: spaceId, user_id: userId, art_number: artNumber, done: mark.done, note, photo_urls: photoUrls },
          { onConflict: "space_id,user_id,art_number" }
        );
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// Shares a done square with the community as an ordinary post (the note as
// the body, the photos as its pictures) in the community's first discussion
// space the member can post in. The board stays private; only this post is
// seen by others. `kids` picks which telling of the art names the post, so it
// matches what the family was looking at.
export async function shareArtMark(
  spaceId: string,
  artNumber: number,
  kids: boolean,
  communitySlug: string,
  spaceSlug: string
): Promise<{ error: string | null; postPath?: string }> {
  const ctx = await boardMember(spaceId, artNumber);
  if ("error" in ctx) return { error: ctx.error };
  const { supabase, userId, communityId, isStaff } = ctx;

  const { data: mark } = await supabase
    .from("arts_board_marks")
    .select("done, note, photo_urls, shared_post_id")
    .eq("space_id", spaceId)
    .eq("user_id", userId)
    .eq("art_number", artNumber)
    .maybeSingle();
  if (!mark?.done) return { error: "Mark this art as done before sharing it." };

  const target = await getArtsShareTarget(supabase, communityId, isStaff);
  if (!target) return { error: "This community has no discussion space to share to." };

  if (mark.shared_post_id) {
    return { error: null, postPath: `/c/${communitySlug}/spaces/${target.slug}/posts/${mark.shared_post_id}` };
  }

  const art = SIXTY_FOUR_ARTS[artNumber - 1];
  const title = kids ? art.kidsTitle : art.title;
  const body = [
    mark.note?.trim(),
    `Art ${art.n} of the 64 arts: ${title} (${art.sanskrit}).`,
    kids ? art.kidsTask : art.task,
  ]
    .filter(Boolean)
    .join("\n\n");
  const { mediaUrl, extraMediaUrls } = splitPostMedia(mark.photo_urls ?? []);

  // The id is chosen here so the post can be linked without reading it back.
  const postId = crypto.randomUUID();
  const { error: postError } = await supabase.from("posts").insert({
    id: postId,
    community_id: communityId,
    space_id: target.id,
    author_id: userId,
    title: `We tried ${title}`,
    body,
    media_url: mediaUrl,
    extra_media_urls: extraMediaUrls,
    tags: ["64 arts"],
    post_type: "discussion",
  });
  if (postError) return { error: postError.message };

  const { error } = await supabase
    .from("arts_board_marks")
    .update({ shared_post_id: postId })
    .eq("space_id", spaceId)
    .eq("user_id", userId)
    .eq("art_number", artNumber);
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${target.slug}`);
  return { error: null, postPath: `/c/${communitySlug}/spaces/${target.slug}/posts/${postId}` };
}
