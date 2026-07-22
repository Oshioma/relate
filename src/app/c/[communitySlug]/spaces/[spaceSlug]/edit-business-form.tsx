"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateBusiness } from "./business-directory-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BusinessFormFields } from "./business-form-fields";
import type { PickedLocation } from "./location-picker";
import type { Business, BusinessCustomCategory } from "@/types/database";

export function EditBusinessForm({
  business,
  communitySlug,
  spaceSlug,
  userId,
  customCategories,
  onDone,
  onCancel,
}: {
  business: Business;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  customCategories: BusinessCustomCategory[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState<PickedLocation | null>(
    business.lat !== null && business.lng !== null ? { lat: business.lat, lng: business.lng } : null
  );
  const [imageUrl, setImageUrl] = useState<string | null>(business.image_url);
  const [imagePosition, setImagePosition] = useState<string | null>(business.image_position);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await updateBusiness(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      onDone();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="business_id" value={business.id} />
      {/* Scopes custom-category validation in updateBusiness to this space. */}
      <input type="hidden" name="space_id" value={business.space_id} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Edit {business.name}</p>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <BusinessFormFields
        idPrefix={`edit_business_${business.id}`}
        business={business}
        customCategories={customCategories}
        pin={pin}
        onPinChange={setPin}
        imageUrl={imageUrl}
        onImageChange={setImageUrl}
        imagePosition={imagePosition}
        onImagePositionChange={setImagePosition}
        userId={userId}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save changes
      </SubmitButton>
    </form>
  );
}
