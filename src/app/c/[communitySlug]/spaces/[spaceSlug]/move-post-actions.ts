"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommunityBySlug, getMembership, isCommunityStaff } from "@/lib/data/community";
import { guideBodyFromPost, moveKindFor } from "@/lib/post-move";
import type { Community } from "@/types/database";

// Staff move posts between spaces (see src/lib/post-move.ts for what a move
// means for each space type). Into another feed space, the post keeps its id,
// comments and smiles and only its space changes. Into a Guides space it is
// rebuilt as a guide by the same author with the same date, its comments
// become the guide's comments, and the post is then removed; smiles have no
// equivalent on a guide and don't come along.
//
// Writes go through the service role because the post's author and
// commenters are other people (a guide's created_by and each comment's author
// must stay theirs); every caller below is checked as staff of the community
// first, and only posts and spaces of that community are touched.

export type MovePostsResult = { error: string } | { ok: true; moved: number; path: string };

type PostRow = {
  id: string;
  community_id: string;
  space_id: string;
  author_id: string;
  title: string;
  body: string | null;
  media_url: string | null;
  extra_media_urls: string[] | null;
  created_at: string;
};

async function requireStaff(communitySlug: string): Promise<{ error: string } | { community: Community }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." }
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "That community no longer exists." }
  const membership = await getMembership(supabase, community.id, user.id);
  if (!isCommunityStaff(community, membership, user.id)) return { error: "Only staff can move posts." }
  return { community }
}

async function movePostsInto(communityId: string, communitySlug: string, posts: PostRow[], targetSpaceId: string): Promise<MovePostsResult> {
  const admin = createAdminClient();
  const { data: target } = await admin
    .from("spaces")
    .select("id, slug, space_type, community_id")
    .eq("id", targetSpaceId)
    .maybeSingle();
  if (!target || target.community_id !== communityId) return { error: "That space isn't in this community." };
  const kind = moveKindFor(target.space_type);
  if (!kind) return { error: "That kind of space doesn't hold posts. Pick a discussion or Guides space." };

  const fromSpaceIds = new Set(posts.map((p) => p.space_id));
  const toMove = posts.filter((p) => p.community_id === communityId && p.space_id !== target.id);
  let moved = 0;

  if (kind === "post") {
    if (toMove.length > 0) {
      const { error } = await admin.from("posts").update({ space_id: target.id }).in("id", toMove.map((p) => p.id));
      if (error) return { error: error.message };
      moved = toMove.length;
    }
  } else {
    for (const post of toMove) {
      const { data: guide, error: guideError } = await admin
        .from("guides")
        .insert({
          space_id: target.id,
          community_id: communityId,
          created_by: post.author_id,
          title: post.title,
          body: guideBodyFromPost(post),
          created_at: post.created_at,
        })
        .select("id")
        .single();
      if (guideError || !guide) return { error: `"${post.title}" couldn't become a guide: ${guideError?.message ?? "no row came back"}` };

      const { data: comments, error: commentsError } = await admin
        .from("comments")
        .select("author_id, body, created_at")
        .eq("post_id", post.id)
        .order("created_at");
      const copyComments =
        commentsError || !comments?.length
          ? { error: commentsError }
          : await admin.from("guide_comments").insert(comments.map((c) => ({ guide_id: guide.id, author_id: c.author_id, body: c.body, created_at: c.created_at })));
      if (copyComments.error) {
        // Leave the post exactly where it was rather than half-moved.
        await admin.from("guides").delete().eq("id", guide.id);
        return { error: `"${post.title}" couldn't be moved: its comments didn't copy (${copyComments.error.message}).` };
      }
      await admin.from("guide_contributors").insert({ guide_id: guide.id, user_id: post.author_id });

      const { error: deleteError } = await admin.from("posts").delete().eq("id", post.id);
      if (deleteError) {
        await admin.from("guides").delete().eq("id", guide.id);
        return { error: `"${post.title}" couldn't be moved: ${deleteError.message}` };
      }
      moved++;
    }
  }

  const { data: fromSpaces } = await admin.from("spaces").select("slug").in("id", [...fromSpaceIds]);
  for (const space of fromSpaces ?? []) revalidatePath(`/c/${communitySlug}/spaces/${space.slug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${target.slug}`);
  return { ok: true, moved, path: `/c/${communitySlug}/spaces/${target.slug}` };
}

const POST_COLUMNS = "id, community_id, space_id, author_id, title, body, media_url, extra_media_urls, created_at";

/** One post, from its own page. */
export async function movePost(postId: string, communitySlug: string, targetSpaceId: string): Promise<MovePostsResult> {
  const context = await requireStaff(communitySlug);
  if ("error" in context) return context;
  const { data: post } = await createAdminClient().from("posts").select(POST_COLUMNS).eq("id", postId).maybeSingle();
  if (!post || post.community_id !== context.community.id) return { error: "That post no longer exists." };
  return movePostsInto(context.community.id, context.community.slug, [post as PostRow], targetSpaceId);
}

/**
 * Every post in one space, or only those carrying a tag (Circle imports are
 * tagged with their old Circle space, e.g. "the-art-of-meditation"). From the
 * admin page.
 */
export async function movePostsBetweenSpaces(
  communitySlug: string,
  fromSpaceId: string,
  tag: string,
  targetSpaceId: string
): Promise<MovePostsResult> {
  const context = await requireStaff(communitySlug);
  if ("error" in context) return context;
  if (fromSpaceId === targetSpaceId) return { error: "Pick a different space to move them to." };
  let query = createAdminClient()
    .from("posts")
    .select(POST_COLUMNS)
    .eq("community_id", context.community.id)
    .eq("space_id", fromSpaceId)
    .order("created_at");
  const wantedTag = tag.trim();
  if (wantedTag) query = query.contains("tags", [wantedTag]);
  const { data: posts, error } = await query;
  if (error) return { error: error.message };
  if (!posts?.length) return { error: wantedTag ? `No posts in that space are tagged "${wantedTag}".` : "That space has no posts to move." };
  return movePostsInto(context.community.id, context.community.slug, posts as PostRow[], targetSpaceId);
}
