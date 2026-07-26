"use client";

import { useMemo, useRef, useState } from "react";
import { X, Search, Sprout, UserCircle2 } from "lucide-react";
import { createPost } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { UploadButton } from "@/components/ui/upload-button";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { Avatar } from "@/components/ui/avatar";
import { cn, isImageUrl, isVideoUrl } from "@/lib/utils";

export interface CropPhotoOption {
  id: string;
  slug: string;
  common_name: string;
  image_url: string | null;
}

interface NewPostFormProps {
  communityId: string;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  /** Crops (with photos) the author can borrow an image from. */
  crops?: CropPhotoOption[];
  /** The current member's avatar, offered as a one-tap photo source. */
  avatarUrl?: string | null;
  authorName?: string | null;
}

export function NewPostForm({
  communityId,
  spaceId,
  communitySlug,
  spaceSlug,
  crops = [],
  avatarUrl = null,
  authorName = null,
}: NewPostFormProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [cropQuery, setCropQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Only crops that actually have a photo are worth offering as an image.
  const cropsWithPhotos = useMemo(() => crops.filter((c: CropPhotoOption) => c.image_url), [crops]);
  const filteredCrops = useMemo(() => {
    const q = cropQuery.trim().toLowerCase();
    if (!q) return cropsWithPhotos;
    return cropsWithPhotos.filter((c: CropPhotoOption) => c.common_name.toLowerCase().includes(q));
  }, [cropsWithPhotos, cropQuery]);

  function selectMedia(url: string) {
    setMediaUrl(url);
    setShowCropPicker(false);
    setCropQuery("");
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createPost(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setMediaUrl(null);
      setShowCropPicker(false);
      setCropQuery("");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="media_url" value={mediaUrl ?? ""} />

      <div className="flex items-start gap-3">
        <Avatar src={avatarUrl} name={authorName} size={36} className="mt-0.5" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="What's on your mind?" required />
          </div>

          <div>
            <Label htmlFor="body">Details (optional)</Label>
            <Textarea id="body" name="body" rows={3} placeholder="Say more…" />
          </div>
        </div>
      </div>

      {mediaUrl && (
        <div className="relative w-full overflow-hidden rounded-md border border-border">
          {/* Show the chosen media the same way the post will — a generous
              banner for photos/videos, a link for documents — so what you pick
              is what you get. */}
          {isImageUrl(mediaUrl) || isVideoUrl(mediaUrl) ? (
            <div className="aspect-[3/2] w-full bg-muted">
              {isVideoUrl(mediaUrl) ? (
                <video preload="metadata" src={mediaUrl} className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          ) : (
            <div className="p-3">
              <MediaAttachment url={mediaUrl} />
            </div>
          )}
          <button
            type="button"
            title="Remove photo"
            onClick={() => setMediaUrl(null)}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground shadow-sm backdrop-blur hover:text-danger"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showCropPicker && (
        <div className="rounded-md border border-border bg-background p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={cropQuery}
              onChange={(event) => setCropQuery(event.target.value)}
              placeholder="Search crops…"
              className="w-full rounded-md border border-border bg-card py-1.5 pl-8 pr-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {filteredCrops.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No crops with photos found.</p>
          ) : (
            <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {filteredCrops.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => selectMedia(crop.image_url as string)}
                  className="group overflow-hidden rounded-md border border-border text-left transition-colors hover:border-accent"
                >
                  <div className="aspect-[3/2] bg-accent-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={crop.image_url as string} alt={crop.common_name} className="h-full w-full object-cover" />
                  </div>
                  <span className="block truncate px-1.5 py-1 text-xs text-foreground group-hover:text-accent">
                    {crop.common_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            name="post_type"
            defaultValue="discussion"
            className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="discussion">Discussion</option>
            <option value="announcement">Announcement</option>
            <option value="resource">Resource</option>
          </select>

          <UploadButton kind="any" label={mediaUrl ? "Change photo" : "Upload"} onUploaded={setMediaUrl} />

          {cropsWithPhotos.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCropPicker((open) => !open)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors",
                showCropPicker
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
              )}
            >
              <Sprout className="h-3.5 w-3.5 shrink-0" />
              Choose a crop
            </button>
          )}

          {avatarUrl && (
            <button
              type="button"
              onClick={() => selectMedia(avatarUrl)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              <UserCircle2 className="h-3.5 w-3.5 shrink-0" />
              Use my photo
            </button>
          )}
        </div>
        <SubmitButton pendingText="Posting…" className="w-auto">
          Post
        </SubmitButton>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}
