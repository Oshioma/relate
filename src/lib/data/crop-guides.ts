import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Crop, CropVariety, CropCompanion, CropPest, CropDisease } from "@/types/database";

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
