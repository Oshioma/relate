"use client";

import { useActionState, useRef, useEffect } from "react";
import { createAccommodationListing, type AccommodationFormState } from "./accommodation-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ACCOMMODATION_TYPES } from "@/lib/accommodation-types";

export function NewAccommodationForm({
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
  const [state, formAction] = useActionState<AccommodationFormState, FormData>(createAccommodationListing, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="accommodation_name">Name</Label>
          <Input id="accommodation_name" name="name" placeholder="Ocean View Guesthouse" required />
        </div>
        <div>
          <Label htmlFor="accommodation_type">Type</Label>
          <select
            id="accommodation_type"
            name="accommodation_type"
            defaultValue="holiday_rental"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {ACCOMMODATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="accommodation_description">Description (optional)</Label>
        <Textarea id="accommodation_description" name="description" rows={2} />
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <div>
          <Label htmlFor="accommodation_price">Price per night (optional)</Label>
          <Input id="accommodation_price" name="price_per_night" type="number" step="0.01" min="0" placeholder="65.00" />
        </div>
        <div>
          <Label htmlFor="accommodation_currency">Currency</Label>
          <Input id="accommodation_currency" name="currency" placeholder="USD" defaultValue="USD" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="accommodation_photo_url">Photo URL (optional)</Label>
          <Input id="accommodation_photo_url" name="photo_url" type="url" placeholder="https://…" />
        </div>
        <div>
          <Label htmlFor="accommodation_booking_url">Booking link (optional)</Label>
          <Input id="accommodation_booking_url" name="booking_url" type="url" placeholder="https://…" />
        </div>
      </div>

      <div>
        <Label htmlFor="accommodation_location_label">Location (optional)</Label>
        <Input id="accommodation_location_label" name="location_label" placeholder="Nungwi Beach" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="accommodation_lat">Latitude (optional)</Label>
          <Input id="accommodation_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="accommodation_lng">Longitude (optional)</Label>
          <Input id="accommodation_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this listing on the Explore Map.</p>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post listing
      </SubmitButton>
    </form>
  );
}
