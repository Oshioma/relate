"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile } from "@/lib/upload-image";
import { defaultSpaceImage } from "@/lib/space-images";
import type { SpaceType } from "@/types/database";

// The space's cover as a full-width banner across the top of the space, the
// same height as the feed page's hero: its own upload
// (spaces.image_url) when it has one, otherwise the space type's default photo,
// the same one its cards show, so every space opens with a picture the way
// every event card does. Admins add, change or remove the upload in place,
// filed at the same path as the Admin → Spaces uploader so the two agree.
export function SpaceCover({
  spaceId,
  communityId,
  spaceType,
  imageUrl,
  canEdit,
  categoryImageUrl = null,
}: {
  spaceId: string;
  communityId: string;
  spaceType: SpaceType;
  imageUrl: string | null;
  // A directory category page (?category=activity) shows one of that
  // category's own photos instead of the space cover; the cover controls are
  // hidden there, since they'd change the whole directory's cover.
  categoryImageUrl?: string | null;
  // Community admins only, matching the community-assets upload policy and
  // spaces_update_admin.
  canEdit: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A default photo that fails to load hides the banner rather than showing a
  // broken-image icon; an upload that fails still shows, so it can be changed.
  const [defaultBroken, setDefaultBroken] = useState(false);

  async function save(url: string | null) {
    const supabase = createClient();
    const { error: updateError } = await supabase.from("spaces").update({ image_url: url }).eq("id", spaceId);
    if (updateError) throw updateError;
    router.refresh();
  }

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
    setBusy(true);
    try {
      await save(await uploadImage(file, "community-assets", `${communityId}/space-${spaceId}-cover`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setBusy(true);
    try {
      await save(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't remove the cover. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const picker = canEdit && (
    <input ref={inputRef} type="file" accept={IMAGE_ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFile} />
  );

  const isDefault = !imageUrl;
  if (isDefault && defaultBroken && !categoryImageUrl) return null;
  const showControls = canEdit && !categoryImageUrl;

  return (
    <div>
      <div className="relative h-[340px] w-full overflow-hidden border-b border-border bg-muted sm:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={categoryImageUrl ?? imageUrl ?? defaultSpaceImage(spaceType)}
          alt=""
          className="h-full w-full object-cover"
          onError={isDefault && !categoryImageUrl ? () => setDefaultBroken(true) : undefined}
        />
        {showControls && (
          <div className="absolute right-3 top-3 flex gap-2 sm:right-4 sm:top-4">
            {picker}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/70 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {busy ? "Uploading…" : isDefault ? "Add your own cover" : "Change cover"}
            </button>
            {!isDefault && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              aria-label="Remove cover"
              className="flex items-center rounded-full bg-black/55 px-2 py-1.5 text-white backdrop-blur-sm hover:bg-black/70 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            )}
          </div>
        )}
      </div>
      {error && <p className="mx-auto mt-2 max-w-3xl px-4 text-xs text-danger sm:px-6">{error}</p>}
    </div>
  );
}
