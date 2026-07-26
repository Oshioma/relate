import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Crop } from "@/types/database";

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
