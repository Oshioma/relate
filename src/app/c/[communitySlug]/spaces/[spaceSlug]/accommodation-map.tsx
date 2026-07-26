"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { UNGUJA_BOUNDS } from "@/lib/map-bounds";
import { accommodationTypeLabel, accommodationPhotos, formatAccommodationPrice } from "@/lib/accommodation-types";
import type { AccommodationListingWithStats } from "@/lib/data/accommodation";

// Same teardrop-free dot marker used by the location picker / static map, so
// stay pins read consistently with the rest of the app's maps.
function pinIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:12px">🛏️</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// MapContainer's bounds only apply on first mount, so refit imperatively when
// the filtered set changes (e.g. the user narrows by amenity).
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
  }, [points, map]);
  return null;
}

// An in-space map of the listings that have coordinates, each pin opening a
// popup that links into the stay's detail page. Leaflet touches `window` at
// import, so the view loads this with next/dynamic ssr:false.
export default function AccommodationMap({
  listings,
  communitySlug,
  spaceSlug,
}: {
  listings: AccommodationListingWithStats[];
  communitySlug: string;
  spaceSlug: string;
}) {
  const located = listings.filter((l) => l.lat !== null && l.lng !== null) as (AccommodationListingWithStats & { lat: number; lng: number })[];
  const points = located.map((l) => [l.lat, l.lng] as [number, number]);

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height: "65vh", minHeight: 420 }}>
      <MapContainer bounds={UNGUJA_BOUNDS} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={points} />
        {located.map((listing) => {
          const cover = accommodationPhotos(listing)[0];
          const price = formatAccommodationPrice(listing);
          return (
            <Marker key={listing.id} position={[listing.lat, listing.lng]} icon={pinIcon()}>
              <Popup>
                <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/stays/${listing.id}`} className="block w-44">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={listing.name} className="mb-1.5 h-24 w-full rounded object-cover" />
                  )}
                  <span className="block text-sm font-semibold text-foreground">{listing.name}</span>
                  <span className="block text-xs text-muted-foreground">{accommodationTypeLabel(listing.accommodation_type)}</span>
                  {price && <span className="mt-0.5 block text-xs font-semibold text-foreground">{price}</span>}
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
