// PICTURES LEFT BEHIND ON CIRCLE.
//
// A community moving from Circle (escapespace.circle.so) arrives with its
// members' profile photos and the pictures inside its posts still pointing at
// Circle's servers: app.circle.so for avatars, assets-v2/v3.circle.so for post
// images. They show while the old Circle community exists and break the day it
// is closed, so Admin -> "Pictures from Circle" copies them into our own
// storage and rewrites the addresses. These helpers only find and swap the
// addresses; the copying is in the admin action.

/** Is this address a picture still served by Circle? */
export function isCirclePictureUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  let host: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    host = parsed.hostname.toLowerCase();
  } catch {
    return false;
  }
  return host === "circle.so" || host.endsWith(".circle.so");
}

/** HTML-escaped ampersands in a src attribute, read back as the real address. */
function decodeAttribute(value: string): string {
  return value.replace(/&amp;/g, "&");
}

/** Every distinct Circle picture used as an <img src> in this HTML, in order. */
export function circlePicturesInHtml(html: string | null | undefined): string[] {
  if (!html) return [];
  const found: string[] = [];
  for (const match of html.matchAll(/<img\b[^>]*?\ssrc\s*=\s*(["'])(.*?)\1/gi)) {
    const url = decodeAttribute(match[2]);
    if (isCirclePictureUrl(url) && !found.includes(url)) found.push(url);
  }
  return found;
}

/**
 * The same HTML with each copied picture's <img src> pointed at its new
 * address. Only src attributes are touched, so a link to the old post on
 * Circle stays as it was written.
 */
export function withCopiedPictures(html: string, copied: Map<string, string>): string {
  if (copied.size === 0) return html;
  return html.replace(/(<img\b[^>]*?\ssrc\s*=\s*)(["'])(.*?)\2/gi, (whole, before: string, quote: string, value: string) => {
    const next = copied.get(decodeAttribute(value));
    return next ? `${before}${quote}${next}${quote}` : whole;
  });
}

/** A short, stable file name for a copied picture, from its position. */
export function circlePictureKey(prefix: string, index: number): string {
  return `${prefix}-${index + 1}`;
}

// VIDEOS LEFT BEHIND ON CIRCLE.
//
// Circle doesn't put a video in a post as a player: it attaches the file and
// the export writes it as a download link, <a class="file" href="https://
// assets-v2.circle.so/…">Name.mp4</a>. The address has no extension, so the
// link text (the file's original name) is what says it is a video.

const VIDEO_NAME = /\.(mp4|m4v|mov|webm)\s*$/i;

/** The file types we keep, by the extension of the original file name. */
export function circleVideoType(name: string): { contentType: string; extension: string } {
  const extension = (name.match(VIDEO_NAME)?.[1] ?? "mp4").toLowerCase();
  if (extension === "mov") return { contentType: "video/quicktime", extension };
  if (extension === "webm") return { contentType: "video/webm", extension };
  return { contentType: "video/mp4", extension: extension === "m4v" ? "m4v" : "mp4" };
}

function linkText(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

/** Every distinct Circle video linked from this HTML, in order, with its file name. */
export function circleVideosInHtml(html: string | null | undefined): { url: string; name: string }[] {
  if (!html) return [];
  const found: { url: string; name: string }[] = [];
  for (const match of html.matchAll(/<a\b[^>]*?\shref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = decodeAttribute(match[2]);
    const name = linkText(match[3]);
    if (isCirclePictureUrl(url) && VIDEO_NAME.test(name) && !found.some((v) => v.url === url)) found.push({ url, name });
  }
  return found;
}

/** The same HTML with each copied video's link pointed at its new address. */
export function withCopiedVideoLinks(html: string, copied: Map<string, string>): string {
  if (copied.size === 0) return html;
  return html.replace(/(<a\b[^>]*?\shref\s*=\s*)(["'])(.*?)\2/gi, (whole, before: string, quote: string, value: string) => {
    const next = copied.get(decodeAttribute(value));
    return next ? `${before}${quote}${next}${quote}` : whole;
  });
}

/**
 * The same HTML without the link to this video, for when the video becomes
 * the post's own player and the download link under it would only repeat it.
 */
export function withoutVideoLink(html: string, url: string): string {
  return html
    .replace(/<a\b[^>]*?\shref\s*=\s*(["'])(.*?)\1[^>]*>[\s\S]*?<\/a>/gi, (whole, _quote: string, value: string) =>
      decodeAttribute(value) === url ? "" : whole
    )
    .replace(/<div>\s*<\/div>/g, "");
}
