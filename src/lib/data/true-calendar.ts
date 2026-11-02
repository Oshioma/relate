import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import { EMPTY_BUNDLE } from "@/lib/true-calendar/research/daily";
import { IMPORT_SECTIONS, type CalendarClaimSource, type CalendarTable } from "@/lib/true-calendar/research/model";

type Client = SupabaseClient<Database>;

// The True Calendar's research, read under RLS: readers get published rows;
// researchers would also get drafts, so every reader-facing query filters to
// 'published' explicitly. Researchers see drafts only on the research page.

const published = "published";

/** Everything the calendar needs to say what a day means. Small: rule rows,
 * not dates. Errors (e.g. the tables not migrated yet) read as "no research". */
export async function getResearchBundle(supabase: Client): Promise<ResearchBundle> {
  const [cultures, systems, cycles, positions, observances, meanings, recommendations, correspondences] = await Promise.all([
    supabase.from("calendar_cultures").select("*").eq("review_status", published).order("sort_order"),
    supabase.from("calendar_systems").select("*").eq("review_status", published),
    supabase.from("calendar_cycles").select("*").eq("review_status", published),
    supabase.from("calendar_cycle_positions").select("*").eq("review_status", published),
    supabase.from("calendar_observances").select("*").eq("review_status", published),
    supabase.from("calendar_meanings").select("*").eq("review_status", published),
    supabase.from("calendar_recommendations").select("*").eq("review_status", published),
    supabase.from("calendar_date_correspondences").select("*").eq("review_status", published).not("gregorian_from", "is", null),
  ]);
  if (cultures.error) return EMPTY_BUNDLE;
  return {
    cultures: cultures.data ?? [],
    systems: systems.data ?? [],
    cycles: cycles.data ?? [],
    positions: positions.data ?? [],
    observances: observances.data ?? [],
    meanings: meanings.data ?? [],
    recommendations: recommendations.data ?? [],
    correspondences: correspondences.data ?? [],
  };
}

export async function getCultureCatalogue(supabase: Client) {
  const [cultures, systems] = await Promise.all([
    supabase.from("calendar_cultures").select("*").eq("review_status", published).order("sort_order"),
    supabase.from("calendar_systems").select("key, culture_key, kind, name").eq("review_status", published),
  ]);
  return { cultures: cultures.data ?? [], systems: systems.data ?? [] };
}

/** One culture and everything published about it, with the sources each claim cites. */
export async function getCultureHistory(supabase: Client, cultureKey: string) {
  const { data: culture } = await supabase.from("calendar_cultures").select("*").eq("key", cultureKey).eq("review_status", published).maybeSingle();
  if (!culture) return null;
  const { data: systems } = await supabase.from("calendar_systems").select("*").eq("culture_key", cultureKey).eq("review_status", published);
  const systemKeys = (systems ?? []).map((s) => s.key);
  const inSystems = <T,>(q: T) => q;
  const [cycles, months, lunarDays, observances, meanings, recommendations, correspondences] = await Promise.all([
    systemKeys.length ? supabase.from("calendar_cycles").select("*").in("system_key", systemKeys).eq("review_status", published) : inSystems({ data: [] }),
    systemKeys.length ? supabase.from("calendar_months").select("*").in("system_key", systemKeys).eq("review_status", published).order("ordinal") : inSystems({ data: [] }),
    systemKeys.length ? supabase.from("calendar_lunar_days").select("*").in("system_key", systemKeys).eq("review_status", published).order("day_number") : inSystems({ data: [] }),
    supabase.from("calendar_observances").select("*").eq("culture_key", cultureKey).eq("review_status", published),
    supabase.from("calendar_meanings").select("*").eq("culture_key", cultureKey).eq("review_status", published),
    supabase.from("calendar_recommendations").select("*").eq("culture_key", cultureKey).eq("review_status", published),
    supabase.from("calendar_date_correspondences").select("*").eq("culture_key", cultureKey).eq("review_status", published).order("gregorian_from"),
  ]);
  const cycleKeys = (cycles.data ?? []).map((c) => c.key);
  const positions = cycleKeys.length
    ? (await supabase.from("calendar_cycle_positions").select("*").in("cycle_key", cycleKeys).eq("review_status", published).order("position")).data ?? []
    : [];

  // Citations for every claim on the page, and the sources they point at.
  const claimKeys = [
    cultureKey,
    ...systemKeys,
    ...cycleKeys,
    ...positions.map((p) => p.key),
    ...(months.data ?? []).map((m) => m.key),
    ...(lunarDays.data ?? []).map((d) => d.key),
    ...(observances.data ?? []).map((o) => o.key),
    ...(meanings.data ?? []).map((m) => m.key),
    ...(recommendations.data ?? []).map((r) => r.key),
    ...(correspondences.data ?? []).map((c) => c.key),
  ];
  const citations: CalendarClaimSource[] = [];
  for (let i = 0; i < claimKeys.length; i += 200) {
    const { data } = await supabase.from("calendar_claim_sources").select("*").in("claim_key", claimKeys.slice(i, i + 200));
    citations.push(...(data ?? []));
  }
  const sourceKeys = [...new Set([...citations.map((c) => c.source_key), ...(cycles.data ?? []).map((c) => c.anchor_source_key).filter((k): k is string => Boolean(k))])];
  const sources = sourceKeys.length ? (await supabase.from("calendar_sources").select("*").in("key", sourceKeys)).data ?? [] : [];

  return {
    culture,
    systems: systems ?? [],
    cycles: cycles.data ?? [],
    positions,
    months: months.data ?? [],
    lunarDays: lunarDays.data ?? [],
    observances: observances.data ?? [],
    meanings: meanings.data ?? [],
    recommendations: recommendations.data ?? [],
    correspondences: correspondences.data ?? [],
    citations,
    sources,
  };
}

export type CultureHistory = NonNullable<Awaited<ReturnType<typeof getCultureHistory>>>;

/** Is this person allowed to import and publish research? */
export async function getResearcherRole(supabase: Client, userId: string | null): Promise<"reviewer" | "researcher" | null> {
  if (!userId) return null;
  const [{ data: profile }, { data: row }] = await Promise.all([
    supabase.from("profiles").select("is_super_admin").eq("id", userId).maybeSingle(),
    supabase.from("calendar_researchers").select("role").eq("user_id", userId).maybeSingle(),
  ]);
  if (profile?.is_super_admin) return "reviewer";
  return row?.role ?? null;
}

/** Current rows for the keys an import mentions, and which claims already cite a source. */
export async function getExistingForImport(supabase: Client, keys: Record<CalendarTable, Set<string>>) {
  const rows: Partial<Record<CalendarTable, Map<string, Record<string, unknown>>>> = {};
  const citedClaims = new Set<string>();
  for (const { table } of IMPORT_SECTIONS) {
    const list = [...keys[table]];
    const map = new Map<string, Record<string, unknown>>();
    for (let i = 0; i < list.length; i += 200) {
      const { data, error } = await supabase.from(table).select("*").in("key", list.slice(i, i + 200));
      if (error) throw new Error(`Could not read ${table}: ${error.message}`);
      for (const row of (data ?? []) as Array<Record<string, unknown>>) map.set(String(row.key), row);
    }
    rows[table] = map;
    if (table !== "calendar_sources" && list.length) {
      for (let i = 0; i < list.length; i += 200) {
        const { data } = await supabase.from("calendar_claim_sources").select("claim_table, claim_key").eq("claim_table", table).eq("relation", "supports").in("claim_key", list.slice(i, i + 200));
        for (const c of data ?? []) citedClaims.add(`${c.claim_table}|${c.claim_key}`);
      }
    }
  }
  return { rows, citedClaims };
}

export interface ReviewItem {
  table: CalendarTable;
  key: string;
  label: string;
  status: string;
  /** Supporting citations on record; publishing needs at least one (sources and catalogue-only cultures excepted). */
  supporting: number;
  /** The culture this record belongs to, by key prefix ("" for sources). */
  cultureKey: string;
}

const LABEL_FIELDS = ["name", "title", "label", "historical_practice", "meaning"] as const;

/** Every record not yet published, for researchers and reviewers. */
export async function getReviewQueue(supabase: Client): Promise<{ items: ReviewItem[]; cultureNames: Map<string, string> }> {
  const { data: allCultures } = await supabase.from("calendar_cultures").select("key, name");
  const cultureNames = new Map((allCultures ?? []).map((c) => [c.key, c.name]));
  const cultureKeys = [...cultureNames.keys()].sort((a, b) => b.length - a.length);
  const cultureOf = (key: string) => cultureKeys.find((c) => key === c || key.startsWith(`${c}.`)) ?? "";

  const items: ReviewItem[] = [];
  for (const { table } of IMPORT_SECTIONS) {
    const { data } = await supabase.from(table).select("*").neq("review_status", "published").order("key").limit(1000);
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    if (rows.length === 0) continue;
    const keys = rows.map((r) => String(r.key));
    const counts = new Map<string, number>();
    if (table !== "calendar_sources") {
      for (let i = 0; i < keys.length; i += 200) {
        const { data: cites } = await supabase.from("calendar_claim_sources").select("claim_key").eq("claim_table", table).eq("relation", "supports").in("claim_key", keys.slice(i, i + 200));
        for (const c of cites ?? []) counts.set(c.claim_key, (counts.get(c.claim_key) ?? 0) + 1);
      }
    }
    for (const r of rows) {
      const key = String(r.key);
      const field = LABEL_FIELDS.find((f) => typeof r[f] === "string" && r[f]);
      const label = table === "calendar_lunar_days" ? `Day ${r.day_number}${r.name ? `: ${r.name}` : ""}` : field ? String(r[field]) : key;
      items.push({
        table,
        key,
        label: label.length > 120 ? `${label.slice(0, 117)}…` : label,
        status: String(r.review_status),
        supporting: counts.get(key) ?? 0,
        cultureKey: table === "calendar_sources" ? "" : cultureOf(table === "calendar_cultures" ? key : String(r.culture_key ?? key)),
      });
    }
  }
  return { items, cultureNames };
}

export async function getRecentImportRuns(supabase: Client, limit = 10) {
  const { data } = await supabase.from("calendar_import_runs").select("*").order("created_at", { ascending: false }).limit(limit);
  return data ?? [];
}

/** For each research file that ships with the app: how much of it is not yet in the database. */
export async function getBundledResearchStatus(supabase: Client) {
  const { BUNDLED_RESEARCH } = await import("@/lib/true-calendar/research/bundled");
  const { parseImport, planImport, keysMentioned } = await import("@/lib/true-calendar/research/import-plan");
  return Promise.all(
    BUNDLED_RESEARCH.map(async (b) => {
      const { file, errors } = parseImport(await b.load());
      if (!file) return { id: b.id, title: b.title, description: b.description, ok: false, problems: errors.length, toWrite: 0, total: 0 };
      try {
        const plan = planImport(file, await getExistingForImport(supabase, keysMentioned(file)));
        const toWrite = plan.sections.reduce((n, s) => n + s.insert.length + s.update.length, 0);
        const total = plan.sections.reduce((n, s) => n + s.insert.length + s.update.length + s.unchanged.length, 0);
        return { id: b.id, title: b.title, description: b.description, ok: plan.ok, problems: plan.errors.length, toWrite, total };
      } catch {
        return { id: b.id, title: b.title, description: b.description, ok: false, problems: 1, toWrite: 0, total: 0 };
      }
    })
  );
}

export type BundledResearchStatus = Awaited<ReturnType<typeof getBundledResearchStatus>>[number];
