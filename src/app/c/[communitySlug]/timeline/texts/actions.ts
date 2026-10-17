"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership, isCommunityStaff } from "@/lib/data/community";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { importWorkChunk, installLibrary, type ChunkResult, type InstallResult } from "@/lib/timeline/texts/importer";
import { textsPath } from "@/lib/timeline/texts/paths";
import { copyArchivePictures, type PictureCopyResult } from "@/lib/timeline/texts/pictures";

// Staff-only, like every seeder: the archive is a curated import, and RLS on
// the archive tables refuses anyone else. Checking here first turns a
// permission error into a sentence.
async function requireStaff(communitySlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." } as const;
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return { error: "This community doesn't have a timeline." } as const;
  const membership = await getMembership(supabase, community.id, user.id);
  if (!isCommunityStaff(community, membership, user.id)) return { error: "Only staff can import the text archive." } as const;
  return { supabase, community, userId: user.id };
}

export async function installArchiveLibrary(communitySlug: string): Promise<{ error: string } | { ok: true; result: InstallResult }> {
  const context = await requireStaff(communitySlug);
  if ("error" in context) return { error: context.error! };
  try {
    const result = await installLibrary(context.supabase, context.community, context.userId);
    revalidatePath(textsPath(communitySlug));
    return { ok: true, result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

/** One chunk. The page calls again until `done`; a failed call can simply be retried. */
export async function importArchiveWork(
  communitySlug: string,
  workKey: string,
  restart = false
): Promise<{ error: string } | { ok: true; result: ChunkResult }> {
  const context = await requireStaff(communitySlug);
  if ("error" in context) return { error: context.error! };
  try {
    const result = await importWorkChunk(context.supabase, context.community, context.userId, workKey, { restart });
    if (result.done) revalidatePath(textsPath(communitySlug));
    return { ok: true, result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Copy the archive's pictures into the community's storage, as many as fit in
 * one call. The page calls again while `remaining` is above zero, passing the
 * keys that failed so they are not retried in the same session.
 */
export async function copyArchivePicturesAction(
  communitySlug: string,
  skip: string[] = []
): Promise<{ error: string } | { ok: true; result: PictureCopyResult }> {
  const context = await requireStaff(communitySlug);
  if ("error" in context) return { error: context.error! };
  try {
    const result = await copyArchivePictures(context.supabase, context.community.id, context.userId, { skip });
    if (result.remaining === 0) revalidatePath(textsPath(communitySlug));
    return { ok: true, result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
