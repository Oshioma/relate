// =============================================================================
// BRINGING A SEEDED RECORD'S TEXT AND PICTURES UP TO DATE
//
// "Check for corrections" has always fixed dates, restored missing records and
// topped up missing pictures. It could not do three things a dataset change
// often needs:
//
//   * rewrite a record's title, summary or description,
//   * remove a picture the dataset has dropped or replaced,
//   * correct a picture's caption, accession number or other details.
//
// So a merged correction reached a community only halfway, and the rest had to
// be fixed by hand in the database. That happened with the Okomilo update and
// again with the Brief 07 picture clean-up.
//
// THE RULE THAT MAKES IT SAFE is the one the date refresh already follows: never
// overwrite what a person here wrote. The trigger on timeline_events records
// every change in timeline_revisions, so "has a person edited this field?" is a
// question the history can answer exactly. Two kinds of change are NOT a
// person's edit, and both are recognised here:
//
//   * a change carrying seed_synced_at. The refresh writes that column in the
//     same UPDATE as its correction, so its revisions carry the key and a
//     person's never do. See the seed_sync_marker migrations.
//   * a picture top-up written before that marker existed. Those revisions only
//     ever APPENDED pictures copied in by the seeder (under
//     `<user>/timeline/<slug>-<hash>`) and labelled existing ones with `shows`.
//     A change that does only that is recognisably the machine's; anything
//     else — a removal, a new caption, an uploaded photograph — is a person's.
//
// Both fail closed. A change that cannot be shown to be the machine's is
// treated as a person's, and the field is left alone.
// =============================================================================

import { pictureName } from "./bring-in-image";

/** The text columns the refresh keeps in step with the seed. */
export const SYNCED_TEXT_FIELDS = ["title", "summary", "description"] as const;
export type SyncedTextField = (typeof SYNCED_TEXT_FIELDS)[number];

export type EventRevision = {
  actor_id: string | null;
  changes: Record<string, { from?: unknown; to?: unknown }> | null;
};

type Picture = { url?: string | null; [key: string]: unknown };

/** The stem a seeded copy is stored under: `<slug>-<hash>`, or `<slug>-<n>` from before the hash. */
function storedStem(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = /\/timeline\/([^/?#]+)\.(?:jpg|jpeg|png|webp|gif)(?:[?#].*)?$/i.exec(url);
  return match ? match[1] : null;
}

/**
 * WAS THIS PICTURE PUT HERE BY THE SEEDER?
 *
 * The seeder files every copy under `<user>/timeline/<slug>-<8 hex>` (and,
 * before that, `<slug>-<position>`). A person's upload goes to
 * `<user>/<uuid>-<name>` with no `/timeline/` in it, so the two cannot be
 * confused. A picture still pointing at Wikimedia because its copy failed is
 * NOT recognised here, on purpose: a person can paste one of those too.
 */
export function isSeededCopy(url: string | null | undefined, slug: string): boolean {
  const stem = storedStem(url);
  if (!stem || !stem.startsWith(`${slug}-`)) return false;
  return /^(?:[0-9a-f]{8}|\d+)$/.test(stem.slice(slug.length + 1));
}

/**
 * WAS THIS CHANGE TO `media` ONLY THE OLD TOP-UP AT WORK?
 *
 * True when nothing was removed, every picture that was there is still there
 * with at most a `shows` label added, and everything new is a seeded copy for
 * this record. That is exactly what the top-up and the classifier wrote, and
 * nothing a person does through the form looks like it.
 */
export function isTopUpOnly(from: unknown, to: unknown, slug: string): boolean {
  const before = Array.isArray(from) ? (from as Picture[]) : [];
  const after = Array.isArray(to) ? (to as Picture[]) : null;
  if (!after) return false;
  // ONE AFTER-ITEM PER BEFORE-ITEM. The top-up could list the same file twice
  // (a second caption for one stored copy), so matching by address alone would
  // compare a picture with its twin and call an append a person's edit.
  const unclaimed = [...after];
  for (const item of before) {
    const index = unclaimed.findIndex((now) => {
      if ((now.url ?? "") !== (item.url ?? "")) return false;
      const keys = new Set([...Object.keys(item), ...Object.keys(now)]);
      for (const key of keys) {
        if (key === "shows" && item.shows == null) continue;
        if (JSON.stringify(item[key]) !== JSON.stringify(now[key])) return false;
      }
      return true;
    });
    if (index === -1) return false;
    unclaimed.splice(index, 1);
  }
  // Whatever is left was added, and the top-up only ever added seeded copies.
  return unclaimed.every((item) => isSeededCopy(item.url, slug));
}

/**
 * WHICH FIELDS OF ONE RECORD A PERSON HAS EDITED.
 *
 * Read from the record's `updated` revisions. A revision with no actor was
 * written outside the app — a migration or a maintenance script — and is not a
 * person's edit. One carrying seed_synced_at is the refresh's own.
 */
export function fieldsEditedByAPerson(revisions: EventRevision[], slug: string): Set<string> {
  const edited = new Set<string>();
  for (const revision of revisions) {
    if (!revision.actor_id || !revision.changes) continue;
    if (Object.prototype.hasOwnProperty.call(revision.changes, "seed_synced_at")) continue;
    for (const [field, change] of Object.entries(revision.changes)) {
      if (field === "media" && isTopUpOnly(change?.from, change?.to, slug)) continue;
      // The top-up also filled an EMPTY cover with a seeded copy.
      if (field === "image_url" && change?.from == null && isSeededCopy(change?.to as string, slug)) continue;
      edited.add(field);
    }
  }
  return edited;
}

/**
 * THE TEXT CHANGES THE SEED ASKS FOR, LESS ANY A PERSON HAS OVERRIDDEN.
 *
 * `patch` is what to write; `kept` names the fields that differ from the seed
 * but were left alone because somebody here edited them.
 */
export function reconcileEventText(
  stored: Record<SyncedTextField, string | null | undefined>,
  seed: Record<SyncedTextField, string | null | undefined>,
  edited: Set<string>
): { patch: Partial<Record<SyncedTextField, string>>; kept: SyncedTextField[] } {
  const patch: Partial<Record<SyncedTextField, string>> = {};
  const kept: SyncedTextField[] = [];
  for (const field of SYNCED_TEXT_FIELDS) {
    const want = seed[field];
    if (want == null || (stored[field] ?? "") === want) continue;
    if (edited.has(field)) kept.push(field);
    else patch[field] = want;
  }
  return { patch, kept };
}

/** Compare two addresses without tripping over how they were percent-encoded. */
function sameAddress(a: unknown, b: unknown): boolean {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  const normalise = (value: string) => {
    try {
      return decodeURIComponent(value).replace(/ /g, "_");
    } catch {
      return value;
    }
  };
  return normalise(a) === normalise(b);
}

type SeedPictureLike = { url: string; caption?: string; creditFrom?: string; [key: string]: unknown };

/** The seeded picture a stored copy was made from, read off the name it was stored under. */
function matchByStoredName<T extends SeedPictureLike>(item: Picture, slug: string, seed: T[]): T | undefined {
  const stem = storedStem(item.url);
  return stem ? seed.find((candidate) => pictureName(slug, candidate.url) === stem) : undefined;
}

/** Which seeded picture a stored one is, by what it says about itself. */
function matchByDetails<T extends SeedPictureLike>(item: Picture, seed: T[]): T | undefined {
  return (
    seed.find((candidate) => sameAddress(item.originalFileUrl, candidate.originalFileUrl)) ??
    seed.find((candidate) => sameAddress(item.sourcePageUrl, candidate.sourcePageUrl)) ??
    seed.find((candidate) => sameAddress(item.url, candidate.url)) ??
    seed.find((candidate) => {
      const caption = typeof item.caption === "string" ? item.caption.trim() : "";
      return caption.length > 0 && caption === (candidate.caption ?? "").trim();
    })
  );
}

/** Key order is not a difference. */
function samePicture(a: Picture, b: Picture): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) return false;
  }
  return true;
}

/**
 * A RECORD'S PICTURES, BROUGHT INTO LINE WITH WHAT THE SEED NOW SAYS.
 *
 * Call it only when no person has edited the record's pictures. Then:
 *
 *   * a picture that is a copy of a seeded one takes the seed's details —
 *     caption, accession number, provenance — keeping its own stored address
 *     and the credit worked out when it was copied in;
 *   * a seeded copy the seed no longer lists is removed;
 *   * anything else (a picture still hotlinked, one from elsewhere) is kept
 *     exactly as it is, in its place.
 *
 * Pictures the seed has gained are NOT added here; the top-up that runs after
 * this does that, with its budget.
 *
 * The cover follows: if it was a seeded copy and the seed's cover is among the
 * pictures that remain, it points at that; if it was a seeded copy that has
 * gone, it is cleared so the top-up can bring the seed's cover in.
 */
export function reconcileSeededPictures<T extends SeedPictureLike>(args: {
  slug: string;
  stored: { image_url: string | null; media: Picture[] };
  seed: { imageUrl?: string | null; media?: T[] };
}): { image_url: string | null; media: Picture[]; removed: number; corrected: number; changed: boolean } {
  const { slug, stored } = args;
  const seedMedia = args.seed.media ?? [];
  const media: Picture[] = [];
  const used = new Set<T>();
  let removed = 0;
  let corrected = 0;
  let coverUrl: string | null = null;

  // A COPY NAMED AFTER ITS SOURCE WINS. Copies stored under the older
  // positional names (`<slug>-1`) were overwritten in place when a later
  // top-up reused the position, so their bytes may be a different photograph
  // from the details they carry. A hash-named copy is a function of the source
  // address and cannot have that problem — so where both stand for the same
  // seeded picture, the hash-named one is kept and the other is the duplicate.
  const byName = stored.media.map((item) => matchByStoredName(item, slug, seedMedia));
  const claimedByName = new Set(byName.filter((match): match is T => Boolean(match)));

  for (const [index, item] of stored.media.entries()) {
    const named = byName[index];
    const detailed = named ? undefined : matchByDetails(item, seedMedia);
    const match = named ?? (detailed && !claimedByName.has(detailed) ? detailed : undefined);
    if (match && !used.has(match)) {
      used.add(match);
      // The seed's details, with the two things that belong to the copy: where
      // it is stored, and the credit resolved when it was brought in.
      const { url: seedUrl, creditFrom, ...details } = match;
      const next: Picture = { ...details, url: item.url };
      if (creditFrom === "source" && item.credit !== undefined) next.credit = item.credit;
      if (next.shows === undefined && item.shows !== undefined) next.shows = item.shows;
      if (!samePicture(item, next)) corrected++;
      media.push(next);
      if (args.seed.imageUrl && seedUrl === args.seed.imageUrl) coverUrl = item.url ?? null;
      continue;
    }
    if (isSeededCopy(item.url, slug)) {
      removed++;
      continue;
    }
    media.push(item);
  }

  let image_url = stored.image_url;
  if (isSeededCopy(stored.image_url, slug)) {
    const stillThere = media.some((item) => item.url === stored.image_url);
    image_url = coverUrl ?? (stillThere ? stored.image_url : null);
  }

  const changed = removed > 0 || corrected > 0 || image_url !== stored.image_url;
  return { image_url, media, removed, corrected, changed };
}
