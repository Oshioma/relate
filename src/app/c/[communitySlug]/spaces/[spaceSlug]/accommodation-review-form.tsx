"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { StarRatingInput } from "./star-rating";
import { submitAccommodationReview } from "./accommodation-review-actions";
import type { AccommodationReview } from "@/types/database";

// Write or edit the current member's review of a stay: a required star rating
// plus optional text. One review per member, so an existing review pre-fills and
// re-submitting updates it. Rating and body are controlled state so a failed
// submit (React 19 auto-resets uncontrolled fields on action return) never wipes
// what the member just typed.
export function AccommodationReviewForm({
  listingId,
  communitySlug,
  spaceSlug,
  existing,
}: {
  listingId: string;
  communitySlug: string;
  spaceSlug: string;
  existing: AccommodationReview | null;
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
      const result = await submitAccommodationReview(undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
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
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="rating" value={rating ?? ""} />

      <p className="text-sm font-medium text-foreground">{existing ? "Edit your review" : "Write a review"}</p>
      <StarRatingInput value={rating} onChange={setRating} disabled={isPending} />
      <Textarea name="body" rows={3} placeholder="Share what your stay was like…" value={body} onChange={(e) => setBody(e.target.value)} />
      {error && <p className="text-xs text-danger">{error}</p>}
      <SubmitButton pendingText="Saving…" className="w-auto">
        {existing ? "Update review" : "Post review"}
      </SubmitButton>
    </form>
  );
}
