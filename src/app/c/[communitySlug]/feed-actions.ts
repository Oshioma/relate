"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SMILE_EMOJI } from "@/lib/post-reactions";
import type { FeedRefType } from "@/lib/data/feed-interactions";

export type FeedActionResult = { error: string | null };

const MAX_COMMENT_LENGTH = 2000;

// A post's smile and comments live in post_reactions/comments, which the
// post's own page also reads; every other card type is addressed
// polymorphically in feed_reactions/feed_comments.
function revalidateFeed(communitySlug: string, itemType: FeedRefType) {
  if (itemType === "post") {
    // "layout" reaches every page nested under the community, which is how the
    // post's own detail page picks the change up — the feed card doesn't carry
    // the space slug its path would need.
    revalidatePath(`/c/${communitySlug}`, "layout");
    return;
  }
  revalidatePath(`/c/${communitySlug}`);
}

/**
 * Toggle the signed-in member's smile on a feed card. `reacted` is the state
 * the client is currently showing, so we do the opposite of it; RLS guarantees
 * a member can only add or remove their own reaction.
 */
export async function toggleFeedReaction(
  communitySlug: string,
  communityId: string,
  itemType: FeedRefType,
  itemId: string,
  reacted: boolean
): Promise<FeedActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in to react." };

  const { error } =
    itemType === "post"
      ? reacted
        ? await supabase.from("post_reactions").delete().eq("post_id", itemId).eq("user_id", user.id).eq("emoji", SMILE_EMOJI)
        : await supabase.from("post_reactions").insert({ post_id: itemId, user_id: user.id, emoji: SMILE_EMOJI })
      : reacted
        ? await supabase
            .from("feed_reactions")
            .delete()
            .eq("item_type", itemType)
            .eq("item_id", itemId)
            .eq("user_id", user.id)
            .eq("emoji", SMILE_EMOJI)
        : await supabase.from("feed_reactions").insert({
            community_id: communityId,
            item_type: itemType,
            item_id: itemId,
            user_id: user.id,
            emoji: SMILE_EMOJI,
          });

  // A double-tap can race the unique constraint (23505) — treat an existing
  // reaction as already done rather than surfacing an error.
  if (error && error.code !== "23505") return { error: error.message };

  revalidateFeed(communitySlug, itemType);
  return { error: null };
}

export async function createFeedComment(
  communitySlug: string,
  communityId: string,
  itemType: FeedRefType,
  itemId: string,
  formData: FormData
): Promise<FeedActionResult> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Comment can't be empty." };
  if (body.length > MAX_COMMENT_LENGTH) return { error: "That comment is too long." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in to comment." };

  const { error } =
    itemType === "post"
      ? await supabase.from("comments").insert({ post_id: itemId, author_id: user.id, body })
      : await supabase.from("feed_comments").insert({
          community_id: communityId,
          item_type: itemType,
          item_id: itemId,
          author_id: user.id,
          body,
        });

  if (error) return { error: error.message };

  revalidateFeed(communitySlug, itemType);
  return { error: null };
}

// Which table the comment came from depends on the card it hangs off, so the
// caller passes the type along with the id. RLS decides whether this viewer is
// allowed to remove it (their own comment, or staff moderating).
export async function deleteFeedComment(
  communitySlug: string,
  itemType: FeedRefType,
  commentId: string
): Promise<FeedActionResult> {
  const supabase = await createClient();

  const { error } =
    itemType === "post"
      ? await supabase.from("comments").delete().eq("id", commentId)
      : await supabase.from("feed_comments").delete().eq("id", commentId);

  if (error) return { error: error.message };

  revalidateFeed(communitySlug, itemType);
  return { error: null };
}
