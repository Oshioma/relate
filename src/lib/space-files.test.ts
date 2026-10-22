import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isOwnSpaceFileUrl,
  isSpaceFileUrl,
  spaceFilePath,
  spaceFilePathFromUrl,
  spaceFileUrl,
  uploadTargetFor,
} from "./space-files";
import { splitPostMedia } from "./post-media";
import { fileNameFromUrl, isImageUrl, normalizeUrl } from "./utils";

const SPACE = "11111111-2222-4333-8444-555555555555";
const USER = "66666666-7777-4888-9999-aaaaaaaaaaaa";
const ID = "bbbbbbbb-cccc-4ddd-8eee-ffffffffffff";

test("only spaces visitors can open keep the public bucket", () => {
  assert.equal(uploadTargetFor({ id: SPACE, visibility: "public" }, { privacy: "public" }), null);
  assert.equal(uploadTargetFor({ id: SPACE, visibility: "public" }, { privacy: "private" }), null);
  assert.deepEqual(uploadTargetFor({ id: SPACE, visibility: "public" }, { privacy: "invite_only" }), { spaceId: SPACE });
  assert.deepEqual(uploadTargetFor({ id: SPACE, visibility: "members" }, { privacy: "public" }), { spaceId: SPACE });
  assert.deepEqual(uploadTargetFor({ id: SPACE, visibility: "private" }, { privacy: "public" }), { spaceId: SPACE });
});

test("a private file's link round-trips to its storage path", () => {
  const path = spaceFilePath(SPACE, USER, "My Stems (final).WAV", ID);
  assert.equal(path, `${SPACE}/${USER}/${ID}-my-stems-final-.wav`);
  const url = spaceFileUrl(path);
  assert.equal(url, `/api/files/${path}`);
  assert.equal(spaceFilePathFromUrl(url), path);
  assert.equal(spaceFilePathFromUrl(`${url}?v=2`), path);
  assert.equal(fileNameFromUrl(url), "my-stems-final-.wav");
  assert.ok(isImageUrl(spaceFileUrl(spaceFilePath(SPACE, USER, "a.JPG", ID))));
});

test("anything else isn't a private file link", () => {
  assert.equal(isSpaceFileUrl("https://x.supabase.co/storage/v1/object/public/uploads/a/b.jpg"), false);
  assert.equal(isSpaceFileUrl(`/api/files/${SPACE}/../${USER}/x.jpg`), false);
  assert.equal(isSpaceFileUrl(`/api/files/${SPACE}/x.jpg`), false);
  assert.equal(isSpaceFileUrl(`/api/files/not-a-space/${USER}/x.jpg`), false);
  assert.equal(isSpaceFileUrl(`/api/files/${SPACE}/${USER}/%E0%A4%A`), false);
});

test("own private file: same space and uploader only", () => {
  const url = spaceFileUrl(spaceFilePath(SPACE, USER, "a.jpg", ID));
  assert.equal(isOwnSpaceFileUrl(url, SPACE, USER), true);
  assert.equal(isOwnSpaceFileUrl(url, SPACE, ID), false);
  assert.equal(isOwnSpaceFileUrl(url, ID, USER), false);
});

test("posts and links accept private file links", () => {
  const photo = spaceFileUrl(spaceFilePath(SPACE, USER, "a.jpg", ID));
  assert.deepEqual(splitPostMedia([photo, "/elsewhere/b.jpg"]), { mediaUrl: photo, extraMediaUrls: [] });
  assert.equal(normalizeUrl(photo), photo);
  assert.equal(normalizeUrl("example.com"), "https://example.com");
});
