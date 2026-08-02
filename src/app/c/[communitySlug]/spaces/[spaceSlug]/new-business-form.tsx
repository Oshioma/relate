"use client";

import { useRef, useState } from "react";
import { createBusiness } from "./business-directory-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BusinessFormFields } from "./business-form-fields";
import { ImportFromLink } from "./import-from-link";
import { DuplicateHint } from "./duplicate-hint";
import type { GalleryImage } from "./business-images-input";
import type { PickedLocation } from "@/components/map/location-picker";
import type { ListingDraft } from "@/lib/listing-draft";
import type { BusinessCustomCategory, BusinessCategoryLabelOverride, BusinessHoursSchedule } from "@/types/database";

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
  const [schedule, setSchedule] = useState<BusinessHoursSchedule | null>(null);
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  // Bumped on every autofill. The text fields are uncontrolled, so remounting
  // them is what makes a fresh draft's defaults take effect.
  const [draftKey, setDraftKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Mirrors the name field purely so the duplicate hint has something to watch.
  // The field itself stays uncontrolled, like the rest of the form.
  const [name, setName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function applyDraft(next: ListingDraft) {
    setDraft(next);
    if (next.name) setName(next.name);
    setDraftKey((key) => key + 1);
    if (next.lat !== null && next.lng !== null) setPin({ lat: next.lat, lng: next.lng });
    if (next.opening_hours) setSchedule(next.opening_hours);
    // Suggested photos are additions, not a replacement — anything already
    // uploaded stays, and stays first so it keeps the cover slot.
    if (next.photos.length > 0) {
      setImages((current) => {
        const seen = new Set(current.map((image) => image.url));
        const added = next.photos.filter((url) => !seen.has(url)).map((url) => ({ url, position: null }));
        return [...current, ...added].slice(0, 12);
      });
    }
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createBusiness(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPin(null);
      setImages([]);
      setSchedule(null);
      setDraft(null);
      setName("");
      setDraftKey((key) => key + 1);
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <ImportFromLink kind="business" spaceId={spaceId} onApply={applyDraft} />

      <DuplicateHint communityId={communityId} communitySlug={communitySlug} name={name} lat={pin?.lat} lng={pin?.lng} />

      <BusinessFormFields
        key={draftKey}
        idPrefix="business"
        onNameChange={setName}
        draft={draft}
        customCategories={customCategories}
        labelOverrides={labelOverrides}
        pin={pin}
        onPinChange={setPin}
        images={images}
        onImagesChange={setImages}
        schedule={schedule}
        onScheduleChange={setSchedule}
        userId={userId}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add business
      </SubmitButton>
    </form>
  );
}
