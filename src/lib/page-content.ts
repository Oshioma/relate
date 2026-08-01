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

function firstMatch(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const value = decodeEntities(match[1]).trim();
      if (value) return value;
    }
  }
  return null;
}

function extractJsonLd(html: string): string[] {
  const blocks: string[] = [];
  const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    const raw = match[1].trim();
    if (!raw) continue;
    // Only keep blocks that describe a place — sites emit BreadcrumbList,
    // Organization and WebSite blocks that would just crowd the prompt.
    if (!/"@type"\s*:\s*"?[^",]*(?:Hotel|Lodging|Resort|Apartment|House|Restaurant|Food|Bar|Cafe|LocalBusiness|Place|Product|Offer)/i.test(raw)) {
      continue;
    }
    blocks.push(raw.slice(0, MAX_JSON_LD_CHARS));
    if (blocks.length >= MAX_JSON_LD_BLOCKS) break;
  }
  return blocks;
}

export async function fetchPageContent(url: URL): Promise<PageContent | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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
    title: firstMatch(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    ]),
    description: firstMatch(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
    ]),
    jsonLd: extractJsonLd(html),
    text: text.slice(0, MAX_TEXT),
    images: extractImagesFromHtml(html, finalUrl),
  };
}

// Follows a shortener (maps.app.goo.gl, g.co, bit.ly …) to whatever it points
// at without downloading the body. Returns the original URL when the hop fails,
// so callers can always keep working with something.
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
