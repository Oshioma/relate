"use client";

import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createSpace } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { useFormDraftRef } from "@/lib/use-form-draft";
import { SubmitButton } from "@/components/ui/submit-button";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import { GUIDED_JOURNEY_PRESETS } from "@/lib/guided-journey/presets";
import type { SpaceType } from "@/types/database";

export function NewSpaceForm({
  communityId,
  communitySlug,
  allowedTypes,
}: {
  communityId: string;
  communitySlug: string;
  // The space types this community may add, as regulated by the super admin.
  allowedTypes: SpaceType[];
}) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Group the allowed types under their categories for the picker.
  const groups = groupSpaceTypesByCategory(allowedTypes.map((t) => SPACE_TYPES[t]));
  const defaultType = allowedTypes.includes("discussion") ? "discussion" : allowedTypes[0];
  const [type, setType] = useState<SpaceType>(defaultType);
  // The cover is uploaded before the space exists, so it can't be filed under
  // the space's id the way the edit form files it. A random id per form keeps
  // two half-made spaces from overwriting each other's photo. It never reaches
  // the page's HTML (only the upload path), so the server and browser picking
  // different ids can't trip hydration.
  const [coverKey, setCoverKey] = useState(() => crypto.randomUUID());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // The description editor keeps its text in React, so a restored draft is
  // handed back as its starting value and the editor remounted to take it.
  const [descriptionSeed, setDescriptionSeed] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const descriptionMirrorRef = useRef<HTMLInputElement>(null);
  const lastDescriptionRef = useRef("");

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.space_type === "string" && allowedTypes.includes(values.space_type as SpaceType)) {
      setType(values.space_type as SpaceType);
    }
    if (typeof values.image_url === "string") setImageUrl(values.image_url || null);
    if (typeof values.description_draft === "string" && values.description_draft) {
      lastDescriptionRef.current = values.description_draft;
      if (descriptionMirrorRef.current) descriptionMirrorRef.current.value = values.description_draft;
      setDescriptionSeed(values.description_draft);
      setEditorKey((k) => k + 1);
    }
  }, [allowedTypes]);
  const { clear: clearDraft, saveNow } = useFormDraftRef(formRef, `new-space:${communityId}`, { onRestore });

  // The cover is a controlled hidden field: write it to the DOM now so the
  // draft saved straight after carries it.
  function setCover(url: string | null) {
    flushSync(() => setImageUrl(url));
    saveNow();
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createSpace(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      clearDraft();
      formRef.current?.reset();
      setType(defaultType);
      setImageUrl(null);
      setCoverKey(crypto.randomUUID());
      lastDescriptionRef.current = "";
      setDescriptionSeed("");
      setEditorKey((k) => k + 1);
    }
  }

  if (allowedTypes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        No space types are available to this community yet. Ask the platform admin to enable some.
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      {/* Draft-only mirror of the description, so a refresh restores it; the action ignores it. */}
      <input ref={descriptionMirrorRef} type="hidden" name="description_draft" data-draft />

      <div>
        <Label htmlFor="space_name">Name</Label>
        <Input id="space_name" name="name" placeholder="e.g. Announcements" required />
      </div>

      {/* Type comes before description now: a directory shows no description
          anywhere, so the field is hidden for it — and a field that vanishes
          after you have typed into it would be worse than one that was never
          offered. */}
      <div>
        <Label htmlFor="space_type">Type</Label>
        <select
          id="space_type"
          name="space_type"
          value={type}
          onChange={(e) => setType(e.target.value as SpaceType)}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {groups.map((group) => (
            <optgroup key={group.category.key} label={group.category.label}>
              {group.types.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {type === "guided_journey" && (
        <div>
          <Label htmlFor="journey_preset">Start from</Label>
          <select
            id="journey_preset"
            name="journey_preset"
            defaultValue="gardening"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {GUIDED_JOURNEY_PRESETS.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {preset.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Sets the starting wording, stages and milestones. Change any of it later from the space&apos;s Manage page.
          </p>
        </div>
      )}

      {type !== "business_directory" && (
        <div>
          <Label htmlFor="space_description">Description (optional)</Label>
          <RichEditor
            key={editorKey}
            id="space_description"
            name="description"
            rows={4}
            defaultValue={descriptionSeed}
            placeholder="Add an intro or an About section for this space…"
            onChange={(value) => {
              // Fires on mount too; only a real change is worth a save, or the
              // empty mount would overwrite the draft before it's restored.
              if (value === lastDescriptionRef.current) return;
              lastDescriptionRef.current = value;
              if (descriptionMirrorRef.current) descriptionMirrorRef.current.value = value;
              saveNow();
            }}
          />
        </div>
      )}

      <div>
        <Label>Cover image (optional)</Label>
        <input type="hidden" name="image_url" value={imageUrl ?? ""} data-draft />
        <div className="flex items-center gap-4">
          <ImageUpload
            // Remounted when the cover changes from outside (Remove, a restored
            // draft, a reset after Create) so its preview follows.
            key={imageUrl ?? "none"}
            bucket="community-assets"
            basePath={`${communityId}/space-new-${coverKey}-cover`}
            currentUrl={imageUrl}
            onUploaded={(url) => setCover(url)}
            shape="square"
            size={64}
            label="cover"
          />
          {imageUrl && (
            <button
              type="button"
              onClick={() => setCover(null)}
              className="text-sm font-medium text-muted-foreground hover:text-danger"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Shown at the top of the space and on its cards. Leave it empty to use the space type&apos;s default photo.
        </p>
      </div>

      <div>
        <Label htmlFor="visibility">Who can see it</Label>
        <select
          id="visibility"
          name="visibility"
          defaultValue="members"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="public">Public — anyone, even non-members</option>
          <option value="members">Members — active members only</option>
          <option value="private">Private — owners, admins &amp; moderators only</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="show_in_nav" defaultChecked className="h-4 w-4 rounded border-border" />
        Show in left navigation
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create space
      </SubmitButton>
    </form>
  );
}
