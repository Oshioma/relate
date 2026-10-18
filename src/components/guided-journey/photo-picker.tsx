"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_ACCEPTED_TYPES, IMAGE_MAX_BYTES } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

// Photo picker for guided-journey forms. Uploads straight to the shared
// 'uploads' bucket under the member's own folder (the bucket's RLS only lets a
// user write to `<their id>/…`), then carries the URLs into the form as a
// hidden JSON field. The hidden field is marked data-draft so a refresh keeps
// already-uploaded photos (see useFormDraft) — the URLs aren't sensitive.
export function PhotoPicker({
  name,
  userId,
  max = 6,
  value,
  onChange,
  label = "Add photos",
  compact = false,
}: {
  name: string;
  userId: string;
  max?: number;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);
    const room = max - value.length;
    if (room <= 0) {
      setError(max === 1 ? "Remove the current photo first." : `You can add up to ${max} photos.`);
      return;
    }
    const supabase = createClient();
    setBusy(true);
    const added: string[] = [];
    try {
      for (const file of files.slice(0, room)) {
        if (!(IMAGE_ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
          setError("Please choose a JPG, PNG, WebP or GIF photo.");
          continue;
        }
        if (file.size > IMAGE_MAX_BYTES) {
          setError("That photo is over 8MB — try a smaller one.");
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${userId}/journeys/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { contentType: file.type });
        if (uploadError) {
          setError(uploadError.message);
          continue;
        }
        added.push(supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl);
      }
    } finally {
      setBusy(false);
    }
    if (added.length > 0) onChange([...value, ...added].slice(0, max));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(value)} data-draft readOnly />
      <div className={cn("flex flex-wrap gap-2", value.length > 0 && "mb-2")}>
        {value.map((url, i) => (
          <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
            {/* eslint-disable-next-line @next/next/no-img-element -- member upload on Supabase storage */}
            <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-90 transition hover:opacity-100"
              aria-label={`Remove photo ${i + 1}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-dashed border-border bg-card text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-soft disabled:opacity-60",
            compact ? "px-3 py-2" : "px-4 py-3"
          )}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 text-accent" />}
          {busy ? "Uploading…" : label}
        </button>
      )}
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPTED_TYPES.join(",")} multiple={max > 1} className="hidden" onChange={handleFiles} />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
