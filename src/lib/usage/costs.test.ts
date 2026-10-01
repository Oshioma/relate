import { test } from "node:test";
import assert from "node:assert/strict";
import {
  claudeCost,
  claudeCostWithCache,
  claudeRateFor,
  estimateLessonTokens,
  formatUsd,
  lessonWritingCost,
  parseUsagePeriod,
  periodStart,
  proxyCost,
  summariseUsage,
  whisperCost,
  type LessonUsageRow,
  type Rates,
  type VideoUsageRow,
} from "./costs";

const RATES: Rates = {
  claudeDefault: { model: "claude-opus-5", inputPerMTok: 5, outputPerMTok: 25 },
  claudeByModel: { "claude-sonnet-5-5": { inputPerMTok: 2, outputPerMTok: 10 } },
  whisperPerHour: 0.04,
  proxyPerGB: 7,
};

const lesson = (over: Partial<LessonUsageRow>): LessonUsageRow => ({
  community_id: "a",
  ai_model: "claude-opus-5",
  ai_input_tokens: null,
  ai_output_tokens: null,
  source_chars: null,
  lesson_chars: null,
  ...over,
});

const video = (over: Partial<VideoUsageRow>): VideoUsageRow => ({
  community_id: "a",
  status: "done",
  method: "whisper",
  duration_seconds: null,
  audio_seconds: null,
  download_bytes: null,
  proxied: null,
  ...over,
});

test("old lessons are estimated from text length plus the system prompt", () => {
  assert.deepEqual(estimateLessonTokens(8_000, 20_000), { inputTokens: 5_000, outputTokens: 5_000 });
  assert.deepEqual(estimateLessonTokens(-5, 0), { inputTokens: 3_000, outputTokens: 0 });
});

test("Claude cost is per million tokens, per model", () => {
  assert.equal(claudeCost(1_000_000, 1_000_000, RATES.claudeDefault), 30);
  assert.equal(claudeRateFor("claude-sonnet-5-5", RATES).inputPerMTok, 2);
  assert.equal(claudeRateFor("unknown-model", RATES), RATES.claudeDefault);
  assert.equal(claudeRateFor(null, RATES), RATES.claudeDefault);
});

test("Whisper is per hour of audio and proxy per decimal GB", () => {
  assert.equal(whisperCost(3600, RATES), 0.04);
  assert.equal(whisperCost(-10, RATES), 0);
  assert.equal(proxyCost(2_000_000_000, RATES), 14);
});

test("summary counts recorded and estimated lessons separately", () => {
  const s = summariseUsage(
    [
      lesson({ ai_input_tokens: 10_000, ai_output_tokens: 4_000 }),
      lesson({ source_chars: 8_000, lesson_chars: 20_000, ai_model: null }),
    ],
    [],
    RATES
  );
  assert.equal(s.lessons.count, 2);
  assert.equal(s.lessons.estimated, 1);
  assert.equal(s.lessons.inputTokens, 15_000);
  assert.equal(s.lessons.outputTokens, 9_000);
  assert.ok(Math.abs(s.lessons.cost - (15_000 * 5 + 9_000 * 25) / 1e6) < 1e-12);
});

test("video summary: captions are free, failed Whisper audio still costs, proxy only when proxied", () => {
  const s = summariseUsage(
    [],
    [
      video({ method: "captions", audio_seconds: 0, download_bytes: 50_000, proxied: true }),
      video({ audio_seconds: 1800, download_bytes: 30_000_000, proxied: false }),
      video({ status: "error", audio_seconds: 1800 }),
      // From before the worker reported audio: priced at the full duration.
      video({ duration_seconds: 3600, community_id: "b" }),
    ],
    RATES
  );
  assert.equal(s.videos.transcribed, 3);
  assert.equal(s.videos.captions, 1);
  assert.equal(s.videos.whisper, 2);
  assert.equal(s.videos.audioSeconds, 7200);
  assert.equal(s.videos.estimatedAudio, 1);
  assert.ok(Math.abs(s.videos.cost - 0.08) < 1e-12);
  assert.equal(s.proxy.jobs, 1);
  assert.equal(s.proxy.bytes, 50_000);
  assert.ok(Math.abs(s.total - (0.08 + 50_000 / 1e9 * 7)) < 1e-12);
});

test("communities are ranked by total cost", () => {
  const s = summariseUsage(
    [lesson({ community_id: "cheap", ai_input_tokens: 10, ai_output_tokens: 10 })],
    [video({ community_id: "dear", audio_seconds: 36_000 })],
    RATES
  );
  assert.deepEqual(
    s.byCommunity.map((c) => c.communityId),
    ["dear", "cheap"]
  );
  assert.equal(s.byCommunity[0].videos, 1);
  assert.equal(s.byCommunity[1].lessons, 1);
});

test("periods: this month starts on the 1st UTC, unknown falls back to month", () => {
  const now = new Date("2026-10-15T12:00:00Z");
  assert.equal(periodStart("month", now)?.toISOString(), "2026-10-01T00:00:00.000Z");
  assert.equal(periodStart("30d", now)?.toISOString(), "2026-09-15T12:00:00.000Z");
  assert.equal(periodStart("all", now), null);
  assert.equal(parseUsagePeriod("nonsense"), "month");
  assert.equal(parseUsagePeriod("all"), "all");
});

test("small sums keep their fractions of a cent", () => {
  assert.equal(formatUsd(0), "$0.00");
  assert.equal(formatUsd(0.0042), "$0.0042");
  assert.equal(formatUsd(1234.5), "$1,234.50");
});

test("one lesson's cost uses its recorded tokens when it has them", () => {
  const rates = {
    claudeDefault: { model: "m", inputPerMTok: 4, outputPerMTok: 20 },
    claudeByModel: {},
    whisperPerHour: 0,
    proxyPerGB: 0,
  };
  const recorded = lessonWritingCost(
    { ai_input_tokens: 40_000, ai_output_tokens: 10_000, sourceChars: 0, lessonChars: 0 },
    rates
  );
  // 40k × $4/M + 10k × $20/M = $0.16 + $0.20
  assert.equal(recorded.estimated, false);
  assert.ok(Math.abs(recorded.cost - 0.36) < 1e-9);

  const guessed = lessonWritingCost({ sourceChars: 88_000, lessonChars: 20_000 }, rates);
  // (88,000 + 12,000) / 4 = 25,000 in; 20,000 / 4 = 5,000 out
  assert.equal(guessed.estimated, true);
  assert.ok(Math.abs(guessed.cost - (0.1 + 0.1)) < 1e-9);
});

test("cached input is priced as a write or a read, not at the full rate", () => {
  const rate = { inputPerMTok: 4, outputPerMTok: 20 };
  // 1,000 plain + 20,000 written to cache + 0 read; 5,000 out.
  const first = claudeCostWithCache(
    { inputTokens: 21_000, outputTokens: 5_000, cacheWriteTokens: 20_000, cacheReadTokens: 0 },
    rate
  );
  assert.ok(Math.abs(first - (1_000 * 4 + 25_000 * 4 + 5_000 * 20) / 1e6) < 1e-9);
  // The next level reads the same 20,000 from cache.
  const next = claudeCostWithCache(
    { inputTokens: 21_000, outputTokens: 5_000, cacheWriteTokens: 0, cacheReadTokens: 20_000 },
    rate
  );
  assert.ok(Math.abs(next - (1_000 * 4 + 2_000 * 4 + 5_000 * 20) / 1e6) < 1e-9);
  // No cache fields: same as the plain price.
  assert.equal(
    claudeCostWithCache({ inputTokens: 21_000, outputTokens: 5_000 }, rate),
    claudeCost(21_000, 5_000, rate)
  );
});
