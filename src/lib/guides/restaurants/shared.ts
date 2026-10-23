// The date the restaurants' details were last checked against current
// sources, and a map search link (never an invented pin).
export const CHECKED = "2026-10-23";

export function maps(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query}, Zanzibar`)}`;
}

// The beach bars guide, for restaurants that are in both.
export const BEACH_BARS_SLUG = "best-beach-bars-zanzibar";
