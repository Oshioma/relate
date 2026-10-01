import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDuration, parseVideoLink, withSiteHelpLink } from "./video-links";

test("YouTube links in every common shape resolve to one watch URL", () => {
  for (const raw of [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
    "youtube.com/watch?v=dQw4w9WgXcQ",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://www.youtube.com/live/dQw4w9WgXcQ",
  ]) {
    const link = parseVideoLink(raw);
    assert.equal(link?.platform, "youtube", raw);
    assert.equal(link?.url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", raw);
    assert.equal(link?.embedUrl, "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", raw);
  }
});

test("YouTube Shorts are portrait", () => {
  assert.equal(parseVideoLink("https://youtube.com/shorts/dQw4w9WgXcQ")?.portrait, true);
});

test("Instagram posts and reels embed", () => {
  const reel = parseVideoLink("https://www.instagram.com/reels/C1a2b3c4d5/?igsh=xyz");
  assert.equal(reel?.url, "https://www.instagram.com/reel/C1a2b3c4d5/");
  assert.equal(reel?.embedUrl, "https://www.instagram.com/reel/C1a2b3c4d5/embed");
  assert.equal(reel?.portrait, true);

  const post = parseVideoLink("instagram.com/p/C1a2b3c4d5/");
  assert.equal(post?.platform, "instagram");
  assert.equal(post?.portrait, false);
});

test("Facebook video links keep only what identifies the video", () => {
  const video = parseVideoLink("https://m.facebook.com/someschool/videos/1234567890/?mibextid=abc");
  assert.equal(video?.url, "https://www.facebook.com/someschool/videos/1234567890/");
  assert.match(video?.embedUrl ?? "", /^https:\/\/www\.facebook\.com\/plugins\/video\.php\?/);

  const watch = parseVideoLink("https://www.facebook.com/watch/?v=987&fbclid=track");
  assert.equal(watch?.url, "https://www.facebook.com/watch/?v=987");

  assert.equal(parseVideoLink("https://fb.watch/abcDEF/")?.embedUrl, null);
  assert.equal(parseVideoLink("https://www.facebook.com/share/v/abc123/")?.embedUrl, null);
});

test("TikTok videos keep the user and id, drop the tracking and embed portrait", () => {
  for (const raw of [
    "https://www.tiktok.com/@some.school/video/7234567890123456789?is_from_webapp=1&sender_device=pc",
    "tiktok.com/@some.school/video/7234567890123456789",
    "https://m.tiktok.com/@some.school/video/7234567890123456789/",
  ]) {
    const link = parseVideoLink(raw);
    assert.equal(link?.platform, "tiktok", raw);
    assert.equal(link?.url, "https://www.tiktok.com/@some.school/video/7234567890123456789", raw);
    assert.equal(link?.embedUrl, "https://www.tiktok.com/embed/v2/7234567890123456789", raw);
    assert.equal(link?.portrait, true, raw);
  }
});

test("TikTok share links are kept but not embedded", () => {
  const vm = parseVideoLink("https://vm.tiktok.com/ZMabc123/");
  assert.equal(vm?.platform, "tiktok");
  assert.equal(vm?.url, "https://vm.tiktok.com/ZMabc123/");
  assert.equal(vm?.embedUrl, null);
  assert.equal(vm?.portrait, true);

  const t = parseVideoLink("https://www.tiktok.com/t/ZTabc123/?_r=1");
  assert.equal(t?.url, "https://www.tiktok.com/t/ZTabc123/");
  assert.equal(t?.embedUrl, null);
});

test("Vimeo links in every common shape resolve to one address", () => {
  for (const raw of [
    "https://vimeo.com/76979871",
    "vimeo.com/76979871?share=copy",
    "https://www.vimeo.com/76979871",
    "https://vimeo.com/channels/staffpicks/76979871",
    "https://vimeo.com/groups/shortfilms/videos/76979871",
    "https://player.vimeo.com/video/76979871",
  ]) {
    const link = parseVideoLink(raw);
    assert.equal(link?.platform, "vimeo", raw);
    assert.equal(link?.url, "https://vimeo.com/76979871", raw);
    assert.equal(link?.embedUrl, "https://player.vimeo.com/video/76979871?dnt=1", raw);
    assert.equal(link?.portrait, false, raw);
  }
});

test("unlisted Vimeo videos keep their hash", () => {
  for (const raw of ["https://vimeo.com/76979871/a1b2c3d4e5", "https://player.vimeo.com/video/76979871?h=a1b2c3d4e5"]) {
    const link = parseVideoLink(raw);
    assert.equal(link?.url, "https://vimeo.com/76979871/a1b2c3d4e5", raw);
    assert.equal(link?.embedUrl, "https://player.vimeo.com/video/76979871?dnt=1&h=a1b2c3d4e5", raw);
  }
  // Something that isn't a hash never reaches the iframe src.
  assert.equal(
    parseVideoLink("https://player.vimeo.com/video/76979871?h=x%22onload")?.embedUrl,
    "https://player.vimeo.com/video/76979871?dnt=1"
  );
});

test("anything else is not a video link", () => {
  for (const raw of [
    "",
    "https://en.wikipedia.org/wiki/Volcano",
    "https://www.facebook.com/someschool",
    "https://www.youtube.com/@channel",
    "https://www.youtube.com/watch?v=short",
    "javascript:alert(1)",
    "file:///etc/passwd",
    "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
    "https://www.tiktok.com/@some.school",
    "https://www.tiktok.com/@some.school/video/notanumber",
    "https://www.tiktok.com/@some.school/photo/7234567890123456789",
    "https://tiktok.com.evil.example/@some.school/video/7234567890123456789",
    "https://eviltiktok.com/@some.school/video/7234567890123456789",
    "https://vimeo.com/channels/staffpicks",
    "https://vimeo.com/someuser",
    "https://vimeo.com/groups/shortfilms",
    "https://player.vimeo.com/api/player.js",
    "https://vimeo.com.evil.example/76979871",
  ]) {
    assert.equal(parseVideoLink(raw), null, raw);
  }
});

test("durations read like a video player's", () => {
  assert.equal(formatDuration(65), "1:05");
  assert.equal(formatDuration(3723), "1:02:03");
  assert.equal(formatDuration(null), null);
});

test("worker help links point at this site's instructions page", () => {
  const readme =
    "Needs cookies. How to fix it: https://github.com/Oshioma/relate/blob/main/workers/video-transcriber/README.md#cookies";
  assert.equal(
    withSiteHelpLink(readme, "https://relate.click/"),
    "Needs cookies. How to fix it: https://relate.click/help/video-cookies"
  );
  assert.equal(
    withSiteHelpLink("Fix: https://relate.click/help/video-cookies", "https://school.example"),
    "Fix: https://school.example/help/video-cookies"
  );
  assert.equal(withSiteHelpLink("That video is private.", "https://relate.click"), "That video is private.");
  assert.equal(withSiteHelpLink(null), null);
});
