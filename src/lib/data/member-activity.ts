import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Resource, Event } from "@/types/database";

type Client = SupabaseClient<Database>;

export type ActivityItem =
  | { kind: "post"; id: string; createdAt: string; title: string; spaceSlug: string; postId: string }
  | { kind: "comment"; id: string; createdAt: string; body: string; spaceSlug: string; postId: string; postTitle: string };

type PostActivityRow = {
  id: string;
  title: string;
  created_at: string;
  spaces: { slug: string } | { slug: string }[] | null;
};

type CommentActivityRow = {
  id: string;
  body: string;
  created_at: string;
  post_id: string;
  posts: { title: string; spaces: { slug: string } | { slug: string }[] | null } | null;
};

function firstSlug(spaces: { slug: string } | { slug: string }[] | null | undefined): string {
  if (!spaces) return "";
  return Array.isArray(spaces) ? (spaces[0]?.slug ?? "") : spaces.slug;
}

export async function getMemberRecentActivity(
  supabase: Client,
  communityId: string,
  profileId: string,
  limit = 8
): Promise<ActivityItem[]> {
  const [{ data: posts, error: postsError }, { data: comments, error: commentsError }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, created_at, spaces:space_id (slug)")
      .eq("community_id", communityId)
      .eq("author_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("comments")
      .select("id, body, post_id, created_at, posts!inner(title, community_id, spaces:space_id (slug))")
      .eq("author_id", profileId)
      .eq("posts.community_id", communityId)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (postsError) throw postsError;
  if (commentsError) throw commentsError;

  const postItems: ActivityItem[] = ((posts ?? []) as unknown as PostActivityRow[]).map((post) => ({
    kind: "post",
    id: post.id,
    createdAt: post.created_at,
    title: post.title,
    spaceSlug: firstSlug(post.spaces),
    postId: post.id,
  }));

  const commentItems: ActivityItem[] = ((comments ?? []) as unknown as CommentActivityRow[]).map((comment) => ({
    kind: "comment",
    id: comment.id,
    createdAt: comment.created_at,
    body: comment.body,
    spaceSlug: firstSlug(comment.posts?.spaces),
    postId: comment.post_id,
    postTitle: comment.posts?.title ?? "a post",
  }));

  return [...postItems, ...commentItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getMemberResources(supabase: Client, communityId: string, profileId: string): Promise<Resource[]> {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("community_id", communityId)
    .eq("created_by", profileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMemberHostedEvents(supabase: Client, communityId: string, profileId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("community_id", communityId)
    .eq("created_by", profileId)
    .order("start_time", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMemberAttendedEvents(supabase: Client, communityId: string, profileId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("event_rsvps")
    .select("events!inner(*)")
    .eq("user_id", profileId)
    .eq("events.community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => row.events as unknown as Event);
}
