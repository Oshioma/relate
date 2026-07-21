"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, Globe, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchWebsiteImage } from "./business-directory-actions";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

// Image field for business listings: preview, pull the og:image from the
// business's website, or upload to the business-images bucket. Carries its
// value into the surrounding form via a hidden `image_url` input.
export function BusinessImageInput({
  value,
  onChange,
  getWebsite,
  userId,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  // Read lazily so the button always sees what's typed in the website field.
  getWebsite: () => string;
  userId: string;
}) {
  const [busy, setBusy] = useState<"fetch" | "upload" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFetchFromWebsite() {
    const website = getWebsite().trim();
    if (!website) {
      setError("Add a website link first.");
      return;
    }
    setError(null);
    setBusy("fetch");
    try {
      const result = await fetchWebsiteImage(website);
      if (result.imageUrl) {
        onChange(result.imageUrl);
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
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="relative h-36 w-full overflow-hidden rounded-md border border-border bg-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Business" className="h-full w-full object-cover" />
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
            onClick={() => onChange(null)}
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
          Use website image
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
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFileChange} />
      <input type="hidden" name="image_url" value={value ?? ""} />
    </div>
  );
}
