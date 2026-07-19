"use client";

import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/input";
import type { Community } from "@/types/database";

export function CommunityBrandingForm({ community }: { community: Community }) {
  const router = useRouter();

  async function persistLogo(url: string) {
    const supabase = createClient();
    await supabase.from("communities").update({ logo_url: url }).eq("id", community.id);
    router.refresh();
  }

  async function persistCover(url: string) {
    const supabase = createClient();
    await supabase.from("communities").update({ cover_image_url: url }).eq("id", community.id);
    router.refresh();
  }

  return (
    <div className="grid gap-6 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
      <div>
        <Label>Logo</Label>
        <div className="mt-2">
          <ImageUpload
            bucket="community-assets"
            basePath={`${community.id}/logo`}
            currentUrl={community.logo_url}
            onUploaded={persistLogo}
            label="Logo"
          />
        </div>
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="mt-2">
          <ImageUpload
            bucket="community-assets"
            basePath={`${community.id}/cover`}
            currentUrl={community.cover_image_url}
            onUploaded={persistCover}
            shape="square"
            size={80}
            label="Cover image"
          />
        </div>
      </div>
    </div>
  );
}
