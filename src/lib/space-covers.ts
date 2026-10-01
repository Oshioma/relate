// Picks a cover photo for each space card on a community's welcome page, so
// "What's inside" reads as real places rather than a row of icons.
//
// Order of preference per space:
//   1. the cover image an admin set on the space (spaces.image_url);
//   2. a photo from the space's own content — a business in a directory, a
//      listing in an accommodation space, an image post;
//   3. for a map, any photo from the community's places (it maps all of them);
//   4. the community's own cover image;
//   5. null — the caller falls back to the type icon.
// Photos from steps 2–4 are not reused across cards while an unused one is
// available, so two cards don't show the same picture.

export interface CoverSpace {
  id: string;
  space_type: string;
  image_url: string | null;
}

export interface CoverPhoto {
  // The space the photo belongs to, or null for community-wide photos.
  spaceId: string | null;
  url: string;
}

// Content photos are often uploads without a file extension in the path
// (storage URLs, Google Places photos); only require http(s) for those.
function isHttpUrl(url: string | null | undefined): url is string {
  return Boolean(url) && /^https?:\/\//i.test(url as string);
}

export function pickSpaceCovers(
  spaces: CoverSpace[],
  photos: CoverPhoto[],
  communityCover: string | null
): Map<string, string | null> {
  const used = new Set<string>();
  const covers = new Map<string, string | null>();
  const usable = photos.filter((photo) => isHttpUrl(photo.url));

  // Admin-set covers first, so a fallback never takes a picture an admin chose.
  for (const space of spaces) {
    if (space.image_url) {
      covers.set(space.id, space.image_url);
      used.add(space.image_url);
    }
  }

  const take = (candidates: CoverPhoto[]): string | null => {
    const fresh = candidates.find((photo) => !used.has(photo.url));
    const chosen = fresh ?? candidates[0];
    if (!chosen) return null;
    used.add(chosen.url);
    return chosen.url;
  };

  // Spaces with their own content go before the map, which can draw on
  // anything, so the map doesn't take the directory's only photo.
  const ordered = [...spaces].sort((a, b) => Number(a.space_type === "map") - Number(b.space_type === "map"));
  for (const space of ordered) {
    if (covers.has(space.id)) continue;
    const own = usable.filter((photo) => photo.spaceId === space.id);
    const pool = own.length === 0 && space.space_type === "map" ? usable : own;
    covers.set(space.id, take(pool));
  }

  // Anything still bare gets the community cover, once.
  if (communityCover && !used.has(communityCover)) {
    const bare = spaces.find((space) => covers.get(space.id) === null);
    if (bare) covers.set(bare.id, communityCover);
  }

  return covers;
}
