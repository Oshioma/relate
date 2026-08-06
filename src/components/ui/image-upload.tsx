"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile, type ImageBucket } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  bucket: ImageBucket;
  // Object path without extension, e.g. `${userId}/avatar` or `${communityId}/logo`.
  // The file's own extension is appended, and re-uploads overwrite in place.
  // For the per-user "uploads" bucket the first segment must be the uploader's id.
  basePath: string;
  currentUrl?: string | null;
  onUploaded: (publicUrl: string) => Promise<void> | void;
  shape?: "circle" | "square";
  size?: number;
  // Preview aspect ratio (width / height). Defaults to 1 (a square). Set it to
  // match how the image actually renders — a preview shaped like a logo invites
  // a logo, which is how wordmarks end up in banner slots.
  aspect?: number;
  // Extra guidance under the upload button, e.g. a recommended size.
  hint?: string;
  label: string;
}

export function ImageUpload({
  bucket,
  basePath,
  currentUrl,
  onUploaded,
  shape = "circle",
  size = 80,
  aspect = 1,
  hint,
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

    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    setIsUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const publicUrl = await uploadImage(file, bucket, basePath);
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
        style={{ width: size, height: size / aspect }}
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
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
