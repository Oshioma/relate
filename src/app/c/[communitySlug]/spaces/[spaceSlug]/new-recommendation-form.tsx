"use client";

import { useRef, useState } from "react";
import { createRecommendation } from "./recommendations-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { RECOMMENDATION_CATEGORIES } from "@/lib/recommendation-categories";

export function NewRecommendationForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  onDone?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createRecommendation(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="recommendation_title">What are you recommending?</Label>
          <Input id="recommendation_title" name="title" placeholder="The Rock Restaurant" required />
        </div>
        <div>
          <Label htmlFor="recommendation_category">Category</Label>
          <select
            id="recommendation_category"
            name="category"
            defaultValue="restaurant"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {RECOMMENDATION_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="recommendation_note">Why do you recommend it? (optional)</Label>
        <Textarea id="recommendation_note" name="note" rows={2} placeholder="What made it worth telling people about?" />
      </div>

      <div>
        <Label htmlFor="recommendation_location_label">Location (optional)</Label>
        <Input id="recommendation_location_label" name="location_label" placeholder="Nungwi Beach" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="recommendation_lat">Latitude (optional)</Label>
          <Input id="recommendation_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="recommendation_lng">Longitude (optional)</Label>
          <Input id="recommendation_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this on the Explore Map.</p>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post recommendation
      </SubmitButton>
    </form>
  );
}
