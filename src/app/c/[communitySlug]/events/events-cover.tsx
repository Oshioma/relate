"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile } from "@/lib/upload-image";
import { DEFAULT_EVENT_IMAGE_URL } from "@/lib/events/default-image";

// A full-width cover across the top of the Events page, the same height as the
// feed page's hero and the space covers, so Events opens with a picture like
// every space does: the community's own upload (communities.events_cover_url)
// when it has one, otherwise the default event photo the event cards fall back
// to. Admins add, change or remove the upload in place, as on a space cover.
export function EventsCover({
  communityId,
  imageUrl,
  canEdit,
}: {
  communityId: string;
  imageUrl: string | null;
  // Community admins only, matching the community-assets upload policy and
  // communities_update_admin.
  canEdit: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(url: string | null) {
    const supabase = createClient();
    const { error: updateError } = await supabase.from("communities").update({ events_cover_url: url }).eq("id", communityId);
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
      await save(await uploadImage(file, "community-assets", `${communityId}/events-cover`));
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

  const isDefault = !imageUrl;

  return (
    <div>
      <div className="relative h-[340px] w-full overflow-hidden border-b border-border bg-muted sm:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl ?? DEFAULT_EVENT_IMAGE_URL} alt="" className="h-full w-full object-cover" />
        {canEdit && (
          <div className="absolute right-3 top-3 flex gap-2 sm:right-4 sm:top-4">
            <input ref={inputRef} type="file" accept={IMAGE_ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFile} />
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
