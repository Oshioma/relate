// The Living Map's polymorphic pin layer: anything in the community with a
// location renders on the Explore Map as a MapItem — a flattened view-model
// so the map doesn't need to know each entity's shape. Businesses and
// landmarks keep their own richer pins/popups; everything else goes through
// this. Assembled in src/lib/data/map-items.ts.

export type MapItemKind = "event" | "listing" | "job" | "stay" | "club" | "volunteer" | "recommendation" | "post";

export type MapItem = {
  kind: MapItemKind;
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  lat: number;
  lng: number;
  locationLabel: string | null;
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
};

// Display order here is also the filter-pill order on the map.
export const MAP_ITEM_KINDS: Record<MapItemKind, { emoji: string; color: string; label: string }> = {
  event: { emoji: "📅", color: "#7c3aed", label: "Events" },
  listing: { emoji: "🏷️", color: "#ea580c", label: "For sale" },
  stay: { emoji: "🏠", color: "#0d9488", label: "Stays" },
  job: { emoji: "💼", color: "#0369a1", label: "Jobs" },
  club: { emoji: "👥", color: "#db2777", label: "Clubs" },
  volunteer: { emoji: "🤝", color: "#16a34a", label: "Volunteering" },
  recommendation: { emoji: "⭐", color: "#d97706", label: "Tips" },
  post: { emoji: "💬", color: "#475569", label: "Discussions" },
};

export const MAP_ITEM_KIND_ORDER = Object.keys(MAP_ITEM_KINDS) as MapItemKind[];
