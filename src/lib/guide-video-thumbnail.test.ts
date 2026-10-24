import { test } from "node:test";
import assert from "node:assert/strict";
import { guideVideoThumbnail } from "./guide-video-thumbnail";

const STILL = { kind: "image", src: "https://i.ytimg.com/vi/xpyT27y61bw/hqdefault.jpg" };

test("a YouTube video added with the editor's video button gets YouTube's still", () => {
  assert.deepEqual(guideVideoThumbnail('<p>Intro</p><iframe src="https://www.youtube-nocookie.com/embed/xpyT27y61bw" allowfullscreen></iframe>'), STILL);
});

test("a pasted YouTube link gets the same still", () => {
  assert.deepEqual(guideVideoThumbnail('<a href="https://www.youtube.com/watch?v=xpyT27y61bw">https://www.youtube.com/watch?v=xpyT27y61bw</a>'), STILL);
  assert.deepEqual(guideVideoThumbnail("Watch this:\nhttps://youtu.be/xpyT27y61bw"), STILL);
});

test("an uploaded video shows its own first frame", () => {
  assert.deepEqual(guideVideoThumbnail('<video controls preload="metadata" src="https://x.supabase.co/storage/v1/object/public/a/b.mp4"></video>'), {
    kind: "video",
    src: "https://x.supabase.co/storage/v1/object/public/a/b.mp4",
  });
});

test("a Vimeo video gets a play tile", () => {
  assert.deepEqual(guideVideoThumbnail('<iframe src="https://player.vimeo.com/video/123456?dnt=1"></iframe>'), { kind: "tile" });
});

test("the first video in the guide wins", () => {
  assert.deepEqual(
    guideVideoThumbnail('<iframe src="https://www.youtube-nocookie.com/embed/xpyT27y61bw"></iframe><video src="/a.mp4"></video>'),
    STILL
  );
});

test("a guide with no video has no thumbnail", () => {
  assert.equal(guideVideoThumbnail('<p>Best coffee: <a href="https://example.com">here</a></p><img src="https://example.com/a.jpg">'), null);
  assert.equal(guideVideoThumbnail(""), null);
});
