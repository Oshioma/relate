import "server-only";
import { extractImagesFromHtml } from "@/lib/scrape-website-image";

// Fetches a single page a member explicitly pasted and reduces it to the parts
// worth handing to an extraction model: the share metadata, any schema.org
// JSON-LD, the visible text, and candidate photos. One fetch serves all four.
//
// This is a best-effort reader, not a crawler. Plenty of booking sites gate
// server-side requests, so every failure path returns null and the caller falls
// back to what the URL itself reveals — see extractDraftFromLink.

export type PageContent = {
  finalUrl: string;
  title: string | null;
  description: string | null;
  // Every <meta> tag on the page, keyed by its name/property lowercased —
  // "og:site_name", "author", "article:published_time". The title and
  // description above are the two everything wanted; this is the rest, for
  // callers that need a byline or a publication date (the timeline's source
  // importer) without fetching the page a second time.
  meta: Record<string, string>;
  // Raw application/ld+json blocks. Booking.com, TripAdvisor and most hotel
  // sites publish a schema.org Hotel/LocalBusiness object here, which is far
  // more reliable than anything recovered from the rendered text.
  jsonLd: string[];
  text: string;
  images: string[];
};

const MAX_HTML = 800_000;
const MAX_TEXT = 12_000;
const MAX_JSON_LD_BLOCKS = 3;
const MAX_JSON_LD_CHARS = 6_000;
const FETCH_TIMEOUT_MS = 12_000;
// NOTE ON THE {0,4000} IN THE ATTRIBUTE PATTERNS BELOW.
//
// A lazy [\s\S]*? that never finds its closing quote scans to the end of the
// document from every start position — quadratic on a 600KB single-page-app
// shell, which is exactly the shape of a shared-chat or Google-Docs link. The
// bound has to be written into each pattern because a regex quantifier cannot
// take a variable; 4,000 characters is far longer than any real attribute and
// short enough that a pathological page costs nothing.

// The member pastes a link and we fetch that one page on their behalf, so we
// send an ordinary browser's headers rather than a crawler's — many listing
// sites serve a stub (or a 403) to anything else, and a stub can't be parsed.
const BROWSER_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};

// Server-side fetches of member-supplied URLs must not be usable to probe the
// private network the app runs in, so loopback/link-local/RFC1918 hosts are
// refused outright. DNS rebinding to a private address is still possible in
// principle; the payoff is limited here because the response is only ever fed
// into an extraction model, never returned raw to the member.
export function isPublicHttpUrl(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) {
    return false;
  }
  // IPv6 loopback / unique-local / link-local.
  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) return false;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 0 || a === 10 || a === 127) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
  }
  return true;
}

export function parsePublicUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  return isPublicHttpUrl(url) ? url : null;
}

// Listing copy leans on typographic entities (&bull; between facts, &ndash; in
// date ranges, curly quotes in descriptions). Numeric entities are decoded
// generically; the named set covers what actually turns up on these pages.
// Anything unrecognised is left as written rather than mangled.
const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  bull: "•",
  middot: "·",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  times: "×",
  deg: "°",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
  copy: "©",
  reg: "®",
  trade: "™",
  frac12: "½",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (match, body: string) => {
    const token = body.toLowerCase();
    const code = token.startsWith("#x") ? Number.parseInt(token.slice(2), 16) : token.startsWith("#") ? Number(token.slice(1)) : NaN;
    if (Number.isInteger(code)) {
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[token] ?? match;
  });
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      // Keep block boundaries as separators so "Wifi" and "Kitchen" don't fuse.
      .replace(/<\/(p|div|li|tr|h[1-6]|section|article|br)\s*>/gi, " \n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// The LAST capture group, not the first: the patterns below capture their own
// quote character so they can backreference it, which would otherwise push the
// value they actually want into group 2.
function firstMatch(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    const captured = match?.[match.length - 1];
    if (captured) {
      const value = decodeEntities(captured).trim();
      if (value) return value;
    }
  }
  return null;
}

// What the listings importer keeps: blocks that describe a place. Sites emit
// BreadcrumbList, Organization and WebSite blocks that would just crowd the
// prompt.
const PLACE_JSON_LD =
  /"@type"\s*:\s*"?[^",]*(?:Hotel|Lodging|Resort|Apartment|House|Restaurant|Food|Bar|Cafe|LocalBusiness|Place|Product|Offer)/i;

// What the timeline's source importer keeps: blocks that describe a piece of
// WORK, which is where a byline and a publication date live.
export const ARTICLE_JSON_LD =
  /"@type"\s*:\s*"?[^",]*(?:Article|NewsArticle|BlogPosting|ScholarlyArticle|Report|VideoObject|Book|CreativeWork|WebPage)/i;

function extractJsonLd(html: string, keep: RegExp): string[] {
  const blocks: string[] = [];
  const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    const raw = match[1].trim();
    if (!raw) continue;
    // A @graph holds its types inside, so a block containing one is offered to
    // the caller and left for it to walk.
    if (!keep.test(raw) && !/"@graph"/i.test(raw)) {
      continue;
    }
    blocks.push(raw.slice(0, MAX_JSON_LD_CHARS));
    if (blocks.length >= MAX_JSON_LD_BLOCKS) break;
  }
  return blocks;
}

export async function fetchPageContent(
  url: URL,
  // Which schema.org blocks are worth keeping, and how long to wait. Both
  // default to what the listing importer has always had; the timeline's source
  // importer narrows the wait, because somebody is watching a spinner. A
  // parameter rather than a changed constant, so one caller's needs cannot
  // quietly change what the other one gets.
  options: { jsonLdTypes?: RegExp; timeoutMs?: number } = {}
): Promise<PageContent | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(options.timeoutMs ?? FETCH_TIMEOUT_MS),
      headers: BROWSER_HEADERS,
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;
  if (!(response.headers.get("content-type") ?? "").includes("html")) return null;

  let html: string;
  try {
    html = (await response.text()).slice(0, MAX_HTML);
  } catch {
    return null;
  }

  const finalUrl = response.url || url.toString();
  const text = htmlToText(html);

  return {
    finalUrl,
    // Each pattern captures its own quote character and backreferences it, so
    // "Dinosaur asteroid hit 'worst possible place'" survives intact. The old
    // [^"']+ stopped at the first quote of either kind and truncated it.
    title: firstMatch(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=(["'])([\s\S]{0,4000}?)\1/i,
      /<meta[^>]+content=(["'])([\s\S]{0,4000}?)\1[^>]+property=["']og:title["']/i,
      /<title[^>]*>([\s\S]{0,4000}?)<\/title>/i,
    ]),
    description: firstMatch(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=(["'])([\s\S]{0,4000}?)\1/i,
      /<meta[^>]+name=["']description["'][^>]+content=(["'])([\s\S]{0,4000}?)\1/i,
      /<meta[^>]+content=(["'])([\s\S]{0,4000}?)\1[^>]+name=["']description["']/i,
    ]),
    meta: extractMeta(html),
    jsonLd: extractJsonLd(html, options.jsonLdTypes ?? PLACE_JSON_LD),
    text: text.slice(0, MAX_TEXT),
    images: extractImagesFromHtml(html, finalUrl),
  };
}

// Follows a shortener (maps.app.goo.gl, g.co, bit.ly …) to whatever it points
// at without downloading the body. Returns the original URL when the hop fails,
// so callers can always keep working with something.
// Every <meta> with a name or property and a content, in either attribute
// order — the same both-orders problem the image and title patterns above
// already solve, because plenty of real pages write content first.
const META_PATTERNS = [
  /<meta[^>]+(?:name|property|itemprop)=["']([^"']+)["'][^>]*content=(["'])([\s\S]{0,4000}?)\2/gi,
  /<meta[^>]+content=(["'])([\s\S]{0,4000}?)\1[^>]*(?:name|property|itemprop)=["']([^"']+)["']/gi,
];

function extractMeta(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  META_PATTERNS.forEach((pattern, index) => {
    for (const match of html.matchAll(pattern)) {
      // The second pattern matches content first, so the pair is reversed. Both
      // capture the quote character they opened with (see the title patterns).
      const key = (index === 0 ? match[1] : match[3]).trim().toLowerCase();
      const value = decodeEntities((index === 0 ? match[3] : match[2]).trim());
      // First writer wins: a page that repeats a property usually means the
      // first one, and og:* is conventionally near the top.
      if (key && value && !meta[key]) meta[key] = value;
    }
  });
  return meta;
}

export async function resolveRedirect(url: URL): Promise<URL> {
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      headers: BROWSER_HEADERS,
      redirect: "follow",
      cache: "no-store",
    });
    const resolved = new URL(response.url || url.toString());
    return isPublicHttpUrl(resolved) ? resolved : url;
  } catch {
    return url;
  }
}
