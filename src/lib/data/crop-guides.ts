import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Crop,
  CropVariety,
  CropCompanion,
  CropPest,
  CropDisease,
  CropRegion,
  CropCalendar,
  CommunityCropRegion,
  CropGrowingJournal,
  CropCommunityTip,
  Profile,
} from "@/types/database";

type Client = SupabaseClient<Database>;

// Crops are platform-global reference records, not space-scoped — every
// community's Crop Guides space reads from the same published library. RLS
// already limits SELECT to published rows (plus drafts for super admins), so
// these functions don't re-filter by status.

// Lightweight shape for list/card rendering — the full narrative jsonb is only
// needed on the detail page.
export type CropListItem = Pick<
  Crop,
  | "id"
  | "slug"
  | "common_name"
  | "scientific_name"
  | "category"
  | "difficulty"
  | "beginner_friendly"
  | "time_to_maturity_days"
  | "sun"
  | "water_need"
  | "pollinator_friendly"
  | "nitrogen_fixer"
  | "organic_favourite"
  | "image_url"
  | "overview"
>;

const LIST_COLUMNS =
  "id, slug, common_name, scientific_name, category, difficulty, beginner_friendly, time_to_maturity_days, sun, water_need, pollinator_friendly, nitrogen_fixer, organic_favourite, image_url, overview";

export async function getCrops(supabase: Client): Promise<CropListItem[]> {
  const { data, error } = await supabase
    .from("crops")
    .select(LIST_COLUMNS)
    .order("common_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CropListItem[];
}

export async function getCropBySlug(supabase: Client, slug: string): Promise<Crop | null> {
  const { data, error } = await supabase.from("crops").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

// A companion row plus the slug of the companion crop when it exists in the
// library, so the companion-planting graph can link between crop pages.
export type CropCompanionWithLink = CropCompanion & { companion_slug: string | null };

export type CropDetail = {
  crop: Crop;
  varieties: CropVariety[];
  companions: CropCompanionWithLink[];
  pests: CropPest[];
  diseases: CropDisease[];
};

export async function getCropDetail(supabase: Client, slug: string): Promise<CropDetail | null> {
  const crop = await getCropBySlug(supabase, slug);
  if (!crop) return null;

  const [{ data: varieties, error: vErr }, { data: companions, error: cErr }, { data: pests, error: pErr }, { data: diseases, error: dErr }] =
    await Promise.all([
      supabase.from("crop_varieties").select("*").eq("crop_id", crop.id).order("sort_order", { ascending: true }),
      supabase
        .from("crop_companions")
        .select("*, companion:companion_crop_id (slug)")
        .eq("crop_id", crop.id)
        .order("sort_order", { ascending: true }),
      supabase.from("crop_pests").select("*").eq("crop_id", crop.id).order("sort_order", { ascending: true }),
      supabase.from("crop_diseases").select("*").eq("crop_id", crop.id).order("sort_order", { ascending: true }),
    ]);

  if (vErr) throw vErr;
  if (cErr) throw cErr;
  if (pErr) throw pErr;
  if (dErr) throw dErr;

  const companionsWithLink: CropCompanionWithLink[] = (companions ?? []).map((row) => {
    const { companion, ...rest } = row as CropCompanion & { companion: { slug: string } | null };
    return { ...rest, companion_slug: companion?.slug ?? null };
  });

  return {
    crop,
    varieties: varieties ?? [],
    companions: companionsWithLink,
    pests: pests ?? [],
    diseases: diseases ?? [],
  };
}

// --- Region-aware planting calendars ----------------------------------------

export async function getCropRegions(supabase: Client): Promise<CropRegion[]> {
  const { data, error } = await supabase.from("crop_regions").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// A community's own growing regions (Zanzibar, Kenya Highlands, …). Returns []
// for a guest or non-member — RLS limits reads to members.
export async function getCommunityCropRegions(supabase: Client, communityId: string): Promise<CommunityCropRegion[]> {
  const { data, error } = await supabase
    .from("community_crop_regions")
    .select("*")
    .eq("community_id", communityId)
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Every calendar row for one crop across all regions — small enough to fetch in
// one query and filter by region on the client (no refetch when switching).
export async function getCropCalendar(supabase: Client, cropId: string): Promise<CropCalendar[]> {
  const { data, error } = await supabase.from("crop_calendars").select("*").eq("crop_id", cropId);
  if (error) throw error;
  return data ?? [];
}

// One month's slice across every crop, for the "What can I grow now?" panel.
// Indexed on (region_id, month); the client filters by the selected region.
export type MonthCalendarRow = Pick<CropCalendar, "crop_id" | "region_id" | "activity">;

export async function getCurrentMonthCalendar(supabase: Client, month: number): Promise<MonthCalendarRow[]> {
  const { data, error } = await supabase.from("crop_calendars").select("crop_id, region_id, activity").eq("month", month);
  if (error) throw error;
  return (data ?? []) as MonthCalendarRow[];
}

// --- Community power: journals, tips, saves ---------------------------------

export type JournalWithAuthor = CropGrowingJournal & { author: Profile | null };

export async function getCropJournals(supabase: Client, cropId: string, communityId: string): Promise<JournalWithAuthor[]> {
  const { data, error } = await supabase
    .from("crop_growing_journals")
    .select("*, author:user_id (*)")
    .eq("crop_id", cropId)
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as JournalWithAuthor[];
}

export type JournalStats = {
  growerCount: number;
  entryCount: number;
  avgYieldKg: number | null;
  avgDaysToHarvest: number | null;
  topVariety: { name: string; avgRating: number; count: number } | null;
};

// Aggregate journal entries into the headline stats shown on the crop page.
// Computed in JS (like the guide-ratings aggregation) — the caller has already
// read the community's entries via RLS.
export function computeJournalStats(journals: CropGrowingJournal[]): JournalStats {
  const growers = new Set(journals.map((j) => j.user_id));

  const yields = journals.map((j) => j.yield_kg).filter((v): v is number => v != null);
  const avgYieldKg = yields.length ? yields.reduce((s, v) => s + v, 0) / yields.length : null;

  const spans = journals
    .filter((j) => j.planted_on && j.harvested_on)
    .map((j) => (new Date(j.harvested_on as string).getTime() - new Date(j.planted_on as string).getTime()) / 86400000)
    .filter((d) => d >= 0);
  const avgDaysToHarvest = spans.length ? Math.round(spans.reduce((s, v) => s + v, 0) / spans.length) : null;

  // Highest-rated variety: group rated entries by variety, rank by average.
  const byVariety = new Map<string, number[]>();
  for (const j of journals) {
    if (!j.variety || j.success_rating == null) continue;
    const list = byVariety.get(j.variety) ?? [];
    list.push(j.success_rating);
    byVariety.set(j.variety, list);
  }
  let topVariety: JournalStats["topVariety"] = null;
  for (const [name, ratings] of byVariety) {
    const avg = ratings.reduce((s, v) => s + v, 0) / ratings.length;
    if (!topVariety || avg > topVariety.avgRating) {
      topVariety = { name, avgRating: avg, count: ratings.length };
    }
  }

  return { growerCount: growers.size, entryCount: journals.length, avgYieldKg, avgDaysToHarvest, topVariety };
}

export type TipWithAuthor = CropCommunityTip & { author: Profile | null };

// Regional tips visible to the viewer (RLS returns approved tips plus the
// viewer's own / staff's pending ones).
export async function getCropTips(supabase: Client, cropId: string, communityId: string): Promise<TipWithAuthor[]> {
  const { data, error } = await supabase
    .from("crop_community_tips")
    .select("*, author:created_by (*)")
    .eq("crop_id", cropId)
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as TipWithAuthor[];
}

// The set of crop ids the viewer has saved (empty for a guest).
export async function getSavedCropIds(supabase: Client, userId: string): Promise<string[]> {
  const { data, error } = await supabase.from("crop_saves").select("crop_id").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.crop_id);
}
