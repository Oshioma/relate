"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createBusiness } from "./business-directory-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import type { PickedLocation } from "./location-picker";

// Leaflet touches `window` at import time, so the picker can only load in the
// browser — same pattern as explore-map-loader.tsx.
const LocationPicker = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => <div className="flex h-[360px] items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

export function NewBusinessForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
}) {
  const [pin, setPin] = useState<PickedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createBusiness(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPin(null);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="business_name">Name</Label>
          <Input id="business_name" name="name" placeholder="The Rock Restaurant" required />
        </div>
        <div>
          <Label htmlFor="business_category">Category</Label>
          <select
            id="business_category"
            name="category"
            defaultValue="restaurant"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {BUSINESS_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="business_description">Description (optional)</Label>
        <Textarea id="business_description" name="description" rows={2} placeholder="What makes this place worth a visit?" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="business_address">Address (optional)</Label>
          <Input id="business_address" name="address" placeholder="Beach Road, Jambiani" />
        </div>
        <div>
          <Label htmlFor="business_opening_hours">Opening hours (optional)</Label>
          <Input id="business_opening_hours" name="opening_hours" placeholder="Daily, 8am – 10pm" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="business_website">Website (optional)</Label>
          <Input id="business_website" name="website" type="url" placeholder="https://…" />
        </div>
        <div>
          <Label htmlFor="business_phone">Phone (optional)</Label>
          <Input id="business_phone" name="phone" type="tel" placeholder="+255 …" />
        </div>
      </div>

      <div>
        <Label>Location (optional)</Label>
        <LocationPicker value={pin} onChange={setPin} />
        <input type="hidden" name="lat" value={pin?.lat ?? ""} />
        <input type="hidden" name="lng" value={pin?.lng ?? ""} />
        <p className="mt-1.5 text-xs text-muted-foreground">Drop a pin to show this business on the Explore Map.</p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add business
      </SubmitButton>
    </form>
  );
}
