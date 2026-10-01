// Gathers the rows behind the platform admin's "Usage & costs" tab and prices
// them. Reads with the service-role client — callers must have verified the
// viewer is a super admin first.
//
// Aggregated in JS rather than SQL for now: the platform writes lessons and
// transcribes videos in the hundreds, not millions, and the rows asked for are
// a handful of numbers each (lesson text is measured in the database by
// lesson_usage_rows, never shipped). ROW_CAP bounds the worst case; past it
// the page says the figures are partial rather than quietly under-reporting.
// When that starts happening, move the sums into a SQL function.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  periodStart,
  summariseUsage,
  type LessonUsageRow,
  type UsagePeriod,
  type UsageSummary,
  type VideoUsageRow,
} from "@/lib/usage/costs";
import { getUsageRates } from "@/lib/usage/pricing";

const ROW_CAP = 20_000;
// PostgREST caps a single response (1,000 rows on Supabase by default), so
// rows are read in pages of this size up to ROW_CAP.
const PAGE = 1_000;
const TOP_COMMUNITIES = 20;

export class UsageNotInstalledError extends Error {}

export type UsageReport = {
  summary: UsageSummary;
  rates: ReturnType<typeof getUsageRates>;
  communityNames: Record<string, { name: string; slug: string }>;
  truncated: { lessons: boolean; videos: boolean };
  rowCap: number;
  topCommunities: number;
};

// Postgres "undefined_function" / "undefined_column", and PostgREST's own
// "not in the schema cache" codes: all mean the migration isn't pushed yet.
function isNotInstalled(error: { code?: string } | null): boolean {
  return Boolean(error?.code && ["42883", "42703", "PGRST202", "PGRST204"].includes(error.code));
}

async function readPages<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { code?: string; message: string } | null }>
): Promise<{ rows: T[]; truncated: boolean }> {
  const rows: T[] = [];
  for (let from = 0; from < ROW_CAP; from += PAGE) {
    const { data, error } = await fetchPage(from, Math.min(from + PAGE, ROW_CAP) - 1);
    if (error) {
      if (isNotInstalled(error)) throw new UsageNotInstalledError(error.message);
      throw new Error(error.message);
    }
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return { rows, truncated: false };
  }
  return { rows, truncated: true };
}

export async function getUsageReport(
  admin: SupabaseClient<Database>,
  period: UsagePeriod
): Promise<UsageReport> {
  const since = periodStart(period)?.toISOString() ?? null;

  const [lessons, videos] = await Promise.all([
    readPages<LessonUsageRow>((from, to) =>
      admin.rpc("lesson_usage_rows", { p_since: since, p_limit: ROW_CAP }).range(from, to)
    ),
    readPages<VideoUsageRow>((from, to) => {
      let query = admin
        .from("lesson_video_jobs")
        .select("community_id, status, method, duration_seconds, audio_seconds, download_bytes, proxied")
        .order("created_at", { ascending: false })
        .order("id")
        .range(from, to);
      if (since) query = query.gte("created_at", since);
      return query;
    }),
  ]);

  const rates = getUsageRates();
  const summary = summariseUsage(lessons.rows, videos.rows, rates);

  const ids = summary.byCommunity.slice(0, TOP_COMMUNITIES).map((c) => c.communityId);
  const communityNames: UsageReport["communityNames"] = {};
  if (ids.length > 0) {
    const { data } = await admin.from("communities").select("id, name, slug").in("id", ids);
    for (const c of data ?? []) communityNames[c.id] = { name: c.name, slug: c.slug };
  }

  return {
    summary,
    rates,
    communityNames,
    truncated: { lessons: lessons.truncated, videos: videos.truncated },
    rowCap: ROW_CAP,
    topCommunities: TOP_COMMUNITIES,
  };
}
