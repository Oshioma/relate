import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityFeature, FeatureKey } from "@/types/database";
import { COMMUNITY_FEATURES } from "@/lib/features";

type Client = SupabaseClient<Database>;

// One feature's resolved two-level state, for the community owner's admin UI.
export type FeatureControl = {
  key: FeatureKey;
  label: string;
  description: string;
  // Whether the super admin permits this feature for the community.
  available: boolean;
  // The owner's own on/off choice (defaults to on when they haven't set it).
  ownerEnabled: boolean;
  // available && ownerEnabled — what actually shows in the nav.
  effective: boolean;
};

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

// AVAILABILITY (super admin layer): which features the community may use.
// An explicit community_features override wins, otherwise the platform
// default, otherwise enabled.
export async function getCommunityFeatureAvailability(supabase: Client, communityId: string): Promise<Record<FeatureKey, boolean>> {
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

// The community owner's own on/off preferences. A missing row means "on",
// so this returns only explicit choices — undefined means "not set".
async function getCommunityFeaturePrefs(supabase: Client, communityId: string): Promise<Partial<Record<FeatureKey, boolean>>> {
  const { data, error } = await supabase
    .from("community_feature_prefs")
    .select("feature_key, enabled")
    .eq("community_id", communityId);
  if (error) throw error;

  const prefs: Partial<Record<FeatureKey, boolean>> = {};
  for (const row of data ?? []) {
    prefs[row.feature_key as FeatureKey] = row.enabled;
  }
  return prefs;
}

// EFFECTIVE feature state for one community — what the nav actually shows.
// A feature is on only when the super admin permits it AND the owner hasn't
// turned it off.
export async function getCommunityFeatures(supabase: Client, communityId: string): Promise<Record<FeatureKey, boolean>> {
  const [availability, prefs] = await Promise.all([
    getCommunityFeatureAvailability(supabase, communityId),
    getCommunityFeaturePrefs(supabase, communityId),
  ]);

  const resolved = { ...availability };
  for (const { key } of COMMUNITY_FEATURES) {
    resolved[key] = availability[key] && (prefs[key] ?? true);
  }
  return resolved;
}

// Both layers per feature, for the community owner's admin toggles.
export async function getCommunityFeatureControls(supabase: Client, communityId: string): Promise<FeatureControl[]> {
  const [availability, prefs] = await Promise.all([
    getCommunityFeatureAvailability(supabase, communityId),
    getCommunityFeaturePrefs(supabase, communityId),
  ]);

  return COMMUNITY_FEATURES.map(({ key, label, description }) => {
    const available = availability[key];
    const ownerEnabled = prefs[key] ?? true;
    return { key, label, description, available, ownerEnabled, effective: available && ownerEnabled };
  });
}

// Every explicit per-community override, for the platform admin's community
// list — resolution happens client-side against getFeatureDefaults.
export async function getAllCommunityFeatureOverrides(supabase: Client): Promise<CommunityFeature[]> {
  const { data, error } = await supabase.from("community_features").select("*");
  if (error) throw error;
  return data ?? [];
}
