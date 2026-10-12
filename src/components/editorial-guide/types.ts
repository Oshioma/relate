import type { Destination, GuidePhoto } from "@/lib/guides/where-to-stay/types";

// The slice of a destination the interactive (client) parts of the guide
// need. Keeps the long editorial copy out of the client bundle.
export type DestinationSummary = Pick<Destination, "key" | "name" | "rank" | "category" | "summary" | "bestFor" | "panel" | "tradeOff" | "lat" | "lng" | "coast"> & {
  photo: Pick<GuidePhoto, "src" | "alt" | "width"> | null;
};

export function summarise(d: Destination): DestinationSummary {
  const photo = d.photos[0] ?? null;
  return {
    key: d.key,
    name: d.name,
    rank: d.rank,
    category: d.category,
    summary: d.summary,
    bestFor: d.bestFor,
    panel: d.panel,
    tradeOff: d.tradeOff,
    lat: d.lat,
    lng: d.lng,
    coast: d.coast,
    photo: photo ? { src: photo.src, alt: photo.alt, width: photo.width } : null,
  };
}
