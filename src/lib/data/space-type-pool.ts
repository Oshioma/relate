import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunitySpaceType, SpaceType } from "@/types/database";
import { SPACE_TYPE_LIST } from "@/lib/space-types";

type Client = SupabaseClient<Database>;

// The full list of space types, in code order. Handy default for callers that
// resolve a Record<SpaceType, boolean> against every known type.
const ALL_SPACE_TYPES: SpaceType[] = SPACE_TYPE_LIST.map((t) => t.type);

// Platform-wide default pool (used for new communities, and as the fallback
// for any community without an explicit override). Missing rows/keys default
// to enabled — today's behavior, where every type is available.
export async function getSpaceTypeDefaults(supabase: Client): Promise<Record<SpaceType, boolean>> {
  const { data, error } = await supabase.from("space_type_defaults").select("space_type, enabled");
  if (error) throw error;

  const defaults = Object.fromEntries(ALL_SPACE_TYPES.map((t) => [t, true])) as Record<SpaceType, boolean>;
  for (const row of data ?? []) {
    defaults[row.space_type as SpaceType] = row.enabled;
  }
  return defaults;
}

// The resolved pool for one community: which space types its admins may add.
// An explicit community_space_types override wins, otherwise the platform
// default, otherwise enabled.
export async function getCommunitySpaceTypePool(supabase: Client, communityId: string): Promise<Record<SpaceType, boolean>> {
  const [defaults, overridesResult] = await Promise.all([
    getSpaceTypeDefaults(supabase),
    supabase.from("community_space_types").select("space_type, enabled").eq("community_id", communityId),
  ]);
  if (overridesResult.error) throw overridesResult.error;

  const resolved = { ...defaults };
  for (const row of overridesResult.data ?? []) {
    resolved[row.space_type as SpaceType] = row.enabled;
  }
  return resolved;
}

// The space types a community may add right now, as a list in code order —
// what the "add a space" picker offers.
export async function getAllowedSpaceTypes(supabase: Client, communityId: string): Promise<SpaceType[]> {
  const pool = await getCommunitySpaceTypePool(supabase, communityId);
  return ALL_SPACE_TYPES.filter((t) => pool[t]);
}

// Every explicit per-community override, for the platform admin's community
// list — resolution happens client-side against getSpaceTypeDefaults.
export async function getAllCommunitySpaceTypeOverrides(supabase: Client): Promise<CommunitySpaceType[]> {
  const { data, error } = await supabase.from("community_space_types").select("*");
  if (error) throw error;
  return data ?? [];
}
