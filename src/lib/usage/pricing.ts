// Every rate the "Usage & costs" panel prices with, in one place.
//
// Server-only because the overrides are read from the environment, and so the
// page can't drift from what's configured here. The defaults are list prices
// as of 2026-10; when a provider changes its price, set the env var (no deploy
// of new code needed) and update the default here when convenient. The panel
// prints the rates it used, so a stale one is visible rather than silent.

import "server-only";
import { LESSON_WRITER_MODEL } from "@/lib/ai/lesson-writer";
import type { ClaudeRate, Rates } from "@/lib/usage/costs";

// Anthropic first-party list prices, USD per million tokens, from the
// Claude API model table (cached 2026-09-25). Only the models the app has
// used or is likely to switch to; anything else falls back to the default.
const CLAUDE_LIST_PRICES: Record<string, ClaudeRate> = {
  "claude-opus-5": { inputPerMTok: 5, outputPerMTok: 25 },
  "claude-opus-5-5": { inputPerMTok: 4, outputPerMTok: 20 },
  "claude-opus-4-8": { inputPerMTok: 5, outputPerMTok: 25 },
  "claude-sonnet-5-5": { inputPerMTok: 2, outputPerMTok: 10 },
  "claude-sonnet-5": { inputPerMTok: 2, outputPerMTok: 10 },
  "claude-haiku-4-5": { inputPerMTok: 1, outputPerMTok: 5 },
};

// Groq's price for whisper-large-v3-turbo, billed per hour of audio.
const DEFAULT_WHISPER_PER_HOUR = 0.04;
// A typical residential-proxy rate. Providers range roughly $3–$15/GB.
const DEFAULT_PROXY_PER_GB = 7;

function envNumber(name: string): number | null {
  const raw = process.env[name]?.trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function getUsageRates(): Rates & { claudeOverridden: boolean } {
  // The writer's model is priced from the table; if it is ever switched to one
  // the table doesn't know, Opus-tier list price is the cautious guess.
  const listed = CLAUDE_LIST_PRICES[LESSON_WRITER_MODEL] ?? { inputPerMTok: 5, outputPerMTok: 25 };
  const input = envNumber("COST_CLAUDE_INPUT_PER_MTOK");
  const output = envNumber("COST_CLAUDE_OUTPUT_PER_MTOK");
  // An override is a statement about what we actually pay (a negotiated rate,
  // a partner platform), so it applies to every lesson whatever model wrote it.
  const claudeOverridden = input !== null || output !== null;

  return {
    claudeDefault: {
      model: LESSON_WRITER_MODEL,
      inputPerMTok: input ?? listed.inputPerMTok,
      outputPerMTok: output ?? listed.outputPerMTok,
    },
    claudeByModel: claudeOverridden ? {} : CLAUDE_LIST_PRICES,
    whisperPerHour: envNumber("COST_WHISPER_PER_HOUR") ?? DEFAULT_WHISPER_PER_HOUR,
    proxyPerGB: envNumber("COST_PROXY_PER_GB") ?? DEFAULT_PROXY_PER_GB,
    claudeOverridden,
  };
}
