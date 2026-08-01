// og:image / twitter:image in either attribute order, then plain <img> tags.
const META_IMAGE_PATTERNS = [
  /<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]+content=["']([^"']+)["']/gi,
  /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["']/gi,
  /<img[^>]+src=["']([^"']+)["']/gi,
];

const MAX_CANDIDATES = 12;

// Filenames that are almost never the actual event/business photo —
// they're the site's logo, favicon, or a UI sprite, but still show up as
// og:image on sites that never set a per-page share image.
const NON_PHOTO_PATTERN = /(?:^|[/_.-])(logo|favicon|icon|sprite|badge|placeholder|avatar)(?:[/_.-]|\d*\.)/i;

// Pulls candidate image URLs out of already-fetched HTML: share images first
// (usually the best), then images on the page. Split out from
// scrapeWebsiteImages so callers that already hold the page's HTML — the
// listing-link importer, which fetches once and reads text, JSON-LD and images
// from the same response — don't have to fetch it a second time.
export function extractImagesFromHtml(html: string, baseUrl: string | URL): string[] {
  const found: string[] = [];
  for (const pattern of META_IMAGE_PATTERNS) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[1].replace(/&amp;/g, "&");
      if (raw.startsWith("data:") || /\.svg(\?|$)/i.test(raw) || NON_PHOTO_PATTERN.test(raw)) continue;
      try {
        const resolved = new URL(raw, baseUrl).toString();
        if (/^https?:\/\//.test(resolved) && !found.includes(resolved)) {
          found.push(resolved);
          if (found.length >= MAX_CANDIDATES) return found;
        }
      } catch {
        // Malformed src attribute — skip it.
      }
    }
  }
  return found;
}

// Best-effort scrape of candidate images from a web page. Returns [] rather
// than throwing — an unreachable or imageless page just means no image was found.
export async function scrapeWebsiteImages(pageUrl: string): Promise<string[]> {
  let url: URL;
  try {
    url = new URL(pageUrl);
  } catch {
    return [];
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return [];

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; RelateBot/1.0; +https://relate.app)", accept: "text/html" },
    });
    if (!response.ok) return [];
    const html = (await response.text()).slice(0, 500_000);
    return extractImagesFromHtml(html, response.url || url);
  } catch {
    // Timeout, DNS failure, TLS error — treat all as "no image found".
    return [];
  }
}
