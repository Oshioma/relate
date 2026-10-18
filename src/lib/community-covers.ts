// Suggested cover photos for a new community, offered in the wizard's
// Customize step (public/images/community-covers, credits alongside). Each is
// tagged with the community templates it suits, so the picker leads with
// covers that fit what's being built — and a community whose owner never
// picks still launches with the best match rather than a blank header.

export interface CommunityCover {
  key: string;
  label: string;
  templates: string[];
}

export const COMMUNITY_COVERS: CommunityCover[] = [
  { key: "gathering", label: "Friends at sunset", templates: ["networking", "fanclub", "faith", "book_club", "custom", "startup"] },
  { key: "worship", label: "Hands raised", templates: ["faith", "fanclub"] },
  { key: "sunrise", label: "Sunrise meadow", templates: ["faith", "wellness", "coaching"] },
  { key: "city", label: "City skyline", templates: ["place", "business", "networking", "startup"] },
  { key: "yoga", label: "Yoga at dusk", templates: ["wellness", "coaching", "fitness"] },
  { key: "music-studio", label: "Music studio", templates: ["creator", "fanclub"] },
  { key: "giving", label: "Make a change", templates: ["nonprofit"] },
  { key: "gaming", label: "Gaming setup", templates: ["gaming"] },
  { key: "hiking", label: "Mountain hike", templates: ["activity", "fitness"] },
  { key: "volunteer", label: "Volunteers", templates: ["nonprofit"] },
  { key: "craft", label: "Handmade ceramics", templates: ["craft"] },
  { key: "beach", label: "Beach", templates: ["place"] },
  { key: "market", label: "Fresh produce", templates: ["farming", "place"] },
  { key: "field", label: "Crop field", templates: ["farming"] },
  { key: "classroom", label: "Classroom", templates: ["school", "learning", "course"] },
  { key: "library", label: "Library", templates: ["learning", "course", "book_club"] },
  { key: "coworking", label: "Coworking space", templates: ["business", "startup", "networking", "coaching"] },
  { key: "camera", label: "Camera and prints", templates: ["photography", "creator"] },
  { key: "running", label: "Runners", templates: ["fitness", "activity"] },
  { key: "mountains", label: "Mountain view", templates: ["place", "activity", "custom"] },
];

export function coverPath(key: string): string {
  return `/images/community-covers/${key}.webp`;
}

export function isCoverKey(key: string | null | undefined): key is string {
  return Boolean(key) && COMMUNITY_COVERS.some((c) => c.key === key);
}

// All covers, the ones tagged for this template first (in list order).
export function coversForTemplate(templateKey: string): CommunityCover[] {
  const matching = COMMUNITY_COVERS.filter((c) => c.templates.includes(templateKey));
  return [...matching, ...COMMUNITY_COVERS.filter((c) => !c.templates.includes(templateKey))];
}

// The cover a community gets when its owner doesn't pick one.
export function defaultCoverKey(templateKey: string): string {
  return coversForTemplate(templateKey)[0].key;
}
