"use client";

import { useActionState } from "react";
import { updateLocation, type LocationFormState } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { MemberLocation } from "@/types/database";

export function LocationForm({ location }: { location: MemberLocation | null }) {
  const [state, formAction] = useActionState<LocationFormState, FormData>(updateLocation, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Location</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Approximate only — city/region/country. We never show your exact address.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={location?.city ?? ""} placeholder="Zanzibar City" />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Input id="region" name="region" defaultValue={location?.region ?? ""} placeholder="Zanzibar" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue={location?.country ?? ""} placeholder="Tanzania" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="is_visible"
          defaultChecked={location?.is_visible ?? false}
          className="h-4 w-4 rounded border-border accent-[var(--accent)]"
        />
        Show my approximate location to other members
      </label>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save location
      </SubmitButton>
    </form>
  );
}
