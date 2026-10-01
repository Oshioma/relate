// Lessons that were written but could not be saved.
//
// Writing a lesson is a paid model call; losing the result to a failed insert
// means paying for it twice. So a failed insert parks the complete row here,
// and "Save it now" moves it into space_lessons as written. See
// 20261001122856_unsaved_lessons.sql.
//
// The table is service-role only. Parking happens inside a request that has
// already authorised the author; saving re-checks authorship itself.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SpaceLesson } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";

type Client = SupabaseClient<Database>;

// Returns the parked row's id, or null if even parking failed — in which case
// there is nothing more to offer than the error itself.
export async function parkUnsavedLesson(entry: {
  spaceId: string;
  communityId: string;
  userId: string;
  row: Record<string, unknown>;
  error: string | null;
}): Promise<string | null> {
  try {
    const { data, error } = await createAdminClient()
      .from("unsaved_lessons")
      .insert({
        space_id: entry.spaceId,
        community_id: entry.communityId,
        created_by: entry.userId,
        row: entry.row,
        error: entry.error,
      })
      .select("id")
      .single();
    if (error || !data) {
      console.error("Could not park unsaved lesson", error);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error("Could not park unsaved lesson", error);
    return null;
  }
}

export type SaveUnsavedResult =
  | { ok: true; row: SpaceLesson }
  | { ok: false; status: number; error: string };

// Moves a parked lesson into space_lessons. Only its author may do this: the
// row is theirs, and the caller has already checked they can still write
// lessons in that space. The insert goes through the caller's own client, so
// RLS is the backstop exactly as for a freshly written lesson.
export async function saveUnsavedLesson(
  supabase: Client,
  userId: string,
  unsavedId: string
): Promise<SaveUnsavedResult> {
  const admin = createAdminClient();
  const { data: parked } = await admin
    .from("unsaved_lessons")
    .select("*")
    .eq("id", unsavedId)
    .maybeSingle();

  if (!parked || parked.created_by !== userId) {
    return { ok: false, status: 404, error: "That unsaved lesson isn't there any more." };
  }

  const row = parked.row as Database["public"]["Tables"]["space_lessons"]["Insert"];
  const insert = (values: typeof row) =>
    supabase.from("space_lessons").insert(values).select("*").single();

  let { data: saved, error } = await insert(row);
  // A column the deployed database doesn't have yet: save without the
  // optional usage figures rather than not at all.
  if (error?.code === "PGRST204") {
    const rest = { ...row } as Record<string, unknown>;
    delete rest.ai_model;
    delete rest.ai_input_tokens;
    delete rest.ai_output_tokens;
    ({ data: saved, error } = await insert(rest as typeof row));
  }

  if (error || !saved) {
    console.error("Could not save parked lesson", error);
    return { ok: false, status: 500, error: "It still couldn't be saved. Try again in a minute." };
  }

  await admin.from("unsaved_lessons").delete().eq("id", unsavedId);
  return { ok: true, row: saved as SpaceLesson };
}

// The space a parked lesson belongs to, so the route can check authorship
// before anything else.
export async function unsavedLessonSpace(unsavedId: string): Promise<string | null> {
  const { data } = await createAdminClient()
    .from("unsaved_lessons")
    .select("space_id")
    .eq("id", unsavedId)
    .maybeSingle();
  return data?.space_id ?? null;
}
