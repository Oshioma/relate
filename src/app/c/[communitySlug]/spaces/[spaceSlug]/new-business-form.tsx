"use client";

import { useActionState, useRef, useEffect } from "react";
import { createBusiness, type BusinessFormState } from "./business-directory-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";

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
  const [state, formAction] = useActionState<BusinessFormState, FormData>(createBusiness, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="business_lat">Latitude (optional)</Label>
          <Input id="business_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="business_lng">Longitude (optional)</Label>
          <Input id="business_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this business on the Explore Map.</p>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add business
      </SubmitButton>
    </form>
  );
}
