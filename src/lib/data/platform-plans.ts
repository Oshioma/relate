import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PlatformPlan } from "@/types/database";

type Client = SupabaseClient<Database>;

// Active plans, in display order. RLS returns active plans to everyone (and all
// plans to the super admin), so this is safe with the user-scoped client.
export async function getActivePlatformPlans(supabase: Client): Promise<PlatformPlan[]> {
  const { data, error } = await supabase
    .from("platform_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Every plan including inactive ones — for the super-admin management screen
// (RLS only returns the full set to a super admin).
export async function getAllPlatformPlans(supabase: Client): Promise<PlatformPlan[]> {
  const { data, error } = await supabase
    .from("platform_plans")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPlatformPlan(supabase: Client, planId: string): Promise<PlatformPlan | null> {
  const { data, error } = await supabase.from("platform_plans").select("*").eq("id", planId).maybeSingle();
  if (error) throw error;
  return data;
}
