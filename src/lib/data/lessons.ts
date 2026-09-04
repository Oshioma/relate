import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SpaceLesson } from "@/types/database";
import { toLessonRow, type LessonRow } from "@/lib/school/lesson-types";

type Client = SupabaseClient<Database>;

// Lessons are space-scoped, and RLS already limits every read to spaces the
// caller can view (including anonymously, for a public space) — so none of
// these re-check membership. The callers that WRITE do, because authoring is
// staff-only and RLS is the backstop, not the message.

export async function getSpaceLessons(supabase: Client, spaceId: string): Promise<LessonRow[]> {
  const { data, error } = await supabase
    .from("space_lessons")
    .select("*, creator:created_by (full_name, username)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as unknown as SpaceLesson[]).map(toLessonRow);
}

export async function getLesson(supabase: Client, lessonId: string): Promise<LessonRow | null> {
  const { data, error } = await supabase
    .from("space_lessons")
    .select("*, creator:created_by (full_name, username)")
    .eq("id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data ? toLessonRow(data as unknown as SpaceLesson) : null;
}

// How many lessons this space holds, for the space list and nav counts.
export async function countSpaceLessons(supabase: Client, spaceId: string): Promise<number> {
  const { count, error } = await supabase
    .from("space_lessons")
    .select("id", { count: "exact", head: true })
    .eq("space_id", spaceId);

  if (error) throw error;
  return count ?? 0;
}
