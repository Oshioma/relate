import { isImageUrl, isVideoUrl } from "@/lib/utils";
import { isSpaceFileUrl } from "@/lib/space-files";

// A post's media is media_url (the lead item: photo, video or document) plus
// up to MAX_EXTRA_PHOTOS more photos in extra_media_urls.
export const MAX_POST_PHOTOS = 4;
export const MAX_EXTRA_PHOTOS = MAX_POST_PHOTOS - 1;
export const MAX_POST_TAGS = 5;
const MAX_TAG_LENGTH = 24;

// The tags field's example: crop-flavoured in growing (farming, gardening…)
// communities, neutral everywhere else.
export function tagsPlaceholder(growing: boolean): string {
  return growing ? "e.g. Chillies, First harvest" : "e.g. Update, Question";
}

// A web link, or a file in a space's private folder (served from /api/files/).
const isHttp = (url: string) => /^https?:\/\//i.test(url) || isSpaceFileUrl(url);

// Extra photos are checked by elimination rather than by extension: a photo
// from a crop guide or an image CDN often has no file extension at all, and
// isImageUrl would turn it away.
const DOCUMENT_EXT = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|zip|rtf|odt)(\?.*)?$/i;
export function isPhotoUrl(url: string): boolean {
  return !isVideoUrl(url) && !DOCUMENT_EXT.test(url);
}

// The photos and videos to show for a post, lead first. A document lead isn't
// visual, so it's left out here (it renders as a download link instead).
export function postGallery(post: { media_url: string | null; extra_media_urls?: string[] | null }): string[] {
  const extras = (post.extra_media_urls ?? []).filter(isPhotoUrl);
  // splitPostMedia only stores extras after a photo lead, so with extras the
  // lead is a photo even when its URL carries no extension.
  const leadVisual =
    post.media_url &&
    (isImageUrl(post.media_url) || isVideoUrl(post.media_url) || (extras.length > 0 && isPhotoUrl(post.media_url)));
  return [...(leadVisual && post.media_url ? [post.media_url] : []), ...extras];
}

// Split the composer's media list into the columns: the first item is the
// lead (any kind), the rest must be http(s) photos, capped.
export function splitPostMedia(urls: string[]): { mediaUrl: string | null; extraMediaUrls: string[] } {
  const clean = urls.map((u) => u.trim()).filter(isHttp);
  const [lead = null, ...rest] = clean;
  // Extras only follow a photo lead — a video or document lead stands alone.
  const extras = lead && isPhotoUrl(lead) ? rest.filter(isPhotoUrl).slice(0, MAX_EXTRA_PHOTOS) : [];
  return { mediaUrl: lead, extraMediaUrls: extras };
}

// "Chillies, #first harvest,chillies" → ["Chillies", "first harvest"]: split on
// commas, drop a leading #, collapse spaces, dedupe case-insensitively, cap.
export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(",")) {
    const tag = part.replace(/^\s*#+/, "").replace(/\s+/g, " ").trim().slice(0, MAX_TAG_LENGTH).trim();
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length === MAX_POST_TAGS) break;
  }
  return tags;
}
