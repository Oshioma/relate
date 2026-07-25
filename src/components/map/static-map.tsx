"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// Read-only single-pin map for a detail page. Same tiles and pin style as the
// location picker, but non-interactive by default (no click-to-move, dragging
// off) so it's a preview rather than an editor. Leaflet touches `window` at
// import time, so callers load this with next/dynamic ssr:false.
function pinIcon(emoji: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:12px">${emoji}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export default function StaticMap({
  lat,
  lng,
  emoji = "🏪",
  zoom = 15,
  height = 240,
}: {
  lat: number;
  lng: number;
  emoji?: string;
  zoom?: number;
  height?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={pinIcon(emoji)} />
      </MapContainer>
    </div>
  );
}
