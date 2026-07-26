"use client";

import { useRef, useState } from "react";
import { createAccommodationListing } from "./accommodation-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { AccommodationFormFields } from "./accommodation-form-fields";

export function NewAccommodationForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  userId,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  userId: string;
  onDone?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createAccommodationListing(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPhotos([]);
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <AccommodationFormFields idPrefix="new_accommodation" photos={photos} onPhotosChange={setPhotos} userId={userId} />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post listing
      </SubmitButton>
    </form>
  );
}
