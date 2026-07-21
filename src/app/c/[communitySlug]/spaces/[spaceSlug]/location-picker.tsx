"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Same Africa-centred default as the Explore Map (see explore-map.tsx) so a
// blank picker opens roughly where the community's pins will live.
const DEFAULT_CENTER: [number, number] = [-6.1659, 39.2026];

// Matches the business marker on the Explore Map so the pin previews the way
// it will actually render there.
function pinIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:12px">🏪</span>`,
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

export default function LocationPicker({
  value,
  onChange,
}: {
  value: PickedLocation | null;
  onChange: (value: PickedLocation | null) => void;
}) {
  return (
    <div>
      <div className="cursor-crosshair overflow-hidden rounded-md border border-border" style={{ height: 240 }}>
        <MapContainer
          center={value ? [value.lat, value.lng] : DEFAULT_CENTER}
          zoom={value ? 13 : 6}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onPick={(lat, lng) => onChange({ lat, lng })} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon()}
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
          {value
            ? `Pinned at ${value.lat.toFixed(4)}, ${value.lng.toFixed(4)} — drag the pin to fine-tune.`
            : "Click the map to drop a pin where the business is."}
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
