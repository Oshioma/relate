"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

interface ImageUploadProps {
  bucket: "avatars" | "community-assets";
  // Object path without extension, e.g. `${userId}/avatar` or `${communityId}/logo`.
  // The file's own extension is appended, and re-uploads overwrite in place.
  basePath: string;
  currentUrl?: string | null;
  onUploaded: (publicUrl: string) => Promise<void> | void;
  shape?: "circle" | "square";
  size?: number;
  label: string;
}

export function ImageUpload({
  bucket,
  basePath,
  currentUrl,
  onUploaded,
  shape = "circle",
  size = 80,
  label,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    setIsUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${basePath}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

      await onUploaded(publicUrl);
      setPreview(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
      setPreview(currentUrl ?? null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground transition-opacity hover:opacity-80 disabled:opacity-60",
          shape === "circle" ? "rounded-full" : "rounded-lg"
        )}
        style={{ width: size, height: size }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <Upload className="h-5 w-5" />
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </button>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="text-sm font-medium text-accent hover:underline disabled:opacity-60"
        >
          {preview ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        </button>
        <p className="mt-0.5 text-xs text-muted-foreground">PNG, JPEG, WebP, or GIF. Up to 8MB.</p>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
