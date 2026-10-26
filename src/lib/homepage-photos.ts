// Which pictures the platform homepage shows (Platform admin -> Homepage).
// Each slot uses the super admin's pick when there is one, and otherwise falls
// back to the featured communities' covers in the order they were featured.

export type HomepagePhotoSettings = {
  why_photo_url?: string | null;
  closing_photo_url?: string | null;
};

type WithCover = { cover_image_url: string | null };

// A stored photo address, or null for anything that isn't a plain web
// address (a data: URL, a script). Never throws.
export function readPhotoUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  return /^https:\/\/\S+$/i.test(url) ? url : null;
}

// The hero community is the picked one when it's available (public, still
// exists), else the first featured community with a cover.
export function pickHomepagePhotos<C extends WithCover>(
  settings: HomepagePhotoSettings | null,
  featured: C[],
  pickedHero: C | null
): { heroCommunity: C | null; whyPhoto: string | null; closingPhoto: string | null } {
  const withCovers = featured.filter((c) => c.cover_image_url);
  return {
    heroCommunity: pickedHero ?? withCovers[0] ?? null,
    whyPhoto:
      readPhotoUrl(settings?.why_photo_url) ?? (withCovers[1] ?? withCovers[0])?.cover_image_url ?? null,
    closingPhoto:
      readPhotoUrl(settings?.closing_photo_url) ??
      (withCovers[2] ?? withCovers[1] ?? withCovers[0])?.cover_image_url ??
      null,
  };
}
