// Who may write a lesson.
//
// Authoring is staff-only: every lesson is a paid model call, and in a school
// the teaching library is a published artefact rather than a scratchpad. RLS on
// space_lessons enforces the same rule in Postgres (see
// 20260904181544_space_lessons.sql) — this exists so the API answers with a
// real status code and a sentence a teacher can act on, instead of a policy
// violation.
//
// Shared by all three lesson routes, which are otherwise unrelated.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Space } from "@/types/database";

export type LessonAuthor =
  | { ok: true; userId: string; space: Space }
  | { ok: false; status: number; error: string };

export async function authorizeLessonAuthor(
  supabase: SupabaseClient<Database>,
  spaceId: string
): Promise<LessonAuthor> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "You need to be signed in." };
  }

  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("id", spaceId)
    .maybeSingle();

  // Indistinguishable from "not allowed to see it", which is the point.
  if (!space) {
    return { ok: false, status: 404, error: "Space not found." };
  }

  if (space.space_type !== "lessons") {
    return { ok: false, status: 400, error: "That isn't a Lessons space." };
  }

  const { data: membership } = await supabase
    .from("community_memberships")
    .select("role, status")
    .eq("community_id", space.community_id)
    .eq("user_id", user.id)
    .maybeSingle();

  const isStaff =
    membership?.status === "active" &&
    (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");

  if (!isStaff) {
    return {
      ok: false,
      status: 403,
      error: "Only teachers and staff can write lessons here.",
    };
  }

  return { ok: true, userId: user.id, space };
}
