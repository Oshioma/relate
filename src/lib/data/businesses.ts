import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Business } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getSpaceBusinesses(supabase: Client, spaceId: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("space_id", spaceId)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
