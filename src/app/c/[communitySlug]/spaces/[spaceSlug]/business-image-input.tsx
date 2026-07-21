"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, Globe, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchWebsiteImages } from "./business-directory-actions";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function parsePosition(position: string | null): { x: number; y: number } {
  const match = position?.match(/^(\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%$/);
  return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 50, y: 50 };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

// Image field for business listings: preview, pull images from the business's
// website (cycling through candidates on repeat clicks), or upload to the
// business-images bucket. Dragging the preview pans the image within the crop;
// the chosen object-position is saved so the card shows the same framing.
// Carries its values into the surrounding form via hidden inputs.
export function BusinessImageInput({
  value,
  onChange,
  position,
  onPositionChange,
  getWebsite,
  userId,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  position: string | null;
  onPositionChange: (position: string | null) => void;
  // Read lazily so the button always sees what's typed in the website field.
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

  const isCycling = value !== null && fetchedFor !== null && candidates.includes(value);

  function setImage(url: string | null) {
    onChange(url);
    onPositionChange(null);
  }

  async function handleFetchFromWebsite() {
    const website = getWebsite().trim();
    if (!website) {
      setError("Add a website link first.");
      return;
    }
    setError(null);

    // Second click for the same website: step through the found images.
    if (isCycling && fetchedFor === website) {
      if (candidates.length < 2) {
        setError("No other images found on that website.");
        return;
      }
      setImage(candidates[(candidates.indexOf(value) + 1) % candidates.length]);
      return;
    }

    setBusy("fetch");
    try {
      const result = await fetchWebsiteImages(website);
      if (result.images.length > 0) {
        setCandidates(result.images);
        setFetchedFor(website);
        setImage(result.images[0]);
      } else {
        setError(result.error ?? "Couldn't find an image on that website.");
      }
    } finally {
      setBusy(null);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a PNG, JPEG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is too large (max 8MB).");
      return;
    }

    setBusy("upload");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(path, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("business-images").getPublicUrl(path);
      setImage(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setBusy(null);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!value || busy) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, from: parsePosition(position), moved: false };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const box = boxRef.current;
    if (!drag || !box) return;
    const rect = box.getBoundingClientRect();
    // Dragging right reveals more of the image's left side: object-position
    // percentages move opposite to the pointer.
    const x = clamp(drag.from.x - ((event.clientX - drag.startX) / rect.width) * 100, 0, 100);
    const y = clamp(drag.from.y - ((event.clientY - drag.startY) / rect.height) * 100, 0, 100);
    drag.moved = true;
    onPositionChange(`${Math.round(x)}% ${Math.round(y)}%`);
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
        className={`relative h-56 w-full overflow-hidden rounded-md border border-border bg-muted ${value ? "cursor-move" : ""}`}
        style={{ touchAction: value ? "none" : undefined }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Business"
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ objectPosition: position ?? "50% 50%" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
        {value && !busy && (
          <button
            type="button"
            title="Remove image"
            onClick={() => setImage(null)}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={handleFetchFromWebsite}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          <Globe className="h-3.5 w-3.5" />
          {isCycling ? `Fetch another image (${candidates.indexOf(value) + 1}/${candidates.length})` : "Use website image"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload image
        </button>
        {value && <span className="text-xs text-muted-foreground">Drag the image to adjust the crop.</span>}
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFileChange} />
      <input type="hidden" name="image_url" value={value ?? ""} />
      <input type="hidden" name="image_position" value={position ?? ""} />
    </div>
  );
}
