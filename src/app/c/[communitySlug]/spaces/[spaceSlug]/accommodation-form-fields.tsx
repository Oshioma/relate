"use client";

import { Input, Textarea, Label } from "@/components/ui/input";
import { ACCOMMODATION_TYPES, ACCOMMODATION_PRICE_UNITS, ACCOMMODATION_AMENITIES } from "@/lib/accommodation-types";
import { AccommodationPhotosInput } from "./accommodation-photos-input";
import type { ListingDraft } from "@/lib/listing-draft";
import type { AccommodationListing } from "@/types/database";
import type { BusinessLinkOption } from "@/lib/data/accommodation";

const selectClass = "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

// Shared field set for the new and edit accommodation forms, so both stay in
// lockstep. `idPrefix` keeps input ids unique when several forms (e.g. an inline
// edit card) live on the page at once; `listing` pre-fills for editing.
//
// `draft` is an unsaved link-import result: it outranks `listing` as the default
// for any field it filled. These inputs are uncontrolled, so defaults only apply
// on mount — the parent remounts this subtree (via `key`) per draft.
export function AccommodationFormFields({
  idPrefix,
  listing,
  draft,
  businesses,
  photos,
  onPhotosChange,
  userId,
}: {
  idPrefix: string;
  listing?: AccommodationListing;
  draft?: ListingDraft | null;
  businesses: BusinessLinkOption[];
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  userId: string;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_name`}>Name</Label>
          <Input id={`${idPrefix}_name`} name="name" placeholder="Ocean View Guesthouse" defaultValue={draft?.name ?? listing?.name ?? ""} required />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_type`}>Type</Label>
          <select
            id={`${idPrefix}_type`}
            name="accommodation_type"
            defaultValue={draft?.accommodation_type ?? listing?.accommodation_type ?? "holiday_rental"}
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
        <Textarea id={`${idPrefix}_description`} name="description" rows={2} defaultValue={draft?.description ?? listing?.description ?? ""} />
      </div>

      {businesses.length > 0 && (
        <div>
          <Label htmlFor={`${idPrefix}_business`}>Link to a directory listing (optional)</Label>
          <select id={`${idPrefix}_business`} name="business_id" defaultValue={listing?.business_id ?? ""} className={selectClass}>
            <option value="">Not linked</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">If this stay is already in the Business Directory, link it so guests can jump to its full page.</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[1.5fr_1.5fr_1fr]">
        <div>
          <Label htmlFor={`${idPrefix}_price`}>Price (optional)</Label>
          <Input id={`${idPrefix}_price`} name="price_per_night" type="number" step="0.01" min="0" placeholder="65.00" defaultValue={draft?.price ?? listing?.price_per_night ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_price_unit`}>Per</Label>
          <select id={`${idPrefix}_price_unit`} name="price_unit" defaultValue={draft?.price_unit ?? listing?.price_unit ?? "per_night"} className={selectClass}>
            {ACCOMMODATION_PRICE_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_currency`}>Currency</Label>
          <Input id={`${idPrefix}_currency`} name="currency" placeholder="USD" defaultValue={draft?.currency ?? listing?.currency ?? "USD"} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor={`${idPrefix}_bedrooms`}>Bedrooms (optional)</Label>
          <Input id={`${idPrefix}_bedrooms`} name="bedrooms" type="number" min="0" step="1" placeholder="2" defaultValue={draft?.bedrooms ?? listing?.bedrooms ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_bathrooms`}>Bathrooms (optional)</Label>
          <Input id={`${idPrefix}_bathrooms`} name="bathrooms" type="number" min="0" step="1" placeholder="1" defaultValue={draft?.bathrooms ?? listing?.bathrooms ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_max_guests`}>Sleeps (optional)</Label>
          <Input id={`${idPrefix}_max_guests`} name="max_guests" type="number" min="0" step="1" placeholder="4" defaultValue={draft?.max_guests ?? listing?.max_guests ?? ""} />
        </div>
      </div>

      <div>
        <Label>Amenities (optional)</Label>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {ACCOMMODATION_AMENITIES.map((a) => (
            <label key={a.value} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="amenities"
                value={a.value}
                defaultChecked={draft ? draft.amenities.includes(a.value) : listing?.amenities.includes(a.value) ?? false}
                className="h-3.5 w-3.5 rounded border-border"
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_available_from`}>Available from (optional)</Label>
          <Input id={`${idPrefix}_available_from`} name="available_from" type="date" defaultValue={listing?.available_from ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_available_to`}>Available until (optional)</Label>
          <Input id={`${idPrefix}_available_to`} name="available_to" type="date" defaultValue={listing?.available_to ?? ""} />
        </div>
      </div>

      <div>
        <Label>Photos (optional)</Label>
        <AccommodationPhotosInput photos={photos} onChange={onPhotosChange} userId={userId} />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_booking_url`}>Booking link (optional)</Label>
        <Input id={`${idPrefix}_booking_url`} name="booking_url" type="url" placeholder="https://…" defaultValue={draft?.booking_url ?? listing?.booking_url ?? ""} />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_location_label`}>Location (optional)</Label>
        <Input id={`${idPrefix}_location_label`} name="location_label" placeholder="Nungwi Beach" defaultValue={draft?.location_label ?? listing?.location_label ?? ""} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_lat`}>Latitude (optional)</Label>
          <Input id={`${idPrefix}_lat`} name="lat" type="number" step="any" placeholder="-6.1462" defaultValue={draft?.lat ?? listing?.lat ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_lng`}>Longitude (optional)</Label>
          <Input id={`${idPrefix}_lng`} name="lng" type="number" step="any" placeholder="39.3621" defaultValue={draft?.lng ?? listing?.lng ?? ""} />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this listing on the Explore Map.</p>
    </>
  );
}
