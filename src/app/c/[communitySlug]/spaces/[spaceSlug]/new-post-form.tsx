"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { createPost } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { UploadButton } from "@/components/ui/upload-button";

interface NewPostFormProps {
  communityId: string;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
}

export function NewPostForm({ communityId, spaceId, communitySlug, spaceSlug }: NewPostFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createPost(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setImageUrl(null);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="image_url" value={imageUrl ?? ""} />

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="What's on your mind?" required />
      </div>

      <div>
        <Label htmlFor="body">Details (optional)</Label>
        <Textarea id="body" name="body" rows={3} placeholder="Say more…" />
      </div>

      {imageUrl && (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Attachment" className="max-h-40 rounded-md border border-border" />
          <button
            type="button"
            title="Remove image"
            onClick={() => setImageUrl(null)}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            name="post_type"
            defaultValue="discussion"
            className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="discussion">Discussion</option>
            <option value="announcement">Announcement</option>
            <option value="resource">Resource</option>
          </select>
          <UploadButton label={imageUrl ? "Change image" : "Attach image"} onUploaded={setImageUrl} />
        </div>
        <SubmitButton pendingText="Posting…" className="w-auto">
          Post
        </SubmitButton>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}
