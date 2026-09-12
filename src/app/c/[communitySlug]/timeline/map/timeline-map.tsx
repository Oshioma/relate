"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import Link from "next/link";
import { Map as MapGL, Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import { MapPin } from "lucide-react";
import { timelineCategory } from "@/lib/timeline/taxonomy";

// The same keyless vector basemap the rest of the app already uses, so this
// page introduces neither a second tile provider nor an API key.
const STYLE = "https://tiles.openfreemap.org/styles/positron";

export type PinnedPlace = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
};

export function TimelineMap({ places, communitySlug }: { places: PinnedPlace[]; communitySlug: string }) {
  const [open, setOpen] = useState<PinnedPlace | null>(null);

  // FRAME WHATEVER IS THERE, rather than assuming a part of the world. With
  // nine Carthaginian records the view is the western Mediterranean; with a
  // hundred it is wherever they are. Hard-coding a centre would make the map
  // look like a map of somewhere, which is the thing this page is trying not
  // to imply.
  const lats = places.map((place) => place.lat!).filter((n) => Number.isFinite(n));
  const lngs = places.map((place) => place.lng!).filter((n) => Number.isFinite(n));
  const centre =
    lats.length > 0
      ? {
          latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
          longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
        }
      : { latitude: 20, longitude: 0 };
  const span =
    lats.length > 1
      ? Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs))
      : 0;
  const zoom = span === 0 ? 2 : Math.max(1, Math.min(6, Math.log2(360 / Math.max(span, 1)) - 0.5));

  return (
    <div className="h-[26rem] overflow-hidden rounded-xl border border-border sm:h-[32rem]">
      <MapGL
        initialViewState={{ ...centre, zoom }}
        mapStyle={STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {places.map((place) => {
          const meta = timelineCategory(place.category);
          return (
            <Marker
              key={place.id}
              latitude={place.lat!}
              longitude={place.lng!}
              anchor="bottom"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setOpen(place);
              }}
            >
              <button
                type="button"
                aria-label={place.title}
                className="flex h-7 w-7 -translate-y-1 items-center justify-center rounded-full bg-card shadow ring-1 ring-border"
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${meta.chipClass}`}>
                  <MapPin className="h-3 w-3" />
                </span>
              </button>
            </Marker>
          );
        })}
        {open && (
          <Popup
            latitude={open.lat!}
            longitude={open.lng!}
            anchor="bottom"
            offset={28}
            closeButton
            onClose={() => setOpen(null)}
            maxWidth="18rem"
          >
            <Link
              href={`/c/${communitySlug}/timeline/${open.slug}`}
              className="block text-sm font-semibold text-foreground hover:underline"
            >
              {open.title}
            </Link>
            {open.location_name && <p className="mt-0.5 text-xs text-muted-foreground">{open.location_name}</p>}
            {/* SAY WHAT A PIN IS. A dot on a map reads as "this happened
                exactly here"; for most of these it means "this is the place
                the record names", which is a looser thing and worth saying at
                the moment somebody clicks one. */}
            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
              The place this record names — not a measured findspot.
            </p>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
