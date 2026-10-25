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
