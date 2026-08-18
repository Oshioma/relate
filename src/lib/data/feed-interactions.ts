import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FeedItemType, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

// A feed card, named the way feed_reactions/feed_comments address it. Posts
// carry the extra "post" type: their smiles and comments live in the older
// post_reactions/comments tables so the count on a card and the count on the
// post's own page can never drift apart.
export type FeedRefType = FeedItemType | "post";
export type FeedRef = { type: FeedRefType; id: string };

export type FeedCommentWithAuthor = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  author: Pick<Profile, "id" | "full_name" | "username" | "avatar_url"> | null;
};

export type FeedInteraction = {
  reactionCount: number;
  viewerReacted: boolean;
  comments: FeedCommentWithAuthor[];
};

// Map key for a ref. Ids are uuids and unique on their own, but keying by both
// keeps the map honest if a card type is ever backed by a non-uuid id.
export function feedRefKey(type: FeedRefType, id: string): string {
  return `${type}:${id}`;
}

const EMPTY: FeedInteraction = { reactionCount: 0, viewerReacted: false, comments: [] };

export function feedInteractionFor(
  interactions: Map<string, FeedInteraction>,
  type: FeedRefType,
  id: string
): FeedInteraction {
  return interactions.get(feedRefKey(type, id)) ?? EMPTY;
}

type AuthorRow = { id: string; full_name: string | null; username: string; avatar_url: string | null } | null;

const AUTHOR_COLUMNS = "id, full_name, username, avatar_url";

function toComment(row: {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  author: AuthorRow;
}): FeedCommentWithAuthor {
  return { id: row.id, body: row.body, created_at: row.created_at, author_id: row.author_id, author: row.author };
}

/**
 * Reaction tallies and comment threads for a batch of feed cards, in four
 * queries regardless of how many cards (or how many kinds of card) the feed is
 * showing. Returns a map keyed by `feedRefKey` — read it with
 * `feedInteractionFor`, which supplies the empty state for a card nobody has
 * touched yet.
 */
export async function getFeedInteractions(
  supabase: Client,
  communityId: string,
  refs: FeedRef[],
  viewerId?: string | null
): Promise<Map<string, FeedInteraction>> {
  const result = new Map<string, FeedInteraction>();
  if (refs.length === 0) return result;

  const postIds = refs.filter((r) => r.type === "post").map((r) => r.id);
  const otherIds = refs.filter((r) => r.type !== "post").map((r) => r.id);

  const [feedReactions, feedComments, postReactions, postComments] = await Promise.all([
    otherIds.length > 0
      ? supabase.from("feed_reactions").select("item_type, item_id, user_id").eq("community_id", communityId).in("item_id", otherIds)
      : Promise.resolve({ data: [], error: null }),
    otherIds.length > 0
      ? supabase
          .from("feed_comments")
          .select(`id, body, created_at, author_id, item_type, item_id, author:author_id (${AUTHOR_COLUMNS})`)
          .eq("community_id", communityId)
          .in("item_id", otherIds)
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
    postIds.length > 0
      ? supabase.from("post_reactions").select("post_id, user_id").in("post_id", postIds)
      : Promise.resolve({ data: [], error: null }),
    postIds.length > 0
      ? supabase
          .from("comments")
          .select(`id, body, created_at, author_id, post_id, author:author_id (${AUTHOR_COLUMNS})`)
          .in("post_id", postIds)
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
  ]);

  function bucket(key: string): FeedInteraction {
    let entry = result.get(key);
    if (!entry) {
      entry = { reactionCount: 0, viewerReacted: false, comments: [] };
      result.set(key, entry);
    }
    return entry;
  }

  for (const row of (feedReactions.data ?? []) as { item_type: FeedItemType; item_id: string; user_id: string }[]) {
    const entry = bucket(feedRefKey(row.item_type, row.item_id));
    entry.reactionCount += 1;
    if (viewerId && row.user_id === viewerId) entry.viewerReacted = true;
  }

  for (const row of (postReactions.data ?? []) as { post_id: string; user_id: string }[]) {
    const entry = bucket(feedRefKey("post", row.post_id));
    entry.reactionCount += 1;
    if (viewerId && row.user_id === viewerId) entry.viewerReacted = true;
  }

  const feedCommentRows = (feedComments.data ?? []) as unknown as ({
    item_type: FeedItemType;
    item_id: string;
  } & Parameters<typeof toComment>[0])[];
  for (const row of feedCommentRows) {
    bucket(feedRefKey(row.item_type, row.item_id)).comments.push(toComment(row));
  }

  const postCommentRows = (postComments.data ?? []) as unknown as ({ post_id: string } & Parameters<typeof toComment>[0])[];
  for (const row of postCommentRows) {
    bucket(feedRefKey("post", row.post_id)).comments.push(toComment(row));
  }

  return result;
}
