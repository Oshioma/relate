"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, Globe, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { detectFacePosition } from "@/lib/face-position";
import { DEFAULT_PHOTO_POSITION, photoObjectPosition } from "@/lib/photo-position";
import { fetchWebsiteImages } from "./business-directory-actions";

export type GalleryImage = { url: string; position: string | null };

const MAX_IMAGES = 12;
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function parsePosition(position: string | null): { x: number; y: number } {
  const match = (position ?? DEFAULT_PHOTO_POSITION).match(/^(\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%$/);
  return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 50, y: 50 };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

// Multi-photo editor for a listing. The first image is the cover (shown on the
// card, the feed and map popups); the rest fill out the detail-page carousel.
// Add photos by uploading (to the business-images bucket) or pulling them from
// the business's website, reorder them, drag the big preview to reframe the
// cover's crop, and carry the whole set into the form as a hidden JSON `images`
// field. Generalises the old single-image BusinessImageInput.
//
// Uploads are framed automatically: face detection (face-position.ts) picks a
// focal point so people's heads survive the feed's short strip crop. Website
// images can't be — their pixels are cross-origin — so they keep the default
// crop until dragged.
export function BusinessImagesInput({
  images,
  onChange,
  getWebsite,
  userId,
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  // Read lazily so the website button always sees what's typed in the field.
  getWebsite: () => string;
  userId: string;
}) {
  const [busy, setBusy] = useState<"fetch" | "upload" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; from: { x: number; y: number }; moved: boolean } | null>(null);

  const cover = images[0] ?? null;
  const atLimit = images.length >= MAX_IMAGES;

  function addImages(added: GalleryImage[]) {
    const existing = new Set(images.map((i) => i.url));
    const fresh = added.filter((image) => !existing.has(image.url));
    if (fresh.length === 0) return;
    onChange([...images, ...fresh].slice(0, MAX_IMAGES));
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const next = index + delta;
    if (next < 0 || next >= images.length) return;
    const reordered = [...images];
    const [item] = reordered.splice(index, 1);
    reordered.splice(next, 0, item);
    onChange(reordered);
  }

  function setCoverPosition(position: string | null) {
    if (images.length === 0) return;
    onChange(images.map((image, i) => (i === 0 ? { ...image, position } : image)));
  }

  async function handleFetchFromWebsite() {
    const website = getWebsite().trim();
    if (!website) {
      setError("Add a website link first.");
      return;
    }
    setError(null);

    // Reuse a prior fetch for the same website; otherwise scrape now.
    let found = candidates;
    if (fetchedFor !== website) {
      setBusy("fetch");
      try {
        const result = await fetchWebsiteImages(website);
        found = result.images;
        setCandidates(found);
        setFetchedFor(website);
        if (found.length === 0) {
          setError(result.error ?? "Couldn't find an image on that website.");
          return;
        }
      } finally {
        setBusy(null);
      }
    }

    const existing = new Set(images.map((i) => i.url));
    const next = found.find((url) => !existing.has(url));
    if (!next) {
      setError("No more new images found on that website.");
      return;
    }
    addImages([{ url: next, position: null }]);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    setBusy("upload");
    try {
      const supabase = createClient();
      const uploaded: GalleryImage[] = [];
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
        const [{ error: uploadError }, position] = await Promise.all([
          supabase.storage.from("business-images").upload(path, file, { contentType: file.type }),
          detectFacePosition(file),
        ]);
        if (uploadError) {
          setError(uploadError.message);
          continue;
        }
        uploaded.push({ url: supabase.storage.from("business-images").getPublicUrl(path).data.publicUrl, position });
      }
      if (uploaded.length > 0) addImages(uploaded);
    } finally {
      setBusy(null);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!cover || busy) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, from: parsePosition(cover.position), moved: false };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const box = boxRef.current;
    if (!drag || !box) return;
    const rect = box.getBoundingClientRect();
    const x = clamp(drag.from.x - ((event.clientX - drag.startX) / rect.width) * 100, 0, 100);
    const y = clamp(drag.from.y - ((event.clientY - drag.startY) / rect.height) * 100, 0, 100);
    drag.moved = true;
    setCoverPosition(`${Math.round(x)}% ${Math.round(y)}%`);
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <div>
      <div
        ref={boxRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative h-56 w-full overflow-hidden rounded-md border border-border bg-muted ${cover ? "cursor-move" : ""}`}
        style={{ touchAction: cover ? "none" : undefined }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt="Cover"
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ objectPosition: photoObjectPosition(cover.position) }}
          />
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

      {cover && (
        <div className="mt-2">
          {/* The feed shows the cover as a much shorter strip than the box
              above (feed-item-card's h-40 banner), so a crop that looks fine
              there can still behead the subject in the feed. Same height, same
              position — dragging above updates this live. */}
          <div className="h-40 w-full overflow-hidden rounded-md border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt="Cover as it crops in the feed"
              draggable={false}
              className="h-full w-full select-none object-cover"
              style={{ objectPosition: photoObjectPosition(cover.position) }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">How the cover crops in the feed</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={image.url} className="group relative h-16 w-16 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: photoObjectPosition(image.position) }} draggable={false} />
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
                <button type="button" title="Move later" disabled={index === images.length - 1} onClick={() => move(index, 1)} className="p-0.5 text-white disabled:opacity-30">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy !== null || atLimit}
          onClick={handleFetchFromWebsite}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          <Globe className="h-3.5 w-3.5" />
          Add from website
        </button>
        <button
          type="button"
          disabled={busy !== null || atLimit}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload photos
        </button>
        {cover ? (
          <span className="text-xs text-muted-foreground">Uploads frame faces automatically — drag the cover to adjust. {images.length}/{MAX_IMAGES} photos.</span>
        ) : (
          <span className="text-xs text-muted-foreground">The first photo becomes the cover.</span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} multiple className="hidden" onChange={handleFileChange} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
    </div>
  );
}
