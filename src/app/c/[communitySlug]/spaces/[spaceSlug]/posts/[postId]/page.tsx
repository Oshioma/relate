import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getPostById, getPostComments, getPostReactionSummary } from "@/lib/data/posts";
import { getCrops } from "@/lib/data/crop-guides";
import { getMyFarmCrops } from "@/lib/farm-bridge";
import { postSections } from "@/lib/post-sections";
import { SectionNav } from "@/components/ui/section-nav";
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
  // An invite-only community, or a members-only space or post, resolves to
  // null for a signed-out visitor (RLS), who may well be a member following a
  // notification link — ask them to sign in and bring them back, rather than 404.
  const signInFirst = () => redirect(`/login?next=${encodeURIComponent(`/c/${communitySlug}/spaces/${spaceSlug}/posts/${postId}`)}`);

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community && !user) signInFirst();
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space && !user) signInFirst();
  if (!space) notFound();

  const post = await getPostById(supabase, postId);
  if (!post && !user) signInFirst();
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

  // Long-form posts (guides) whose <h2> headings carry ids get the same
  // section sidebar as the admin page. Short posts keep the single column.
  const sections = postSections(post.body ?? "");
  const hasSectionNav = sections.length >= 3;

  return (
    <div
      className={`mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 ${
        hasSectionNav ? "lg:grid lg:max-w-6xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10" : ""
      }`}
    >
      {hasSectionNav && <SectionNav sections={sections.map((s) => ({ ...s, group: "Contents" }))} label="Article sections" />}

      {/* scroll-mt keeps a jumped-to heading clear of the sticky mobile bar. */}
      <div className="min-w-0 lg:max-w-3xl [&_h2[id]]:scroll-mt-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
            {space.name}
          </Link>
        </p>

        <PostCard
          post={post}
          canEdit={isPostAuthor || isStaff}
          canDelete={isPostAuthor || isStaff}
          canPin={isStaff}
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
    </div>
  );
}
