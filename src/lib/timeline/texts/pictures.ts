// THE ARCHIVE'S PICTURES, COPIED INTO THE COMMUNITY'S OWN STORAGE.
//
// A corpus file names each picture by its address at Wikimedia or a museum.
// Pointing a reader's browser at that address is fragile (bring-in-image.ts
// explains why), so after an import the pictures are copied into the
// community's storage and the row's url is switched to the copy. The original
// address stays in the corpus file and the catalogue page in source_page_url,
// so nothing about where a picture came from is lost.
//
// WHICH PICTURES. Oshi decided on 2026-10-17 to copy every picture the archive
// shows: open and attribution licences, share-alike, the non-commercial museum
// images (copied with credit and licence, for the community's own educational
// use), and the two Unas wall photographs whose public-domain claim on Commons
// is not established ("for history's sake"). Their captions and licence fields
// already say all of that. Only a picture marked 'restricted' stays a link.
//
// THE MARKERS' PICTURES TOO. The timeline markers this library creates carry
// pictures of their own (the inventory's anchor events). Those are copied by
// the same button, with the timeline's own rules (hotlinkedPicturesToBringIn,
// withBroughtInPictures): only the address changes, provenance is kept, and
// the cover follows its gallery twin.
//
// A COPY IS NAMED FOR WHAT IT IS A COPY OF: the image key and a hash of the
// source address. A re-import that finds a row already holding the copy of
// the same address keeps it; a corpus file that points a key at a new address
// gets a new copy.

import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  bringImageIn,
  hotlinkedPicturesToBringIn,
  isHotlinked,
  pictureName,
  withBroughtInPictures,
} from "../bring-in-image";
import type { SeedPicture } from "../seed-types";
import { INVENTORY } from "./inventory";

type Client = SupabaseClient<Database>;

export const COPIED_LICENCE_STATUSES = ["open", "attribution", "share_alike", "non_commercial", "unknown"] as const;

/** Time one call may spend downloading before it returns and lets the page call again. */
export const PICTURE_COPY_BUDGET_MS = 40_000;

export function copiedPictureName(importKey: string, sourceUrl: string): string {
  const hash = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 10);
  return `texts-${importKey.replace(/[^a-z0-9-]/gi, "-")}-${hash}`;
}

/** Is this stored address our copy of that source? */
export function isCopyOf(storedUrl: string | null | undefined, importKey: string, sourceUrl: string): boolean {
  if (!storedUrl || isHotlinked(storedUrl)) return false;
  return storedUrl.includes(`/${copiedPictureName(importKey, sourceUrl)}.`);
}

/**
 * For rows about to be upserted: keep the copy already stored for the same
 * key and source, so a re-import does not point the row back at Wikimedia.
 */
export async function keepCopiedPictures<T extends { import_key: string; url: string }>(
  supabase: Client,
  communityId: string,
  rows: T[]
): Promise<T[]> {
  if (rows.length === 0) return rows;
  const { data } = await supabase
    .from("timeline_passage_images")
    .select("import_key, url")
    .eq("community_id", communityId)
    .in(
      "import_key",
      rows.map((row) => row.import_key)
    );
  const stored = new Map((data ?? []).map((row) => [row.import_key, row.url]));
  return rows.map((row) => {
    const existing = stored.get(row.import_key);
    return isCopyOf(existing, row.import_key, row.url) ? { ...row, url: existing! } : row;
  });
}

export type PictureCopyResult = {
  copied: number;
  failed: { key: string; reason: string }[];
  /** Pictures still pointing elsewhere that a further call would try. */
  remaining: number;
};

/** The slugs of the markers this library creates. */
export const MARKER_SLUGS: string[] = INVENTORY.flatMap((work) =>
  work.anchor && "event" in work.anchor ? [work.anchor.event.slug] : []
);

/** One picture still pointing at somebody else's server. */
export type PictureToCopy =
  | { kind: "passage"; id: string; import_key: string; url: string }
  | { kind: "marker"; id: string; import_key: string; url: string; slug: string };

/** Pictures in this community still pointing at somebody else's server. */
export async function picturesToCopy(supabase: Client, communityId: string): Promise<PictureToCopy[]> {
  const { data, error } = await supabase
    .from("timeline_passage_images")
    .select("id, import_key, url")
    .eq("community_id", communityId)
    .in("licence_status", [...COPIED_LICENCE_STATUSES]);
  if (error) throw new Error(`pictures: ${error.message}`);
  const passages = (data ?? [])
    .filter((row) => isHotlinked(row.url))
    .map((row) => ({ kind: "passage" as const, ...row }));

  const { data: markers, error: markerError } = await supabase
    .from("timeline_events")
    .select("id, slug, image_url, media")
    .eq("community_id", communityId)
    .in("slug", MARKER_SLUGS);
  if (markerError) throw new Error(`marker pictures: ${markerError.message}`);
  const markerPictures = (markers ?? []).flatMap((row) =>
    hotlinkedPicturesToBringIn({ image_url: row.image_url, media: (row.media ?? []) as SeedPicture[] }).urls.map(
      (url) => ({ kind: "marker" as const, id: row.id, slug: row.slug, import_key: `${row.slug}:${url}`, url })
    )
  );
  return [...passages, ...markerPictures];
}

/** Copy one marker picture in and point the record at the copy, re-reading it first. */
async function copyMarkerPicture(
  supabase: Client,
  userId: string,
  job: Extract<PictureToCopy, { kind: "marker" }>
): Promise<string | null> {
  const brought = await bringImageIn(supabase, { url: job.url, userId, name: pictureName(job.slug, job.url) });
  if ("reason" in brought) return brought.reason;
  const { data: record, error } = await supabase.from("timeline_events").select("image_url, media").eq("id", job.id).single();
  if (error || !record) return `stored, but the marker could not be read: ${error?.message}`;
  const next = withBroughtInPictures(
    { image_url: record.image_url, media: (record.media ?? []) as SeedPicture[] },
    new Map([[job.url, brought.url]])
  );
  const { error: updateError } = await supabase
    .from("timeline_events")
    .update({ image_url: next.image_url, media: next.media })
    .eq("id", job.id);
  return updateError ? `stored, but the marker could not be updated: ${updateError.message}` : null;
}

/**
 * Copy as many as fit in the time budget. `skip` lists keys that already
 * failed in this session, so one picture that cannot be fetched does not stop
 * the rest.
 */
export async function copyArchivePictures(
  supabase: Client,
  communityId: string,
  userId: string,
  { skip = [], budgetMs = PICTURE_COPY_BUDGET_MS }: { skip?: string[]; budgetMs?: number } = {}
): Promise<PictureCopyResult> {
  const started = Date.now();
  const pending = (await picturesToCopy(supabase, communityId)).filter((row) => !skip.includes(row.import_key));
  const result: PictureCopyResult = { copied: 0, failed: [], remaining: pending.length };
  for (const row of pending) {
    if (Date.now() - started > budgetMs) break;
    if (row.kind === "marker") {
      result.remaining -= 1;
      const failed = await copyMarkerPicture(supabase, userId, row);
      if (failed) result.failed.push({ key: row.import_key, reason: failed });
      else result.copied += 1;
      continue;
    }
    const brought = await bringImageIn(supabase, { url: row.url, userId, name: copiedPictureName(row.import_key, row.url) });
    result.remaining -= 1;
    if ("reason" in brought) {
      result.failed.push({ key: row.import_key, reason: brought.reason });
      continue;
    }
    const { error } = await supabase.from("timeline_passage_images").update({ url: brought.url }).eq("id", row.id);
    if (error) result.failed.push({ key: row.import_key, reason: `stored, but the row could not be updated: ${error.message}` });
    else result.copied += 1;
  }
  return result;
}
