import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SpaceJournalField, SpaceJournalEntry, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type JournalEntryWithAuthor = SpaceJournalEntry & { author: Profile };

export async function getSpaceJournalFields(supabase: Client, spaceId: string): Promise<SpaceJournalField[]> {
  const { data, error } = await supabase
    .from("space_journal_fields")
    .select("*")
    .eq("space_id", spaceId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Grouped fetch for the admin page: one query for every journal space in
// the community, rather than N+1 per-space round trips.
export async function getJournalFieldsBySpaceIds(supabase: Client, spaceIds: string[]): Promise<Record<string, SpaceJournalField[]>> {
  if (spaceIds.length === 0) return {};

  const { data, error } = await supabase
    .from("space_journal_fields")
    .select("*")
    .in("space_id", spaceIds)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const grouped: Record<string, SpaceJournalField[]> = {};
  for (const field of data ?? []) {
    (grouped[field.space_id] ??= []).push(field);
  }
  return grouped;
}

export async function getSpaceJournalEntries(supabase: Client, spaceId: string): Promise<JournalEntryWithAuthor[]> {
  const { data, error } = await supabase
    .from("space_journal_entries")
    .select("*, author:author_id (*)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as JournalEntryWithAuthor[];
}
