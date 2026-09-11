import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

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

/** One attempt at one address: fetch it, check it, store it. */
async function fetchAndStore(
  supabase: SupabaseClient<Database>,
  { url, userId, name }: { url: string; userId: string; name: string }
): Promise<BringInResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      // NO CACHING. Next patches global fetch and will try to store what comes
      // back; an image is not what that cache is for, and a cache write that
      // fails on a large body would take the whole copy down with it.
      cache: "no-store",
      // Wikimedia asks for a User-Agent that says who is calling and offers a
      // way to get in touch. Sending one is their published condition for
      // automated requests, so it is sent.
      headers: { "User-Agent": "Relate/1.0 (community timeline; +https://github.com/Oshioma/relate)" },
    });
  } catch (error) {
    // Refused, blocked, timed out, DNS — the request never completed.
    const detail = error instanceof Error ? error.message : String(error);
    return { reason: `couldn't reach ${hostOf(url)} (${detail})` };
  }

  if (!response.ok) {
    // Wikimedia's error pages say what was wrong with the request in one line,
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

  // The same per-user path scheme every other upload uses, so the storage
  // policies that already exist are the ones that apply here too.
  const path = `${userId}/timeline/${name}.${extension}`;
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
  media: { url: string; caption?: string; kind?: string }[];
};

/**
 * Bring in every picture an event carries, keeping the originals where a copy
 * could not be made. `slug` names the files so a re-run overwrites its own
 * copies rather than accumulating new ones.
 */
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

  const media: EventPictures["media"] = [];
  for (const [index, item] of pictures.media.entries()) {
    media.push({ ...item, url: await resolve(item.url, `${slug}-${index + 1}`) });
  }

  const imageUrl = pictures.imageUrl ? await resolve(pictures.imageUrl, `${slug}-cover`) : null;

  return { pictures: { imageUrl, media }, broughtIn, reason };
}
