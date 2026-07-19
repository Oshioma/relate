import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getPostById, getPostComments } from "@/lib/data/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { CommentForm } from "./comment-form";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; postId: string }>;
}) {
  const { communitySlug, spaceSlug, postId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const post = await getPostById(supabase, postId);
  if (!post || post.space_id !== space.id) notFound();

  const [membership, comments] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getPostComments(supabase, post.id),
  ]);

  const canComment = membership?.status === "active";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Avatar src={post.author?.avatar_url} name={post.author?.full_name || post.author?.username} size={36} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {post.is_pinned && <Pin className="h-4 w-4 text-accent" />}
                <h1 className="text-lg font-semibold text-foreground">{post.title}</h1>
                <Badge tone="neutral">{post.post_type}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {post.author?.full_name || post.author?.username} · {formatRelativeTime(post.created_at)}
              </p>
              {post.body && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{post.body}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <div className="mb-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <Avatar src={comment.author?.avatar_url} name={comment.author?.full_name || comment.author?.username} size={28} />
            <div className="min-w-0 flex-1 rounded-lg bg-muted px-3 py-2">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-medium text-foreground">
                  {comment.author?.full_name || comment.author?.username}
                </p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</p>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
      </div>

      {canComment && <CommentForm postId={post.id} communitySlug={community.slug} spaceSlug={space.slug} />}
    </div>
  );
}
