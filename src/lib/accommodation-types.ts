import type { AccommodationType } from "@/types/database";

export const ACCOMMODATION_TYPES: { value: AccommodationType; label: string }[] = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "holiday_rental", label: "Holiday rental" },
  { value: "long_term_rental", label: "Long-term rental" },
  { value: "house_share", label: "House share" },
  { value: "camping", label: "Camping" },
];

export function accommodationTypeLabel(type: AccommodationType): string {
  return ACCOMMODATION_TYPES.find((t) => t.value === type)?.label ?? type;
}

// A listing's price rendered as "$65 / night" (or a plain fallback if the
// currency code isn't one Intl understands). Shared by the card, detail page,
// feed and map so pricing always reads the same.
export function formatAccommodationPrice(listing: { price_per_night: number | null; currency: string | null }): string | null {
  if (listing.price_per_night === null) return null;
  try {
    const amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: listing.currency || "USD",
      maximumFractionDigits: 0,
    }).format(listing.price_per_night);
    return `${amount} / night`;
  } catch {
    return `${listing.currency ?? ""} ${listing.price_per_night} / night`.trim();
  }
}

// The listing's photo gallery: prefer photo_urls, falling back to the legacy
// denormalised cover for rows created before photo_urls existed. Shared by the
// card, the detail carousel and the edit form so they never disagree.
export function accommodationPhotos(listing: { photo_urls: string[]; photo_url: string | null }): string[] {
  if (listing.photo_urls.length > 0) return listing.photo_urls;
  return listing.photo_url ? [listing.photo_url] : [];
}
