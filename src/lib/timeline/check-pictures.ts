// =============================================================================
// DOES THIS PICTURE ACTUALLY LOAD?
//
// Pictures are added to seeded records by writing a URL into a file. Nobody
// can see whether that URL resolves until somebody opens the record, and a
// broken image is silent: the page renders, the layout holds, and there is
// simply a grey box where a photograph of a flood deposit should be. Two
// repair paths already exist in this codebase for exactly that, both written
// after the fact.
//
// This checks them instead. It runs on the server, which can reach the
// internet from the deployment, and reports what is broken without touching
// anything.
//
// ---------------------------------------------------------------------------
// THE PART THAT NEEDS CARE: THIS FETCHES URLS SOMEBODY ELSE SUPPLIED
//
// A member can add an event with any image URL. Asking the server to fetch it
// is not the same as asking a browser to: the browser sits outside the
// network and the server sits inside it, so "fetch this URL" becomes a way to
// make the server talk to things the internet cannot reach — a cloud
// metadata endpoint, an internal admin page, a database port.
//
// So the guard below is not a formality:
//
//   * http and https only. No file:, no data:, no gopher:.
//   * No loopback, private, link-local or unique-local address literals.
//     169.254.169.254 is the cloud metadata address and is the specific one
//     worth naming; the ranges around it matter just as much.
//   * No localhost, and no .local / .internal / .home.arpa names.
//   * Redirects are NOT followed — with one narrow exception. A public URL
//     that redirects to an internal one is the standard way around a check
//     like this, so a redirect is reported as its own outcome and the
//     destination is never fetched. The exception is a redirect to a named
//     Wikimedia host over https (see FOLLOWABLE_REDIRECT_HOSTS), and even
//     then the destination goes back through the same guard.
//   * Only the status and content type come back. Never a body.
//
// A hostname that resolves to a private address through DNS is not caught by
// any of this, and saying so is better than implying otherwise. What the guard
// does is stop the obvious cases and make the non-obvious ones deliberate.
// =============================================================================

export type PictureCheck = {
  /** The record the picture is attached to. */
  slug: string;
  title: string;
  url: string;
  /** Where on the record: the cover image, or one of the extra pictures. */
  where: "cover" | "media";
  outcome: "ok" | "missing" | "not-an-image" | "redirected" | "blocked" | "unreachable" | "rate-limited";
  detail: string;
};

/**
 * WHO IS ASKING. Wikimedia's published condition for automated requests is a
 * User-Agent that names the caller and gives a way to get in touch, and it
 * throttles requests without one. The checker used to send none, so a full
 * check was ~300 anonymous requests in a burst — and Wikimedia answered most
 * of the later ones with 429, which the report then listed as broken pictures.
 * The importer in bring-in-image.ts already sent this; now both share it.
 */
export const PICTURE_FETCH_USER_AGENT = "Relate/1.0 (community platform; +https://github.com/Oshioma/relate)";

/**
 * THE ONLY REDIRECTS WORTH FOLLOWING.
 *
 * commons.wikimedia.org/wiki/Special:FilePath/<name> is the documented way to
 * ask Wikimedia for a file by name, and it ALWAYS answers with a redirect to
 * the actual bytes on upload.wikimedia.org. Refusing every redirect therefore
 * reported every one of those pictures as failing — and one record lost a
 * perfectly good photograph on the strength of it.
 *
 * Following a redirect is only dangerous when the destination can be
 * anywhere. Here it cannot: https, a host on this list, and the same guard
 * again. Anything else is still reported and never fetched.
 */
const FOLLOWABLE_REDIRECT_HOSTS = new Set(["upload.wikimedia.org", "commons.wikimedia.org"]);
const MAX_REDIRECTS = 3;

/** How long a 429 is waited out before asking once more. Longer than this and the check is better reported as rate-limited. */
const MAX_RATE_LIMIT_WAIT_MS = 3000;

/** At most this many requests in flight to any single host, whatever the overall concurrency. */
const PER_HOST_CONCURRENCY = 2;

const BLOCKED_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);
const BLOCKED_SUFFIXES = [".local", ".internal", ".home.arpa", ".localhost"];

/** An IPv4 literal in a range that is not routable on the public internet. */
function isPrivateIPv4(host: string): boolean {
  const parts = host.split(".");
  if (parts.length !== 4) return false;
  const octets = parts.map((part) => Number(part));
  if (octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false;
  const [a, b] = octets;
  return (
    a === 10 || // 10.0.0.0/8
    a === 127 || // loopback
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
    (a === 192 && b === 168) || // 192.168.0.0/16
    (a === 169 && b === 254) || // link-local, and 169.254.169.254 with it
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    a === 0
  );
}

function isPrivateIPv6(host: string): boolean {
  const bare = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (!bare.includes(":")) return false;
  return (
    bare === "::1" ||
    bare === "::" ||
    bare.startsWith("fc") || // unique local
    bare.startsWith("fd") ||
    bare.startsWith("fe80") || // link-local
    bare.startsWith("::ffff:") // IPv4-mapped, which would smuggle the ranges above
  );
}

/** Is this a URL the server may safely be asked to fetch? */
export function isFetchableWebUrl(raw: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL;
  try {
    // Only bundled drawings may use a same-origin path.
    const local = /^\/images\/sacred-trees\/[a-z-]+\.png$/.test(raw);
    url = local ? new URL(raw, process.env.NEXT_PUBLIC_SITE_URL ?? "https://relate.click") : new URL(raw);
  } catch {
    return { ok: false, reason: "not a valid URL" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: `${url.protocol.replace(":", "")} is not a web address` };
  }
  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host)) return { ok: false, reason: "points at this machine" };
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) return { ok: false, reason: "points inside a private network" };
  if (isPrivateIPv4(host) || isPrivateIPv6(host)) return { ok: false, reason: "points at a private address" };
  return { ok: true, url };
}

/** Where a redirect points, if it is one this checker may follow. */
function followableRedirect(from: URL, location: string | null): URL | null {
  if (!location) return null;
  let next: URL;
  try {
    next = new URL(location, from);
  } catch {
    return null;
  }
  if (next.protocol !== "https:" || !FOLLOWABLE_REDIRECT_HOSTS.has(next.hostname.toLowerCase())) return null;
  // The list is the decision; the guard runs anyway, so a mistake in the list
  // cannot become a way inside.
  const allowed = isFetchableWebUrl(next.toString());
  return allowed.ok ? allowed.url : null;
}

/** Seconds or an HTTP date, as Retry-After allows; null when absent or unreadable. */
function retryAfterMs(header: string | null, now = Date.now()): number | null {
  if (!header) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const at = Date.parse(header);
  return Number.isNaN(at) ? null : Math.max(0, at - now);
}

/**
 * Ask for one picture and report what came back.
 *
 * HEAD first, because it costs nothing and most image hosts answer it. Some
 * answer 405 or 403 to HEAD while serving GET perfectly well, so a failed HEAD
 * falls back to a GET whose body is abandoned as soon as the headers arrive.
 *
 * A 429 IS NOT A BROKEN PICTURE. It is the host saying "not so fast", and it
 * says nothing about whether the file exists. It is waited out once, briefly,
 * and if it persists it is reported as its own outcome so it is never listed
 * among the pictures that failed.
 */
export async function checkOnePicture(
  raw: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
): Promise<Pick<PictureCheck, "outcome" | "detail">> {
  const allowed = isFetchableWebUrl(raw);
  if (!allowed.ok) return { outcome: "blocked", detail: allowed.reason };

  const attempt = async (url: URL, method: "HEAD" | "GET") => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetchImpl(url, {
        method,
        redirect: "manual",
        signal: controller.signal,
        headers: { accept: "image/*", "user-agent": PICTURE_FETCH_USER_AGENT },
      });
    } finally {
      clearTimeout(timer);
    }
  };

  /** One address: HEAD, GET if HEAD is refused, and one patient retry on 429. */
  const ask = async (url: URL) => {
    const once = async () => {
      const response = await attempt(url, "HEAD");
      // Some hosts refuse HEAD and serve GET. 405 is the honest refusal; 403 is
      // the common dishonest one.
      return response.status === 405 || response.status === 403 ? attempt(url, "GET") : response;
    };
    const response = await once();
    if (response.status !== 429) return response;
    const wait = retryAfterMs(response.headers.get("retry-after")) ?? 1500;
    if (wait > MAX_RATE_LIMIT_WAIT_MS) return response;
    await sleep(wait);
    return once();
  };

  let url = allowed.url;
  let response: Response;
  let hops = 0;
  try {
    response = await ask(url);
    while (response.status >= 300 && response.status < 400) {
      const next = hops < MAX_REDIRECTS ? followableRedirect(url, response.headers.get("location")) : null;
      if (!next) break;
      hops++;
      url = next;
      response = await ask(url);
    }
  } catch (error) {
    return { outcome: "unreachable", detail: error instanceof Error ? error.message : "could not be reached" };
  }

  if (response.status >= 300 && response.status < 400) {
    // Not followed, on purpose: a public URL redirecting to an internal one is
    // the standard way past a check like this. Only the Wikimedia hops above
    // are taken.
    return { outcome: "redirected", detail: `redirects (${response.status}) — destination not followed` };
  }
  if (response.status === 429) {
    return {
      outcome: "rate-limited",
      detail: `${url.hostname} asked us to slow down (429) — not checked, try again in a few minutes`,
    };
  }
  if (response.status === 404 || response.status === 410) {
    return { outcome: "missing", detail: `not found (${response.status})` };
  }
  if (!response.ok) {
    return { outcome: "unreachable", detail: `server answered ${response.status}` };
  }

  const type = response.headers.get("content-type") ?? "";
  if (type && !type.startsWith("image/")) {
    // A Wikimedia file path that has been renamed often answers 200 with an
    // HTML error page, which an <img> renders as a broken icon and a status
    // check alone would call healthy.
    return { outcome: "not-an-image", detail: `answered with ${type.split(";")[0]} rather than an image` };
  }
  return { outcome: "ok", detail: type || "ok" };
}

/** A tiny per-key semaphore: `task` runs once fewer than `limit` others hold the same key. */
function perKeyLimiter(limit: number) {
  const active = new Map<string, number>();
  const waiting = new Map<string, (() => void)[]>();
  return async function run<T>(key: string, task: () => Promise<T>): Promise<T> {
    if ((active.get(key) ?? 0) >= limit) {
      // The slot is handed over by whoever releases it, below, so a newcomer
      // can never slip in between the release and this waiter waking.
      await new Promise<void>((resolve) => {
        const queue = waiting.get(key) ?? [];
        queue.push(resolve);
        waiting.set(key, queue);
      });
    } else {
      active.set(key, (active.get(key) ?? 0) + 1);
    }
    try {
      return await task();
    } finally {
      const next = waiting.get(key)?.shift();
      if (next) next();
      else active.set(key, (active.get(key) ?? 1) - 1);
    }
  };
}

function hostKey(raw: string): string {
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return raw;
  }
}

/** Every picture on a set of records, checked with a small amount of concurrency. */
export async function checkPictures(
  records: { slug: string; title: string; image_url: string | null; media: { url: string }[] }[],
  options: {
    fetchImpl?: typeof fetch;
    concurrency?: number;
    perHostConcurrency?: number;
    limit?: number;
    sleep?: (ms: number) => Promise<void>;
  } = {}
): Promise<PictureCheck[]> {
  const { fetchImpl = fetch, concurrency = 6, perHostConcurrency = PER_HOST_CONCURRENCY, limit = 300, sleep } = options;

  const jobs: Omit<PictureCheck, "outcome" | "detail">[] = [];
  for (const record of records) {
    if (record.image_url) jobs.push({ slug: record.slug, title: record.title, url: record.image_url, where: "cover" });
    for (const item of record.media ?? []) {
      if (item?.url) jobs.push({ slug: record.slug, title: record.title, url: item.url, where: "media" });
    }
  }

  const queue = jobs.slice(0, limit);
  const results: PictureCheck[] = new Array(queue.length);

  // The same picture is usually the cover AND an entry in media, which is the
  // pattern every seeded record uses — so the URLs repeat and each should be
  // asked for once.
  //
  // THE CACHE HOLDS THE PROMISE, NOT THE ANSWER. Recording the result after
  // awaiting it looks equivalent and is not: several workers reach the same
  // URL before any of them has finished, all find the cache empty, and all
  // fetch. Storing the in-flight request means the second worker waits on the
  // first instead of racing it.
  //
  // AND NO MORE THAN A COUPLE AT A TIME TO ANY ONE HOST. Nearly every picture
  // here lives on Wikimedia, so six workers meant six simultaneous requests to
  // the same servers — which is what earned the 429s. The other hosts still
  // get the full concurrency.
  const inFlight = new Map<string, Promise<Pick<PictureCheck, "outcome" | "detail">>>();
  const limited = perKeyLimiter(perHostConcurrency);
  const ask = (url: string) => {
    const existing = inFlight.get(url);
    if (existing) return existing;
    const started = limited(hostKey(url), () => checkOnePicture(url, fetchImpl, undefined, sleep));
    inFlight.set(url, started);
    return started;
  };

  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const index = next++;
      const job = queue[index];
      // Written by index rather than pushed, so the report keeps the order of
      // the records however the workers interleave.
      results[index] = { ...job, ...(await ask(job.url)) };
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  return results;
}

// =============================================================================
// WHO MADE THIS PICTURE, AND UNDER WHAT LICENCE
//
// Attribution is a CONDITION of the licences these images are published under,
// not a courtesy. So a picture whose author and licence cannot be established
// must not be attached to a record — the same rule this project applies to
// citations, for the same reason.
//
// That rule is what has kept images off the flood and cosmology datasets. The
// filenames are easy to find; the author and licence are held in the Commons
// API and cannot be read from the filename. This reads them.
//
// The result is used at SEED TIME rather than displayed: a seeded picture gets
// its caption assembled from what Commons returns, and a picture whose
// attribution cannot be retrieved is skipped rather than attached without one.
// Failing closed is the whole point.
// =============================================================================

export type PictureAttribution = {
  /** Ready to print: creator, licence, and where it came from. */
  credit: string;
  artist: string | null;
  licence: string | null;
};

/** The Commons file name inside a Special:FilePath or upload.wikimedia.org URL, if there is one. */
export function commonsFileName(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (!/(^|\.)wikimedia\.org$|(^|\.)wikipedia\.org$/.test(url.hostname)) return null;

  const viaFilePath = url.pathname.match(/\/Special:FilePath\/(.+)$/);
  if (viaFilePath) return decodeURIComponent(viaFilePath[1]);

  // upload.wikimedia.org/wikipedia/commons/a/ab/Name.jpg
  //
  // The /thumb/ form has to be matched FIRST and by its own pattern, because
  // it carries one segment more than the plain form: the original file name,
  // and then a resized copy of it.
  //
  //   plain   .../commons/a/ab/Name.jpg
  //   thumb   .../commons/thumb/a/ab/Name.jpg/800px-Name.jpg
  //                                 ^^^^^^^^ the file  ^^^^^^^^^^^^^ a render of it
  //
  // Reading the last segment of a thumbnail URL gives "800px-Name.jpg", which
  // is not a file on Commons and would come back missing — so the name has to
  // come from the segment before it.
  const viaThumb = url.pathname.match(/\/wikipedia\/[^/]+\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\/[^/]+$/);
  if (viaThumb) return decodeURIComponent(viaThumb[1]);

  const viaUpload = url.pathname.match(/\/wikipedia\/[^/]+\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)$/);
  if (viaUpload) return decodeURIComponent(viaUpload[1]);
  return null;
}

/** Strip the markup Commons returns in its artist field, which is usually a link. */
function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Ask Commons who made a file and under what licence.
 *
 * Returns null when it cannot be established — which the caller must treat as
 * "do not use this picture", not as "use it without a credit".
 */
export async function fetchCommonsAttribution(
  fileName: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000
): Promise<PictureAttribution | null> {
  const endpoint = new URL("https://commons.wikimedia.org/w/api.php");
  endpoint.searchParams.set("action", "query");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("prop", "imageinfo");
  endpoint.searchParams.set("iiprop", "extmetadata");
  endpoint.searchParams.set("titles", `File:${fileName}`);
  endpoint.searchParams.set("origin", "*");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let payload: unknown;
  try {
    const response = await fetchImpl(endpoint, { signal: controller.signal });
    if (!response.ok) return null;
    payload = await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }

  const pages = (payload as { query?: { pages?: Record<string, unknown> } })?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0] as
    | { imageinfo?: { extmetadata?: Record<string, { value?: string }> }[]; missing?: string }
    | undefined;
  if (!page || "missing" in page) return null;

  const meta = page.imageinfo?.[0]?.extmetadata;
  if (!meta) return null;

  const artist = meta.Artist?.value ? plainText(meta.Artist.value) : null;
  const licence = meta.LicenseShortName?.value ? plainText(meta.LicenseShortName.value) : null;
  // A file with neither is unusable: there is nothing to credit and no licence
  // to comply with. Better to have no picture than an uncredited one.
  if (!artist && !licence) return null;

  const credit = [artist, licence, "via Wikimedia Commons"].filter(Boolean).join(", ");
  return { credit, artist, licence };
}

/** The human-readable file page, where Commons states the author and the licence. */
export function commonsFilePageUrl(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replace(/%20/g, "_")}`;
}

/**
 * THE IMAGE ITSELF, encoded the same way its file page is.
 *
 * This existed four times before it existed once. Three seed files had written
 * their own `commons()` that interpolated the name RAW, and a fourth encoded it
 * but without the %20 step — so a filename carrying a curly apostrophe, an
 * umlaut or a semicolon produced a different URL depending on which dataset it
 * was seeded from. `Zodiaque_de_Dendéra … D_38_;_E_13482.jpg` was live with
 * both an unencoded é and an unencoded semicolon, and a semicolon is a URL
 * sub-delimiter that the parser will not clean up on anyone's behalf.
 *
 * WHY %20 BECOMES AN UNDERSCORE rather than staying encoded: Commons titles
 * treat space and underscore as the same character, and the underscore is the
 * form its own canonical URLs use. Encoding to %20 works, but it means the name
 * in the URL no longer matches the `fileName` stored beside it, which is the
 * one comparison that proves a URL was DERIVED from a filename rather than
 * typed alongside it.
 */
export function commonsFilePathUrl(fileName: string, width = 1200): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName).replace(/%20/g, "_")}?width=${width}`;
}
