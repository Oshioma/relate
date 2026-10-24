import type { MapItem, MapItemLink } from "@/lib/map-item-kinds";
import { cardThumb, parseOverrides, resolveGuideContent, WHERE_TO_STAY_SLUG } from "@/lib/guides/where-to-stay/content";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { loadHotelGuide } from "@/lib/guides/hotel-guide/content";
import { hotelGuideFor } from "@/lib/guides/hotel-guide/registry";
import { loadPlaceGuide } from "@/lib/guides/place-guide/content";
import { placeGuideFor } from "@/lib/guides/place-guide/registry";
import { matchZanzibarPlace } from "@/lib/zanzibar-places";

// The community's editorial guides on the Explore Map: one pin per village or
// area, at its rough centre, listing everything the guides pick out there
// (picturesque places, restaurants, beach bars, hotels), each linking to its
// entry. One pin per area rather than per entry, because the guides
// deliberately carry no exact coordinates ("a search link, so it can never
// point at a made-up pin") — fifty pins piled on a village centre would look
// exact and mislead. Entries that already have a directory listing are on the
// map anyway, as that business's own pin.

export type GuideRow = { slug: string; content: unknown };

type Area = {
  key: string;
  name: string;
  lat: number;
  lng: number;
  description: string | null;
  meta: string | null;
  photo: GuidePhoto | null;
  href: string | null;
  links: MapItemLink[];
};

// "Postcards from Zanzibar: The Island's Picture-Perfect Places" → "The
// Island's Picture-Perfect Places": the guides' titles lead with a strapline.
function shortTitle(title: string): string {
  return title.split(":").pop()!.trim();
}

export function guideMapItems(rows: GuideRow[], communitySlug: string): MapItem[] {
  const guideHref = (slug: string, anchor: string) => `/c/${communitySlug}/guides/${slug}#${anchor}`;
  const areas = new Map<string, Area>();

  // The Where to Stay guide describes the areas themselves — its 14
  // destinations (with any admin overrides) seed the pins.
  const whereToStay = rows.find((r) => r.slug === WHERE_TO_STAY_SLUG);
  if (whereToStay) {
    for (const d of resolveGuideContent(parseOverrides(whereToStay.content)).destinations) {
      const links: MapItemLink[] = [];
      if (d.stays.length > 0) {
        links.push({
          label: `Where to stay in ${d.name} (${d.stays.length} ${d.stays.length === 1 ? "pick" : "picks"})`,
          href: guideHref(WHERE_TO_STAY_SLUG, `${d.key}-stay`),
          group: "Where to Stay in Zanzibar",
          note: null,
        });
      }
      areas.set(d.key, {
        key: d.key,
        name: d.name,
        lat: d.lat,
        lng: d.lng,
        description: d.summary,
        meta: d.category,
        photo: d.photos[0] ?? null,
        href: guideHref(WHERE_TO_STAY_SLUG, d.key),
        links,
      });
    }
  }

  const add = (entry: { key: string; name: string; area: string; photos: GuidePhoto[] }, guideSlug: string, group: string) => {
    const place = matchZanzibarPlace(entry.area);
    if (!place) return;
    const link: MapItemLink = {
      label: entry.name,
      href: guideHref(guideSlug, entry.key),
      group,
      note: entry.area.toLowerCase() === place.name.toLowerCase() ? null : entry.area,
    };
    const existing = areas.get(place.key);
    if (existing) {
      existing.links.push(link);
      existing.photo ??= entry.photos[0] ?? null;
      return;
    }
    areas.set(place.key, {
      key: place.key,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      description: null,
      meta: null,
      photo: entry.photos[0] ?? null,
      href: null,
      links: [link],
    });
  };

  for (const row of rows) {
    const places = placeGuideFor(row.slug);
    if (places) {
      const group = shortTitle(places.title);
      for (const p of loadPlaceGuide(places, row.content).places) add(p, row.slug, group);
      continue;
    }
    const hotels = hotelGuideFor(row.slug);
    if (hotels) {
      const group = shortTitle(hotels.title);
      const resolved = loadHotelGuide(hotels, row.content);
      for (const h of [...resolved.featured, ...resolved.more]) add({ ...h, photos: h.photos.length > 0 ? h.photos : h.areaPhotos }, row.slug, group);
    }
  }

  const items: MapItem[] = [];
  for (const area of areas.values()) {
    if (area.links.length === 0 && !area.href) continue;
    const count = area.links.length;
    items.push({
      kind: "guide",
      id: area.key,
      title: area.name,
      description: area.description,
      imageUrl: cardThumb(area.photo),
      lat: area.lat,
      lng: area.lng,
      locationLabel: area.name,
      locationPrecision: "approximate",
      href: area.href ?? area.links[0].href,
      startTime: null,
      endTime: null,
      price: null,
      currency: null,
      meta: area.meta ?? `${count} ${count === 1 ? "pick" : "picks"} in our guides`,
      links: area.links,
    });
  }
  return items;
}
