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

/**
 * Fetch one image and put it in the community's storage, returning the URL it
 * now lives at — or null if anything at all went wrong.
 *
 * NULL IS A NORMAL ANSWER. The caller keeps the original URL when this fails,
 * so a seed never breaks because a photograph could not be reached: the worst
 * case is the behaviour we already had. Failures are quiet for the same reason
 * — a community that cannot reach Wikimedia still gets its worked example, with
 * every word of it intact.
 */
export async function bringImageIn(
  supabase: SupabaseClient<Database>,
  { url, userId, name }: { url: string; userId: string; name: string }
): Promise<string | null> {
  if (!isHotlinked(url)) return url;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      // Wikimedia asks for a User-Agent that says who is calling and offers a
      // way to get in touch. Sending one is their published condition for
      // automated requests, so it is sent.
      headers: { "User-Agent": "Relate/1.0 (community timeline; +https://github.com/Oshioma/relate)" },
    });
    if (!response.ok) return null;

    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const extension = IMAGE_TYPES.get(contentType);
    if (!extension) return null;

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) return null;

    // The same per-user path scheme every other upload uses, so the storage
    // policies that already exist are the ones that apply here too.
    const path = `${userId}/timeline/${name}.${extension}`;
    const { error } = await supabase.storage
      .from("uploads")
      .upload(path, bytes, { upsert: true, contentType });
    if (error) return null;

    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    return data.publicUrl || null;
  } catch {
    return null;
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
): Promise<{ pictures: EventPictures; broughtIn: number }> {
  // One copy per distinct URL: the cover image is usually also the first
  // picture in the gallery, and fetching it twice would be two downloads and
  // two objects for one photograph.
  const seen = new Map<string, string>();
  let broughtIn = 0;

  const resolve = async (url: string, name: string): Promise<string> => {
    const known = seen.get(url);
    if (known) return known;
    const stored = await bringImageIn(supabase, { url, userId, name });
    const next = stored ?? url;
    if (stored && stored !== url) broughtIn++;
    seen.set(url, next);
    return next;
  };

  const media: EventPictures["media"] = [];
  for (const [index, item] of pictures.media.entries()) {
    media.push({ ...item, url: await resolve(item.url, `${slug}-${index + 1}`) });
  }

  const imageUrl = pictures.imageUrl ? await resolve(pictures.imageUrl, `${slug}-cover`) : null;

  return { pictures: { imageUrl, media }, broughtIn };
}
