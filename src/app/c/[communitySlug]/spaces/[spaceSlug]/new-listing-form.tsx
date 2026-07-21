"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createListing, type ListingFormState } from "./marketplace-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { MARKETPLACE_CATEGORIES } from "@/lib/marketplace-categories";
import type { MarketplaceListingType } from "@/types/database";

export function NewListingForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState<ListingFormState, FormData>(createListing, undefined);
  const [listingType, setListingType] = useState<MarketplaceListingType>("goods");
  const formRef = useRef<HTMLFormElement>(null);
  const isFree = listingType === "free" || listingType === "wanted";

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="listing_title">Title</Label>
          <Input id="listing_title" name="title" placeholder="Beach cruiser bike, barely used" required />
        </div>
        <div>
          <Label htmlFor="listing_type">Category</Label>
          <select
            id="listing_type"
            name="listing_type"
            value={listingType}
            onChange={(e) => setListingType(e.target.value as MarketplaceListingType)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {MARKETPLACE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="listing_description">Description (optional)</Label>
        <Textarea id="listing_description" name="description" rows={2} />
      </div>

      {!isFree && (
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <div>
            <Label htmlFor="listing_price">Price (optional)</Label>
            <Input id="listing_price" name="price" type="number" step="0.01" min="0" placeholder="45.00" />
          </div>
          <div>
            <Label htmlFor="listing_currency">Currency</Label>
            <Input id="listing_currency" name="currency" placeholder="USD" defaultValue="USD" />
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="listing_photo_url">Photo URL (optional)</Label>
          <Input id="listing_photo_url" name="photo_url" type="url" placeholder="https://…" />
        </div>
        <div>
          <Label htmlFor="listing_location_label">Location (optional)</Label>
          <Input id="listing_location_label" name="location_label" placeholder="Stone Town pickup" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="listing_lat">Latitude (optional)</Label>
          <Input id="listing_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="listing_lng">Longitude (optional)</Label>
          <Input id="listing_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this listing on the Explore Map.</p>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post listing
      </SubmitButton>
    </form>
  );
}
