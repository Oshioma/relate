import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTags, postGallery, splitPostMedia } from "./post-media";

test("parseTags splits, strips #, dedupes and caps", () => {
  assert.deepEqual(parseTags("Chillies, #first harvest,chillies, , ##Seeds"), ["Chillies", "first harvest", "Seeds"]);
  assert.deepEqual(parseTags("a,b,c,d,e,f,g"), ["a", "b", "c", "d", "e"]);
  assert.deepEqual(parseTags(""), []);
  assert.equal(parseTags("x".repeat(40))[0].length, 24);
});

test("splitPostMedia keeps the lead of any kind and only extra photos", () => {
  assert.deepEqual(splitPostMedia(["https://a/0.jpg", "https://a/1.jpg", "https://a/v.mp4", "https://cdn/photo-123?w=800"]), {
    mediaUrl: "https://a/0.jpg",
    extraMediaUrls: ["https://a/1.jpg", "https://cdn/photo-123?w=800"],
  });
  // A document or video lead stands alone.
  assert.deepEqual(splitPostMedia(["https://a/doc.pdf", "https://a/1.jpg"]), { mediaUrl: "https://a/doc.pdf", extraMediaUrls: [] });
  assert.deepEqual(splitPostMedia(["javascript:alert(1)", " "]), { mediaUrl: null, extraMediaUrls: [] });
  assert.equal(splitPostMedia(["https://a/0.jpg", "https://a/1.jpg", "https://a/2.jpg", "https://a/3.jpg", "https://a/4.jpg"]).extraMediaUrls.length, 3);
});

test("postGallery leads with a visual lead and skips documents", () => {
  assert.deepEqual(postGallery({ media_url: "https://a/1.jpg", extra_media_urls: ["https://a/2.jpg"] }), ["https://a/1.jpg", "https://a/2.jpg"]);
  assert.deepEqual(postGallery({ media_url: "https://a/doc.pdf", extra_media_urls: ["https://a/2.jpg"] }), ["https://a/2.jpg"]);
  assert.deepEqual(postGallery({ media_url: null }), []);
});
