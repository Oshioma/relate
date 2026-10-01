// Turning recorded usage into estimated money, for the platform admin's
// "Usage & costs" tab.
//
// Pure on purpose: no env, no database, no "server-only". The rates come in as
// an argument (src/lib/usage/pricing.ts reads them from the environment) so
// this can be unit-tested and so one set of rates is applied consistently to
// every row on the page.
//
// Everything here is an ESTIMATE. The quantities are real where they were
// recorded (tokens from Claude's own usage report, audio seconds and bytes
// from the video worker) but the prices are list prices we hold ourselves,
// not what was actually invoiced — and lessons written before usage was
// recorded are estimated from text lengths on top of that.

export type ClaudeRate = { inputPerMTok: number; outputPerMTok: number };

export type Rates = {
  // Used for any model not in byModel, and for lessons with no recorded model.
  claudeDefault: ClaudeRate & { model: string };
  // Per-model list prices, so a lesson written on a different model is priced
  // as that model. Empty when an env override forces one rate for everything.
  claudeByModel: Record<string, ClaudeRate>;
  whisperPerHour: number;
  proxyPerGB: number;
};

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

// The lesson writer's system prompt is around 12,000 characters (it varies a
// little by age band). Rather than rebuild it for every old lesson, the
// estimate adds a flat figure — the prompt is a minority of a typical input.
export const SYSTEM_PROMPT_CHARS = 12_000;
// The usual rule of thumb for English prose. Rough, which is why lessons
// priced this way are counted as "estimated" on the page.
export const CHARS_PER_TOKEN = 4;

export function estimateLessonTokens(
  sourceChars: number,
  lessonChars: number
): { inputTokens: number; outputTokens: number } {
  return {
    inputTokens: Math.round((Math.max(0, sourceChars) + SYSTEM_PROMPT_CHARS) / CHARS_PER_TOKEN),
    // Only the visible lesson JSON: thinking tokens are billed as output too
    // but leave no trace, so old lessons are under- rather than over-counted.
    outputTokens: Math.round(Math.max(0, lessonChars) / CHARS_PER_TOKEN),
  };
}

export function claudeRateFor(model: string | null, rates: Rates): ClaudeRate {
  return (model && rates.claudeByModel[model]) || rates.claudeDefault;
}

export function claudeCost(inputTokens: number, outputTokens: number, rate: ClaudeRate): number {
  return (inputTokens * rate.inputPerMTok + outputTokens * rate.outputPerMTok) / 1_000_000;
}

// What writing one lesson cost, for the line staff see on the lesson itself.
// Uses the recorded token counts when the lesson has them, and the same
// length-based estimate the Usage tab uses when it doesn't — so the two never
// disagree about the same lesson.
export function lessonWritingCost(
  lesson: {
    ai_model?: string | null;
    ai_input_tokens?: number | null;
    ai_output_tokens?: number | null;
    sourceChars: number;
    lessonChars: number;
  },
  rates: Rates
): { cost: number; estimated: boolean } {
  let input = lesson.ai_input_tokens ?? null;
  let output = lesson.ai_output_tokens ?? null;
  const estimated = input === null || output === null;
  if (estimated) {
    const guess = estimateLessonTokens(lesson.sourceChars, lesson.lessonChars);
    input ??= guess.inputTokens;
    output ??= guess.outputTokens;
  }
  return {
    cost: claudeCost(input!, output!, claudeRateFor(lesson.ai_model ?? null, rates)),
    estimated,
  };
}

// Prompt caching changes what input costs: writing the cache is billed at
// 1.25× the input rate, reading it at a fraction (0.1× is the usual list rate;
// some models are cheaper still, so this errs high, the safe direction for an
// allowance). `inputTokens` is the total, cached share included, as stored.
export const CACHE_WRITE_MULTIPLIER = 1.25;
export const CACHE_READ_MULTIPLIER = 0.1;

export function claudeCostWithCache(
  usage: { inputTokens: number; outputTokens: number; cacheWriteTokens?: number; cacheReadTokens?: number },
  rate: ClaudeRate
): number {
  const write = usage.cacheWriteTokens ?? 0;
  const read = usage.cacheReadTokens ?? 0;
  const plain = Math.max(0, usage.inputTokens - write - read);
  const input = plain + write * CACHE_WRITE_MULTIPLIER + read * CACHE_READ_MULTIPLIER;
  return (input * rate.inputPerMTok + usage.outputTokens * rate.outputPerMTok) / 1_000_000;
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

export function whisperCost(audioSeconds: number, rates: Rates): number {
  return (Math.max(0, audioSeconds) / 3600) * rates.whisperPerHour;
}

// Residential proxies bill decimal gigabytes.
export const BYTES_PER_GB = 1_000_000_000;

export function proxyCost(bytes: number, rates: Rates): number {
  return (Math.max(0, bytes) / BYTES_PER_GB) * rates.proxyPerGB;
}

// ---------------------------------------------------------------------------
// Periods
// ---------------------------------------------------------------------------

export const USAGE_PERIODS = [
  { key: "month", label: "This month" },
  { key: "30d", label: "Last 30 days" },
  { key: "all", label: "All time" },
] as const;

export type UsagePeriod = (typeof USAGE_PERIODS)[number]["key"];

export function parseUsagePeriod(raw: string | undefined): UsagePeriod {
  return USAGE_PERIODS.find((p) => p.key === raw)?.key ?? "month";
}

// Where the period starts, or null for all time. Months are UTC, matching how
// the providers bill.
export function periodStart(period: UsagePeriod, now: Date = new Date()): Date | null {
  if (period === "all") return null;
  if (period === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

export type LessonUsageRow = {
  community_id: string;
  ai_model: string | null;
  ai_input_tokens: number | null;
  ai_output_tokens: number | null;
  // Only present when the token counts are missing — see lesson_usage_rows.
  source_chars: number | null;
  lesson_chars: number | null;
};

export type VideoUsageRow = {
  community_id: string;
  status: string;
  method: string | null;
  duration_seconds: number | null;
  audio_seconds: number | null;
  download_bytes: number | null;
  proxied: boolean | null;
};

export type CommunityUsage = {
  communityId: string;
  lessons: number;
  videos: number;
  claudeCost: number;
  whisperCost: number;
  proxyCost: number;
  total: number;
};

export type UsageSummary = {
  lessons: {
    count: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    // How many of `count` had no recorded tokens and were estimated.
    estimated: number;
  };
  videos: {
    // Jobs that finished with a transcript.
    transcribed: number;
    captions: number;
    whisper: number;
    audioSeconds: number;
    // Whisper jobs from before the worker reported audio seconds, priced at
    // the video's full duration instead.
    estimatedAudio: number;
    cost: number;
  };
  proxy: {
    bytes: number;
    jobs: number;
    cost: number;
  };
  total: number;
  byCommunity: CommunityUsage[];
};

export function summariseUsage(
  lessonRows: LessonUsageRow[],
  videoRows: VideoUsageRow[],
  rates: Rates
): UsageSummary {
  const summary: UsageSummary = {
    lessons: { count: 0, inputTokens: 0, outputTokens: 0, cost: 0, estimated: 0 },
    videos: { transcribed: 0, captions: 0, whisper: 0, audioSeconds: 0, estimatedAudio: 0, cost: 0 },
    proxy: { bytes: 0, jobs: 0, cost: 0 },
    total: 0,
    byCommunity: [],
  };
  const communities = new Map<string, CommunityUsage>();
  const community = (id: string) => {
    let entry = communities.get(id);
    if (!entry) {
      entry = { communityId: id, lessons: 0, videos: 0, claudeCost: 0, whisperCost: 0, proxyCost: 0, total: 0 };
      communities.set(id, entry);
    }
    return entry;
  };

  for (const row of lessonRows) {
    let input = row.ai_input_tokens;
    let output = row.ai_output_tokens;
    if (input === null || output === null) {
      const guess = estimateLessonTokens(row.source_chars ?? 0, row.lesson_chars ?? 0);
      input ??= guess.inputTokens;
      output ??= guess.outputTokens;
      summary.lessons.estimated += 1;
    }
    const cost = claudeCost(input, output, claudeRateFor(row.ai_model, rates));
    summary.lessons.count += 1;
    summary.lessons.inputTokens += input;
    summary.lessons.outputTokens += output;
    summary.lessons.cost += cost;
    const c = community(row.community_id);
    c.lessons += 1;
    c.claudeCost += cost;
  }

  for (const row of videoRows) {
    const c = community(row.community_id);
    if (row.status === "done") {
      summary.videos.transcribed += 1;
      if (row.method === "captions") summary.videos.captions += 1;
      if (row.method === "whisper") summary.videos.whisper += 1;
      c.videos += 1;
    }

    // Counted for failed jobs too: Whisper billed whatever it transcribed
    // before the job gave up, and the worker reports exactly that.
    let seconds = row.audio_seconds ?? 0;
    if (row.audio_seconds === null && row.method === "whisper" && row.duration_seconds) {
      seconds = row.duration_seconds;
      summary.videos.estimatedAudio += 1;
    }
    const whisper = whisperCost(seconds, rates);
    summary.videos.audioSeconds += seconds;
    summary.videos.cost += whisper;
    c.whisperCost += whisper;

    // Only proxied jobs cost bandwidth; a direct download is free to us.
    if (row.proxied && row.download_bytes) {
      const proxy = proxyCost(row.download_bytes, rates);
      summary.proxy.bytes += row.download_bytes;
      summary.proxy.jobs += 1;
      summary.proxy.cost += proxy;
      c.proxyCost += proxy;
    }
  }

  for (const c of communities.values()) c.total = c.claudeCost + c.whisperCost + c.proxyCost;
  summary.total = summary.lessons.cost + summary.videos.cost + summary.proxy.cost;
  summary.byCommunity = [...communities.values()].sort((a, b) => b.total - a.total);
  return summary;
}

// "$0.0042" for small sums, "$12.34" for ordinary ones: a single video costs
// fractions of a cent, and rounding that to "$0.00" would read as free.
export function formatUsd(amount: number): string {
  if (amount === 0) return "$0.00";
  if (Math.abs(amount) < 0.01) return `$${amount.toFixed(4)}`;
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
