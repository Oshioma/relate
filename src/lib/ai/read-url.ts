import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Read a web page into plain text, so a lesson can be written from a link
// instead of a paste.
//
// HOW IT WORKS
// Claude's server-side web_fetch tool does the fetching. It will only fetch a
// URL that is already in the conversation, which is exactly this case — the
// person pasted it — so there is no crawling and nothing to abuse. No new
// service, no new API key: the same ANTHROPIC_API_KEY the lesson writer
// already uses, and the same tool discover-events.ts already relies on.
//
// WHAT IT IS FOR
// Articles, blog posts, recipes, Wikipedia, documentation, published lesson
// plans — anything whose words are in the page.
//
// WHAT IT IS NOT FOR: YOUTUBE
// A YouTube watch page does not contain its transcript. The captions come from
// a separate endpoint that routinely refuses datacenter IPs, the scraper
// libraries for it break without warning, and the official API only returns
// captions for videos you own. So this does not pretend: a video link is
// recognised on the way in and answered with a straight "I can't get the
// transcript, here is where to copy it from" rather than a vague failure or,
// worse, a summary of the description passed off as the transcript.

const MODEL = "claude-opus-5";
// Enough for a long article and comfortably inside the lesson ceiling.
const MAX_CONTENT_TOKENS = 40000;
const TIMEOUT_MS = 60_000;

export type ReadUrlResult =
  | { ok: true; text: string; title: string | null }
  | { ok: false; error: string };

export function isUrlReaderConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Sites whose words are not in the page. Matched on host so a link inside an
// article is unaffected.
const VIDEO_HOSTS =
  /(^|\.)(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com|dailymotion\.com|twitch\.tv)$/i;

export function isVideoUrl(raw: string): boolean {
  try {
    return VIDEO_HOSTS.test(new URL(raw).hostname);
  } catch {
    return false;
  }
}

// http/https only, and no addresses that resolve inside our own network — a
// URL typed by a member is untrusted input, and web_fetch runs on Anthropic's
// servers but the check costs nothing and keeps the intent explicit.
export function normaliseUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // A scheme that is already there and is not http(s) is rejected outright,
  // BEFORE anything is prepended. Checking after prepending is not the same
  // check: "file:///etc/passwd" has no "https://" prefix, so it became
  // "https://file:///etc/passwd", which parses cleanly with protocol https:
  // and sailed through. Caught by testing the guard rather than reading it.
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed)?.[1]?.toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") return null;

  const withScheme = scheme ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return null;
  }

  return url.toString();
}

export async function readUrl(rawUrl: string): Promise<ReadUrlResult> {
  if (!isUrlReaderConfigured()) {
    return { ok: false, error: "Reading from a link isn't set up on this deployment yet." };
  }

  const url = normaliseUrl(rawUrl);
  if (!url) {
    return { ok: false, error: "That doesn't look like a web address." };
  }

  if (isVideoUrl(url)) {
    return {
      ok: false,
      error:
        "A video page doesn't carry its transcript, so there's nothing here to read. " +
        "Open the video, use its transcript button, and paste the text in instead.",
    };
  }

  const client = new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 1 });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      // Reading a page out is transcription, not reasoning. The lesson writer
      // does the thinking afterwards.
      output_config: { effort: "low" },
      system:
        "You are given one URL. Fetch it and return the readable article text " +
        "as plain prose: headings, paragraphs, lists and any transcript or " +
        "recipe on the page. Drop navigation, adverts, cookie notices, " +
        "comments, share buttons and related-article links. Do not summarise, " +
        "shorten, translate or comment — reproduce the words as they are, " +
        "because somebody is going to teach from them. Begin with the page's " +
        "title on its own first line. If the page cannot be fetched or holds " +
        "no readable text, reply with exactly: CANNOT_READ",
      messages: [{ role: "user", content: url }],
      tools: [
        {
          type: "web_fetch_20250910",
          name: "web_fetch",
          max_uses: 1,
          max_content_tokens: MAX_CONTENT_TOKENS,
        },
      ],
    });

    // Fetch failures do not raise — they come back as a tool-result block
    // whose content is an error object rather than a document.
    let fetchFailed = false;
    for (const block of message.content) {
      if (block.type === "web_fetch_tool_result" && !("content" in block && block.content)) {
        fetchFailed = true;
      }
    }

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (fetchFailed || !text || text.includes("CANNOT_READ")) {
      return {
        ok: false,
        error:
          "Couldn't read that page — it may need a login, or block automated readers. " +
          "Copy the text across instead.",
      };
    }

    // The first line is the title, by instruction.
    const [firstLine, ...rest] = text.split("\n");
    const body = rest.join("\n").trim();
    const title = firstLine.trim() || null;

    return body
      ? { ok: true, text: `${title}\n\n${body}`, title }
      : { ok: true, text, title: null };
  } catch (error) {
    console.error("Could not read URL", error);
    return { ok: false, error: "Couldn't reach that page just now." };
  }
}
