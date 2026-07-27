"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PostType } from "@/types/database";
import { SMILE_EMOJI } from "@/lib/post-reactions";

export type PostFormState = { error: string } | undefined;

const POST_TYPES: PostType[] = ["discussion", "announcement", "resource"];

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const spaceId = String(formData.get("space_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const mediaUrlRaw = String(formData.get("media_url") ?? "").trim();
  const mediaUrl = /^https?:\/\//.test(mediaUrlRaw) ? mediaUrlRaw : null;
  const postTypeRaw = String(formData.get("post_type") ?? "discussion");
  const postType = POST_TYPES.includes(postTypeRaw as PostType) ? (postTypeRaw as PostType) : "discussion";

  if (!title) {
    return { error: "Give your post a title." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to post." };
  }

  const { error } = await supabase.from("posts").insert({
    community_id: communityId,
    space_id: spaceId,
    author_id: user.id,
    title,
    body: body || null,
    media_url: mediaUrl,
    post_type: postType,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function createComment(
  postId: string,
  communitySlug: string,
  spaceSlug: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Comment can't be empty." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in to comment." };

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    body,
  });

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/posts/${postId}`);
  return undefined;
}

export async function updatePost(
  postId: string,
  communitySlug: string,
  spaceSlug: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const mediaUrlRaw = String(formData.get("media_url") ?? "").trim();
  const mediaUrl = /^https?:\/\//.test(mediaUrlRaw) ? mediaUrlRaw : null;

  if (!title) {
    return { error: "Give your post a title." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ title, body: body || null, media_url: mediaUrl })
    .eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/posts/${postId}`);
  return undefined;
}

export async function deletePost(postId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function updateComment(
  commentId: string,
  communitySlug: string,
  spaceSlug: string,
  postId: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Comment can't be empty." };

  const supabase = await createClient();
  const { error } = await supabase.from("comments").update({ body }).eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/posts/${postId}`);
  return undefined;
}

export async function deleteComment(commentId: string, communitySlug: string, spaceSlug: string, postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/posts/${postId}`);
  return { error: null };
}

// Toggle the current member's smile reaction on a post. `reacted` is the state
// the client is showing, so we simply do the opposite; RLS guarantees a member
// can only add or remove their own reaction. Revalidates both the feed and the
// post page, where the count is shown.
export async function togglePostReaction(postId: string, communitySlug: string, spaceSlug: string, reacted: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in to react." };

  const { error } = reacted
    ? await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id).eq("emoji", SMILE_EMOJI)
    : await supabase.from("post_reactions").insert({ post_id: postId, user_id: user.id, emoji: SMILE_EMOJI });

  // A double-tap can race the unique constraint (23505) — treat an existing
  // reaction as already done rather than surfacing an error.
  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/posts/${postId}`);
  return { error: null };
}
