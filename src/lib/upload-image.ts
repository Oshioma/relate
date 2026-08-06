import { createClient } from "@/lib/supabase/client";

// Shared image-upload plumbing. The ImageUpload control in settings and the
// pencil affordance on the community cover both put a file in the same buckets
// under the same rules, so the rules live here rather than in either component.

export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const IMAGE_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export type ImageBucket = "avatars" | "community-assets" | "uploads";

/** Human-readable reason the file can't be uploaded, or null if it's fine. */
export function validateImageFile(file: File): string | null {
  if (!IMAGE_ACCEPTED_TYPES.includes(file.type)) {
    return "Please choose a PNG, JPEG, WebP, or GIF image.";
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return "That image is too large (max 8MB).";
  }
  return null;
}

/**
 * Upload to `bucket` at `basePath` plus the file's own extension, overwriting
 * any existing object at that path. Returns the public URL with a cache-busting
 * query so a replaced image doesn't keep serving from cache. Throws on failure.
 */
export async function uploadImage(file: File, bucket: ImageBucket, basePath: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${basePath}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
