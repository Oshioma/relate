import type { BusinessCategory, BusinessHoursSchedule, AccommodationType, AccommodationPriceUnit } from "@/types/database";

// The shape "paste a link and we'll fill the form" produces. Every field is
// nullable on purpose: an importer only sets what it actually found, and the
// form treats the rest as untouched. Shared by the server (which builds drafts
// from Google Places / page HTML / Claude) and the client forms (which apply
// them as field defaults), so it must stay free of server-only imports.
export type ListingImportKind = "business" | "accommodation";

export type ListingDraft = {
  name: string | null;
  description: string | null;
  // Directory listings only.
  category: BusinessCategory | null;
  is_local: boolean | null;
  opening_hours: BusinessHoursSchedule | null;
  // Accommodation listings only.
  accommodation_type: AccommodationType | null;
  price: number | null;
  price_unit: AccommodationPriceUnit | null;
  currency: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  amenities: string[];
  booking_url: string | null;
  // Both.
  address: string | null;
  location_label: string | null;
  website: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  photos: string[];
};

export const EMPTY_DRAFT: ListingDraft = {
  name: null,
  description: null,
  category: null,
  is_local: null,
  opening_hours: null,
  accommodation_type: null,
  price: null,
  price_unit: null,
  currency: null,
  bedrooms: null,
  bathrooms: null,
  max_guests: null,
  amenities: [],
  booking_url: null,
  address: null,
  location_label: null,
  website: null,
  phone: null,
  lat: null,
  lng: null,
  photos: [],
};

// Where a draft's facts came from, so the form can tell the member how much to
// trust it. "google" is authoritative (Places API), "page" read the real page,
// and "link" means the page was unreachable and only the URL itself was read.
export type ListingDraftSource = "google" | "page" | "link";

export type ListingImportResult =
  | { ok: true; draft: ListingDraft; source: ListingDraftSource; note: string }
  | { ok: false; error: string };

// True when the draft carries nothing worth applying — every importer can
// technically return an empty draft, and an empty one should read as a failure
// to the member rather than silently wiping nothing into the form.
export function isEmptyDraft(draft: ListingDraft): boolean {
  return Object.entries(draft).every(([, value]) =>
    value === null || (Array.isArray(value) && value.length === 0)
  );
}
