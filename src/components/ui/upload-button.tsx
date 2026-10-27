"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { SPACE_FILES_BUCKET, spaceFilePath, spaceFileUrl, type UploadTarget } from "@/lib/space-files";
import { useUploadTarget } from "./upload-target";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
  "audio/webm",
];
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

// Keep in sync with the 'uploads' and 'space-files' buckets (supabase/migrations) — they
// enforce the same type list and size limit server-side.
const KINDS = {
  image: { types: IMAGE_TYPES, maxBytes: 10 * 1024 * 1024, hint: "an image (max 10MB)" },
  media: { types: [...IMAGE_TYPES, ...VIDEO_TYPES], maxBytes: 50 * 1024 * 1024, hint: "an image or video (max 50MB)" },
  // A phone video of a minute or two runs past 50MB, so this takes the
  // buckets' full limit.
  video: { types: VIDEO_TYPES, maxBytes: 200 * 1024 * 1024, hint: "a video (max 200MB)" },
  any: { types: [...IMAGE_TYPES, ...VIDEO_TYPES, ...DOCUMENT_TYPES], maxBytes: 50 * 1024 * 1024, hint: "an image, video, or document (max 50MB)" },
  // Audio/video/image/docs up to 200MB — for hosting exclusives (tracks, stems,
  // mixes, sets) in a resources space. Matches the raised 'uploads' bucket limit.
  vault: {
    types: [...IMAGE_TYPES, ...VIDEO_TYPES, ...AUDIO_TYPES, ...DOCUMENT_TYPES],
    maxBytes: 200 * 1024 * 1024,
    hint: "audio, video, an image or a document (max 200MB)",
  },
} as const;

// Checks a file against one of the kinds above; the reason it can't be
// uploaded, or null if it's fine.
export function checkMemberFile(file: File, kind: keyof typeof KINDS): string | null {
  const { types, maxBytes, hint } = KINDS[kind];
  if (!(types as readonly string[]).includes(file.type)) return `Please choose ${hint}.`;
  if (file.size > maxBytes) return `That file is too large (max ${Math.round(maxBytes / 1024 / 1024)}MB).`;
  return null;
}

// Puts a file in the signed-in member's folder and returns the link pages
// should use. In a space visitors can't open (`target` set) that's the space's
// private folder and an /api/files/ link; otherwise the public 'uploads'
// bucket and its public URL. Throws on failure.
export async function uploadMemberFile(file: File, target: UploadTarget = null): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  if (target) {
    const path = spaceFilePath(target.spaceId, user.id, file.name, crypto.randomUUID());
    const { error: uploadError } = await supabase.storage.from(SPACE_FILES_BUCKET).upload(path, file, { contentType: file.type });
    if (uploadError) throw uploadError;
    return spaceFileUrl(path);
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 60) || "file";
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  return supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl;
}

// Small self-contained upload button for the general 'uploads' bucket.
// Resolves the signed-in user itself, so forms don't need to thread a userId
// down just to attach a file. The uploaded file keeps a readable name after a
// random prefix, so links to documents still say what they are.
export function UploadButton({
  onUploaded,
  kind = "image",
  label = "Upload image",
  className,
  publicFile = false,
}: {
  // Second arg carries the uploaded file's MIME + name so callers can, e.g.,
  // infer a resource type. Existing callers that take only the URL still work.
  onUploaded: (publicUrl: string, file?: { type: string; name: string }) => void;
  kind?: keyof typeof KINDS;
  label?: string;
  className?: string;
  // Always the public bucket, even inside a private space: for a file the
  // server has to fetch by its link (the plant scanner), not one members share.
  publicFile?: boolean;
}) {
  const spaceTarget = useUploadTarget();
  const target = publicFile ? null : spaceTarget;
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
      onUploaded(await uploadMemberFile(file, target), { type: file.type, name: file.name });
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
