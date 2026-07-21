"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const DOCUMENT_TYPES = [
  "application/pdf",
  "application/zip",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

// Keep in sync with the 'uploads' bucket in supabase/storage.sql — the bucket
// enforces the same type list and size limit server-side.
const KINDS = {
  image: { types: IMAGE_TYPES, maxBytes: 10 * 1024 * 1024, hint: "an image (max 10MB)" },
  media: { types: [...IMAGE_TYPES, ...VIDEO_TYPES], maxBytes: 50 * 1024 * 1024, hint: "an image or video (max 50MB)" },
  any: { types: [...IMAGE_TYPES, ...VIDEO_TYPES, ...DOCUMENT_TYPES], maxBytes: 50 * 1024 * 1024, hint: "an image, video, or document (max 50MB)" },
} as const;

// Small self-contained upload button for the general 'uploads' bucket.
// Resolves the signed-in user itself, so forms don't need to thread a userId
// down just to attach a file. The uploaded file keeps a readable name after a
// random prefix, so links to documents still say what they are.
export function UploadButton({
  onUploaded,
  kind = "image",
  label = "Upload image",
  className,
}: {
  onUploaded: (publicUrl: string) => void;
  kind?: keyof typeof KINDS;
  label?: string;
  className?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { types, maxBytes, hint } = KINDS[kind];

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (!types.includes(file.type)) {
      setError(`Please choose ${hint}.`);
      return;
    }
    if (file.size > maxBytes) {
      setError(`That file is too large (max ${Math.round(maxBytes / 1024 / 1024)}MB).`);
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be signed in.");

      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 60) || "file";
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(path, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(path);
      onUploaded(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <span className={cn("inline-flex flex-col", className)}>
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
      >
        {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {label}
      </button>
      {error && <span className="mt-1 text-xs text-danger">{error}</span>}
      <input ref={inputRef} type="file" accept={types.join(",")} className="hidden" onChange={handleFileChange} />
    </span>
  );
}
