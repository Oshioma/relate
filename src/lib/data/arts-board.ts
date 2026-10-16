import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// A family's marks on one 64 Arts board, keyed by art number. RLS returns only
// the caller's own rows, so a guest (or a failed read) simply gets an empty
// board rather than an error page.
export type ArtsBoardMarks = Record<number, { done: boolean; note: string | null }>;

export async function getArtsBoardMarks(supabase: Client, spaceId: string, userId: string | null): Promise<ArtsBoardMarks> {
  const marks: ArtsBoardMarks = {};
  if (!userId) return marks;

  const { data, error } = await supabase
    .from("arts_board_marks")
    .select("art_number, done, note")
    .eq("space_id", spaceId)
    .eq("user_id", userId);

  if (error) {
    console.error("Could not read arts board marks", error);
    return marks;
  }
  for (const row of data ?? []) marks[row.art_number] = { done: row.done, note: row.note };
  return marks;
}
