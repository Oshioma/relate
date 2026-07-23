"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { geocodeEventLocation } from "./actions";
import type { FlyToTarget, PickedLocation } from "@/components/map/location-picker";
import type { Event } from "@/types/database";

// Leaflet touches `window` at import time, so the picker can only load in the
// browser — same pattern as explore-map-loader.tsx.
const LocationPicker = dynamic(() => import("@/components/map/location-picker"), {
  ssr: false,
  loading: () => <div className="flex h-[280px] items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time, not
// an ISO string with a timezone offset.
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// The shared field set for creating and editing an event. The parent form
// owns the pin state (so it can reset or prefill it) while uncontrolled text
// fields take their defaults from `event` when editing.
export function EventFormFields({
  idPrefix,
  event,
  pin,
  onPinChange,
  communityLocationName = null,
}: {
  idPrefix: string;
  event?: Event;
  pin: PickedLocation | null;
  onPinChange: (pin: PickedLocation | null) => void;
  // Biases geocoding a typed location (e.g. "Kendwa" → "Kendwa, Zanzibar")
  // so the map recenters to the right place rather than a same-named one
  // elsewhere in the world.
  communityLocationName?: string | null;
}) {
  const [flyTo, setFlyTo] = useState<FlyToTarget | null>(null);
  const [locating, setLocating] = useState(false);
  const lastQuery = useRef<string>("");

  // Recenters the map toward what was typed, so dropping a precise pin
  // doesn't require hunting across the whole island first. Only kicks in
  // before a pin exists — once someone's placed one, typing in the location
  // field shouldn't yank the map out from under them.
  async function handleLocationBlur(e: React.FocusEvent<HTMLInputElement>) {
    const query = e.target.value.trim();
    if (!query || query === lastQuery.current || pin) return;
    lastQuery.current = query;

    setLocating(true);
    const result = await geocodeEventLocation(query, communityLocationName);
    setLocating(false);
    if (result) setFlyTo({ lat: result.lat, lng: result.lng, zoom: 14 });
  }

  return (
    <>
      <div>
        <Label htmlFor={`${idPrefix}_title`}>Title</Label>
        <Input id={`${idPrefix}_title`} name="title" placeholder="Community welcome call" defaultValue={event?.title} required />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_description`}>Description</Label>
        <Textarea id={`${idPrefix}_description`} name="description" rows={2} placeholder="What's this event about?" defaultValue={event?.description ?? ""} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_start_time`}>Starts</Label>
          <Input
            id={`${idPrefix}_start_time`}
            name="start_time"
            type="datetime-local"
            defaultValue={toDatetimeLocal(event?.start_time)}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_end_time`}>Ends (optional)</Label>
          <Input id={`${idPrefix}_end_time`} name="end_time" type="datetime-local" defaultValue={toDatetimeLocal(event?.end_time)} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_location`}>
            Location (optional){locating && <span className="ml-1.5 font-normal text-muted-foreground">Locating…</span>}
          </Label>
          <Input
            id={`${idPrefix}_location`}
            name="location"
            placeholder="123 Main St, or a place like Kendwa"
            defaultValue={event?.location ?? ""}
            onBlur={handleLocationBlur}
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_online_url`}>Online link (optional)</Label>
          <Input id={`${idPrefix}_online_url`} name="online_url" type="text" placeholder="example.com/meeting" defaultValue={event?.online_url ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_image_url`}>Image URL (optional)</Label>
        <Input
          id={`${idPrefix}_image_url`}
          name="image_url"
          type="text"
          placeholder="https://example.com/photo.jpg"
          defaultValue={event?.image_url ?? ""}
        />
      </div>

      <div>
        <Label>Show on the Explore Map (optional)</Label>
        <LocationPicker
          value={pin}
          onChange={onPinChange}
          emoji="📅"
          helpText="Click the map to drop a pin — this puts the event on the Explore Map."
          flyTo={flyTo}
        />
        <input type="hidden" name="lat" value={pin?.lat ?? ""} />
        <input type="hidden" name="lng" value={pin?.lng ?? ""} />
      </div>
    </>
  );
}
