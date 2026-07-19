import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Post, Comment, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type PostWithAuthor = Post & { author: Profile };
export type CommentWithAuthor = Comment & { author: Profile };

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

export async function getCommunityPosts(supabase: Client, communityId: string, limit = 10): Promise<PostWithAuthor[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id (*)")
    .eq("community_id", communityId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as PostWithAuthor[];
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
