"use client";

import { useRef, useState } from "react";
import { createBusiness } from "./business-directory-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BusinessFormFields } from "./business-form-fields";
import type { GalleryImage } from "./business-images-input";
import type { PickedLocation } from "@/components/map/location-picker";
import type { BusinessCustomCategory, BusinessCategoryLabelOverride } from "@/types/database";

export function NewBusinessForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  userId,
  customCategories,
  labelOverrides,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  userId: string;
  customCategories: BusinessCustomCategory[];
  labelOverrides?: BusinessCategoryLabelOverride[];
  onDone?: () => void;
}) {
  const [pin, setPin] = useState<PickedLocation | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createBusiness(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPin(null);
      setImages([]);
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <BusinessFormFields
        idPrefix="business"
        customCategories={customCategories}
        labelOverrides={labelOverrides}
        pin={pin}
        onPinChange={setPin}
        images={images}
        onImagesChange={setImages}
        userId={userId}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add business
      </SubmitButton>
    </form>
  );
}
