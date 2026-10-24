// The Living Map's polymorphic pin layer: anything in the community with a
// location renders on the Explore Map as a MapItem — a flattened view-model
// so the map doesn't need to know each entity's shape. Businesses and
// landmarks keep their own richer pins/popups; everything else goes through
// this. Assembled in src/lib/data/map-items.ts.

export type MapItemKind = "event" | "listing" | "job" | "stay" | "club" | "volunteer" | "recommendation" | "post" | "meetup" | "guide";

export type MapItem = {
  kind: MapItemKind;
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  lat: number;
  lng: number;
  locationLabel: string | null;
  // "exact" = a human placed this pin (map click, or a typed coordinate) —
  // every kind except events. "approximate" = geocoded from free-text
  // location, which only resolves to a general area, not the exact spot —
  // currently only events, since typing a Location is what puts them on the
  // map (see src/app/c/[communitySlug]/events/actions.ts).
  locationPrecision: "exact" | "approximate";
  // Where "View" leads — a detail page when one exists (posts), otherwise
  // the owning space (or /events).
  href: string;
  // Kind-specific extras. Dates stay ISO and are formatted client-side so
  // they render in the viewer's locale/timezone, not the server's.
  startTime: string | null;
  endTime: string | null;
  price: number | null;
  currency: string | null;
  // Pre-built one-liner for kinds with nothing to format client-side
  // (job type, club category, volunteers needed, …).
  meta: string | null;
  // Guide area pins only: what the community's guides pick out in this area,
  // each linking to its entry (e.g. "Kendwa Rocks · Beach Bars").
  links: MapItemLink[] | null;
};

export type MapItemLink = {
  label: string;
  href: string;
  // Which guide it comes from, used as the group heading in the popup.
  group: string;
  // That guide's own page.
  groupHref: string;
  // The entry's own area wording ("Off Stone Town"), so a pin at a village
  // centre never implies the place is exactly there.
  note: string | null;
};

// Display order here is also the filter-pill order on the map.
export const MAP_ITEM_KINDS: Record<MapItemKind, { emoji: string; color: string; label: string }> = {
  meetup: { emoji: "🥾", color: "#0f766e", label: "Meetups" },
  event: { emoji: "📅", color: "#7c3aed", label: "Events" },
  guide: { emoji: "📖", color: "#be123c", label: "From the guides" },
  listing: { emoji: "🏷️", color: "#ea580c", label: "For sale" },
  stay: { emoji: "🏠", color: "#0d9488", label: "Stays" },
  job: { emoji: "💼", color: "#0369a1", label: "Jobs" },
  club: { emoji: "👥", color: "#db2777", label: "Clubs" },
  volunteer: { emoji: "🤝", color: "#16a34a", label: "Volunteering" },
  recommendation: { emoji: "⭐", color: "#d97706", label: "Tips" },
  post: { emoji: "💬", color: "#475569", label: "Discussions" },
};

export const MAP_ITEM_KIND_ORDER = Object.keys(MAP_ITEM_KINDS) as MapItemKind[];

// Midnight at the start of the day `offset` days from `now`, local time.
export function dayStart(now: Date, offset: number): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset).getTime();
}

// "Tonight" / "Today" / "Tomorrow" / "On now" for an event in the next two
// days, null otherwise. Local time, since the map only renders client-side.
export function eventDayWord(startIso: string, endIso: string | null, now = new Date()): string | null {
  const start = new Date(startIso);
  const startMs = start.getTime();
  const endMs = endIso ? new Date(endIso).getTime() : startMs;
  if (endMs < now.getTime()) return null;
  if (startMs < dayStart(now, 0)) return "On now";
  if (startMs < dayStart(now, 1)) return startMs <= now.getTime() ? "On now" : start.getHours() >= 17 ? "Tonight" : "Today";
  if (startMs < dayStart(now, 2)) return "Tomorrow";
  return null;
}

// The map's default event window: anything on today or tomorrow, including
// a long-running event that started earlier and is still going.
export function isEventTodayOrTomorrow(item: MapItem, now = new Date()): boolean {
  if (item.kind !== "event" || !item.startTime) return false;
  return eventDayWord(item.startTime, item.endTime, now) !== null;
}
