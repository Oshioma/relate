"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { setCropImageUrl } from "./crop-guides-actions";
import { CropImageAiButtons } from "./crop-image-ai-buttons";

// Super-admin control on the crop guide for setting/replacing the hero photo.
// Three ways in: upload a file, "Find photo with AI" (web), or "Generate image".
// All resolve to a hosted URL that's persisted onto the crop via a
// super-admin-gated server action; the hero image refreshes on success.
export function CropImageEditor({
  slug,
  currentUrl,
  commonName,
  scientificName,
  category,
  ediblePart,
  viewerId,
  communitySlug,
  spaceSlug,
  generateEnabled,
}: {
  slug: string;
  currentUrl: string | null;
  commonName: string;
  scientificName: string | null;
  category: string | null;
  ediblePart: string | null;
  viewerId: string;
  communitySlug: string;
  spaceSlug: string;
  generateEnabled: boolean;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Persist a resolved image URL (from upload or AI) onto the crop.
  async function persist(url: string) {
    setError(null);
    setSaved(false);
    const res = await setCropImageUrl({ slug, imageUrl: url, communitySlug, spaceSlug });
    if (res.error) {
      setError(res.error);
      return;
    }
    setPreview(url);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="mt-4 rounded-md border border-dashed border-border p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Crop photo · super admin
      </p>
      <div className="mt-3">
        <ImageUpload
          // Remount when the preview changes so the thumbnail reflects AI results.
          key={preview ?? "empty"}
          bucket="uploads"
          basePath={`${viewerId}/crops/${slug}`}
          currentUrl={preview}
          shape="square"
          size={72}
          label="crop photo"
          onUploaded={persist}
        />
      </div>
      <CropImageAiButtons
        commonName={commonName}
        scientificName={scientificName}
        category={category}
        ediblePart={ediblePart}
        generateEnabled={generateEnabled}
        onImage={persist}
      />
      {saved && <p className="mt-2 text-xs text-accent">Photo updated.</p>}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
