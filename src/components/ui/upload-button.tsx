"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

// Small self-contained "upload an image" button for the general 'uploads'
// bucket (see supabase/storage.sql). Resolves the signed-in user itself, so
// forms don't need to thread a userId down just to attach an image.
export function UploadButton({
  onUploaded,
  label = "Upload image",
  className,
}: {
  onUploaded: (publicUrl: string) => void;
  label?: string;
  className?: string;
}) {
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
      setError("That image is too large (max 10MB).");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be signed in.");

      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

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
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFileChange} />
    </span>
  );
}
