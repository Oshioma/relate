import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Resource } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getSpaceResources(supabase: Client, spaceId: string): Promise<Resource[]> {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
