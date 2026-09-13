import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { isHotlinked, storeExternalImage, pictureName } from "@/lib/timeline/bring-in-image";

// A listing is created from a form submit, so it can't hang on a slow host the
// way a background seed can — it waits less per image than the timeline does.
const PER_IMAGE_TIMEOUT_MS = 10_000;
// A ceiling on how many we'll actually download in one submit. Anything past it
// keeps its original URL rather than holding the submit open indefinitely.
const MAX_DOWNLOADS = 12;

/**
 * Copy any still-external listing photos into our own storage so they keep
 * working after the source site renames, deletes, or hotlink-blocks them.
 *
 * This is the fix for the broken covers seen in the feed and on cards: an
 * imported (scraped) listing stored an `<img>` pointing at someone else's
 * server, and once that server dropped the file there was nothing to show. A
 * photo copied here is ours to serve, and the only thing that can break it is
 * us.
 *
 * BEST-EFFORT, and deliberately so. A photo we can't fetch — very often because
 * the source is *already* gone — keeps its original URL, so this never blocks
 * or fails creating a listing; the worst case is the behaviour it replaces.
 * Photos already in our storage are recognised and left untouched. The returned
 * array lines up one-to-one with `urls`.
 */
export async function rehostListingImages(
  supabase: SupabaseClient<Database>,
  { urls, userId }: { urls: string[]; userId: string }
): Promise<string[]> {
  const out: string[] = [];
  // One copy per distinct URL: a cover is usually the gallery's first photo
  // too, and fetching it twice would be two downloads for one picture.
  const seen = new Map<string, string>();
  let downloads = 0;

  for (const url of urls) {
    if (!isHotlinked(url)) {
      // Already ours (or not a real URL) — leave it exactly as it is.
      out.push(url);
      continue;
    }
    const known = seen.get(url);
    if (known) {
      out.push(known);
      continue;
    }
    if (downloads >= MAX_DOWNLOADS) {
      out.push(url);
      continue;
    }
    downloads++;
    const result = await storeExternalImage(supabase, {
      url,
      userId,
      folder: "listings",
      // A stable, collision-free name per source URL, so re-importing the same
      // photo overwrites its own copy rather than piling up new objects.
      key: pictureName("listing", url),
      timeoutMs: PER_IMAGE_TIMEOUT_MS,
    });
    const resolved = "url" in result ? result.url : url;
    seen.set(url, resolved);
    out.push(resolved);
  }
  return out;
}
