import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PlatformSettings } from "@/types/database";

type Client = SupabaseClient<Database>;

// The one-row (id = 1) platform legal settings — Terms & Privacy. RLS makes the
// row world-readable, so this is safe with the user-scoped client (including for
// signed-out visitors on /terms and /privacy). Returns null only if the seed row
// is somehow missing.
export async function getPlatformSettings(supabase: Client): Promise<PlatformSettings | null> {
  const { data, error } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data ?? null;
}
