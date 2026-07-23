import Anthropic from "@anthropic-ai/sdk";

// Cheap-and-fast configuration while the feature bakes: Haiku costs ~5x less
// than Sonnet per token and finishes in well under a minute, which also
// avoids hosting timeouts. Set EVENT_DISCOVERY_MODEL (e.g. "claude-sonnet-5")
// to trade cost for extraction quality later — the basic web tool variants
// below work on every current model.
const DEFAULT_MODEL = "claude-haiku-4-5";
const MODEL = process.env.EVENT_DISCOVERY_MODEL || DEFAULT_MODEL;
const MAX_WEB_SEARCHES = 6;
// Server-side web search runs in an API-side loop that can stop with
// stop_reason "pause_turn"; re-sending the conversation resumes it.
const MAX_CONTINUATIONS = 2;
const MAX_RESULTS = 15;
// Hosting kills the whole request at its max duration (300s on Vercel with
// Fluid Compute), which reaches the browser as a dead connection with no
// error message. Keep our own budget comfortably below that so every run
// ends with an explicit status instead.
// One API request runs the web searches AND page fetches sequentially inside
// it, so it needs real room: 150s per request, no retry. A continuation is
// only attempted while elapsed time leaves space for another full request,
// keeping the worst case (~120s + 150s) under the 300s platform limit.
const REQUEST_TIMEOUT_MS = 150_000;
const CONTINUE_DEADLINE_MS = 120_000;

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  // The SDK defaults (10-minute timeout, 2 silent retries with backoff) can
  // hold a stalled or rate-limited call far past the hosting limit; retries
  // are off because retrying a timed-out 2-minute request doubles the bill
  // for a run that's already doomed.
  if (!client) client = new Anthropic({ timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 });
  return client;
}

export type DiscoveredEvent = {
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  source_url: string | null;
};

// Distinguishes failure causes so the UI can say "out of credit" instead of
// a generic "check your API key" when the account balance is the problem.
// "search_limited" means Anthropic rejected the web searches themselves
// (server tool rate limit) — the model ran but couldn't look anything up.
// `detail` is a short diagnostic shown to staff in the panel, so failures
// self-explain without a trip to the hosting logs.
export type DiscoveryResult =
  | { status: "ok"; events: DiscoveredEvent[] }
  | { status: "unconfigured" | "billing" | "search_limited" | "error"; detail?: string };

const MAX_PAGE_FETCHES = 5;
const MAX_FETCH_TOKENS = 8_000;

const SYSTEM_PROMPT = `You are an event researcher for a local community platform. Find real, upcoming, public events (concerts, festivals, markets, sports, cultural events, meetups, exhibitions, recurring nights) in the location you are given.

Method: web_search for event calendars and listings for that location, then web_fetch several of the most promising listing pages to read the actual event details — search snippets alone rarely contain dates. Cast a wide net: try multiple searches covering different event types and listing sites rather than stopping after the first one or two hits.

Respond with ONLY a JSON array — no prose, no markdown fences. Each element:
{
  "title": string,
  "description": string,          // 1-2 sentences, plain text
  "start_time": string,           // ISO 8601 with timezone offset, e.g. "2026-08-01T18:00:00+03:00"
  "end_time": string | null,      // ISO 8601, must be after start_time, or null
  "location": string,             // venue and/or area, e.g. "Old Fort, Stone Town"
  "source_url": string            // page where the event is listed
}

Rules:
- Speed matters: start searching immediately, run a few broad searches against event calendars and listings sites, and extract from those results. Do not run extra searches to double-check individual events.
- Only include events you actually saw in search results or fetched pages. Never invent events. If a listing gives only a date with no time, use a sensible local time for that kind of event; if it gives a day without a year, assume the next upcoming occurrence.
- Regularly recurring public events (weekly markets, recurring live-music or club nights) count — list the next occurrence.
- Skip anything that matches an existing event title you are given.
- Return at most ${MAX_RESULTS} events, soonest first. If you find nothing verifiable, return [].
- Your final message must be exactly the JSON array — starting with "[" and ending with "]".`;

// Searches the web for upcoming events near `locationName` and returns
// structured candidates, or a status describing why the call couldn't run.
export async function discoverEventsWithAI(opts: {
  locationName: string;
  existingTitles: string[];
}): Promise<DiscoveryResult> {
  const anthropic = getClient();
  if (!anthropic) return { status: "unconfigured" };

  const today = new Date().toISOString().slice(0, 10);
  const existing = opts.existingTitles
    .slice(0, 50)
    .map((t) => `- ${t}`)
    .join("\n");

  const startedAt = Date.now();
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Today's date is ${today}. Find upcoming public events in ${opts.locationName} over the next 60 days.${
        existing ? `\n\nAlready on our calendar (skip these):\n${existing}` : ""
      }`,
    },
  ];

  try {
    const send = () =>
      anthropic.messages.create({
        model: MODEL,
        // On models with default-on thinking (e.g. Sonnet 5 via the env
        // override) this budget is shared with thinking; keep headroom so
        // the JSON never truncates mid-array. No effort param — Haiku
        // doesn't support it.
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        // Basic web tool variants: supported by Haiku and every current
        // bigger model, so the EVENT_DISCOVERY_MODEL override stays safe.
        tools: [
          { type: "web_search_20250305", name: "web_search", max_uses: MAX_WEB_SEARCHES },
          // Fetch reads pages already surfaced by search — snippets alone
          // rarely carry event dates. Token-capped to bound cost per run.
          {
            type: "web_fetch_20250910",
            name: "web_fetch",
            max_uses: MAX_PAGE_FETCHES,
            max_content_tokens: MAX_FETCH_TOKENS,
          },
        ],
        messages,
      });

    // Web search failures don't raise — they come back as tool-result blocks
    // whose content is an error object instead of a results array. Tally them
    // so "the searches were rejected" isn't reported as "no events exist".
    let searchOk = 0;
    let searchFailed = 0;
    const tallySearches = (content: Anthropic.ContentBlock[]) => {
      for (const block of content) {
        if (block.type === "web_search_tool_result") {
          if (Array.isArray(block.content)) searchOk++;
          else searchFailed++;
        }
      }
    };

    console.log(`[discover-events] starting ${MODEL} run for "${opts.locationName}"`);

    let response = await send();
    tallySearches(response.content);
    for (let i = 0; i < MAX_CONTINUATIONS && response.stop_reason === "pause_turn"; i++) {
      const elapsed = Date.now() - startedAt;
      if (elapsed > CONTINUE_DEADLINE_MS) {
        console.error(`[discover-events] no time left to resume paused run (${Math.round(elapsed / 1000)}s elapsed)`);
        return { status: "error", detail: `ran out of time after ${Math.round(elapsed / 1000)}s (paused mid-search)` };
      }
      messages.push({ role: "assistant", content: response.content });
      response = await send();
      tallySearches(response.content);
    }

    // Always leave a usage trail so hosting logs show which model/config is
    // actually deployed and what each run cost.
    console.log(
      `[discover-events] ${MODEL} run for "${opts.locationName}" finished in ${Math.round((Date.now() - startedAt) / 1000)}s; stop_reason=${response.stop_reason}; searches ok=${searchOk} failed=${searchFailed}; usage=${JSON.stringify(response.usage)}`,
    );

    if (searchFailed > 0 && searchOk === 0) {
      return { status: "search_limited", detail: `${searchFailed} searches rejected, 0 succeeded` };
    }

    const text = response.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("\n");

    if (response.stop_reason === "max_tokens") {
      console.error("[discover-events] output truncated at max_tokens; usage:", response.usage);
      return { status: "error", detail: "model output was truncated at the token limit" };
    }

    const events = parseEvents(text);
    if (events === null) {
      // The model produced prose instead of JSON — surface it as an error
      // (not "no events found") with the start of what it actually said.
      console.error(
        `[discover-events] no JSON array in model output (stop_reason=${response.stop_reason}); text starts: ${text.slice(0, 300)}`,
      );
      return { status: "error", detail: `model returned prose instead of JSON: "${text.slice(0, 160)}"` };
    }

    if (events.length === 0) {
      console.log(
        `[discover-events] genuine empty result for "${opts.locationName}" (stop_reason=${response.stop_reason}); text starts: ${text.slice(0, 300)}`,
      );
    }

    return { status: "ok", events };
  } catch (error) {
    console.error("[discover-events] Anthropic API call failed:", error);
    const detail = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 200) : String(error).slice(0, 200);
    if (error instanceof Anthropic.AuthenticationError) return { status: "unconfigured", detail };
    // Request-level 429s get the same "wait it out" guidance as rejected searches.
    if (error instanceof Anthropic.RateLimitError) return { status: "search_limited", detail };
    // Out-of-credit surfaces as a 400 whose message mentions the credit balance.
    if (error instanceof Anthropic.APIError && /credit balance/i.test(error.message)) {
      return { status: "billing", detail };
    }
    return { status: "error", detail };
  }
}

// The model is told to emit bare JSON, but tolerate stray prose or fences by
// slicing from the first "[" to the last "]". Returns null when no JSON
// array could be recovered at all — callers treat that as a failed run,
// distinct from a genuine empty result.
function parseEvents(text: string): DiscoveredEvent[] | null {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end <= start) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;

  const now = Date.now();
  const events: DiscoveredEvent[] = [];

  for (const item of parsed) {
    if (events.length >= MAX_RESULTS) break;
    if (typeof item !== "object" || item === null) continue;
    const raw = item as Record<string, unknown>;

    const title = asTrimmedString(raw.title)?.slice(0, 200);
    const startTime = asFutureDate(raw.start_time, now);
    if (!title || !startTime) continue;

    let endTime = asDate(raw.end_time);
    if (endTime && endTime <= startTime) endTime = null;

    events.push({
      title,
      description: asTrimmedString(raw.description)?.slice(0, 1000) ?? null,
      start_time: startTime,
      end_time: endTime,
      location: asTrimmedString(raw.location)?.slice(0, 300) ?? null,
      source_url: asHttpUrl(raw.source_url),
    });
  }

  return events.sort((a, b) => a.start_time.localeCompare(b.start_time));
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

function asFutureDate(value: unknown, now: number): string | null {
  const iso = asDate(value);
  return iso && Date.parse(iso) > now ? iso : null;
}

function asHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
