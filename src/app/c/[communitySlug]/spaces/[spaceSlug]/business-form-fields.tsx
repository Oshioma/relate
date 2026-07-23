"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Input, Textarea, Label } from "@/components/ui/input";
import { businessCategoryOptions } from "@/lib/business-categories";
import { BusinessImageInput } from "./business-image-input";
import type { PickedLocation } from "@/components/map/location-picker";
import type { Business, BusinessCustomCategory } from "@/types/database";

// Leaflet touches `window` at import time, so the picker can only load in the
// browser — same pattern as explore-map-loader.tsx.
const LocationPicker = dynamic(() => import("@/components/map/location-picker"), {
  ssr: false,
  loading: () => <div className="flex h-[360px] items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

// The shared field set for adding and editing a directory listing. The parent
// form owns the pin and image state (so it can reset or prefill them) while
// uncontrolled text fields take their defaults from `business` when editing.
export function BusinessFormFields({
  idPrefix,
  business,
  pin,
  onPinChange,
  imageUrl,
  onImageChange,
  imagePosition,
  onImagePositionChange,
  userId,
  customCategories,
}: {
  idPrefix: string;
  business?: Business;
  // Staff-added categories for this space, merged into the category select.
  customCategories: BusinessCustomCategory[];
  pin: PickedLocation | null;
  onPinChange: (pin: PickedLocation | null) => void;
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  imagePosition: string | null;
  onImagePositionChange: (position: string | null) => void;
  userId: string;
}) {
  const websiteRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_name`}>Name</Label>
          <Input id={`${idPrefix}_name`} name="name" placeholder="The Rock Restaurant" defaultValue={business?.name} required />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_category`}>Category</Label>
          <select
            id={`${idPrefix}_category`}
            name="category"
            defaultValue={business?.category ?? "restaurant"}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {businessCategoryOptions(customCategories).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_description`}>Description (optional)</Label>
        <Textarea
          id={`${idPrefix}_description`}
          name="description"
          rows={2}
          placeholder="What makes this place worth a visit?"
          defaultValue={business?.description ?? ""}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_location_label`}>Area (optional)</Label>
          <Input
            id={`${idPrefix}_location_label`}
            name="location_label"
            placeholder="Kendwa"
            defaultValue={business?.location_label ?? ""}
          />
          <p className="mt-1 text-xs text-muted-foreground">The village or neighbourhood — used to filter the directory.</p>
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_address`}>Address (optional)</Label>
          <Input id={`${idPrefix}_address`} name="address" placeholder="Beach Road, Jambiani" defaultValue={business?.address ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_opening_hours`}>Opening hours (optional)</Label>
        <Input id={`${idPrefix}_opening_hours`} name="opening_hours" placeholder="Daily, 8am – 10pm" defaultValue={business?.opening_hours ?? ""} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_website`}>Website (optional)</Label>
          <Input ref={websiteRef} id={`${idPrefix}_website`} name="website" type="url" placeholder="https://…" defaultValue={business?.website ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_phone`}>Phone (optional)</Label>
          <Input id={`${idPrefix}_phone`} name="phone" type="tel" placeholder="+255 …" defaultValue={business?.phone ?? ""} />
        </div>
      </div>

      <div>
        <Label>Image (optional)</Label>
        <BusinessImageInput
          value={imageUrl}
          onChange={onImageChange}
          position={imagePosition}
          onPositionChange={onImagePositionChange}
          getWebsite={() => websiteRef.current?.value ?? ""}
          userId={userId}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">Leave empty and we&apos;ll try to pull one from the website automatically.</p>
      </div>

      <div>
        <Label>Location (optional)</Label>
        <LocationPicker value={pin} onChange={onPinChange} />
        <input type="hidden" name="lat" value={pin?.lat ?? ""} />
        <input type="hidden" name="lng" value={pin?.lng ?? ""} />
        <p className="mt-1.5 text-xs text-muted-foreground">Drop a pin to show this business on the Explore Map.</p>
      </div>
    </>
  );
}
