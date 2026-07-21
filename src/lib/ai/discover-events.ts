import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-4-8";
const MAX_WEB_SEARCHES = 6;
// Server-side web search runs in an API-side loop that can stop with
// stop_reason "pause_turn"; re-sending the conversation resumes it.
const MAX_CONTINUATIONS = 4;
const MAX_RESULTS = 8;

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
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

const SYSTEM_PROMPT = `You are an event researcher for a local community platform. Use web search to find real, upcoming, public events (concerts, festivals, markets, sports, cultural events, meetups, exhibitions) in the location you are given.

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
- Only include events you found via web search, with a concrete future date. Never invent events. If a listing gives only a date with no time, use a sensible local time for that kind of event.
- Skip anything that matches an existing event title you are given.
- Return at most ${MAX_RESULTS} events, soonest first. If you find nothing verifiable, return [].`;

// Searches the web for upcoming events near `locationName` and returns
// structured candidates. Follows the concierge pattern: returns null when
// ANTHROPIC_API_KEY isn't configured or the API call fails, so callers can
// degrade gracefully.
export async function discoverEventsWithAI(opts: {
  locationName: string;
  existingTitles: string[];
}): Promise<DiscoveredEvent[] | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const today = new Date().toISOString().slice(0, 10);
  const existing = opts.existingTitles
    .slice(0, 50)
    .map((t) => `- ${t}`)
    .join("\n");

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
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_WEB_SEARCHES }],
        messages,
      });

    let response = await send();
    for (let i = 0; i < MAX_CONTINUATIONS && response.stop_reason === "pause_turn"; i++) {
      messages.push({ role: "assistant", content: response.content });
      response = await send();
    }

    const text = response.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("\n");
    return parseEvents(text);
  } catch {
    return null;
  }
}

// The model is told to emit bare JSON, but tolerate stray prose or fences by
// slicing from the first "[" to the last "]".
function parseEvents(text: string): DiscoveredEvent[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end <= start) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

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
