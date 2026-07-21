"use client";

import { useRef, useState } from "react";
import { createClub } from "./clubs-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { CLUB_CATEGORY_PRESETS } from "@/lib/club-categories";

export function NewClubForm({
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
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createClub(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="club_name">Club name</Label>
        <Input id="club_name" name="name" placeholder="Sunset Runners" required />
      </div>

      <div>
        <Label htmlFor="club_category">Category (optional)</Label>
        <input
          id="club_category"
          name="category"
          ref={categoryInputRef}
          defaultValue=""
          placeholder="Running"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CLUB_CATEGORY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                if (categoryInputRef.current) categoryInputRef.current.value = preset;
              }}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="club_description">Description (optional)</Label>
        <Textarea id="club_description" name="description" rows={2} placeholder="What's this club about, and who's it for?" />
      </div>

      <div>
        <Label htmlFor="club_location_label">Usual meeting place (optional)</Label>
        <Input id="club_location_label" name="location_label" placeholder="Forodhani Gardens, Saturdays 7am" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="club_lat">Latitude (optional)</Label>
          <Input id="club_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="club_lng">Longitude (optional)</Label>
          <Input id="club_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this club&apos;s meeting place on the Explore Map.</p>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Start a club
      </SubmitButton>
    </form>
  );
}
