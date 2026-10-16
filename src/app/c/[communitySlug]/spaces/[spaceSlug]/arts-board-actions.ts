"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isArtNumber } from "@/lib/arts/sixty-four-arts";

// A family's tick and note on one square of a 64 Arts board: one row per
// family per art, written over. A cleared tick with no note removes the row
// rather than leaving an empty one behind.
//
// Re-checks that the caller is an active member of the board's community
// rather than trusting the UI; RLS refuses the write regardless.
export async function setArtMark(
  spaceId: string,
  artNumber: number,
  mark: { done: boolean; note: string },
  communitySlug: string,
  spaceSlug: string
): Promise<{ error: string | null }> {
  if (!isArtNumber(artNumber)) return { error: "That isn't one of the 64 arts." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: space } = await supabase.from("spaces").select("id, community_id, space_type").eq("id", spaceId).maybeSingle();
  if (!space || space.space_type !== "arts_board") return { error: "Board not found." };

  const { data: membership } = await supabase
    .from("community_memberships")
    .select("status")
    .eq("community_id", space.community_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (membership?.status !== "active") return { error: "Join this community to keep your family's board." };

  const note = mark.note.trim().slice(0, 1000) || null;
  const { error } =
    !mark.done && !note
      ? await supabase.from("arts_board_marks").delete().eq("space_id", spaceId).eq("user_id", user.id).eq("art_number", artNumber)
      : await supabase
          .from("arts_board_marks")
          .upsert({ space_id: spaceId, user_id: user.id, art_number: artNumber, done: mark.done, note }, { onConflict: "space_id,user_id,art_number" });
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
