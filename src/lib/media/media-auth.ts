// Who may add to a Books & Media shelf.
//
// Any active member: in a homeschool the parents are the reviewers. RLS on
// space_media_items enforces the same rule in Postgres (see the
// space_media_items migration) — this exists so the API and the actions can
// answer with a real status code and a sentence somebody can act on, instead
// of a policy violation. Staff standing is reported too, for the edit/delete
// decisions that go beyond "may add".

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Space } from "@/types/database";

export type MediaMember =
  | { ok: true; userId: string; space: Space; isStaff: boolean }
  | { ok: false; status: number; error: string };

export async function authorizeMediaMember(supabase: SupabaseClient<Database>, spaceId: string): Promise<MediaMember> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "You need to be signed in." };
  }

  const { data: space } = await supabase.from("spaces").select("*").eq("id", spaceId).maybeSingle();

  // Indistinguishable from "not allowed to see it", which is the point.
  if (!space) {
    return { ok: false, status: 404, error: "Space not found." };
  }

  if (space.space_type !== "books_media") {
    return { ok: false, status: 400, error: "That isn't a Books & Media space." };
  }

  const { data: membership } = await supabase
    .from("community_memberships")
    .select("role, status")
    .eq("community_id", space.community_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membership?.status !== "active") {
    return { ok: false, status: 403, error: "Join this community to add to its shelf." };
  }

  const isStaff = membership.role === "owner" || membership.role === "admin" || membership.role === "moderator";
  return { ok: true, userId: user.id, space, isStaff };
}
