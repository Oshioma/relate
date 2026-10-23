import { stayTermForType, type StayTerm } from "@/lib/accommodation-types";
import type { AccommodationType } from "@/types/database";
import type { ZanzibarRoomsStay } from "./stays";

// Zanzibar Rooms stays shown inside a community's accommodation directory, in
// the same grid as the members' own listings and under the same filters.
// Plain TypeScript (no React, no zod) so the client view and the tests share it.

// The one space that shows them: Mzungu Zanzibar's accommodation directory.
// The spaces page is shared by every community, so this is gated by slug
// rather than by space type.
export const PARTNER_DIRECTORY = { communitySlug: "mzunguzanzibar", spaceSlug: "accomodation" } as const;
// How many stays the directory asks the feed for.
export const DIRECTORY_STAYS_LIMIT = 24;

export function showsPartnerStays(communitySlug: string, spaceSlug: string): boolean {
  return communitySlug === PARTNER_DIRECTORY.communitySlug && spaceSlug === PARTNER_DIRECTORY.spaceSlug;
}

// A stay as the directory card renders it. The price label is worked out on
// the server so the client never loads the feed parser.
export type PartnerStay = ZanzibarRoomsStay & { priceLabel: string };

// Which type chip a stay sits under. The feed has no property type, only a
// price unit: monthly lets are long-term rentals (so they also land under the
// directory's "Long term" toggle, the way a member's monthly let would) and
// everything else is a holiday rental, the closest of the directory's types to
// a short let booked through a listings site.
export function partnerStayType(stay: Pick<ZanzibarRoomsStay, "priceUnit">): AccommodationType {
  return stay.priceUnit === "month" ? "long_term_rental" : "holiday_rental";
}

function words(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

// Which of the directory's location chips a stay's area belongs to, or null
// (it then shows only under "All locations"). Zanzibar Rooms areas are place
// names with an optional neighbourhood ("Jambiani - Kikadini", "Kendwa"), so a
// chip matches when its words open the area's words; the longest match wins
// ("Stone Town" over a hypothetical "Stone"). Never invents a new chip.
export function partnerStayLocation(area: string | null, labels: readonly string[]): string | null {
  if (!area) return null;
  const areaWords = words(area);
  let best: string | null = null;
  let bestLength = 0;
  for (const label of labels) {
    const labelWords = words(label);
    if (labelWords.length === 0 || labelWords.length <= bestLength) continue;
    if (labelWords.every((w, i) => areaWords[i] === w)) {
      best = label;
      bestLength = labelWords.length;
    }
  }
  return best;
}

export type PlacedPartnerStay = PartnerStay & { type: AccommodationType; term: StayTerm; location: string | null };

export function placePartnerStays(stays: readonly PartnerStay[] | null | undefined, labels: readonly string[]): PlacedPartnerStay[] {
  return (stays ?? []).map((stay) => {
    const type = partnerStayType(stay);
    return { ...stay, type, term: stayTermForType(type), location: partnerStayLocation(stay.area, labels) };
  });
}

export type DirectoryFilters = {
  term: StayTerm | "all";
  type: AccommodationType | "all";
  location: string;
  query: string;
  min: number | null;
  max: number | null;
  amenities: readonly string[];
  savedOnly: boolean;
  sort: "newest" | "price_asc" | "price_desc" | "top_rated";
};

// Whether a stay passes the directory's filters. Amenity and "Saved" filters
// hide every stay: the feed lists no amenities, and stays can't be saved here.
export function partnerStayMatches(stay: PlacedPartnerStay, f: DirectoryFilters): boolean {
  if (f.amenities.length > 0 || f.savedOnly) return false;
  if (f.term !== "all" && stay.term !== f.term) return false;
  if (f.type !== "all" && stay.type !== f.type) return false;
  if (f.location !== "all" && stay.location !== f.location) return false;
  const q = f.query.trim().toLowerCase();
  if (q && ![stay.name, stay.summary, stay.area ?? ""].some((s) => s.toLowerCase().includes(q))) return false;
  if (f.min !== null && Number.isFinite(f.min) && stay.fromPrice < f.min) return false;
  if (f.max !== null && Number.isFinite(f.max) && stay.fromPrice > f.max) return false;
  return true;
}

export type DirectoryItem<L> = { kind: "listing"; listing: L } | { kind: "partner"; stay: PlacedPartnerStay };

// The grid: the members' listings (already filtered and sorted by the view)
// with the matching stays merged in. Price sorts interleave by the stay's
// "from" price compared as-is with a listing's price, exactly as the directory
// already compares listings (it doesn't convert currencies or units); unpriced
// listings stay last. Every other sort puts stays after the members' listings,
// since they have no date or rating here.
export function mergeDirectory<L extends { price_per_night: number | null }>(
  listings: readonly L[],
  stays: readonly PlacedPartnerStay[],
  f: DirectoryFilters
): DirectoryItem<L>[] {
  const items: DirectoryItem<L>[] = listings.map((listing) => ({ kind: "listing", listing }));
  const partners: DirectoryItem<L>[] = stays.filter((s) => partnerStayMatches(s, f)).map((stay) => ({ kind: "partner", stay }));
  if (partners.length === 0) return items;
  const merged = [...items, ...partners];
  if (f.sort !== "price_asc" && f.sort !== "price_desc") return merged;
  const dir = f.sort === "price_asc" ? 1 : -1;
  const price = (item: DirectoryItem<L>) => (item.kind === "listing" ? item.listing.price_per_night : item.stay.fromPrice);
  // Stable, so equal prices keep members' listings first.
  return merged.sort((a, b) => {
    const pa = price(a);
    const pb = price(b);
    if (pa === null) return pb === null ? 0 : 1;
    if (pb === null) return -1;
    return (pa - pb) * dir;
  });
}
