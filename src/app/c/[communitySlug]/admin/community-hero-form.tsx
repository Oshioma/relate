"use client";

import { useActionState, useEffect } from "react";
import { updateCommunityHero, type CommunityHeroState } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraft } from "@/lib/use-form-draft";
import type { Community, Space } from "@/types/database";

// The feed's landing hero: headline, "Watch video" link and the space the
// sidebar promo card features. Drafts survive a refresh until saved.
export function CommunityHeroForm({ community, spaces }: { community: Community; spaces: Space[] }) {
  const [state, formAction] = useActionState<CommunityHeroState, FormData>(updateCommunityHero, undefined);
  const { formRef, clearDraft } = useFormDraft(`community-hero:${community.id}`);

  useEffect(() => {
    if (state && "ok" in state) clearDraft();
  }, [state, clearDraft]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <div>
        <Label htmlFor="community_tagline">Headline</Label>
        <Input
          id="community_tagline"
          name="tagline"
          maxLength={140}
          defaultValue={community.tagline ?? ""}
          placeholder="Grow food. Share knowledge. Rebuild communities."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          The big line over your cover photo. Leave blank to show the community name.
        </p>
      </div>

      <div>
        <Label htmlFor="community_hero_video">Video link</Label>
        <Input
          id="community_hero_video"
          name="hero_video_url"
          type="url"
          defaultValue={community.hero_video_url ?? ""}
          placeholder="https://www.youtube.com/watch?v=…"
        />
        <p className="mt-1 text-xs text-muted-foreground">Adds a “Watch video” button to the header.</p>
      </div>

      <div>
        <Label htmlFor="community_featured_space">Featured space</Label>
        <select
          id="community_featured_space"
          name="featured_space_id"
          defaultValue={community.featured_space_id ?? ""}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">None</option>
          {spaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Promoted in a photo card beside the feed, using the space’s image and description.
        </p>
      </div>

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save
      </SubmitButton>
    </form>
  );
}
