import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Post, Comment, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type PostWithAuthor = Post & { author: Profile };
export type CommentWithAuthor = Comment & { author: Profile };
export type PostWithSpace = Post & { space: Pick<Space, "id" | "name" | "slug"> };
export type PostWithAuthorAndSpace = Post & { author: Profile; space: Pick<Space, "id" | "name" | "slug"> };

export async function getSpacePosts(supabase: Client, spaceId: string): Promise<PostWithAuthor[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id (*)")
    .eq("space_id", spaceId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostWithAuthor[];
}

export async function getCommunityPosts(supabase: Client, communityId: string, limit = 10): Promise<PostWithAuthorAndSpace[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as PostWithAuthorAndSpace[];
}

export async function getMemberPosts(supabase: Client, communityId: string, authorId: string): Promise<PostWithSpace[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostWithSpace[];
}

export async function getPostById(supabase: Client, postId: string): Promise<PostWithAuthor | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id (*)")
    .eq("id", postId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as PostWithAuthor | null;
}

export async function getPostComments(supabase: Client, postId: string): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*, author:author_id (*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as CommentWithAuthor[];
}
