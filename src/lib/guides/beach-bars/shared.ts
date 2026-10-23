// The date the bars' details were last checked against current sources, and
// a map search link (never an invented pin).
export const CHECKED = "2026-10-23";

export function maps(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query}, Zanzibar`)}`;
}

// The restaurant guide, for bars that are in both.
export const RESTAURANTS_SLUG = "best-restaurants-zanzibar";
