"use client";

import { useRef, useState } from "react";
import { createBusiness } from "./business-directory-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BusinessFormFields } from "./business-form-fields";
import type { PickedLocation } from "@/components/map/location-picker";
import type { BusinessCustomCategory } from "@/types/database";

export function NewBusinessForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  userId,
  customCategories,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  userId: string;
  customCategories: BusinessCustomCategory[];
  onDone?: () => void;
}) {
  const [pin, setPin] = useState<PickedLocation | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState<string | null>(null);
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
      setImageUrl(null);
      setImagePosition(null);
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
        pin={pin}
        onPinChange={setPin}
        imageUrl={imageUrl}
        onImageChange={setImageUrl}
        imagePosition={imagePosition}
        onImagePositionChange={setImagePosition}
        userId={userId}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add business
      </SubmitButton>
    </form>
  );
}
