"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, LinkIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_PHOTOS = 10;
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

// Multi-photo editor for an accommodation listing. The first photo is the cover
// (shown on the card, the feed and map popups); the rest fill out the card's
// carousel. Add photos by uploading (to the shared `uploads` bucket, namespaced
// per user like avatars) or by pasting an image URL, reorder them, and carry the
// whole set into the form as a hidden JSON `photo_urls` field. Simpler cousin of
// the Business Directory's BusinessImagesInput — accommodation photos have no
// per-photo crop framing, so this tracks plain URL strings.
export function AccommodationPhotosInput({
  photos,
  onChange,
  userId,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  userId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const cover = photos[0] ?? null;
  const atLimit = photos.length >= MAX_PHOTOS;

  function addPhotos(urls: string[]) {
    const existing = new Set(photos);
    const fresh = urls.filter((url) => !existing.has(url));
    if (fresh.length === 0) return;
    onChange([...photos, ...fresh].slice(0, MAX_PHOTOS));
  }

  function removeAt(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const next = index + delta;
    if (next < 0 || next >= photos.length) return;
    const reordered = [...photos];
    const [item] = reordered.splice(index, 1);
    reordered.splice(next, 0, item);
    onChange(reordered);
  }

  function addFromUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) {
      setError("Enter a photo link starting with http:// or https://");
      return;
    }
    if (atLimit) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    setError(null);
    addPhotos([url]);
    setUrlDraft("");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of files.slice(0, room)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError("Please choose PNG, JPEG, WebP, or GIF images.");
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError("Some images were too large (max 8MB each).");
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "png";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { contentType: file.type });
        if (uploadError) {
          setError(uploadError.message);
          continue;
        }
        uploaded.push(supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl);
      }
      if (uploaded.length > 0) addPhotos(uploaded);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="relative h-48 w-full overflow-hidden rounded-md border border-border bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="Cover" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">No photos yet</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
        {cover && <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white">Cover</span>}
      </div>

      {photos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {photos.map((url, index) => (
            <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" draggable={false} />
              <button
                type="button"
                title="Remove photo"
                onClick={() => removeAt(index)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/40 opacity-0 transition group-hover:opacity-100">
                <button type="button" title="Move earlier" disabled={index === 0} onClick={() => move(index, -1)} className="p-0.5 text-white disabled:opacity-30">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" title="Move later" disabled={index === photos.length - 1} onClick={() => move(index, 1)} className="p-0.5 text-white disabled:opacity-30">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || atLimit}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload photos
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <LinkIcon className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              value={urlDraft}
              disabled={atLimit}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFromUrl();
                }
              }}
              placeholder="…or paste a photo link"
              className="w-full rounded-md border border-border bg-card py-1.5 pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
          </div>
          <button
            type="button"
            disabled={atLimit || !urlDraft.trim()}
            onClick={addFromUrl}
            className="shrink-0 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
          >
            Add
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {cover ? `The first photo is the cover. ${photos.length}/${MAX_PHOTOS} photos.` : "The first photo becomes the cover."}
      </p>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} multiple className="hidden" onChange={handleFileChange} />
      <input type="hidden" name="photo_urls" value={JSON.stringify(photos)} />
    </div>
  );
}
