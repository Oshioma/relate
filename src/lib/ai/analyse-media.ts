import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { fetchPageContent, parsePublicUrl } from "@/lib/page-content";
import { normaliseUrl } from "@/lib/ai/read-url";
import { parseVideoLink } from "@/lib/school/video-links";
import { isbnFromUrl } from "@/lib/media/isbn";
import { meterClaude } from "@/lib/usage/ai-meter";
import { CONCERN_LEVELS, MEDIA_KIND_KEYS, MEDIA_VERDICT_KEYS, PROFANITY_LEVELS } from "@/lib/media/media-types";
import { CONCERN_KEYS, MediaAnalysisSchema, type MediaAnalysisShape } from "@/lib/media/media-analysis-schema";

// Reviews a book, video or other piece of media from a pasted link, for a
// parent deciding whether to hand it to a child.
//
// HOW IT WORKS
// 1. The page itself is read first, cheaply and without a model: its title,
//    description, cover and any schema.org Book/VideoObject block. For a
//    YouTube or Vimeo link the platform's oEmbed endpoint gives the title and
//    channel without scraping.
// 2. Claude is handed those facts and asked to research the work with web
//    search — reviews, publisher pages, age ratings, parent guides — and to
//    finish by calling record_media_review with what it found. The page alone
//    says what a thing is; it almost never says whether chapter nine has a
//    swear word in it, and that is the question being asked.
// 3. The answer is validated and handed back as a DRAFT: the form shows every
//    field and the parent decides. Nothing is written to the database here.
//
// BOOKS FROM A SHOP LINK
// Amazon and most other shops answer a server-side read with a bot check, so
// the page gives nothing — not even the cover. The ISBN in the link does:
// Google Books and Open Library know the book by it, cover included, with no
// key and no scraping (see src/lib/media/isbn.ts). Those facts go to the
// model in place of the page, and the cover comes from the catalogue.
//
// THE COVER PICTURE
// Never taken on the model's word alone. The page's own og:image, a video's
// oEmbed thumbnail or a catalogue cover is used as found; a cover link the
// model reports from its searching is fetched and kept only if it really is
// an image. A plausible-looking URL to nothing is worse than no picture.
//
// WHAT IT WILL NOT DO
// Invent certainty. The model is told to say "unknown" for language it could
// not check and to mark its confidence, and the form shows that. A review that
// quietly guessed "no bad language" is worse than one that says it didn't
// look.

// Opus by default: this is a judgement about what children should see, and
// a web-search run on a weaker model misses things. Overridable for cost.
const DEFAULT_MODEL = "claude-opus-5-5";
const MODEL = process.env.MEDIA_REVIEW_MODEL || DEFAULT_MODEL;
const MAX_WEB_SEARCHES = 5;
const MAX_TOKENS = 8000;
// A search run can pause and resume; this is how many resumes we allow.
const MAX_CONTINUATIONS = 3;
const TIMEOUT_MS = 100_000;
const TOOL_NAME = "record_media_review";

export function isMediaReviewConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// The shape of an answer, and how it is tidied, live in a pure module so the
// tidying can be unit-tested without a server context.
export type MediaAnalysis = MediaAnalysisShape & {
  // Canonical form of the pasted link.
  url: string;
  // A cover or thumbnail the page offered, if any. Never from the model.
  image_url: string | null;
};

export type MediaUsage = { model: string; inputTokens: number; outputTokens: number };

export type AnalyseMediaResult =
  | { ok: true; analysis: MediaAnalysis; usage: MediaUsage }
  | { ok: false; error: string };

// --- Reading the page -------------------------------------------------------

type PageFacts = {
  url: string;
  kindHint: "video" | "book" | null;
  isbn: string | null;
  // What a book catalogue said, as lines for the prompt.
  catalogue: string[];
  title: string | null;
  creator: string | null;
  description: string | null;
  image: string | null;
  jsonLd: string[];
  text: string;
};

const MEDIA_JSON_LD =
  /"@type"\s*:\s*"?[^",]*(?:Book|Product|VideoObject|Movie|TVSeries|TVEpisode|Episode|PodcastSeries|PodcastEpisode|VideoGame|SoftwareApplication|CreativeWork|Article)/i;

async function oEmbed(endpoint: string): Promise<{ title?: string; author_name?: string; thumbnail_url?: string } | null> {
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return data && typeof data === "object" ? (data as { title?: string; author_name?: string; thumbnail_url?: string }) : null;
  } catch {
    return null;
  }
}

// A link that claims to be a picture is only believed once it has answered as
// one. HEAD first; a host that refuses HEAD gets a GET whose body is dropped.
const IMAGE_TIMEOUT_MS = 8000;

export async function verifyImageUrl(candidate: string | null | undefined): Promise<string | null> {
  if (!candidate) return null;
  const url = parsePublicUrl(candidate);
  if (!url) return null;
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const response = await fetch(url, { method, signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS), redirect: "follow", cache: "no-store" });
      const type = response.headers.get("content-type") ?? "";
      if (method === "GET" || response.ok || response.status === 405) {
        await response.body?.cancel().catch(() => undefined);
        if (response.ok && type.startsWith("image/")) return url.toString().slice(0, 1000);
        if (method === "GET" || response.status !== 405) return null;
      }
    } catch {
      return null;
    }
  }
  return null;
}

type BookRecord = {
  title: string | null;
  authors: string[];
  description: string | null;
  publisher: string | null;
  publishedDate: string | null;
  categories: string[];
  maturityRating: string | null;
  cover: string | null;
};

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000), cache: "no-store", headers: { accept: "application/json" } });
  if (!response.ok) return null;
  return response.json();
}

function str(value: unknown, max = 2000): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).map((v) => v.trim()) : [];
}

// Google Books knows most books in print and carries a description and a
// cover; Open Library fills in what it lacks. Either failing costs nothing but
// that source.
async function lookupBook(isbn: string): Promise<BookRecord | null> {
  const [google, openLibrary, openLibraryCover] = await Promise.allSettled([
    fetchJson(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`),
    fetchJson(`https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`),
    verifyImageUrl(`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg?default=false`),
  ]);

  const record: BookRecord = { title: null, authors: [], description: null, publisher: null, publishedDate: null, categories: [], maturityRating: null, cover: null };
  let found = false;

  if (google.status === "fulfilled" && google.value && typeof google.value === "object") {
    const items = (google.value as { items?: unknown }).items;
    const info = Array.isArray(items) && items[0] && typeof items[0] === "object" ? (items[0] as { volumeInfo?: Record<string, unknown> }).volumeInfo : null;
    if (info) {
      found = true;
      record.title = str(info.title, 200);
      record.authors = strings(info.authors);
      record.description = str(info.description);
      record.publisher = str(info.publisher, 200);
      record.publishedDate = str(info.publishedDate, 40);
      record.categories = strings(info.categories);
      record.maturityRating = str(info.maturityRating, 40);
      const links = info.imageLinks && typeof info.imageLinks === "object" ? (info.imageLinks as Record<string, unknown>) : null;
      const thumb = str(links?.thumbnail, 1000) ?? str(links?.smallThumbnail, 1000);
      // Google serves these over http and with a page-curl effect; neither
      // belongs on a card.
      if (thumb) record.cover = thumb.replace(/^http:\/\//i, "https://").replace(/&edge=curl/g, "");
    }
  }

  if (openLibrary.status === "fulfilled" && openLibrary.value && typeof openLibrary.value === "object") {
    const ol = openLibrary.value as Record<string, unknown>;
    found = true;
    record.title ??= str(ol.title, 200);
    record.publisher ??= strings(ol.publishers)[0] ?? null;
    record.publishedDate ??= str(ol.publish_date, 40);
    if (record.authors.length === 0) record.authors = strings(ol.by_statement ? [ol.by_statement] : []);
  }

  if (openLibraryCover.status === "fulfilled" && openLibraryCover.value) {
    found = true;
    record.cover ??= openLibraryCover.value;
  }

  return found ? record : null;
}

async function gatherFacts(url: string): Promise<PageFacts> {
  const facts: PageFacts = { url, kindHint: null, isbn: null, catalogue: [], title: null, creator: null, description: null, image: null, jsonLd: [], text: "" };

  // A book by its ISBN, before the page: the catalogue answers even when the
  // shop will not, and its cover is the real cover.
  const isbn = isbnFromUrl(url);
  if (isbn) {
    facts.isbn = isbn;
    facts.kindHint = "book";
    const book = await lookupBook(isbn);
    if (book) {
      facts.title = book.title;
      facts.creator = book.authors.join(", ") || null;
      facts.description = book.description;
      facts.image = book.cover;
      facts.catalogue = [
        book.title && `Title: ${book.title}`,
        book.authors.length > 0 && `Authors: ${book.authors.join(", ")}`,
        book.publisher && `Publisher: ${book.publisher}${book.publishedDate ? ` (${book.publishedDate})` : ""}`,
        book.categories.length > 0 && `Categories: ${book.categories.join("; ")}`,
        book.maturityRating && `Maturity rating: ${book.maturityRating}`,
        book.description && `Description: ${book.description}`,
      ].filter((line): line is string => typeof line === "string");
    }
  }

  const video = parseVideoLink(url);
  if (video) {
    facts.kindHint = "video";
    facts.url = video.url;
    const endpoint =
      video.platform === "youtube"
        ? `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`
        : video.platform === "vimeo"
          ? `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(video.url)}`
          : null;
    if (endpoint) {
      const embed = await oEmbed(endpoint);
      if (embed) {
        facts.title = typeof embed.title === "string" ? embed.title : null;
        facts.creator = typeof embed.author_name === "string" ? embed.author_name : null;
        facts.image = typeof embed.thumbnail_url === "string" ? embed.thumbnail_url : null;
      }
    }
  }

  const parsed = parsePublicUrl(facts.url);
  if (!parsed) return facts;
  const page = await fetchPageContent(parsed, { jsonLdTypes: MEDIA_JSON_LD, timeoutMs: 10_000, maxText: 6000, dropChrome: true });
  if (!page) return facts;

  facts.title ??= page.title;
  facts.description ??= page.description;
  facts.image ??= page.meta["og:image"] ?? page.meta["twitter:image"] ?? page.images[0] ?? null;
  facts.creator ??= page.meta["author"] ?? page.meta["book:author"] ?? null;
  facts.jsonLd = page.jsonLd;
  facts.text = page.text;
  return facts;
}

// --- Asking Claude ----------------------------------------------------------

const SYSTEM_PROMPT = `You review books, videos, shows, podcasts, games and apps for parents who homeschool, so they can decide whether to give something to their children. You are thorough, specific and honest about what you could not check.

A parent pasted one link. You are given what the page itself says. Then:

1. Identify the work precisely — title, who made it (author, channel, studio, publisher), and what kind of thing it is.
2. Research it with web_search: the publisher's or platform's own page, reviews, age ratings and parent guides (Common Sense Media, Kirkus, Goodreads, publisher age bands, BBFC/MPAA/PEGI ratings, the channel's reputation). Several short searches beat one. For an obscure video or a small channel there may be nothing beyond the page; say so rather than padding.
3. Report what a parent needs to know BEFORE handing it over, under the categories offered: language, violence, frightening or upsetting content, sexual content, romance, drinking/drugs/smoking, mature themes, religious/political/ideological content, adverts or consumerism, online safety. Be concrete: "two uses of 'damn', one 'hell'" is useful, "some language" is not. Say what is in it, not whether you approve of it.
4. Suggest an age range as whole years, from what the publisher, platform and reviewers say, tempered by what you found. Prefer a range (e.g. 8 to 12) to a single age.
5. Give a verdict for a typical family with children in that range: "suitable" (nothing to worry about), "caution" (fine, but a parent should know something first — say what in reason), or "not_suitable" (you would not give this to children in the suggested range — say why in reason, plainly). Reason is required for caution and not_suitable.
6. Write the description as two to four sentences on what the work is about, in neutral language a parent can read aloud. Write summary_for_parents as the paragraph you would say to a parent at the door: what it is, what is good about it, what to know.
7. List themes: the good things in it — subjects, values, skills, what a child would get from it. Each one a short phrase of two to five words ("courage under pressure", "ancient Egypt", "sharing"), never a sentence.

Honesty rules, which outrank everything above:
- profanity is "unknown" unless you found something that actually says what the language is like. Never report "none" because you found nothing.
- A concern with level "none" means you checked and there is nothing; leave a category out if you could not check it.
- confidence is "high" only when several independent sources agree; "low" when you are going mostly on the page itself.
- Never invent a rating, a review or a quote. sources lists the pages you actually used.
- If the link is not a book, video, show, podcast, game, app or website for people to read, watch, listen to or use — a login page, an error page, a shop's homepage — set kind "other", describe what it actually is, verdict "caution", and say so in reason.

When you are done, call ${TOOL_NAME} exactly once with everything you found. The call is the answer; do not write the review out as text as well.`;

const REVIEW_TOOL: Anthropic.Tool = {
  name: TOOL_NAME,
  description: "Record the finished review of the work the parent linked to. Call this exactly once, at the end, with every field filled in.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["kind", "title", "creator", "description", "age_min", "age_max", "verdict", "reason", "profanity", "concerns", "themes", "summary_for_parents", "confidence", "sources", "cover_image_url"],
    properties: {
      kind: { type: "string", enum: MEDIA_KIND_KEYS, description: "What kind of thing it is." },
      title: { type: "string", description: "The work's own title, without the site's suffixes." },
      creator: { type: ["string", "null"], description: "Author, channel, studio or publisher. Null if unknown." },
      description: { type: "string", description: "Two to four neutral sentences on what it is about." },
      age_min: { type: ["integer", "null"], description: "Youngest suggested age in whole years (0 to 21), or null." },
      age_max: { type: ["integer", "null"], description: "Oldest suggested age in whole years (0 to 21), or null for no upper bound." },
      verdict: { type: "string", enum: MEDIA_VERDICT_KEYS, description: "suitable, caution, or not_suitable for children in the suggested range." },
      reason: { type: ["string", "null"], description: "Why it is caution or not_suitable, in plain words. Null only when suitable." },
      profanity: { type: "string", enum: PROFANITY_LEVELS.map((p) => p.value), description: "How much bad language, or unknown if not checked." },
      concerns: {
        type: "array",
        description: "One entry per category you were able to check.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["category", "level", "note"],
          properties: {
            category: { type: "string", enum: CONCERN_KEYS },
            level: { type: "string", enum: [...CONCERN_LEVELS] },
            note: { type: "string", description: "What specifically, in one or two sentences. Empty if level is none." },
          },
        },
      },
      themes: { type: "array", items: { type: "string" }, description: "Subjects, values and skills a child would get from it. Each a phrase of two to five words, never a sentence." },
      summary_for_parents: { type: "string", description: "One paragraph for a parent: what it is, what is good, what to know." },
      confidence: { type: "string", enum: ["low", "medium", "high"] },
      sources: { type: "array", items: { type: "string" }, description: "URLs of the pages you actually used." },
      cover_image_url: {
        type: ["string", "null"],
        description:
          "A direct link to the cover or thumbnail image file (ending .jpg/.png or served as an image), only if you saw one on the publisher's, platform's or a catalogue page. Null otherwise. Never guess a URL.",
      },
    },
  },
};

function buildPrompt(facts: PageFacts): string {
  const parts = [`The link the parent pasted: ${facts.url}`];
  if (facts.kindHint === "video") parts.push("This is a video link.");
  if (facts.isbn) parts.push(`This is a book link; the ISBN in it is ${facts.isbn}.`);
  if (facts.catalogue.length > 0) parts.push("", "What the book catalogue (Google Books / Open Library) says about this ISBN:", ...facts.catalogue);
  if (facts.title && facts.catalogue.length === 0) parts.push(`Page title: ${facts.title}`);
  if (facts.creator && facts.catalogue.length === 0) parts.push(`Page author/channel: ${facts.creator}`);
  if (facts.description && facts.catalogue.length === 0) parts.push(`Page description: ${facts.description}`);
  if (facts.jsonLd.length > 0) parts.push("", "Structured data (schema.org JSON-LD) from the page:", ...facts.jsonLd);
  if (facts.text) parts.push("", "Visible page text (may be partial):", facts.text);
  if (!facts.title && !facts.description && !facts.text) {
    parts.push(
      "",
      "The page itself could not be read (shops often refuse automated readers), so identify the work from the link and from what you can find about it."
    );
  }
  return parts.join("\n");
}

function usageOf(responses: Anthropic.Message[]): MediaUsage {
  return responses.reduce<MediaUsage>(
    (sum, r) => ({
      model: r.model || sum.model,
      inputTokens: sum.inputTokens + r.usage.input_tokens + (r.usage.cache_creation_input_tokens ?? 0) + (r.usage.cache_read_input_tokens ?? 0),
      outputTokens: sum.outputTokens + r.usage.output_tokens,
    }),
    { model: MODEL, inputTokens: 0, outputTokens: 0 }
  );
}

// The model is told to answer with the tool; if it wrote the JSON out as
// text instead, that is still an answer worth reading.
function extractAnswer(response: Anthropic.Message): unknown {
  const toolUse = response.content.find((block): block is Anthropic.ToolUseBlock => block.type === "tool_use" && block.name === TOOL_NAME);
  if (toolUse) return toolUse.input;
  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
  const fence = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const candidate = (fence?.[1] ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function analyseMedia(rawUrl: string): Promise<AnalyseMediaResult> {
  if (!isMediaReviewConfigured()) {
    return { ok: false, error: "AI reviews aren't set up on this deployment yet." };
  }
  const url = normaliseUrl(rawUrl);
  if (!url) return { ok: false, error: "That doesn't look like a web address." };

  const facts = await gatherFacts(url);
  const client = new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 1 });
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: buildPrompt(facts) }];
  const responses: Anthropic.Message[] = [];

  const send = () =>
    client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // A review is a judgement, but not a long one; medium keeps a search
      // run inside the route's time limit.
      output_config: { effort: "medium" },
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_WEB_SEARCHES }, REVIEW_TOOL],
      tool_choice: { type: "auto" },
      messages,
    });

  try {
    let response = await send();
    responses.push(response);
    // Charged to the community this runs for, when there is one (ai-meter.ts).
    await meterClaude("media_review", response);
    for (let i = 0; i < MAX_CONTINUATIONS && response.stop_reason === "pause_turn"; i++) {
      messages.push({ role: "assistant", content: response.content });
      response = await send();
      responses.push(response);
      await meterClaude("media_review", response);
    }

    if (response.stop_reason === "refusal") {
      return { ok: false, error: "Claude declined to review this one. Add it by hand if you'd like it on the shelf." };
    }
    if (response.stop_reason === "max_tokens") {
      return { ok: false, error: "The review ran too long and was cut off. Try again, or add it by hand." };
    }

    const parsed = MediaAnalysisSchema.safeParse(extractAnswer(response));
    if (!parsed.success) {
      console.error("[analyse-media] answer in an unexpected shape", parsed.error.issues.slice(0, 5));
      return { ok: false, error: "The review came back in an unexpected shape. Try again, or add it by hand." };
    }

    const data = parsed.data;
    // A verdict with no reason is a verdict nobody can act on. Keep the
    // parent's rule rather than the model's: suitable needs no reason.
    const reason = data.reason?.trim() || null;
    // The page's or catalogue's own picture first; the model's find only once
    // it has answered as an image.
    const image = facts.image && /^https?:\/\//i.test(facts.image) ? facts.image.slice(0, 1000) : await verifyImageUrl(data.cover_image_url);
    return {
      ok: true,
      analysis: {
        ...data,
        reason,
        url: facts.url,
        image_url: image,
      },
      usage: usageOf(responses),
    };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "Claude is busy right now — try again in a minute." };
    }
    if (error instanceof Anthropic.APIError) {
      console.error("[analyse-media] API error", error.status, error.message);
      return { ok: false, error: "Couldn't get a review just now. Try again, or add it by hand." };
    }
    console.error("[analyse-media] failed", error);
    return { ok: false, error: "Couldn't get a review just now. Try again, or add it by hand." };
  }
}
