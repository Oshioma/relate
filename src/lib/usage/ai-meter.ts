// Charging every AI call to the community it was made for.
//
// Lessons and video transcripts record their spend explicitly. Everything
// else — event discovery, plant ID and the plant scanner, the growing
// assistant, listing import, reading a page into a lesson, the concierge —
// is a library function deep under a server action, and threading a community
// id through each of them would be noise. Instead the action that knows the
// community wraps its work in `meteredFor(...)`, and any Claude call made
// inside reports its usage with `meterClaude(...)`, which finds the community
// from the surrounding context. Outside a metered context it does nothing.
//
// The allowance itself is checked by the action, before the call, with
// `checkAiAllowance` — see ai-spend.ts.

import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { recordAiSpend } from "@/lib/usage/ai-spend";
import { getUsageRates } from "@/lib/usage/pricing";
import { claudeCostWithCache, claudeRateFor } from "@/lib/usage/costs";

type MeterContext = { communityId: string; userId: string | null };

const context = new AsyncLocalStorage<MeterContext>();

// Anthropic's web search tool, billed per search on top of tokens.
const WEB_SEARCH_USD = 10 / 1000;

export function meteredFor<T>(ctx: MeterContext, work: () => Promise<T>): Promise<T> {
  return context.run(ctx, work);
}

// The parts of a Claude response that say what it cost.
type ClaudeResponse = {
  id: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number | null;
    cache_read_input_tokens?: number | null;
    server_tool_use?: { web_search_requests?: number | null } | null;
  };
};

// Records one Claude call against the community in context. Never throws.
export async function meterClaude(kind: string, response: ClaudeResponse | null | undefined): Promise<void> {
  const ctx = context.getStore();
  if (!ctx || !response?.usage) return;
  const write = response.usage.cache_creation_input_tokens ?? 0;
  const read = response.usage.cache_read_input_tokens ?? 0;
  const tokens = claudeCostWithCache(
    {
      inputTokens: response.usage.input_tokens + write + read,
      outputTokens: response.usage.output_tokens,
      cacheWriteTokens: write,
      cacheReadTokens: read,
    },
    claudeRateFor(response.model, getUsageRates())
  );
  const searches = (response.usage.server_tool_use?.web_search_requests ?? 0) * WEB_SEARCH_USD;
  await recordAiSpend({
    communityId: ctx.communityId,
    userId: ctx.userId,
    kind,
    amountUsd: tokens + searches,
    ref: `${kind}:${response.id}`,
  });
}

// A call billed at a flat price rather than by tokens (an image generation).
export async function meterFlat(kind: string, amountUsd: number, ref: string): Promise<void> {
  const ctx = context.getStore();
  if (!ctx) return;
  await recordAiSpend({ communityId: ctx.communityId, userId: ctx.userId, kind, amountUsd, ref: `${kind}:${ref}` });
}
