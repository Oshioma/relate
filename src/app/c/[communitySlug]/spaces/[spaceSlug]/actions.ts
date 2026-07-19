"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PostType } from "@/types/database";

export type PostFormState = { error: string } | undefined;

const POST_TYPES: PostType[] = ["discussion", "announcement", "resource"];

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const spaceId = String(formData.get("space_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
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

  if (!title) {
    return { error: "Give your post a title." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ title, body: body || null })
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
