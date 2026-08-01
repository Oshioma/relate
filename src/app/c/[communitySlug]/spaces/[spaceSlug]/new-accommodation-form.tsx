"use client";

import { useRef, useState } from "react";
import { createAccommodationListing } from "./accommodation-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { AccommodationFormFields } from "./accommodation-form-fields";
import { ImportFromLink } from "./import-from-link";
import type { BusinessLinkOption } from "@/lib/data/accommodation";
import type { ListingDraft } from "@/lib/listing-draft";

export function NewAccommodationForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  userId,
  businesses,
  importUrl,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  userId: string;
  businesses: BusinessLinkOption[];
  // Pre-loaded link from the directory hand-off; autofills once on arrival.
  importUrl?: string;
  onDone?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  // Bumped on every autofill. The text fields are uncontrolled, so remounting
  // them is what makes a fresh draft's defaults take effect.
  const [draftKey, setDraftKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function applyDraft(next: ListingDraft) {
    setDraft(next);
    setDraftKey((key) => key + 1);
    // Suggested photos are additions, not a replacement — anything already
    // uploaded stays, and stays first so it keeps the cover slot.
    if (next.photos.length > 0) {
      setPhotos((current) => [...current, ...next.photos.filter((url) => !current.includes(url))]);
    }
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createAccommodationListing(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPhotos([]);
      setDraft(null);
      setDraftKey((key) => key + 1);
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <ImportFromLink kind="accommodation" spaceId={spaceId} initialUrl={importUrl} onApply={applyDraft} />

      <AccommodationFormFields
        key={draftKey}
        idPrefix="new_accommodation"
        draft={draft}
        businesses={businesses}
        photos={photos}
        onPhotosChange={setPhotos}
        userId={userId}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post listing
      </SubmitButton>
    </form>
  );
}
