import Anthropic from "@anthropic-ai/sdk";
import type { ConciergeResults } from "@/lib/data/concierge";

const MODEL = "claude-haiku-4-5";
const MAX_QUERY_LENGTH = 300;

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

const SYSTEM_PROMPT = `You are the concierge for a local community platform. Answer the member's question in 2-4 short, conversational sentences, using ONLY the search results listed below the question — never invent businesses, events, people, or details that aren't listed. Recommend specific items by name where it helps. If the results don't really answer the question, say so briefly and suggest rephrasing. Plain text only, no markdown, no headings, no bullet lists.`;

// Layer 2: takes Layer 1's plain ILIKE search results and asks Claude to
// synthesize a short conversational answer grounded in them. Returns null
// (silently falling back to Layer 1's grouped result list) whenever
// ANTHROPIC_API_KEY isn't configured, there's nothing to summarize, or the
// API call itself fails for any reason.
export async function synthesizeConciergeAnswer(results: ConciergeResults): Promise<string | null> {
  const anthropic = getClient();
  if (!anthropic || results.totalCount === 0) return null;

  const context = Object.entries(results.resultsByType)
    .flatMap(([type, items]) =>
      (items ?? []).map((item) => {
        const parts = [`[${type}] ${item.title}`];
        if (item.extra) parts.push(`(${item.extra})`);
        if (item.snippet) parts.push(`— ${item.snippet}`);
        return parts.join(" ");
      }),
    )
    .join("\n");

  const query = results.query.slice(0, MAX_QUERY_LENGTH);

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Question: ${query}\n\nSearch results:\n${context}` }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text.trim() : null;
  } catch {
    return null;
  }
}
