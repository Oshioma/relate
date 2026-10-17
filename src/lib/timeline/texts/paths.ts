// Addresses inside the text archive. Passage and work keys contain dots and
// no slashes, so they sit in a path segment as they are.

import { timelinePath } from "../availability";

export function textsPath(communitySlug: string): string {
  return `${timelinePath(communitySlug)}/texts`;
}

export function workPath(communitySlug: string, workKey: string): string {
  return `${textsPath(communitySlug)}/${encodeURIComponent(workKey)}`;
}

export function passagePath(communitySlug: string, workKey: string, passageKey: string): string {
  return `${workPath(communitySlug, workKey)}/${encodeURIComponent(passageKey)}`;
}

/** The comparison page with these passages in its lanes, in this order. */
export function comparePath(communitySlug: string, passageKeys: string[]): string {
  const query = passageKeys.map((key) => `p=${encodeURIComponent(key)}`).join("&");
  return `${textsPath(communitySlug)}/compare${query ? `?${query}` : ""}`;
}

export function themePath(communitySlug: string, themeKey?: string): string {
  return `${textsPath(communitySlug)}/themes${themeKey ? `/${encodeURIComponent(themeKey)}` : ""}`;
}
