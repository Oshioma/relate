"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { Check, Loader2, Upload } from "lucide-react";
import { saveHomepagePhotos, type HomepagePhotosFormState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraftRef } from "@/lib/use-form-draft";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

// A public community that can lend the homepage its cover (and, for the hero,
// its logo, name and tagline).
export type CoverChoice = { id: string; name: string; cover_image_url: string };

const DRAFT_KEY = "platform-homepage-photos";

export function HomepagePhotosForm({
  userId,
  communities,
  heroCommunityId,
  whyPhotoUrl,
  closingPhotoUrl,
}: {
  userId: string;
  communities: CoverChoice[];
  heroCommunityId: string | null;
  whyPhotoUrl: string | null;
  closingPhotoUrl: string | null;
}) {
  const [state, formAction] = useActionState<HomepagePhotosFormState, FormData>(saveHomepagePhotos, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [hero, setHero] = useState(heroCommunityId ?? "");
  const [why, setWhy] = useState(whyPhotoUrl ?? "");
  const [closing, setClosing] = useState(closingPhotoUrl ?? "");

  // The picks live in React state, mirrored into hidden inputs marked
  // data-draft, so a refresh puts back whatever was chosen but not yet saved.
  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.hero_community_id === "string") setHero(values.hero_community_id);
    if (typeof values.why_photo_url === "string") setWhy(values.why_photo_url);
    if (typeof values.closing_photo_url === "string") setClosing(values.closing_photo_url);
  }, []);
  const { clear, saveNow } = useFormDraftRef(formRef, DRAFT_KEY, { onRestore });

  // Save the draft after each pick has reached its hidden input.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    saveNow();
  }, [hero, why, closing, saveNow]);

  useEffect(() => {
    if (state && "ok" in state) clear();
  }, [state, clear]);

  return (
    <form ref={formRef} action={formAction} className="space-y-8 rounded-lg border border-border p-4">
      <input type="hidden" name="hero_community_id" value={hero} data-draft />
      <input type="hidden" name="why_photo_url" value={why} data-draft />
      <input type="hidden" name="closing_photo_url" value={closing} data-draft />

      <fieldset>
        <legend className="text-sm font-medium text-foreground">Hero community</legend>
        <p className="mb-3 mt-1 text-xs text-muted-foreground">
          The community shown in the browser-and-phone preview at the top: its cover, logo, name and tagline.
        </p>
        <CoverGrid
          communities={communities}
          selected={communities.find((c) => c.id === hero)?.cover_image_url ?? ""}
          automaticLabel="Automatic: the first featured community with a cover"
          onAutomatic={() => setHero("")}
          onPick={(c) => setHero(c.id)}
        />
      </fieldset>

      <PhotoSlot
        title="“Powerful community tools” photo"
        hint="Beside the “Why relate.click” checklist. Shown at about 4:3."
        userId={userId}
        slot="why"
        value={why}
        onChange={setWhy}
        communities={communities}
      />

      <PhotoSlot
        title="“Start your community today” photo"
        hint="Behind the closing banner, faded on the left under the words. A wide photo with its subject on the right works best."
        userId={userId}
        slot="closing"
        value={closing}
        onChange={setClosing}
        communities={communities}
      />

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save photos
      </SubmitButton>
    </form>
  );
}

// One section photo: automatic, a community's cover, or an uploaded photo.
function PhotoSlot({
  title,
  hint,
  userId,
  slot,
  value,
  onChange,
  communities,
}: {
  title: string;
  hint: string;
  userId: string;
  slot: string;
  value: string;
  onChange: (url: string) => void;
  communities: CoverChoice[];
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCover = communities.some((c) => c.cover_image_url === value);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      // The uploads bucket wants the uploader's id first in the path.
      onChange(await uploadImage(file, "uploads", `${userId}/homepage/${slot}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">{title}</legend>
      <p className="mb-3 mt-1 text-xs text-muted-foreground">{hint}</p>
      <CoverGrid
        communities={communities}
        selected={value}
        automaticLabel="Automatic: a featured community's cover"
        onAutomatic={() => onChange("")}
        onPick={(c) => onChange(c.cover_image_url)}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "relative flex aspect-[4/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-dashed border-border bg-muted text-xs text-muted-foreground hover:border-accent hover:text-accent",
            value && !isCover && "border-solid ring-2 ring-accent ring-offset-2"
          )}
        >
          {value && !isCover ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Your uploaded photo" className="absolute inset-0 h-full w-full object-cover" />
              <SelectedMark />
              <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-white">Change upload</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload a photo
            </>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </span>
          )}
        </button>
      </CoverGrid>
      <p className="mt-2 text-xs text-muted-foreground">PNG, JPEG, WebP, or GIF. Up to 8MB.</p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFile} />
    </fieldset>
  );
}

// "Automatic", then every public community's cover as a clickable tile, then
// anything extra (the upload tile).
function CoverGrid({
  communities,
  selected,
  automaticLabel,
  onAutomatic,
  onPick,
  children,
}: {
  communities: CoverChoice[];
  selected: string;
  automaticLabel: string;
  onAutomatic: () => void;
  onPick: (community: CoverChoice) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      <button
        type="button"
        onClick={onAutomatic}
        aria-pressed={!selected}
        className={cn(
          "relative flex aspect-[4/3] items-center justify-center rounded-lg border border-border bg-card p-2 text-center text-xs text-muted-foreground hover:border-accent",
          !selected && "text-foreground ring-2 ring-accent ring-offset-2"
        )}
      >
        {automaticLabel}
        {!selected && <SelectedMark />}
      </button>
      {communities.map((community) => {
        const isSelected = selected === community.cover_image_url;
        return (
          <button
            key={community.id}
            type="button"
            onClick={() => onPick(community)}
            aria-pressed={isSelected}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-lg border border-border hover:border-accent",
              isSelected && "ring-2 ring-accent ring-offset-2"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={community.cover_image_url} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-left text-xs text-white">
              {community.name}
            </span>
            {isSelected && <SelectedMark />}
          </button>
        );
      })}
      {children}
    </div>
  );
}

function SelectedMark() {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
      <Check className="h-3 w-3" />
    </span>
  );
}
