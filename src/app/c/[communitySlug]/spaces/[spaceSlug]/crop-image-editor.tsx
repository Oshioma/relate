"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { setCropImageUrl } from "./crop-guides-actions";

// Super-admin control on the crop guide for setting/replacing the hero photo.
// Uploads to the shared `uploads` bucket (path namespaced to the admin's id, as
// its RLS requires) and persists the resulting URL onto the crop via a
// super-admin-gated server action.
export function CropImageEditor({
  slug,
  currentUrl,
  viewerId,
  communitySlug,
  spaceSlug,
}: {
  slug: string;
  currentUrl: string | null;
  viewerId: string;
  communitySlug: string;
  spaceSlug: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mt-4 rounded-md border border-dashed border-border p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Crop photo · super admin
      </p>
      <div className="mt-3">
        <ImageUpload
          bucket="uploads"
          basePath={`${viewerId}/crops/${slug}`}
          currentUrl={currentUrl}
          shape="square"
          size={72}
          label="crop photo"
          onUploaded={async (url) => {
            setError(null);
            setSaved(false);
            const res = await setCropImageUrl({ slug, imageUrl: url, communitySlug, spaceSlug });
            if (res.error) setError(res.error);
            else setSaved(true);
          }}
        />
      </div>
      {saved && <p className="mt-2 text-xs text-accent">Photo updated.</p>}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
