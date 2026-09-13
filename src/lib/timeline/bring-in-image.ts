import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { creditFor, pictureSourceFor } from "./picture-sources";

// BRINGING A PICTURE IN, RATHER THAN POINTING AT SOMEBODY ELSE'S SERVER.
//
// An <img src="https://upload.wikimedia.org/…"> is not a picture on this site.
// It is an instruction to the reader's browser to go and ask Wikimedia for one,
// and every reason that request might fail is outside our control: the file is
// renamed or deleted upstream, the host declines the referrer, a school network
// blocks the domain, the reader is offline. When it fails there is nothing to
// show and no way to tell from here that anything is wrong — which is exactly
// what happened to the Great Pyramid's photographs.
//
// So the bytes are copied once, at the moment the event is seeded, into the
// community's own storage. After that the picture is ours to serve and the
// only thing that can break it is us.
//
// WHAT THIS DOES NOT CHANGE. Copying is not permission. Only images whose
// licence allows it are ever brought in, the attribution and licence travel
// with the image in its caption (where a reader can see them, because that is a
// condition of the licence and not a courtesy), and the copy lives in the
// community's own space for its own members — not a public gallery, not a
// commercial use.

/** What we are willing to store, and the extension each type is filed under. */
const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

/** The same ceiling the in-app uploader uses. A seed should not be a way past it. */
const MAX_BYTES = 8 * 1024 * 1024;

/** Long enough for a large photograph, short enough that seeding cannot hang. */
const FETCH_TIMEOUT_MS = 20_000;

/** Is this picture already ours, or is it still pointing at somebody else's server? */
export function isHotlinked(url: string | null | undefined): boolean {
  if (!url) return false;
  const ours = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url.startsWith("http")) return false;
  return !ours || !url.startsWith(ours);
}

export type BringInResult = { url: string } | { reason: string };

/**
 * Fetch one image and put it in the community's storage.
 *
 * FAILURE COMES BACK WITH A REASON, and that is not decoration. The first
 * version returned null for everything — network refused, 403, an HTML error
 * page, a rejected upload — and the person who pressed the button was told
 * "couldn't be fetched just now", which is true of all four and useful for
 * none. There is nothing they can do with that, and nothing anyone can debug
 * from it. Four different problems need four different sentences.
 *
 * A failure is still not an error: the caller keeps the original URL, so the
 * worst case is the behaviour this replaces.
 */
export async function bringImageIn(
  supabase: SupabaseClient<Database>,
  { url, userId, name }: { url: string; userId: string; name: string }
): Promise<BringInResult> {
  if (!isHotlinked(url)) return { url };

  // The address as stored, then whatever else is worth trying for it.
  const attempts = [url, ...wikimediaAlternatives(url)];
  let firstReason: string | null = null;

  for (const attempt of attempts) {
    const result = await fetchAndStore(supabase, { url: attempt, userId, name });
    if ("url" in result) return result;
    firstReason ??= result.reason;
  }
  return { reason: firstReason ?? "that picture could not be brought in" };
}

/** One attempt at one address for the timeline: fetch it, check it, store it. */
async function fetchAndStore(
  supabase: SupabaseClient<Database>,
  { url, userId, name }: { url: string; userId: string; name: string }
): Promise<BringInResult> {
  return storeExternalImage(supabase, { url, userId, folder: "timeline", key: name });
}

/**
 * Copy one external image into the community's own storage, under
 * `<userId>/<folder>/<key>.<ext>` in the `uploads` bucket — the same per-user
 * path scheme every other upload uses, so the storage policies that already
 * exist are the ones that apply here too. Returns the stored public URL, or a
 * one-line reason it couldn't be brought in (see bringImageIn's note on why the
 * reason matters). The timeline seeds this from Wikimedia; the directory and
 * accommodation importers seed it from a business's own scraped photos.
 */
export async function storeExternalImage(
  supabase: SupabaseClient<Database>,
  {
    url,
    userId,
    folder,
    key,
    timeoutMs = FETCH_TIMEOUT_MS,
  }: { url: string; userId: string; folder: string; key: string; timeoutMs?: number }
): Promise<BringInResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      // NO CACHING. Next patches global fetch and will try to store what comes
      // back; an image is not what that cache is for, and a cache write that
      // fails on a large body would take the whole copy down with it.
      cache: "no-store",
      // A User-Agent that says who is calling and offers a way to get in touch —
      // Wikimedia's published condition for automated requests, and good manners
      // for scraping anyone else's photo too.
      headers: { "User-Agent": "Relate/1.0 (community platform; +https://github.com/Oshioma/relate)" },
    });
  } catch (error) {
    // Refused, blocked, timed out, DNS — the request never completed.
    const detail = error instanceof Error ? error.message : String(error);
    return { reason: `couldn't reach ${hostOf(url)} (${detail})` };
  }

  if (!response.ok) {
    // An error page usually says what was wrong with the request in one line,
    // and that line is worth far more than the bare status code.
    const detail = await response
      .text()
      .then((body) => body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120))
      .catch(() => "");
    return { reason: `${hostOf(url)} answered ${response.status}${detail ? ` — ${detail}` : ""}` };
  }

  const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const extension = IMAGE_TYPES.get(contentType);
  if (!extension) return { reason: `${hostOf(url)} sent ${contentType || "no content type"}, not an image` };

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    return { reason: `the download from ${hostOf(url)} broke off (${error instanceof Error ? error.message : String(error)})` };
  }
  if (bytes.byteLength === 0) return { reason: `${hostOf(url)} sent an empty file` };
  if (bytes.byteLength > MAX_BYTES) {
    return { reason: `that picture is ${Math.round(bytes.byteLength / 1024 / 1024)}MB, over the 8MB limit` };
  }

  const path = `${userId}/${folder}/${key}.${extension}`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(path, bytes, { upsert: true, contentType });
  if (error) return { reason: `storage refused the upload: ${error.message}` };

  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  if (!data.publicUrl) return { reason: "storage accepted the file but gave back no address for it" };
  return { url: data.publicUrl };
}

// A WIKIMEDIA THUMBNAIL CANNOT BE WIDER THAN THE FILE IT COMES FROM.
//
// This is the whole reason the Great Pyramid's photographs never appeared
// anywhere — not in the app, not in a browser, not once. The stored addresses
// asked upload.wikimedia.org for a 1024px thumbnail of an old upload that is
// smaller than 1024px, and Wikimedia answers a request it cannot satisfy with
// 400. Hand-built thumbnail paths carry that trap: you have to know the
// original's dimensions to pick a width, and nothing about the file name tells
// you them.
//
// Special:FilePath is the documented way to ask for a file by NAME and let
// Wikimedia choose the thumbnail — so the size question is answered by the only
// party that knows the answer. Tried with a width first, then without, which is
// full resolution and always exists if the file does.
//
// Derived from the failing address rather than stored alongside it, so this
// also repairs communities that already have the broken URLs written into their
// events.
export function wikimediaAlternatives(url: string): string[] {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return [];
  }
  if (!parsed.host.endsWith("wikimedia.org") && !parsed.host.endsWith("wikipedia.org")) return [];

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];
  // /wikipedia/commons/thumb/e/e3/Name.jpg/1024px-Name.jpg → the name is the
  // second-to-last segment. /wikipedia/commons/e/e3/Name.jpg → it is the last.
  const name = segments.includes("thumb") ? segments[segments.length - 2] : segments[segments.length - 1];
  if (!name || !name.includes(".")) return [];

  const base = `https://commons.wikimedia.org/wiki/Special:FilePath/${name}`;
  return [`${base}?width=1024`, base];
}

/** Just the host, for a message a person reads. */
function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "that address";
  }
}

export type EventPictures = {
  imageUrl: string | null;
  /**
   * `shows` is here because it was missing: the seeds have always set it and
   * the spread below has always carried it through, but the type said
   * otherwise, so nothing checked that a later artwork kept declaring itself.
   *
   * `creditFrom` marks a caption that is written WITHOUT its credit, to be
   * finished at seed time — see resolveCredits.
   */
  media: {
    url: string;
    caption?: string;
    /**
     * WHO MADE IT, KEPT APART FROM WHAT IT SHOWS.
     *
     * The credit used to be appended to the caption, and the caption is also
     * the picture's alt text — so a screen reader read out "…before the floods
     * were accepted, via Wikimedia Commons, author and licence are stated on
     * the file page, h-t-t-p-s colon slash slash commons dot wikimedia…". The
     * licence belongs on the page; it does not belong in the description of
     * what the photograph is of.
     */
    credit?: string;
    kind?: string;
    shows?: string;
    creditFrom?: "source";
  }[];
};

/**
 * FINISH THE CAPTIONS THAT ASKED TO BE FINISHED.
 *
 * A credit written into a seed file is a credit written from memory, months
 * before anyone reads it, for a file whose licence may since have been
 * corrected upstream. The ones already in this codebase were checked by hand,
 * one at a time, which does not scale past a few and cannot be re-checked at
 * all.
 *
 * So a seed may instead write the caption WITHOUT the credit and set
 * `creditFrom: "source"`. At seed time — on a server, with a network — the
 * credit is worked out from the picture's own source and appended. Commons is
 * asked outright and usually answers with the author and licence; everything
 * else, and Commons when it does not answer, gets a pointer to where the terms
 * are stated.
 *
 * IF NOTHING CAN BE ESTABLISHED, THE PICTURE IS DROPPED rather than shown
 * bare. That is not the general rule — a picture from a listed source is
 * always attachable, because a listed source always has terms to point at —
 * it is what happens when a URL is from no listed source at all, which should
 * not survive review and is worth failing loudly rather than quietly.
 *
 * Runs before the bytes are copied, because afterwards the URL is ours and no
 * longer says where the picture came from.
 */
export async function resolveCredits(
  pictures: EventPictures,
  fetchImpl: typeof fetch = fetch
): Promise<{ media: EventPictures["media"]; dropped: string[] }> {
  const media: EventPictures["media"] = [];
  const dropped: string[] = [];
  // One lookup per distinct URL: the cover image is usually the first picture
  // in the gallery too, and asking Commons twice for one file is one request
  // more than they agreed to serve us.
  const seen = new Map<string, string | null>();

  for (const item of pictures.media) {
    if (item.creditFrom !== "source") {
      media.push(item);
      continue;
    }
    if (!pictureSourceFor(item.url)) {
      dropped.push(item.url);
      continue;
    }
    if (!seen.has(item.url)) {
      const resolved = await creditFor(item.url, fetchImpl);
      seen.set(item.url, resolved?.credit ?? null);
    }
    const credit = seen.get(item.url) ?? null;
    // creditFrom is an instruction to this function, not something to store on
    // the event, so it does not travel any further than here.
    const rest = { ...item };
    delete rest.creditFrom;
    media.push(credit ? { ...rest, credit } : rest);
  }

  return { media, dropped };
}

/**
 * Bring in every picture an event carries, keeping the originals where a copy
 * could not be made. `slug` names the files so a re-run overwrites its own
 * copies rather than accumulating new ones.
 */
/**
 * A SHORT, STABLE FINGERPRINT OF A PICTURE'S SOURCE ADDRESS.
 *
 * The stored path used to be `<slug>-<position in the list>`, and storage
 * upserts, so the path was only unique as long as the list never changed. Top
 * up an event with the two pictures it is missing and they are positions 1 and
 * 2 of THAT list — overwriting the objects the event's existing pictures point
 * at, which turns them into different photographs without touching the row.
 *
 * Naming by the source address instead makes the path a function of the
 * picture: the same picture always lands in the same place however it was
 * reached, two different pictures can never collide, and bringing one in twice
 * costs one download rather than two objects.
 *
 * FNV-1a, because this needs to be stable and short, not unguessable.
 */
export function pictureName(slug: string, url: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < url.length; index++) {
    hash ^= url.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `${slug}-${hash.toString(16).padStart(8, "0")}`;
}

/**
 * WHICH OF A SEED'S PICTURES AN EVENT HAS NOT GOT YET.
 *
 * Seeding skips an event that already exists, which is right — a community may
 * have edited it. But it meant that an event seeded when the dataset offered
 * one picture stayed at one for ever, however many were added to the seed
 * afterwards. Göbekli Tepe carries four and communities were showing one.
 *
 * MATCHED BY CAPTION, for two reasons. The stored URL is no use: pictures are
 * copied into the community's own storage, so the address on the event is not
 * the address in the seed. And a caption is stored exactly as the seed wrote it
 * — only the credit is added, into its own field — so it identifies a seeded
 * picture reliably. Every seeded picture is required to have a caption of some
 * length by the rules in seeded-pictures.test.ts, which is what makes this safe
 * rather than clever.
 *
 * ANYTHING THE COMMUNITY ADDED ITSELF IS INVISIBLE TO THIS. Its caption is not
 * one any seed claims, so it never matches, is never counted as covering a
 * seeded picture, and is never touched. The caller appends what comes back and
 * removes nothing.
 */
export function picturesMissingFrom(
  existing: { caption?: string | null }[],
  seeded: { caption?: string }[]
): { caption?: string }[] {
  const have = new Set(
    existing.map((item) => (item.caption ?? "").trim()).filter((caption) => caption.length > 0)
  );
  // A seeded picture with no caption cannot be told apart from another one, so
  // it is left alone rather than added again on every seeding run. The caption
  // rule in the tests means this should never happen; being wrong about that
  // should cost nothing rather than duplicate pictures for ever.
  return seeded.filter((item) => {
    const caption = (item.caption ?? "").trim();
    return caption.length > 0 && !have.has(caption);
  });
}

/**
 * WHAT ONE RECORD IS SHORT OF, AS ONE ANSWER BOTH CALLERS USE.
 *
 * There are two ways a seeded record can be topped up: the dataset's own offer
 * card, and the "Check for corrections" button. They asked the question
 * differently, and that difference is the whole of the bug this exists to
 * prevent.
 *
 * The card asked `picturesMissingFrom`, so it topped up a record that had SOME
 * of its pictures. The button asked "does this record have any picture at
 * all?" and skipped it if it did — and the card is HIDDEN once a community has
 * the dataset, so the button was the only path left. A record that arrived
 * with one picture could therefore never get a second, however many the
 * dataset gained afterwards, and nothing anywhere said so.
 *
 * One function, both callers, so the two answers cannot drift apart again.
 */
export function pictureTopUp<T extends { url: string; caption?: string }>(
  stored: { image_url?: string | null; media?: { url?: string; caption?: string | null }[] | null },
  seed: { imageUrl?: string | null; media?: T[] }
): { missing: T[]; needsCover: boolean; count: number } {
  const missing = picturesMissingFrom(stored.media ?? [], seed.media ?? []) as T[];
  // A cover is wanted only when the record has none. Replacing one a community
  // chose would be taking their decision away, and the cover is the largest
  // thing on the card.
  const needsCover = !stored.image_url && Boolean(seed.imageUrl);
  // Every seeded cover is also a gallery picture, so when it is among the ones
  // being brought in it is one photograph and not two. Counting it twice would
  // spend the budget on work that is not happening.
  const coverAlreadyCounted = missing.some((item) => item.url === seed.imageUrl);
  return { missing, needsCover, count: missing.length + (needsCover && !coverAlreadyCounted ? 1 : 0) };
}

export async function bringEventPicturesIn(
  supabase: SupabaseClient<Database>,
  { pictures, userId, slug }: { pictures: EventPictures; userId: string; slug: string }
): Promise<{ pictures: EventPictures; broughtIn: number; reason: string | null }> {
  // One copy per distinct URL: the cover image is usually also the first
  // picture in the gallery, and fetching it twice would be two downloads and
  // two objects for one photograph.
  const seen = new Map<string, string>();
  let broughtIn = 0;
  // The first thing that went wrong, kept so the caller can say what happened
  // rather than that something did.
  let reason: string | null = null;

  const resolve = async (url: string, name: string): Promise<string> => {
    const known = seen.get(url);
    if (known) return known;
    const result = await bringImageIn(supabase, { url, userId, name });
    if ("reason" in result) {
      reason ??= result.reason;
      seen.set(url, url);
      return url;
    }
    if (result.url !== url) broughtIn++;
    seen.set(url, result.url);
    return result.url;
  };

  // The credits are finished BEFORE the bytes move, because afterwards the URL
  // is ours and no longer says where the picture came from.
  const { media: credited, dropped } = await resolveCredits(pictures);
  for (const url of dropped) reason ??= `no terms of use could be established for ${hostOf(url)}, so that picture was left out`;

  const media: EventPictures["media"] = [];
  for (const item of credited) {
    media.push({ ...item, url: await resolve(item.url, pictureName(slug, item.url)) });
  }

  // A COVER IS A PICTURE TOO, AND IT HAS NO CAPTION TO CARRY A CREDIT.
  //
  // Every seeded cover is also the first picture in the gallery, so a cover
  // whose gallery twin was dropped for having no establishable terms would
  // otherwise be the one copy that got through — uncredited, and the largest
  // thing on the page. It goes with it.
  const coverDropped = pictures.imageUrl != null && dropped.includes(pictures.imageUrl);
  const imageUrl =
    pictures.imageUrl && !coverDropped
      ? await resolve(pictures.imageUrl, pictureName(slug, pictures.imageUrl))
      : null;

  return { pictures: { imageUrl, media }, broughtIn, reason };
}
