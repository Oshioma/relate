"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { StarRatingInput } from "./star-rating";
import { submitReview } from "./business-review-actions";
import type { BusinessReview } from "@/types/database";

// Write or edit the current member's review of a listing: a required star rating
// plus optional text. One review per member, so an existing review pre-fills the
// form and re-submitting updates it in place.
//
// The rating and body are BOTH controlled state, deliberately. A React 19 form
// `action` auto-resets uncontrolled fields once the action returns — so if the
// text lived in a `defaultValue` textarea, hitting the "pick a rating" guard (or
// any server error) would wipe what the member just typed. Controlled state
// survives that reset, so their words are never lost on a failed submit.
export function BusinessReviewForm({
  businessId,
  communitySlug,
  spaceSlug,
  existing,
}: {
  businessId: string;
  communitySlug: string;
  spaceSlug: string;
  existing: BusinessReview | null;
}) {
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [body, setBody] = useState<string>(existing?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    if (rating === null) {
      setError("Pick a star rating from 1 to 5.");
      return;
    }
    startTransition(async () => {
      const result = await submitReview(undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        // Only clear a brand-new review; an edit keeps showing what was saved.
        if (!existing) {
          setBody("");
          setRating(null);
        }
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-2 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="rating" value={rating ?? ""} />

      <p className="text-sm font-medium text-foreground">{existing ? "Edit your review" : "Write a review"}</p>
      <StarRatingInput value={rating} onChange={setRating} disabled={isPending} />
      <Textarea
        name="body"
        rows={3}
        placeholder="Share what your experience was like…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      <SubmitButton pendingText="Saving…" className="w-auto">
        {existing ? "Update review" : "Post review"}
      </SubmitButton>
    </form>
  );
}
