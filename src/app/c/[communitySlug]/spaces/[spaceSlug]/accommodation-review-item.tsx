"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CornerDownRight, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatRelativeTime } from "@/lib/utils";
import { deleteAccommodationReview, replyToAccommodationReview, deleteAccommodationReviewReply } from "./accommodation-review-actions";
import type { AccommodationReviewWithAuthor } from "@/lib/data/accommodation";

// One review in the list: the reviewer's stars, text and time, plus the host/
// staff reply beneath it. The reviewer (or staff) can delete their review; the
// host (or staff) can post, edit or remove a single public reply.
export function AccommodationReviewItem({
  review,
  listingId,
  communitySlug,
  spaceSlug,
  canDeleteReview,
  canReply,
}: {
  review: AccommodationReviewWithAuthor;
  listingId: string;
  communitySlug: string;
  spaceSlug: string;
  canDeleteReview: boolean;
  canReply: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { reply } = review;

  function handleDeleteReview() {
    if (!window.confirm("Delete your review?")) return;
    startTransition(async () => {
      const result = await deleteAccommodationReview(review.id, listingId, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleReply(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await replyToAccommodationReview(undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setReplying(false);
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  function handleDeleteReply() {
    if (!reply || !window.confirm("Delete this reply?")) return;
    startTransition(async () => {
      const result = await deleteAccommodationReviewReply(reply.id);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <Avatar src={review.author?.avatar_url} name={review.author?.full_name || review.author?.username} size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-sm font-medium text-foreground">{review.author?.full_name || review.author?.username}</p>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(review.created_at)}</p>
          </div>
          <div className="mt-0.5 flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={`h-3.5 w-3.5 ${n <= review.rating ? "fill-accent text-accent" : "text-border"}`} />
            ))}
          </div>
          {review.body && <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">{review.body}</p>}

          <div className="mt-2 flex gap-3 text-xs">
            {canDeleteReview && (
              <button type="button" disabled={isPending} onClick={handleDeleteReview} className="font-medium text-danger hover:underline disabled:opacity-60">
                Delete
              </button>
            )}
            {canReply && !reply && !replying && (
              <button type="button" onClick={() => setReplying(true)} className="font-medium text-muted-foreground hover:text-foreground">
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {reply && (
        <div className="mt-3 ml-6 flex items-start gap-2 rounded-md bg-muted px-3 py-2">
          <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <p className="text-xs font-semibold text-foreground">{reply.author?.full_name || reply.author?.username}</p>
              <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">Host</span>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(reply.created_at)}</p>
            </div>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{reply.body}</p>
            {canReply && (
              <button type="button" disabled={isPending} onClick={handleDeleteReply} className="mt-1 text-xs font-medium text-danger hover:underline disabled:opacity-60">
                Delete reply
              </button>
            )}
          </div>
        </div>
      )}

      {replying && !reply && (
        <form ref={formRef} action={handleReply} className="mt-3 ml-6 space-y-2">
          <input type="hidden" name="review_id" value={review.id} />
          <input type="hidden" name="listing_id" value={listingId} />
          <input type="hidden" name="community_slug" value={communitySlug} />
          <input type="hidden" name="space_slug" value={spaceSlug} />
          <Textarea name="body" rows={2} placeholder="Write a public reply…" required />
          <div className="flex gap-2">
            <SubmitButton pendingText="Posting…" className="w-auto">
              Post reply
            </SubmitButton>
            <button type="button" onClick={() => setReplying(false)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
