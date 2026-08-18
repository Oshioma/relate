import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getPostById, getPostComments, getPostReactionSummary } from "@/lib/data/posts";
import { getCrops } from "@/lib/data/crop-guides";
import { getMyFarmCrops } from "@/lib/farm-bridge";
import { CommentForm } from "./comment-form";
import { PostCard } from "./post-card";
import { CommentItem } from "./comment-item";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; postId: string }>;
}) {
  const { communitySlug, spaceSlug, postId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const post = await getPostById(supabase, postId);
  if (!post || post.space_id !== space.id) notFound();

  const [membership, comments, crops, editorProfile, editorFarmCrops, reactions] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    getPostComments(supabase, post.id),
    // Powers the "choose a crop" image source when editing the post.
    getCrops(supabase),
    user ? getProfile(supabase, user.id) : Promise.resolve(null),
    // Powers the "My Crops" image source when editing — the editor's own farm.
    user ? getMyFarmCrops(user.email) : Promise.resolve([]),
    getPostReactionSummary(supabase, post.id, user?.id),
  ]);

  const isActiveMember = membership?.status === "active";
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const isPostAuthor = post.author_id === user?.id;
  // In a one-way (staff_post_only) space only staff may comment — unless the
  // admin re-opened comments via allow_member_comments. Mirrors the
  // comments_insert_member RLS policy. Reactions stay open to every member, so
  // fans can still react to an announcement even when they can't comment.
  const canComment =
    isActiveMember && (!space.staff_post_only || space.allow_member_comments || Boolean(isStaff));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <PostCard
        post={post}
        canEdit={isPostAuthor || isStaff}
        canDelete={isPostAuthor || isStaff}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        crops={crops}
        myCrops={editorFarmCrops}
        avatarUrl={editorProfile?.avatar_url}
        reactionCount={reactions.count}
        viewerReacted={reactions.viewerReacted}
        reactors={reactions.reactors}
        viewer={
          editorProfile
            ? { id: editorProfile.id, name: editorProfile.full_name || editorProfile.username, avatarUrl: editorProfile.avatar_url }
            : null
        }
        canReact={isActiveMember}
      />

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <div className="mb-4 space-y-3">
        {comments.map((comment) => {
          const isCommentAuthor = comment.author_id === user?.id;
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              canEdit={isCommentAuthor}
              canDelete={isCommentAuthor || isStaff}
              communitySlug={community.slug}
              spaceSlug={space.slug}
              postId={post.id}
            />
          );
        })}
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
      </div>

      {canComment ? (
        <CommentForm postId={post.id} communitySlug={community.slug} spaceSlug={space.slug} />
      ) : (
        isActiveMember && (
          <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Comments are turned off in this one-way space. You can still react to posts.
          </p>
        )
      )}
    </div>
  );
}
