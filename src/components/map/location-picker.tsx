"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { UNGUJA_BOUNDS } from "@/lib/map-bounds";

// Matches the marker style used on the Explore Map so the pin previews the
// way it will actually render there.
function pinIcon(emoji: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:12px">${emoji}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export type PickedLocation = { lat: number; lng: number };

export type FlyToTarget = { lat: number; lng: number; zoom: number };

// Imperatively recenters an already-mounted map — MapContainer's
// center/bounds props only apply on first mount, so getting the map to move
// afterward (e.g. after geocoding what someone typed into the location text
// field) needs the map instance itself. Skips re-firing for the same target
// (e.g. a parent re-render) by keying off the target's own values.
function FlyToHandler({ target }: { target: FlyToTarget | null }) {
  const map = useMap();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!target) return;
    const key = `${target.lat},${target.lng},${target.zoom}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    map.flyTo([target.lat, target.lng], target.zoom);
  }, [target, map]);

  return null;
}

export default function LocationPicker({
  value,
  onChange,
  emoji = "🏪",
  helpText = "Click the map to drop a pin where the business is.",
  flyTo = null,
}: {
  value: PickedLocation | null;
  onChange: (value: PickedLocation | null) => void;
  emoji?: string;
  helpText?: string;
  // Recenters the map to a place resolved from typed text (e.g. geocoding
  // "Kendwa") without moving the pin — the caller still clicks to drop it.
  flyTo?: FlyToTarget | null;
}) {
  return (
    <div>
      <div className="cursor-crosshair overflow-hidden rounded-md border border-border" style={{ height: 360 }}>
        <MapContainer
          {...(value ? { center: [value.lat, value.lng] as [number, number], zoom: 13 } : { bounds: UNGUJA_BOUNDS })}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onPick={(lat, lng) => onChange({ lat, lng })} />
          <FlyToHandler target={flyTo} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon(emoji)}
              draggable
              eventHandlers={{
                dragend(e) {
                  const p = (e.target as L.Marker).getLatLng();
                  onChange({ lat: p.lat, lng: p.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {value ? `Pinned at ${value.lat.toFixed(4)}, ${value.lng.toFixed(4)} — drag the pin to fine-tune.` : helpText}
        </p>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="shrink-0 text-xs font-medium text-danger hover:underline">
            Remove pin
          </button>
        )}
      </div>
    </div>
  );
}
