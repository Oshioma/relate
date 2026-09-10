import "server-only";
import { ARTICLE_JSON_LD, fetchPageContent, parsePublicUrl, resolveRedirect } from "@/lib/page-content";

// Turning a pasted link into a source record.
//
// Sources are the point of this feature, and the fastest way to end up with a
// timeline of unsourced dates is to make adding a source feel like paperwork.
// A child watching a documentary or reading a Wikipedia article has the link in
// their clipboard; this turns that into a titled, attributed, dated source in
// one paste.
//
// IT FILLS THE FORM, IT DOES NOT SUBMIT IT. Everything comes back as a
// suggestion in editable fields, because page metadata is often wrong or
// missing and the person pasting knows better than the page does. Nothing is
// saved until they press the button.
//
// WHAT IT WILL NOT DO. It does not read the page's argument, judge the source,
// or guess a date for the EVENT. The only date it looks for is the source's
// own — when the article was published, when the video went up, when the wiki
// page was last edited — which is the fact this product keeps carefully apart
// from the date the source is being cited for.

export type LinkedSource = {
  url: string;
  title: string;
  author: string | null;
  publisher: string | null;
  workTitle: string | null;
  sourceType: string;
  /** The SOURCE's own date — never the event's. Null when the page doesn't say. */
  published: { year: number; month: number | null; day: number | null } | null;
  /** The page's own one-line description, offered as the event's summary. */
  summary: string | null;
  /** The page's share image, offered as the event's picture. */
  imageUrl: string | null;
  /** What we could not find, so the form can say so rather than looking complete. */
  missing: string[];
};

export type LinkReadResult = { ok: true; source: LinkedSource } | { ok: false; error: string };

// A watch page's metadata is thin and its channel name isn't in it, but every
// video host publishes oEmbed — a keyless, stable endpoint that returns exactly
// the title and the author we want. Worth the special case: "the video source"
// is half of what anyone pastes into a homeschool timeline.
const OEMBED_ENDPOINTS: { matches: (host: string) => boolean; endpoint: (url: string) => string }[] = [
  {
    matches: (host) => host === "youtube.com" || host === "www.youtube.com" || host === "youtu.be" || host === "m.youtube.com",
    endpoint: (url) => `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
  },
  {
    matches: (host) => host === "vimeo.com" || host === "www.vimeo.com" || host === "player.vimeo.com",
    endpoint: (url) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  },
];

function hostOf(url: URL): string {
  return url.hostname.toLowerCase();
}

/**
 * A first guess at what kind of source this is.
 *
 * Deliberately conservative and always overridable: getting it wrong in the
 * dropdown costs one click, and guessing "primary source" from a URL would be
 * the software making a claim about evidence that it has no business making.
 * Anything unrecognised falls to "website", which is true of every web page.
 */
export function guessSourceType(url: URL): string {
  const host = hostOf(url).replace(/^www\./, "");
  const path = url.pathname.toLowerCase();

  if (OEMBED_ENDPOINTS.some((entry) => entry.matches(hostOf(url)))) return "video";
  if (host.endsWith("wikipedia.org") || host.endsWith("wikiversity.org")) return "website";
  if (
    host === "doi.org" ||
    host.endsWith("arxiv.org") ||
    host.endsWith("jstor.org") ||
    host.endsWith("nature.com") ||
    host.endsWith("science.org") ||
    host.endsWith("sciencedirect.com") ||
    host.endsWith("springer.com") ||
    host.endsWith("cambridge.org") ||
    host.endsWith("oup.com") ||
    host.endsWith("plos.org") ||
    host.endsWith("pnas.org") ||
    path.includes("/doi/")
  ) {
    return "academic_paper";
  }
  if (host.endsWith("britishmuseum.org") || host.endsWith("metmuseum.org") || host.includes("museum") || path.includes("/collection/")) {
    return "museum";
  }
  if (host.endsWith("archive.org") || host.endsWith("gutenberg.org")) return "historical_document";
  if (host.endsWith("books.google.com") || host.endsWith("googleusercontent.com")) return "book";
  return "website";
}

/** The site's own name for itself, or its hostname when it doesn't say. */
function publisherFor(url: URL, meta: Record<string, string>): string | null {
  const named = meta["og:site_name"] || meta["application-name"] || meta["twitter:site"];
  if (named) return named.replace(/^@/, "");
  const host = hostOf(url).replace(/^www\./, "");
  return host || null;
}

/** Pull a name out of "author": a string, an object with a name, or an array of either. */
function nameOf(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return nameOf(value[0]);
  if (typeof value === "object" && value !== null) {
    const inner = (value as Record<string, unknown>).name;
    return typeof inner === "string" ? inner : undefined;
  }
  return undefined;
}

function flattenNodes(parsed: unknown): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== "object" || value === null) return;
    const node = value as Record<string, unknown>;
    nodes.push(node);
    // A @graph is a bag of nodes at the top level; the interesting one is
    // rarely first.
    if (Array.isArray(node["@graph"])) (node["@graph"] as unknown[]).forEach(visit);
  };
  visit(parsed);
  return nodes;
}

type StructuredBits = { author?: string; published?: string; publisher?: string; headline?: string };

function bitsFrom(node: Record<string, unknown>): StructuredBits {
  const published =
    typeof node.datePublished === "string"
      ? node.datePublished
      : typeof node.uploadDate === "string"
        ? node.uploadDate
        : typeof node.dateCreated === "string"
          ? node.dateCreated
          : undefined;
  return {
    author: nameOf(node.author),
    published,
    publisher: nameOf(node.publisher),
    headline: typeof node.headline === "string" ? node.headline : nameOf(node.name),
  };
}

/**
 * schema.org, where a page publishes it — far more reliable than a byline
 * scraped from text.
 *
 * Merged field by field across every node rather than taken wholesale from the
 * first one that has anything. A @graph usually opens with a WebSite node
 * carrying the site's name and nothing else; returning on that gave the site's
 * name as the headline and lost the article's author and date entirely.
 * Article-shaped nodes are read first so their values win.
 */
function fromJsonLd(blocks: string[]): StructuredBits {
  const nodes: Record<string, unknown>[] = [];
  for (const block of blocks) {
    try {
      nodes.push(...flattenNodes(JSON.parse(block)));
    } catch {
      // A malformed block is one fewer place to look, not a failure.
    }
  }

  const isWork = (node: Record<string, unknown>) => {
    const type = node["@type"];
    const text = Array.isArray(type) ? type.join(" ") : typeof type === "string" ? type : "";
    return /Article|BlogPosting|Report|VideoObject|Book|CreativeWork/i.test(text);
  };

  const merged: StructuredBits = {};
  for (const node of [...nodes.filter(isWork), ...nodes.filter((node) => !isWork(node))]) {
    const bits = bitsFrom(node);
    merged.author ??= bits.author;
    merged.published ??= bits.published;
    merged.publisher ??= bits.publisher;
    merged.headline ??= bits.headline;
  }
  return merged;
}

/** "2023-06-14T10:00:00Z" → the parts the source's date fields want. */
export function parseIsoDateParts(raw: string | undefined | null): LinkedSource["published"] {
  if (!raw) return null;
  const match = raw.trim().match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!match) return null;
  const year = Number(match[1]);
  if (!Number.isFinite(year) || year < 1 || year > 3000) return null;
  const month = match[2] ? Number(match[2]) : null;
  const day = match[3] ? Number(match[3]) : null;
  return {
    year,
    month: month && month >= 1 && month <= 12 ? month : null,
    day: month && day && day >= 1 && day <= 31 ? day : null,
  };
}

const MONTH_NAMES = ["january","february","march","april","may","june","july","august","september","october","november","december"];

/**
 * A wiki page's "last edited on 14 June 2023" line.
 *
 * For a wiki this IS the source's date, and it is the most teachable one in the
 * product: the article about the Battle of Hastings was edited last month, and
 * the battle was in 1066. Keeping those two apart is the whole of §8.
 */
export function parseWikiLastEdited(text: string): LinkedSource["published"] {
  const match = text.match(/last edited on\s+(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);
  if (!match) return null;
  const month = MONTH_NAMES.indexOf(match[2].toLowerCase());
  if (month === -1) return null;
  return { year: Number(match[3]), month: month + 1, day: Number(match[1]) };
}

/** A last-resort title from the URL itself: ".../wiki/Battle_of_Hastings" → "Battle of Hastings". */
export function titleFromUrl(url: URL): string {
  const segment = url.pathname.split("/").filter(Boolean).pop() ?? "";
  const cleaned = decodeURIComponent(segment).replace(/\.[a-z0-9]{2,4}$/i, "").replace(/[_-]+/g, " ").trim();
  return cleaned || hostOf(url).replace(/^www\./, "");
}

type PageLike = {
  finalUrl: string;
  title: string | null;
  description: string | null;
  meta: Record<string, string>;
  jsonLd: string[];
  text: string;
  images: string[];
};

/**
 * Everything the page says about itself, as source fields.
 *
 * Pure, so the messy part — which of five places a byline might be hiding — can
 * be tested against real pages' markup without the network.
 */
export function deriveSourceFromPage(url: URL, page: PageLike): LinkedSource {
  const meta = page.meta;
  const structured = fromJsonLd(page.jsonLd);

  const title =
    (page.title ?? "").trim() ||
    structured.headline?.trim() ||
    meta["og:title"] ||
    meta["twitter:title"] ||
    titleFromUrl(url);

  const author =
    structured.author?.trim() ||
    meta["author"] ||
    meta["article:author"] ||
    meta["citation_author"] ||
    meta["twitter:creator"]?.replace(/^@/, "") ||
    null;

  const published =
    parseIsoDateParts(structured.published) ??
    parseIsoDateParts(meta["article:published_time"]) ??
    parseIsoDateParts(meta["citation_publication_date"]) ??
    parseIsoDateParts(meta["date"]) ??
    (hostOf(url).endsWith("wikipedia.org") ? parseWikiLastEdited(page.text) : null);

  const publisher = structured.publisher?.trim() || publisherFor(url, meta);

  const missing: string[] = [];
  if (!author) missing.push("who wrote it");
  if (!published) missing.push("when it was published");

  return {
    url: page.finalUrl || url.toString(),
    // Wikipedia's <title> ends " - Wikipedia"; the site name is already the
    // publisher, so repeating it in the title is noise on every card.
    title: title.replace(/\s+[-–|]\s+(Wikipedia|YouTube|Vimeo)\s*$/i, "").trim(),
    author,
    publisher,
    workTitle: null,
    sourceType: guessSourceType(url),
    published,
    // The page's own blurb, which is usually a decent one-line summary of what
    // happened. Offered for the event, not for the source — and only ever as a
    // starting point somebody edits.
    summary: (page.description ?? meta["og:description"] ?? "").trim() || null,
    imageUrl: page.images[0] ?? null,
    missing,
  };
}

type OEmbed = { title?: unknown; author_name?: unknown; provider_name?: unknown; thumbnail_url?: unknown };

async function readOEmbed(url: URL): Promise<LinkedSource | null> {
  const entry = OEMBED_ENDPOINTS.find((candidate) => candidate.matches(hostOf(url)));
  if (!entry) return null;

  try {
    const response = await fetch(entry.endpoint(url.toString()), {
      signal: AbortSignal.timeout(8000),
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as OEmbed;
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (!title) return null;
    const author = typeof data.author_name === "string" ? data.author_name.trim() : null;

    return {
      url: url.toString(),
      title,
      author: author || null,
      publisher: typeof data.provider_name === "string" ? data.provider_name : null,
      workTitle: null,
      sourceType: "video",
      // oEmbed carries no upload date. Saying so beats guessing, and the
      // contributor can read it off the page in two seconds.
      published: null,
      summary: null,
      imageUrl: typeof data.thumbnail_url === "string" ? data.thumbnail_url : null,
      missing: [...(author ? [] : ["who made it"]), "when it was published"],
    };
  } catch {
    return null;
  }
}

/**
 * Read a pasted link into source fields.
 *
 * Reuses the same guarded fetcher the listing importer uses, so a member cannot
 * point this at the private network the app runs in (see isPublicHttpUrl).
 */
export async function readSourceLink(rawUrl: string): Promise<LinkReadResult> {
  const trimmed = rawUrl.trim();
  if (!trimmed) return { ok: false, error: "Paste a link first." };

  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = parsePublicUrl(withScheme);
  if (!url) return { ok: false, error: "That doesn't look like a web address we can open." };

  const oembed = await readOEmbed(url);
  if (oembed) return { ok: true, source: oembed };

  // A shortened link tells us nothing about the source; follow it first so the
  // guesses below are made about the real page.
  const resolved = hostOf(url).split(".").length <= 2 && url.pathname.length <= 12 ? await resolveRedirect(url) : url;
  const target = parsePublicUrl(resolved.toString()) ?? url;

  const page = await fetchPageContent(target, { jsonLdTypes: ARTICLE_JSON_LD });
  if (!page) {
    // Plenty of sites refuse a server-side request. That is not a dead end —
    // the link is still a perfectly good source, it just has to be typed.
    return {
      ok: false,
      error: "Couldn't read that page — some sites don't allow it. The link is saved; fill in the title yourself.",
    };
  }

  return { ok: true, source: deriveSourceFromPage(target, page) };
}
