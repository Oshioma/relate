"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { SMILE_EMOJI } from "@/lib/post-reactions";
import { cn, formatRelativeTime } from "@/lib/utils";
import { toggleFeedReaction, createFeedComment, deleteFeedComment } from "./feed-actions";
import type { FeedCommentWithAuthor, FeedRefType } from "@/lib/data/feed-interactions";

export interface FeedItemActionsProps {
  communitySlug: string;
  communityId: string;
  itemType: FeedRefType;
  itemId: string;
  // What the card is about, so the smile button can say who you're smiling at
  // to a screen reader ("Smile at Ana Ruiz") instead of just "Smile".
  itemTitle: string;
  reactionCount: number;
  viewerReacted: boolean;
  comments: FeedCommentWithAuthor[];
  // A signed-in member of this community. Everyone else sees the tallies but
  // gets no controls — the same read-only treatment posts already use.
  canInteract: boolean;
  viewerId: string | null;
  // Staff can remove any comment; members only their own.
  isStaff: boolean;
}

export function FeedItemActions({
  communitySlug,
  communityId,
  itemType,
  itemId,
  itemTitle,
  reactionCount,
  viewerReacted,
  comments,
  canInteract,
  viewerId,
  isStaff,
}: FeedItemActionsProps) {
  // Optimistic reaction state so the smile toggles instantly, mirroring the
  // post card. The server action revalidates and `router.refresh()` reconciles.
  const [reacted, setReacted] = useState(viewerReacted);
  const [reactions, setReactions] = useState(reactionCount);
  const [isReacting, startReacting] = useTransition();
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleReaction() {
    const next = !reacted;
    setError(null);
    setReacted(next);
    setReactions((n) => n + (next ? 1 : -1));
    startReacting(async () => {
      const result = await toggleFeedReaction(communitySlug, communityId, itemType, itemId, !next);
      if (result.error) {
        // Revert on failure.
        setReacted(!next);
        setReactions((n) => n + (next ? -1 : 1));
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  async function handleComment(formData: FormData) {
    setError(null);
    const result = await createFeedComment(communitySlug, communityId, itemType, itemId, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  function handleDelete(commentId: string) {
    if (!window.confirm("Delete this comment?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteFeedComment(communitySlug, itemType, commentId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  const commentCount = comments.length;

  return (
    <div className="border-t border-border px-6 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleReaction}
          disabled={!canInteract || isReacting}
          aria-pressed={reacted}
          aria-label={reacted ? `Remove your smile from ${itemTitle}` : `Smile at ${itemTitle}`}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            reacted ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground",
            canInteract ? "hover:border-accent/50 hover:text-foreground disabled:opacity-60" : "cursor-default"
          )}
        >
          <span aria-hidden className="text-base leading-none">
            {SMILE_EMOJI}
          </span>
          {reactions > 0 && <span>{reactions}</span>}
          <span aria-hidden>{reacted ? "Smiled" : "Smile"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments((open) => !open)}
          aria-expanded={showComments}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {commentCount > 0 && <span>{commentCount}</span>}
          <span>{commentCount === 1 ? "Comment" : "Comments"}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.map((comment) => {
            const authorName = comment.author?.full_name || comment.author?.username || "Member";
            const canDelete = isStaff || (viewerId !== null && comment.author_id === viewerId);
            return (
              <div key={comment.id} className="flex items-start gap-2.5">
                <Avatar src={comment.author?.avatar_url} name={authorName} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{authorName}</span> · {formatRelativeTime(comment.created_at)}
                  </p>
                  {/* `break-words`: comment bodies are member-typed and routinely
                      carry an unbroken run (a URL, a handle) that would otherwise
                      push the card past its column. */}
                  <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-foreground">{comment.body}</p>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isPending}
                      className="mt-0.5 text-xs font-medium text-muted-foreground hover:text-danger disabled:opacity-60"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {commentCount === 0 && !canInteract && <p className="text-sm text-muted-foreground">No comments yet.</p>}

          {canInteract && (
            <form action={handleComment} className="space-y-2">
              <Textarea name="body" rows={2} maxLength={2000} placeholder="Say something…" required />
              <div className="flex justify-end">
                <SubmitButton pendingText="Posting…" className="w-auto">
                  Comment
                </SubmitButton>
              </div>
            </form>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
