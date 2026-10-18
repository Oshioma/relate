"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import type { DestinationSummary } from "./types";
import { commonsSrcSet } from "./guide-image";

// The overview map of all 14 destinations, on the same OpenStreetMap tiles
// and Leaflet stack as the community's Explore Map. Pins sit at each area's
// approximate centre — enough to see where places are relative to each other,
// never presented as a business's exact position. Scroll-zoom is off so the
// page keeps scrolling past it on a phone.
export default function GuideMap({ destinations }: { destinations: DestinationSummary[] }) {
  return (
    <MapContainer
      center={[-6.1, 39.36]}
      zoom={9}
      minZoom={8}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      aria-label="Map of the 14 destinations in this guide"
    >
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {destinations.map((d) => {
        const thumb = d.photo ? commonsSrcSet(d.photo.src, d.photo.width).src : null;
        return (
          <CircleMarker
            key={d.key}
            center={[d.lat, d.lng]}
            radius={9}
            pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#0e7490", fillOpacity: 1 }}
          >
            <Tooltip direction="top" offset={[0, -8]} permanent={false}>
              {d.rank}. {d.name}
            </Tooltip>
            <Popup>
              <div style={{ width: 200 }}>
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element -- popup thumbnail, rendered by Leaflet outside React's image pipeline
                  <img src={thumb} alt={d.photo?.alt ?? ""} loading="lazy" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6 }} />
                )}
                <p style={{ margin: "6px 0 2px", fontWeight: 600 }}>
                  {d.rank}. {d.name}
                </p>
                <p style={{ margin: 0, fontSize: 12 }}>{d.summary}</p>
                <a href={`#${d.key}`} style={{ display: "inline-block", marginTop: 6, fontSize: 12, fontWeight: 600 }}>
                  Read the {d.name} guide →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
