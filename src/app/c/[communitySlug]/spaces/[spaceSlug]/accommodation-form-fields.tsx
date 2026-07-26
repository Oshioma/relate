"use client";

import { Input, Textarea, Label } from "@/components/ui/input";
import { ACCOMMODATION_TYPES } from "@/lib/accommodation-types";
import { AccommodationPhotosInput } from "./accommodation-photos-input";
import type { AccommodationListing } from "@/types/database";

// Shared field set for the new and edit accommodation forms, so both stay in
// lockstep. `idPrefix` keeps input ids unique when several forms (e.g. an inline
// edit card) live on the page at once; `listing` pre-fills for editing.
export function AccommodationFormFields({
  idPrefix,
  listing,
  photos,
  onPhotosChange,
  userId,
}: {
  idPrefix: string;
  listing?: AccommodationListing;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  userId: string;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_name`}>Name</Label>
          <Input id={`${idPrefix}_name`} name="name" placeholder="Ocean View Guesthouse" defaultValue={listing?.name ?? ""} required />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_type`}>Type</Label>
          <select
            id={`${idPrefix}_type`}
            name="accommodation_type"
            defaultValue={listing?.accommodation_type ?? "holiday_rental"}
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
        <Label htmlFor={`${idPrefix}_description`}>Description (optional)</Label>
        <Textarea id={`${idPrefix}_description`} name="description" rows={2} defaultValue={listing?.description ?? ""} />
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <div>
          <Label htmlFor={`${idPrefix}_price`}>Price per night (optional)</Label>
          <Input
            id={`${idPrefix}_price`}
            name="price_per_night"
            type="number"
            step="0.01"
            min="0"
            placeholder="65.00"
            defaultValue={listing?.price_per_night ?? ""}
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_currency`}>Currency</Label>
          <Input id={`${idPrefix}_currency`} name="currency" placeholder="USD" defaultValue={listing?.currency ?? "USD"} />
        </div>
      </div>

      <div>
        <Label>Photos (optional)</Label>
        <AccommodationPhotosInput photos={photos} onChange={onPhotosChange} userId={userId} />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_booking_url`}>Booking link (optional)</Label>
        <Input id={`${idPrefix}_booking_url`} name="booking_url" type="url" placeholder="https://…" defaultValue={listing?.booking_url ?? ""} />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_location_label`}>Location (optional)</Label>
        <Input id={`${idPrefix}_location_label`} name="location_label" placeholder="Nungwi Beach" defaultValue={listing?.location_label ?? ""} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_lat`}>Latitude (optional)</Label>
          <Input id={`${idPrefix}_lat`} name="lat" type="number" step="any" placeholder="-6.1462" defaultValue={listing?.lat ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_lng`}>Longitude (optional)</Label>
          <Input id={`${idPrefix}_lng`} name="lng" type="number" step="any" placeholder="39.3621" defaultValue={listing?.lng ?? ""} />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this listing on the Explore Map.</p>
    </>
  );
}
