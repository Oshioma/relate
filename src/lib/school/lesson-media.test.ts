import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_KEPT_MEDIA_BYTES,
  canKeepMedia,
  isOwnLessonMediaPath,
  keptContentType,
  lessonMediaPath,
  lessonMediaPublicUrl,
  mediaTypeOfPath,
  titleFromFileName,
} from "./lesson-media";
import { signUploadToken, verifyUploadToken } from "./upload-token";

const USER = "0b6f3c1e-2d4a-4e8b-9c7d-1a2b3c4d5e6f";
const OTHER = "9f8e7d6c-5b4a-4321-8fed-cba987654321";
const FILE_ID = "11111111-2222-4333-8444-555555555555";

test("a kept upload's path is in the uploader's folder and names its player", () => {
  const video = lessonMediaPath(USER, FILE_ID, "video/mp4");
  assert.equal(video, `${USER}/lesson-media/${FILE_ID}.mp4`);
  assert.equal(mediaTypeOfPath(video!), "video");

  const audio = lessonMediaPath(USER, FILE_ID, "audio/webm");
  assert.equal(audio, `${USER}/lesson-media/${FILE_ID}.weba`);
  assert.equal(mediaTypeOfPath(audio!), "audio");
});

test("only the caller's own lesson-media paths are accepted", () => {
  const mine = `${USER}/lesson-media/${FILE_ID}.mp3`;
  assert.ok(isOwnLessonMediaPath(mine, USER));
  assert.ok(!isOwnLessonMediaPath(mine, OTHER));
  for (const path of [
    `${USER}/lesson-media/../${OTHER}/x.mp3`,
    `${USER}/other/${FILE_ID}.mp3`,
    `${USER}/lesson-media/${FILE_ID}.exe`,
    `/${USER}/lesson-media/${FILE_ID}.mp3`,
    `${USER}/lesson-media/${FILE_ID}.mp3?x=1`,
    "",
  ]) {
    assert.ok(!isOwnLessonMediaPath(path, USER), path);
  }
});

test("browser content-type quirks map onto what the bucket allows", () => {
  assert.equal(keptContentType("audio/x-m4a"), "audio/mp4");
  assert.equal(keptContentType("audio/mp3"), "audio/mpeg");
  assert.equal(keptContentType("VIDEO/QUICKTIME"), "video/quicktime");
  assert.equal(keptContentType("video/x-matroska"), null);
  assert.equal(keptContentType(""), null);
});

test("big or unsupported files go direct rather than being kept", () => {
  assert.ok(canKeepMedia({ size: 10, type: "video/mp4" }));
  assert.ok(canKeepMedia({ size: MAX_KEPT_MEDIA_BYTES, type: "video/mp4" }));
  assert.ok(!canKeepMedia({ size: MAX_KEPT_MEDIA_BYTES + 1, type: "video/mp4" }));
  assert.ok(!canKeepMedia({ size: 10, type: "video/x-matroska" }));
  assert.ok(!canKeepMedia({ size: 0, type: "video/mp4" }));
});

test("public URL is built from the project URL", () => {
  assert.equal(
    lessonMediaPublicUrl("https://abc.supabase.co/", `${USER}/lesson-media/${FILE_ID}.mp4`),
    `https://abc.supabase.co/storage/v1/object/public/uploads/${USER}/lesson-media/${FILE_ID}.mp4`
  );
});

test("a file name becomes a title", () => {
  assert.equal(titleFromFileName("Lecture 3 – final.mp4"), "Lecture 3 – final");
  assert.equal(titleFromFileName("noext"), "noext");
});

test("upload tokens match the worker's format and expire", () => {
  // Same vector as UploadTokenTests in workers/video-transcriber/test_app.py,
  // so the two implementations can't drift apart unnoticed.
  const now = 2_000_000_000 - 2 * 60 * 60;
  const token = signUploadToken("test-secret", "job-12345678", now);
  assert.equal(token, "2000000000.db69dbd3f4307d45c1103ba7304ec8f20227f8b9e1508b38798954037af30231");

  assert.ok(verifyUploadToken("test-secret", "job-12345678", token, now));
  assert.ok(!verifyUploadToken("test-secret", "job-other", token, now));
  assert.ok(!verifyUploadToken("wrong", "job-12345678", token, now));
  assert.ok(!verifyUploadToken("test-secret", "job-12345678", token, 2_000_000_001));
  assert.ok(!verifyUploadToken("test-secret", "job-12345678", "garbage", now));
});
