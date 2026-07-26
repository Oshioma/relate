import type { AccommodationType, AccommodationPriceUnit } from "@/types/database";

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

// How a price reads. The short suffix ("/ night") goes next to the amount; the
// long label ("per night") labels the picker.
export const ACCOMMODATION_PRICE_UNITS: { value: AccommodationPriceUnit; label: string; suffix: string }[] = [
  { value: "per_night", label: "per night", suffix: "/ night" },
  { value: "per_week", label: "per week", suffix: "/ week" },
  { value: "per_month", label: "per month", suffix: "/ month" },
];

function priceUnitSuffix(unit: AccommodationPriceUnit): string {
  return ACCOMMODATION_PRICE_UNITS.find((u) => u.value === unit)?.suffix ?? "/ night";
}

// The amenities a listing can advertise, and that guests can filter on. Slugs
// are what accommodation_listings.amenities stores; labels are what render.
export const ACCOMMODATION_AMENITIES: { value: string; label: string }[] = [
  { value: "wifi", label: "Wifi" },
  { value: "kitchen", label: "Kitchen" },
  { value: "air_conditioning", label: "Air conditioning" },
  { value: "heating", label: "Heating" },
  { value: "free_parking", label: "Free parking" },
  { value: "pool", label: "Pool" },
  { value: "washer", label: "Washer" },
  { value: "tv", label: "TV" },
  { value: "workspace", label: "Workspace" },
  { value: "breakfast", label: "Breakfast" },
  { value: "pet_friendly", label: "Pet friendly" },
  { value: "hot_water", label: "Hot water" },
];

export function amenityLabel(value: string): string {
  return ACCOMMODATION_AMENITIES.find((a) => a.value === value)?.label ?? value;
}

// A listing's price rendered as "$65 / night" (respecting its price unit; plain
// fallback if the currency code isn't one Intl understands). Shared by the card,
// detail page, feed and map so pricing always reads the same.
export function formatAccommodationPrice(listing: {
  price_per_night: number | null;
  currency: string | null;
  price_unit?: AccommodationPriceUnit;
}): string | null {
  if (listing.price_per_night === null) return null;
  const suffix = priceUnitSuffix(listing.price_unit ?? "per_night");
  try {
    const amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: listing.currency || "USD",
      maximumFractionDigits: 0,
    }).format(listing.price_per_night);
    return `${amount} ${suffix}`;
  } catch {
    return `${listing.currency ?? ""} ${listing.price_per_night} ${suffix}`.trim();
  }
}

// A compact "2 bd · 1 ba · sleeps 4" summary, skipping whatever wasn't set.
export function accommodationFactsSummary(listing: {
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
}): string | null {
  const parts: string[] = [];
  if (listing.bedrooms !== null) parts.push(`${listing.bedrooms} bd`);
  if (listing.bathrooms !== null) parts.push(`${listing.bathrooms} ba`);
  if (listing.max_guests !== null) parts.push(`sleeps ${listing.max_guests}`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

// The availability window as "Available Aug 3 – Aug 10", "Available from Aug 3"
// or "Available until Aug 10" — null when neither bound is set.
export function formatAvailabilityWindow(listing: { available_from: string | null; available_to: string | null }): string | null {
  const fmt = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const { available_from: from, available_to: to } = listing;
  if (from && to) return `Available ${fmt(from)} – ${fmt(to)}`;
  if (from) return `Available from ${fmt(from)}`;
  if (to) return `Available until ${fmt(to)}`;
  return null;
}

// The listing's photo gallery; photo_urls[0] is the cover. A thin accessor kept
// so the card, detail carousel and edit form share one notion of "the photos".
export function accommodationPhotos(listing: { photo_urls: string[] }): string[] {
  return listing.photo_urls;
}
