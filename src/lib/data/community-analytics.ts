import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// Community analytics for the community's own owner and admins
// (/c/<slug>/admin/analytics). Everything is counted in the database by the
// community_analytics() RPC (see its migration), which also enforces who may
// read it — this module only types and normalises the jsonb it returns.

export const ANALYTICS_RANGES = [7, 30, 90] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export function parseAnalyticsRange(value: string | string[] | undefined): AnalyticsRange {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return (ANALYTICS_RANGES as readonly number[]).includes(n) ? (n as AnalyticsRange) : 30;
}

export interface AnalyticsTotals {
  activeMembers: number;
  joins: number;
  leaves: number;
  posts: number;
  comments: number;
  reactions: number;
}

export interface AnalyticsDay {
  day: string; // YYYY-MM-DD, UTC
  active: number;
  joins: number;
  leaves: number;
  posts: number;
  comments: number;
  reactions: number;
}

export interface AnalyticsSpace {
  id: string;
  name: string;
  slug: string;
  posts: number;
  comments: number;
}

export interface AnalyticsMember {
  userId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  activeDays: number;
  posts: number;
  comments: number;
  reactions: number;
}

export interface CommunityAnalytics {
  rangeDays: AnalyticsRange;
  presence: { activeToday: number; active7d: number; active30d: number; memberCount: number };
  current: AnalyticsTotals;
  previous: AnalyticsTotals;
  daily: AnalyticsDay[];
  topSpaces: AnalyticsSpace[];
  topMembers: AnalyticsMember[];
}

type Raw = Record<string, unknown>;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const arr = (v: unknown): Raw[] => (Array.isArray(v) ? v.map(obj) : []);

function totals(raw: unknown): AnalyticsTotals {
  const t = obj(raw);
  return {
    activeMembers: num(t.active_members),
    joins: num(t.joins),
    leaves: num(t.leaves),
    posts: num(t.posts),
    comments: num(t.comments),
    reactions: num(t.reactions),
  };
}

// Exported for tests: the RPC's jsonb in, typed shape out, with every missing
// or malformed field read as zero/empty rather than throwing.
export function normaliseAnalytics(raw: unknown): CommunityAnalytics {
  const r = obj(raw);
  const presence = obj(r.presence);
  const t = obj(r.totals);
  return {
    rangeDays: parseAnalyticsRange(String(r.range_days ?? "")),
    presence: {
      activeToday: num(presence.active_today),
      active7d: num(presence.active_7d),
      active30d: num(presence.active_30d),
      memberCount: num(presence.member_count),
    },
    current: totals(t.current),
    previous: totals(t.previous),
    daily: arr(r.daily).map((d) => ({
      day: str(d.day),
      active: num(d.active),
      joins: num(d.joins),
      leaves: num(d.leaves),
      posts: num(d.posts),
      comments: num(d.comments),
      reactions: num(d.reactions),
    })),
    topSpaces: arr(r.top_spaces).map((s) => ({
      id: str(s.id),
      name: str(s.name),
      slug: str(s.slug),
      posts: num(s.posts),
      comments: num(s.comments),
    })),
    topMembers: arr(r.top_members).map((m) => ({
      userId: str(m.user_id),
      name: str(m.name) || str(m.username),
      username: str(m.username),
      avatarUrl: typeof m.avatar_url === "string" ? m.avatar_url : null,
      activeDays: num(m.active_days),
      posts: num(m.posts),
      comments: num(m.comments),
      reactions: num(m.reactions),
    })),
  };
}

export async function getCommunityAnalytics(
  supabase: Client,
  communityId: string,
  range: AnalyticsRange
): Promise<CommunityAnalytics> {
  const { data, error } = await supabase.rpc("community_analytics", {
    p_community_id: communityId,
    p_days: range,
  });
  if (error) throw error;
  return normaliseAnalytics(data);
}

// Change from the previous period, for a stat tile. Null when there is nothing
// to compare against (a previous period of zero), so the tile can say "new"
// instead of an infinite percentage.
export function periodChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
