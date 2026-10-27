import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// A family's marks on one 64 Arts board, keyed by art number. RLS returns only
// the caller's own rows, so a guest (or a failed read) simply gets an empty
// board rather than an error page.
export type ArtMark = {
  done: boolean;
  note: string | null;
  photoUrls: string[];
  videoUrls: string[];
  sharedPostId: string | null;
};
export type ArtsBoardMarks = Record<number, ArtMark>;

export async function getArtsBoardMarks(supabase: Client, spaceId: string, userId: string | null): Promise<ArtsBoardMarks> {
  const marks: ArtsBoardMarks = {};
  if (!userId) return marks;

  const { data, error } = await supabase
    .from("arts_board_marks")
    .select("art_number, done, note, photo_urls, video_urls, shared_post_id")
    .eq("space_id", spaceId)
    .eq("user_id", userId);

  if (error) {
    console.error("Could not read arts board marks", error);
    return marks;
  }
  for (const row of data ?? []) {
    marks[row.art_number] = {
      done: row.done,
      note: row.note,
      photoUrls: row.photo_urls ?? [],
      videoUrls: row.video_urls ?? [],
      sharedPostId: row.shared_post_id,
    };
  }
  return marks;
}

// Where "Share" posts a done square: the community's first discussion space
// (by nav order) that this member can post in. RLS already hides spaces they
// can't see; broadcast-only spaces need staff, and paid spaces are skipped
// rather than risk a post the paywall refuses.
export type ArtsShareTarget = { id: string; name: string; slug: string };

export async function getArtsShareTarget(supabase: Client, communityId: string, isStaff: boolean): Promise<ArtsShareTarget | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("id, name, slug, staff_post_only, price_cents")
    .eq("community_id", communityId)
    .eq("space_type", "discussion")
    .order("sort_order", { ascending: true });
  if (error) return null;
  const target = (data ?? []).find((s) => (isStaff || !s.staff_post_only) && !s.price_cents);
  return target ? { id: target.id, name: target.name, slug: target.slug } : null;
}
