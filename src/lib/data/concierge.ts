import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { formatDate } from "@/lib/utils";

type Client = SupabaseClient<Database>;

export interface ConciergeQueryLogEntry {
  id: string;
  query: string;
  resultCount: number;
  hadAnswer: boolean;
  createdAt: string;
  user: { username: string; fullName: string | null; avatarUrl: string | null } | null;
}

// Fire-and-forget logging so a DB hiccup never blocks a member's search —
// swallow errors rather than surfacing them to the searcher.
export async function logConciergeQuery(
  supabase: Client,
  communityId: string,
  userId: string | null,
  query: string,
  resultCount: number,
  hadAnswer: boolean,
): Promise<void> {
  try {
    await supabase.from("concierge_queries").insert({
      community_id: communityId,
      user_id: userId,
      query,
      result_count: resultCount,
      had_answer: hadAnswer,
    });
  } catch {
    // best-effort logging only
  }
}

export async function getConciergeQueries(supabase: Client, communityId: string, limit = 100): Promise<ConciergeQueryLogEntry[]> {
  const { data, error } = await supabase
    .from("concierge_queries")
    .select("id, query, result_count, had_answer, created_at, user:user_id (username, full_name, avatar_url)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    query: row.query,
    resultCount: row.result_count,
    hadAnswer: row.had_answer,
    createdAt: row.created_at,
    user: row.user ? { username: row.user.username, fullName: row.user.full_name, avatarUrl: row.user.avatar_url } : null,
  }));
}

export type ConciergeResultType =
  | "business"
  | "event"
  | "guide"
  | "marketplace_listing"
  | "job_listing"
  | "accommodation_listing"
  | "volunteer_project"
  | "club"
  | "recommendation"
  | "landmark"
  | "post";

export interface ConciergeResult {
  type: ConciergeResultType;
  id: string;
  title: string;
  snippet: string | null;
  extra: string | null;
  href: string;
}

export interface ConciergeResults {
  query: string;
  resultsByType: Partial<Record<ConciergeResultType, ConciergeResult[]>>;
  totalCount: number;
  // Layer 2 (AI synthesis) fills this in after searchCommunity returns —
  // always null here since this module is DB-only.
  answer: string | null;
}

const RESULTS_PER_TYPE = 5;

// No dedicated search index/migration for this first pass — plain ILIKE
// across each type's title/description-equivalent columns, split on
// whitespace so a multi-word question like "quiet beaches" matches rows
// containing either word rather than requiring the exact phrase. Good
// enough at community scale; a tsvector + GIN index is the natural upgrade
// if search ever needs ranking or runs on much larger data.
function orIlike(columns: string[], query: string): string {
  const words = query
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);
  const terms = words.length > 0 ? words : [query];
  return columns.flatMap((col) => terms.map((term) => `${col}.ilike.%${term}%`)).join(",");
}

function truncate(text: string | null, length = 140): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  return trimmed.length > length ? `${trimmed.slice(0, length)}…` : trimmed;
}

export async function searchCommunity(supabase: Client, communityId: string, communitySlug: string, query: string): Promise<ConciergeResults> {
  const q = query.trim();
  if (!q) {
    return { query: q, resultsByType: {}, totalCount: 0, answer: null };
  }

  const base = `/c/${communitySlug}`;

  const [businesses, events, guides, listings, jobs, accommodation, volunteerProjects, clubs, recommendations, landmarks, posts] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, description, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["name", "description"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("events")
      .select("id, title, description, start_time")
      .eq("community_id", communityId)
      .or(orIlike(["title", "description"], q))
      .order("start_time", { ascending: true })
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("guides")
      .select("id, title, body, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["title", "body"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("marketplace_listings")
      .select("id, title, description, price, currency, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["title", "description"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("job_listings")
      .select("id, title, description, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["title", "description"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("accommodation_listings")
      .select("id, name, description, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["name", "description"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("volunteer_projects")
      .select("id, title, description, category, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["title", "description", "category"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("clubs")
      .select("id, name, description, category, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["name", "description", "category"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("recommendations")
      .select("id, title, note, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["title", "note"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("landmarks")
      .select("id, name, description, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["name", "description"], q))
      .limit(RESULTS_PER_TYPE),
    supabase
      .from("posts")
      .select("id, title, body, space:space_id (slug)")
      .eq("community_id", communityId)
      .or(orIlike(["title", "body"], q))
      .order("created_at", { ascending: false })
      .limit(RESULTS_PER_TYPE),
  ]);

  const resultsByType: Partial<Record<ConciergeResultType, ConciergeResult[]>> = {};

  if (businesses.data?.length) {
    resultsByType.business = businesses.data.map((b) => ({
      type: "business",
      id: b.id,
      title: b.name,
      snippet: truncate(b.description),
      extra: null,
      href: `${base}/spaces/${b.space?.slug ?? ""}`,
    }));
  }

  if (events.data?.length) {
    resultsByType.event = events.data.map((e) => ({
      type: "event",
      id: e.id,
      title: e.title,
      snippet: truncate(e.description),
      extra: formatDate(e.start_time),
      href: `${base}/events`,
    }));
  }

  if (guides.data?.length) {
    resultsByType.guide = guides.data.map((g) => ({
      type: "guide",
      id: g.id,
      title: g.title,
      snippet: truncate(g.body),
      extra: null,
      href: `${base}/spaces/${g.space?.slug ?? ""}/guides/${g.id}`,
    }));
  }

  if (listings.data?.length) {
    resultsByType.marketplace_listing = listings.data.map((l) => ({
      type: "marketplace_listing",
      id: l.id,
      title: l.title,
      snippet: truncate(l.description),
      extra: l.price !== null ? `${l.currency ?? ""} ${l.price}`.trim() : null,
      href: `${base}/spaces/${l.space?.slug ?? ""}`,
    }));
  }

  if (jobs.data?.length) {
    resultsByType.job_listing = jobs.data.map((j) => ({
      type: "job_listing",
      id: j.id,
      title: j.title,
      snippet: truncate(j.description),
      extra: null,
      href: `${base}/spaces/${j.space?.slug ?? ""}`,
    }));
  }

  if (accommodation.data?.length) {
    resultsByType.accommodation_listing = accommodation.data.map((a) => ({
      type: "accommodation_listing",
      id: a.id,
      title: a.name,
      snippet: truncate(a.description),
      extra: null,
      href: `${base}/spaces/${a.space?.slug ?? ""}`,
    }));
  }

  if (volunteerProjects.data?.length) {
    resultsByType.volunteer_project = volunteerProjects.data.map((v) => ({
      type: "volunteer_project",
      id: v.id,
      title: v.title,
      snippet: truncate(v.description),
      extra: v.category,
      href: `${base}/spaces/${v.space?.slug ?? ""}`,
    }));
  }

  if (clubs.data?.length) {
    resultsByType.club = clubs.data.map((c) => ({
      type: "club",
      id: c.id,
      title: c.name,
      snippet: truncate(c.description),
      extra: c.category,
      href: `${base}/spaces/${c.space?.slug ?? ""}`,
    }));
  }

  if (recommendations.data?.length) {
    resultsByType.recommendation = recommendations.data.map((r) => ({
      type: "recommendation",
      id: r.id,
      title: r.title,
      snippet: truncate(r.note),
      extra: null,
      href: `${base}/spaces/${r.space?.slug ?? ""}`,
    }));
  }

  if (landmarks.data?.length) {
    resultsByType.landmark = landmarks.data.map((l) => ({
      type: "landmark",
      id: l.id,
      title: l.name,
      snippet: truncate(l.description),
      extra: null,
      href: `${base}/spaces/${l.space?.slug ?? ""}`,
    }));
  }

  if (posts.data?.length) {
    resultsByType.post = posts.data.map((p) => ({
      type: "post",
      id: p.id,
      title: p.title,
      snippet: truncate(p.body),
      extra: null,
      href: `${base}/spaces/${p.space?.slug ?? ""}/posts/${p.id}`,
    }));
  }

  const totalCount = Object.values(resultsByType).reduce((sum, list) => sum + (list?.length ?? 0), 0);

  return { query: q, resultsByType, totalCount, answer: null };
}
