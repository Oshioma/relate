import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MediaConcern, SpaceMediaItem } from "@/types/database";
import { MediaConcernSchema, isMediaKind, isMediaVerdict, isProfanityLevel, type MediaItemRow, type SharedMediaItem } from "@/lib/media/media-types";

type Client = SupabaseClient<Database>;

// Items are space-scoped, and RLS already limits every read to spaces the
// caller can view (including anonymously, for a public space) — so none of
// these re-check membership. The actions that WRITE do.

const WITH_CREATOR = "*, creatorProfile:created_by (full_name, username, avatar_url)";

function toRow(row: SpaceMediaItem & { creatorProfile?: MediaItemRow["creatorProfile"] }): MediaItemRow {
  return { ...row, concerns: cleanConcerns(row.concerns), creatorProfile: row.creatorProfile ?? null };
}

// jsonb comes back untyped; anything that isn't a concern is dropped rather
// than rendered as "[object Object]".
export function cleanConcerns(value: unknown): MediaConcern[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((c) => {
    const parsed = MediaConcernSchema.safeParse(c);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getSpaceMediaItems(supabase: Client, spaceId: string): Promise<MediaItemRow[]> {
  const { data, error } = await supabase
    .from("space_media_items")
    .select(WITH_CREATOR)
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as unknown as (SpaceMediaItem & { creatorProfile: MediaItemRow["creatorProfile"] })[]).map(toRow);
}

export async function getMediaItem(supabase: Client, itemId: string): Promise<MediaItemRow | null> {
  const { data, error } = await supabase.from("space_media_items").select(WITH_CREATOR).eq("id", itemId).maybeSingle();
  if (error) throw error;
  return data ? toRow(data as unknown as SpaceMediaItem & { creatorProfile: MediaItemRow["creatorProfile"] }) : null;
}

// Whether this shelf already has a review of this link.
export async function findMediaItemByLinkKey(supabase: Client, spaceId: string, linkKey: string): Promise<MediaItemRow | null> {
  const { data, error } = await supabase
    .from("space_media_items")
    .select(WITH_CREATOR)
    .eq("space_id", spaceId)
    .eq("link_key", linkKey)
    .maybeSingle();
  if (error) throw error;
  return data ? toRow(data as unknown as SpaceMediaItem & { creatorProfile: MediaItemRow["creatorProfile"] }) : null;
}

// What other communities have shared. Reads through a SECURITY DEFINER
// function (see the space_media_items migration), so this is the one read
// that sees past RLS — and it only ever returns rows marked as shared.
export async function getSharedMediaItemsFromOtherCommunities(supabase: Client, communityId: string): Promise<SharedMediaItem[]> {
  const { data, error } = await supabase.rpc("shared_media_items_from_other_communities", { p_community_id: communityId, p_limit: 300 });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    community_id: row.community_id,
    community_name: row.community_name,
    community_slug: row.community_slug,
    url: row.url,
    kind: isMediaKind(row.kind) ? row.kind : "other",
    title: row.title,
    creator: row.creator,
    description: row.description,
    image_url: row.image_url,
    age_min: row.age_min,
    age_max: row.age_max,
    verdict: isMediaVerdict(row.verdict) ? row.verdict : "suitable",
    reason: row.reason,
    profanity: isProfanityLevel(row.profanity) ? row.profanity : "unknown",
    concerns: cleanConcerns(row.concerns),
    themes: row.themes ?? [],
    created_at: row.created_at,
  }));
}
