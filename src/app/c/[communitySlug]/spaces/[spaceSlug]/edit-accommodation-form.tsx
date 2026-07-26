"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateAccommodationListing } from "./accommodation-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { AccommodationFormFields } from "./accommodation-form-fields";
import type { AccommodationListing } from "@/types/database";
import type { BusinessLinkOption } from "@/lib/data/accommodation";

export function EditAccommodationForm({
  listing,
  communitySlug,
  spaceSlug,
  userId,
  businesses,
  onDone,
  onCancel,
}: {
  listing: AccommodationListing;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  businesses: BusinessLinkOption[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>(listing.photo_urls);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await updateAccommodationListing(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      onDone();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="listing_id" value={listing.id} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Edit listing</p>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <AccommodationFormFields idPrefix={`edit_accommodation_${listing.id}`} listing={listing} businesses={businesses} photos={photos} onPhotosChange={setPhotos} userId={userId} />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save changes
      </SubmitButton>
    </form>
  );
}
