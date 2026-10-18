"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile } from "@/lib/upload-image";

// The space's own cover (spaces.image_url), as a banner across the top of the
// space. Only an uploaded cover is shown here: the space type's default photo
// dresses the cards that link in, but as a banner it would put the same stock
// picture on top of every new space. Admins add, change or remove it in place,
// filed at the same path as the Admin → Spaces uploader so the two agree.
export function SpaceCover({
  spaceId,
  communityId,
  imageUrl,
  canEdit,
}: {
  spaceId: string;
  communityId: string;
  imageUrl: string | null;
  // Community admins only, matching the community-assets upload policy and
  // spaces_update_admin.
  canEdit: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!imageUrl && !canEdit) return null;

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

  if (!imageUrl) {
    return (
      <div className="mb-6">
        {picker}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {busy ? "Uploading…" : "Add a cover image"}
        </button>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        {canEdit && (
          <div className="absolute right-2 top-2 flex gap-2">
            {picker}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/70 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              Change cover
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              aria-label="Remove cover"
              className="flex items-center rounded-full bg-black/55 px-2 py-1.5 text-white backdrop-blur-sm hover:bg-black/70 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
