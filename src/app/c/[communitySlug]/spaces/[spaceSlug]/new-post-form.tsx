"use client";

import { useRef, useState } from "react";
import { createPost } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Avatar } from "@/components/ui/avatar";
import { PostImagePicker, type CropPhotoOption, type FarmCropPhotoOption } from "./post-image-picker";

interface NewPostFormProps {
  communityId: string;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  /** Community crop-guide photos the author can borrow an image from. */
  crops?: CropPhotoOption[];
  /** The member's own "My Crops" (farm) photos. */
  myCrops?: FarmCropPhotoOption[];
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
  myCrops = [],
  avatarUrl = null,
  authorName = null,
}: NewPostFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createPost(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setMediaUrl(null);
      setExpanded(false);
    }
  }

  // Collapsed, the composer is a friendly one-line prompt so the feed leads with
  // members' posts, not an empty form. Clicking it opens the full composer.
  if (!expanded) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <Avatar src={avatarUrl} name={authorName} size={36} />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
        >
          Share something with the community…
        </button>
      </div>
    );
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
            {/* Autofocus on expand so the member can start typing straight away. */}
            <Input id="title" name="title" placeholder="What's on your mind?" required autoFocus />
          </div>

          <div>
            <Label htmlFor="body">Details (optional)</Label>
            <Textarea id="body" name="body" rows={3} placeholder="Say more…" />
          </div>
        </div>
      </div>

      <PostImagePicker mediaUrl={mediaUrl} onChange={setMediaUrl} crops={crops} myCrops={myCrops} avatarUrl={avatarUrl} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          name="post_type"
          defaultValue="discussion"
          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="discussion">Discussion</option>
          <option value="announcement">Announcement</option>
          <option value="resource">Resource</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setMediaUrl(null);
              setError(null);
            }}
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <SubmitButton pendingText="Posting…" className="w-auto">
            Post
          </SubmitButton>
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}
