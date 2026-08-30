"use client";

import { useRef, useState } from "react";
import { createResource } from "./resource-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { UploadButton } from "@/components/ui/upload-button";
import type { ResourceType } from "@/types/database";

// Map an uploaded file's MIME to the closest resource type (there's no dedicated
// audio type, so audio is stored as a plain file and detected for playback by
// its URL later).
function resourceTypeForMime(mime: string): ResourceType {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/") || mime.startsWith("audio/")) return "file";
  return "document";
}

export function SpaceResourceForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
}) {
  const [error, setError] = useState<string | null>(null);
  // Controlled so the Upload button can fill them after a file lands.
  const [url, setUrl] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>("link");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createResource(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setUrl("");
      setResourceType("link");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="resource_title">Title</Label>
        <Input id="resource_title" name="title" placeholder="Unreleased demo" required />
      </div>

      <div>
        <Label htmlFor="resource_description">Description (optional)</Label>
        <Textarea id="resource_description" name="description" rows={2} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="url">URL or player link</Label>
          <Input
            id="url"
            name="url"
            type="text"
            placeholder="Paste a SoundCloud or Mixcloud link, or upload a file"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="resource_type">Type</Label>
          <select
            id="resource_type"
            name="resource_type"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value as ResourceType)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="link">Link</option>
            <option value="file">File</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <UploadButton
          kind="vault"
          label="Upload a file"
          onUploaded={(publicUrl, file) => {
            setUrl(publicUrl);
            if (file) setResourceType(resourceTypeForMime(file.type));
          }}
        />
        <span className="text-xs text-muted-foreground">Paste a SoundCloud or Mixcloud link for an inline player, or host a file here.</span>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add resource
      </SubmitButton>
    </form>
  );
}
