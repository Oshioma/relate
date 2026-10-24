// Files members upload inside a space visitors can't open go to the private
// 'space-files' bucket instead of the public 'uploads' one (see
// supabase/migrations/20261022153833_private_space_files.sql). Such a file has
// no public link: pages point at /api/files/<path>, which hands out a
// short-lived signed link only to people who can open the space.

export const SPACE_FILES_BUCKET = "space-files";

export const SPACE_FILE_URL_PREFIX = "/api/files/";

// Where a member's upload into a space should go: the space's private folder,
// or null for the public 'uploads' bucket.
export type UploadTarget = { spaceId: string } | null;

// Whether a visitor (signed out, or not a member) can open the space. Mirrors
// has_space_access(): a public space in a community that isn't hidden.
export function spaceIsOpenToVisitors(space: { visibility: string }, community: { privacy: string }): boolean {
  return space.visibility === "public" && community.privacy !== "invite_only";
}

export function uploadTargetFor(
  space: { id: string; visibility: string },
  community: { privacy: string }
): UploadTarget {
  return spaceIsOpenToVisitors(space, community) ? null : { spaceId: space.id };
}

// <space id>/<uploader id>/<random>-<readable name>. The random prefix is the
// one fileNameFromUrl() strips, so a document's link still says what it is.
export function spaceFilePath(spaceId: string, userId: string, fileName: string, id: string): string {
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 60) || "file";
  return `${spaceId}/${userId}/${id}-${safeName}`;
}

export function spaceFileUrl(path: string): string {
  return SPACE_FILE_URL_PREFIX + path.split("/").map(encodeURIComponent).join("/");
}

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const SPACE_FILE_PATH = new RegExp(`^${UUID}/${UUID}/[a-z0-9._-]+$`, "i");

// The storage path behind an /api/files/ link, or null if it isn't one.
export function spaceFilePathFromUrl(url: string): string | null {
  if (!url.startsWith(SPACE_FILE_URL_PREFIX)) return null;
  let path: string;
  try {
    path = decodeURIComponent(url.slice(SPACE_FILE_URL_PREFIX.length).split(/[?#]/)[0]);
  } catch {
    return null;
  }
  return SPACE_FILE_PATH.test(path) ? path : null;
}

export function isSpaceFileUrl(url: string): boolean {
  return spaceFilePathFromUrl(url) !== null;
}

// Whether a link is someone's own upload in a given space.
export function isOwnSpaceFileUrl(url: string, spaceId: string, userId: string): boolean {
  const path = spaceFilePathFromUrl(url);
  return path !== null && path.startsWith(`${spaceId}/${userId}/`);
}
