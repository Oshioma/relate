import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Post, Comment, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type PostWithAuthor = Post & { author: Profile };
export type CommentWithAuthor = Comment & { author: Profile };
export type PostWithSpace = Post & { space: Pick<Space, "id" | "name" | "slug"> };
export type PostWithAuthorAndSpace = Post & { author: Profile; space: Pick<Space, "id" | "name" | "slug"> };
// A feed row carries its comment and reaction counts (plus whether the viewer
// has reacted) so cards can show conversation activity at a glance.
export type PostListItem = PostWithAuthor & {
  comment_count: number;
  reaction_count: number;
  viewer_reacted: boolean;
};

export type SpaceContributor = { id: string; name: string | null; avatarUrl: string | null };

export type DiscussionSpaceSummary = {
  postCount: number;
  contributorCount: number;
  // The most recent few distinct contributors, for the header avatar stack.
  contributors: SpaceContributor[];
  activeThisWeek: boolean;
};

// Header activity stats for a discussion space, derived from its already-loaded
// posts (no extra query). Kept out of the page component so the `Date.now()`
// call for the "active this week" window isn't an impure call during render.
export function summarizeDiscussionActivity(posts: PostListItem[]): DiscussionSpaceSummary {
  const seen = new Map<string, SpaceContributor>();
  const byRecency = [...posts].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  for (const p of byRecency) {
    const a = p.author;
    if (a && !seen.has(a.id)) seen.set(a.id, { id: a.id, name: a.full_name || a.username, avatarUrl: a.avatar_url });
  }
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    postCount: posts.length,
    contributorCount: seen.size,
    contributors: [...seen.values()].slice(0, 5),
    activeThisWeek: posts.some((p) => new Date(p.created_at).getTime() >= weekAgo),
  };
}

export async function getSpacePosts(supabase: Client, spaceId: string, viewerId?: string | null): Promise<PostListItem[]> {
  const { data, error } = await supabase
    .from("posts")
    // comments(count) / post_reactions(count) return [{ count }] per post.
    .select("*, author:author_id (*), comments(count), post_reactions(count)")
    .eq("space_id", spaceId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as (Record<string, unknown> & {
    id: string;
    comments?: { count: number }[];
    post_reactions?: { count: number }[];
  })[];

  // Which of these posts the viewer has personally reacted to — one extra
  // query rather than embedding a per-viewer filter into the aggregate above.
  const reactedIds = new Set<string>();
  if (viewerId && rows.length > 0) {
    const { data: mine } = await supabase
      .from("post_reactions")
      .select("post_id")
      .eq("user_id", viewerId)
      .in("post_id", rows.map((r) => r.id));
    for (const r of mine ?? []) reactedIds.add(r.post_id);
  }

  return rows.map((row) => {
    const { comments, post_reactions, ...post } = row;
    return {
      ...post,
      comment_count: Array.isArray(comments) ? comments[0]?.count ?? 0 : 0,
      reaction_count: Array.isArray(post_reactions) ? post_reactions[0]?.count ?? 0 : 0,
      viewer_reacted: reactedIds.has(row.id),
    };
  }) as unknown as PostListItem[];
}

// Reaction tally for a single post (the detail page), including whether the
// viewer has reacted so the button can render its toggled state.
export async function getPostReactionSummary(
  supabase: Client,
  postId: string,
  viewerId: string | null | undefined
): Promise<{ count: number; viewerReacted: boolean }> {
  const { data, error } = await supabase.from("post_reactions").select("user_id").eq("post_id", postId);
  if (error) throw error;
  const rows = data ?? [];
  return {
    count: rows.length,
    viewerReacted: viewerId ? rows.some((r) => r.user_id === viewerId) : false,
  };
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
