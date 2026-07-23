import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PlaceDefaultSpace } from "@/types/database";

type Client = SupabaseClient<Database>;

// The super-admin-configured default spaces for the Place-Based Community
// template, in display order. The creation wizard seeds a new place
// community's spaces from these (falling back to the code defaults in
// src/lib/community-templates.ts if the table is empty).
export async function getPlaceDefaultSpaces(supabase: Client): Promise<PlaceDefaultSpace[]> {
  const { data, error } = await supabase
    .from("place_default_spaces")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
