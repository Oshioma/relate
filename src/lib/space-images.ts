import type { SpaceType } from "@/types/database";

// Every space type ships with a photo (public/images/space-defaults, credits
// alongside), so a brand-new community's space cards, Explore strip and
// Spaces page look finished before anyone uploads a thing. An admin's own
// upload (spaces.image_url) always wins.
export function defaultSpaceImage(type: SpaceType): string {
  return `/images/space-defaults/${type}.webp`;
}

export function spaceImage(space: { image_url: string | null; space_type: SpaceType }): string {
  return space.image_url || defaultSpaceImage(space.space_type);
}
