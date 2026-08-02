"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Input, Textarea, Label } from "@/components/ui/input";
import { businessCategoryOptions } from "@/lib/business-categories";
import { BusinessImagesInput, type GalleryImage } from "./business-images-input";
import { OpeningHoursInput } from "./opening-hours-input";
import type { PickedLocation } from "@/components/map/location-picker";
import type { ListingDraft } from "@/lib/listing-draft";
import type { Business, BusinessCustomCategory, BusinessCategoryLabelOverride, BusinessHoursSchedule } from "@/types/database";

// Leaflet touches `window` at import time, so the picker can only load in the
// browser — same pattern as explore-map-loader.tsx.
const LocationPicker = dynamic(() => import("@/components/map/location-picker"), {
  ssr: false,
  loading: () => <div className="flex h-[360px] items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

// The shared field set for adding and editing a directory listing. The parent
// form owns the pin and image state (so it can reset or prefill them) while
// uncontrolled text fields take their defaults from `business` when editing.
//
// `draft` is a link-import result the member hasn't saved yet: it outranks
// `business` as the default for any field it filled. Because these are
// uncontrolled inputs, defaults only apply on mount — the parent remounts this
// subtree (via `key`) each time a new draft arrives.
export function BusinessFormFields({
  idPrefix,
  business,
  draft,
  pin,
  onPinChange,
  images,
  onImagesChange,
  schedule,
  onScheduleChange,
  userId,
  customCategories,
  labelOverrides,
  onNameChange,
}: {
  idPrefix: string;
  business?: Business;
  draft?: ListingDraft | null;
  // Staff-added categories for this space, merged into the category select.
  customCategories: BusinessCustomCategory[];
  // Staff relabellings of built-in categories, applied to the select options.
  labelOverrides?: BusinessCategoryLabelOverride[];
  pin: PickedLocation | null;
  onPinChange: (pin: PickedLocation | null) => void;
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  schedule: BusinessHoursSchedule | null;
  onScheduleChange: (schedule: BusinessHoursSchedule | null) => void;
  userId: string;
  // Reports what's typed in the name field so the parent can check it against
  // places the community already has. Optional — editing an existing listing
  // has no use for it.
  onNameChange?: (name: string) => void;
}) {
  const websiteRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_name`}>Name</Label>
          <Input
            id={`${idPrefix}_name`}
            name="name"
            placeholder="The Rock Restaurant"
            defaultValue={draft?.name ?? business?.name}
            onChange={(event) => onNameChange?.(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_category`}>Category</Label>
          <select
            id={`${idPrefix}_category`}
            name="category"
            defaultValue={draft?.category ?? business?.category ?? "restaurant"}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {businessCategoryOptions(customCategories, labelOverrides).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label
        htmlFor={`${idPrefix}_is_local`}
        className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-card px-3 py-2.5"
      >
        <input
          id={`${idPrefix}_is_local`}
          name="is_local"
          type="checkbox"
          defaultChecked={draft?.is_local ?? business?.is_local ?? false}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-sm">
          <span className="font-medium text-foreground">Local business</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Owned and run locally. It still lists under its category and also shows in the &ldquo;Local&rdquo; filter.
          </span>
        </span>
      </label>

      <div>
        <Label htmlFor={`${idPrefix}_description`}>Description (optional)</Label>
        <Textarea
          id={`${idPrefix}_description`}
          name="description"
          rows={2}
          placeholder="What makes this place worth a visit?"
          defaultValue={draft?.description ?? business?.description ?? ""}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_location_label`}>Area (optional)</Label>
          <Input
            id={`${idPrefix}_location_label`}
            name="location_label"
            placeholder="Kendwa"
            defaultValue={draft?.location_label ?? business?.location_label ?? ""}
          />
          <p className="mt-1 text-xs text-muted-foreground">The village or neighbourhood — used to filter the directory.</p>
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_address`}>Address (optional)</Label>
          <Input id={`${idPrefix}_address`} name="address" placeholder="Beach Road, Jambiani" defaultValue={draft?.address ?? business?.address ?? ""} />
        </div>
      </div>

      <div>
        <Label>Opening hours (optional)</Label>
        <OpeningHoursInput value={schedule} onChange={onScheduleChange} />
        <p className="mt-1.5 text-xs text-muted-foreground">Set weekly hours to show an accurate &ldquo;Open now&rdquo; badge on the listing.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_website`}>Website (optional)</Label>
          <Input ref={websiteRef} id={`${idPrefix}_website`} name="website" type="url" placeholder="https://…" defaultValue={draft?.website ?? business?.website ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_phone`}>Phone (optional)</Label>
          <Input id={`${idPrefix}_phone`} name="phone" type="tel" placeholder="+255 …" defaultValue={draft?.phone ?? business?.phone ?? ""} />
        </div>
      </div>

      <div>
        <Label>Photos (optional)</Label>
        <BusinessImagesInput
          images={images}
          onChange={onImagesChange}
          getWebsite={() => websiteRef.current?.value ?? ""}
          userId={userId}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">Add several — the first is the cover. Leave empty and we&apos;ll try to pull one from the website automatically.</p>
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
