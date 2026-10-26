// MOVING A POST TO ANOTHER SPACE.
//
// Space types don't all keep their content in the same place. A discussion
// space (and anything else that shows the ordinary post feed) lists rows from
// `posts`; a Guides space lists rows from `guides`, with their own comments
// table; a live room, a course, a growth journal and the rest don't show posts
// at all. So "move this post" means one of three things depending on where it
// is going: change its space, turn it into a guide, or not possible.

/** Space types that render something other than the post feed. */
const TYPES_WITHOUT_POST_FEED = new Set([
  "custom",
  "resources",
  "journal",
  "growth_journey",
  "directory",
  "challenges",
  "business_directory",
  "map",
  "marketplace",
  "jobs",
  "accommodation",
  "recommendations",
  "clubs",
  "guides",
  "volunteer_hub",
  "course",
  "crop_guides",
  "plant_scanner",
  "my_crops",
  "plant_id",
  "live",
  "meetups",
  "lessons",
  "books_media",
  "arts_board",
  "guided_journey",
]);

/** Does a space of this type show the ordinary discussion feed of posts? */
export function showsPostFeed(spaceType: string | null | undefined): boolean {
  return !TYPES_WITHOUT_POST_FEED.has(spaceType ?? "discussion");
}

export type MoveKind = "post" | "guide";

/** What a post becomes in a space of this type, or null if it can't go there. */
export function moveKindFor(spaceType: string | null | undefined): MoveKind | null {
  if (spaceType === "guides") return "guide";
  return showsPostFeed(spaceType) ? "post" : null;
}

/** The spaces a post in `currentSpaceId` can be moved to, each with what it becomes. */
export function moveTargets<S extends { id: string; space_type: string | null }>(
  spaces: S[],
  currentSpaceId: string
): (S & { kind: MoveKind })[] {
  const targets: (S & { kind: MoveKind })[] = [];
  for (const space of spaces) {
    if (space.id === currentSpaceId) continue;
    const kind = moveKindFor(space.space_type);
    if (kind) targets.push({ ...space, kind });
  }
  return targets;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/**
 * A guide has a title and an HTML body but no photo fields, so a post's
 * attached photos and videos go at the end of the body, where the guide page
 * shows them, rather than being dropped.
 */
export function guideBodyFromPost(post: { body: string | null; media_url: string | null; extra_media_urls: string[] | null }): string {
  const media = [...(post.media_url ? [post.media_url] : []), ...(post.extra_media_urls ?? [])];
  const pieces = media.map((url) =>
    /\.(mp4|webm|mov)(\?|$)/i.test(url)
      ? `<p><video src="${escapeAttribute(url)}" controls></video></p>`
      : `<p><img src="${escapeAttribute(url)}" alt=""></p>`
  );
  return [post.body?.trim() ?? "", ...pieces].filter(Boolean).join("\n");
}
