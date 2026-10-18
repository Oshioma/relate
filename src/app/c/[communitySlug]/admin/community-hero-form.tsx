"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateCommunityHero, type CommunityHeroState } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraft } from "@/lib/use-form-draft";
import { createClient } from "@/lib/supabase/client";
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

      <BackgroundVideoField
        communityId={community.id}
        name="hero_background_video_url"
        label="Feed background video"
        fileStem="hero-video"
        defaultValue={community.hero_background_video_url}
        hint="Loops behind the headline on your community's home feed."
      />
      <BackgroundVideoField
        communityId={community.id}
        name="landing_background_video_url"
        label="Landing page background video"
        fileStem="landing-video"
        defaultValue={community.landing_background_video_url}
        hint="Loops behind the headline on the page visitors see before they sign in."
      />

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

const VIDEO_TYPES = ["video/mp4", "video/webm"];
const VIDEO_MAX_BYTES = 30 * 1024 * 1024;

// A clip that loops behind a hero headline (the feed's or the landing page's). Upload one (stored with the logo
// and cover) or paste a direct link to an .mp4/.webm file — not a YouTube page,
// which a <video> can't play. Uploading fills the field; Save stores it. The
// field stays uncontrolled so the form's draft restore can fill it like any
// other input, and an upload fires an input event so the draft picks it up.
function BackgroundVideoField({
  communityId,
  name,
  label,
  fileStem,
  defaultValue,
  hint,
}: {
  communityId: string;
  // The form field (and communities column) this sets.
  name: string;
  label: string;
  // Storage file name, so the feed and landing clips don't overwrite each other.
  fileStem: string;
  defaultValue: string | null;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "uploading" | "done" | "error"; message?: string }>({
    kind: "idle",
  });

  function setValue(value: string) {
    const input = inputRef.current;
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  async function upload(file: File) {
    if (!VIDEO_TYPES.includes(file.type)) {
      setStatus({ kind: "error", message: "Please choose an MP4 or WebM video." });
      return;
    }
    if (file.size > VIDEO_MAX_BYTES) {
      setStatus({ kind: "error", message: "That video is too large (max 30MB). Trim it to 10–15 seconds." });
      return;
    }
    setStatus({ kind: "uploading" });
    const supabase = createClient();
    const ext = file.type === "video/webm" ? "webm" : "mp4";
    const path = `${communityId}/${fileStem}.${ext}`;
    const { error } = await supabase.storage
      .from("community-assets")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setStatus({ kind: "error", message: error.message });
      return;
    }
    const { data } = supabase.storage.from("community-assets").getPublicUrl(path);
    setValue(`${data.publicUrl}?v=${Date.now()}`);
    setStatus({ kind: "done" });
  }

  return (
    <div>
      <Label htmlFor={`community_${name}`}>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          ref={inputRef}
          id={`community_${name}`}
          name={name}
          type="url"
          defaultValue={defaultValue ?? ""}
          placeholder="Upload a clip, or paste a link to an .mp4"
          className="min-w-0 flex-1"
        />
        <label className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
          {status.kind === "uploading" ? "Uploading…" : "Upload video"}
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="sr-only"
            disabled={status.kind === "uploading"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void upload(file);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setValue("");
            setStatus({ kind: "idle" });
          }}
          className="px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Remove
        </button>
      </div>
      {status.kind === "done" && <p className="mt-1 text-xs text-accent">Uploaded — press Save to use it.</p>}
      {status.kind === "error" && <p className="mt-1 text-xs text-danger">{status.message}</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        {hint} A short, muted clip (10–15 seconds, MP4, up to 30MB), shown on laptops and desktops; phones, and
        anyone who has turned off motion, still see the cover photo.
      </p>
    </div>
  );
}
