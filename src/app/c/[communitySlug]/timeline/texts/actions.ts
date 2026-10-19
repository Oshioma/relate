"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership, isCommunityStaff } from "@/lib/data/community";
import { getPassageByKey, getSourcesByIds } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { chronologyLabel, evidenceLayerLabel } from "@/lib/timeline/taxonomy";
import { OUR_TRANSLATION_LAYER_KEY } from "@/lib/timeline/texts/corpus/plain";
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

// ---------------------------------------------------------------------------
// ONE PASSAGE, OPENED IN PLACE
// ---------------------------------------------------------------------------

export type InlinePassageLayer = {
  id: string;
  heading: string;
  language: string | null;
  content: string | null;
  absentReason: string | null;
  original: boolean;
  source: { title: string; author: string | null; url: string | null; year: number | null } | null;
};

export type InlinePassage = {
  layers: InlinePassageLayer[];
  /** Pictures of this passage itself; when there are any, the full page is worth opening. */
  imageCount: number;
  /** Dates, witnesses, themes, connections or interpretations that only the full page shows. */
  moreOnFullPage: boolean;
};

/**
 * The words of one passage, for the text's contents list to open in place.
 *
 * Read as the viewer, like the pages themselves: anyone who can open the
 * passage page can read it here, and nobody else. Fetched when a passage is
 * opened rather than with the contents, because a long text has hundreds of
 * passages and a reader opens a handful.
 */
export async function readPassageInline(
  communitySlug: string,
  passageKey: string
): Promise<{ error: string } | { ok: true; passage: InlinePassage }> {
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return { error: "This community doesn't have a timeline." };
  try {
    const passage = await getPassageByKey(supabase, community.id, passageKey);
    if (!passage) return { error: "That passage isn't in the archive." };
    const sourcesById = await getSourcesByIds(supabase, passage.layers.map((l) => l.source_id ?? ""));
    const rank = (layer: string) =>
      ["primary_object", "primary_text", "transcription", "transliteration"].includes(layer)
        ? 0
        : layer === "translation"
          ? 1
          : layer === "modern_summary"
            ? 2
            : null;
    const layers = passage.layers
      .filter((l) => rank(l.layer) != null)
      .sort((a, b) => rank(a.layer)! - rank(b.layer)!)
      .map((l): InlinePassageLayer => {
        const source = l.source_id ? sourcesById.get(l.source_id) : undefined;
        return {
          id: l.id,
          heading: [
            l.import_key === OUR_TRANSLATION_LAYER_KEY ? "Our translation" : evidenceLayerLabel(l.layer),
            l.language,
            l.viewpoint ? chronologyLabel(l.viewpoint) : null,
          ]
            .filter(Boolean)
            .join(" · "),
          language: l.language,
          content: l.content,
          absentReason: l.content_absent_reason,
          original: rank(l.layer) === 0,
          source: source
            ? { title: source.title, author: source.author, url: source.url, year: source.published_year }
            : null,
        };
      });
    return {
      ok: true,
      passage: {
        layers,
        imageCount: passage.images.length,
        moreOnFullPage:
          passage.dates.length + passage.witnesses.length + passage.themes.length + passage.links.length > 0 ||
          passage.layers.some((l) => l.layer === "interpretation"),
      },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
