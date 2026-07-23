import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityFeature, FeatureKey } from "@/types/database";
import { COMMUNITY_FEATURES } from "@/lib/features";

type Client = SupabaseClient<Database>;

// Platform-wide default (used for new communities, and as the fallback for
// any existing community without an explicit override). Missing rows/keys
// default to enabled — today's always-on behavior.
export async function getFeatureDefaults(supabase: Client): Promise<Record<FeatureKey, boolean>> {
  const { data, error } = await supabase.from("feature_defaults").select("feature_key, enabled");
  if (error) throw error;

  const defaults = Object.fromEntries(COMMUNITY_FEATURES.map((f) => [f.key, true])) as Record<FeatureKey, boolean>;
  for (const row of data ?? []) {
    defaults[row.feature_key as FeatureKey] = row.enabled;
  }
  return defaults;
}

// Resolved feature state for one community: an explicit override wins,
// otherwise falls back to the platform default.
export async function getCommunityFeatures(supabase: Client, communityId: string): Promise<Record<FeatureKey, boolean>> {
  const [defaults, overridesResult] = await Promise.all([
    getFeatureDefaults(supabase),
    supabase.from("community_features").select("feature_key, enabled").eq("community_id", communityId),
  ]);
  if (overridesResult.error) throw overridesResult.error;

  const resolved = { ...defaults };
  for (const row of overridesResult.data ?? []) {
    resolved[row.feature_key as FeatureKey] = row.enabled;
  }
  return resolved;
}

// Every explicit per-community override, for the platform admin's community
// list — resolution happens client-side against getFeatureDefaults.
export async function getAllCommunityFeatureOverrides(supabase: Client): Promise<CommunityFeature[]> {
  const { data, error } = await supabase.from("community_features").select("*");
  if (error) throw error;
  return data ?? [];
}
