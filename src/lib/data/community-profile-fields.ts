import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityProfileField, CommunityProfileValue } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCommunityProfileFields(supabase: Client, communityId: string): Promise<CommunityProfileField[]> {
  const { data, error } = await supabase
    .from("community_profile_fields")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type ProfileFieldWithValue = CommunityProfileField & { value: CommunityProfileValue["value"] };

// Every field the community defines, paired with this member's answer (or
// `null` if they haven't filled it in). Used both to render a read-only
// view of someone else's answers and to pre-fill the edit form on your own.
export async function getCommunityProfileFieldsWithValues(
  supabase: Client,
  communityId: string,
  profileId: string
): Promise<ProfileFieldWithValue[]> {
  const [{ data: fields, error: fieldsError }, { data: values, error: valuesError }] = await Promise.all([
    supabase.from("community_profile_fields").select("*").eq("community_id", communityId).order("sort_order", { ascending: true }),
    supabase.from("community_profile_values").select("*").eq("community_id", communityId).eq("profile_id", profileId),
  ]);

  if (fieldsError) throw fieldsError;
  if (valuesError) throw valuesError;

  const valueByField = new Map((values ?? []).map((row) => [row.field_id, row.value]));

  return (fields ?? []).map((field) => ({ ...field, value: valueByField.get(field.id) ?? null }));
}
