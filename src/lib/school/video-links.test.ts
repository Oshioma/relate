import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cleanClip,
  clipEmbedUrl,
  describeClip,
  formatDuration,
  formatTimestamp,
  parseTimestamp,
  parseVideoLink,
  seekEmbedUrl,
  withSiteHelpLink,
} from "./video-links";

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

test("timestamps read like a player's clock", () => {
  assert.equal(formatTimestamp(0), "0:00");
  assert.equal(formatTimestamp(5), "0:05");
  assert.equal(formatTimestamp(750.9), "12:30");
  assert.equal(formatTimestamp(3723), "1:02:03");
  assert.equal(formatTimestamp(-4), "0:00");
});

test("a YouTube embed can start at a moment and play", () => {
  const link = parseVideoLink("https://youtu.be/dQw4w9WgXcQ");
  assert.ok(link);
  assert.equal(
    seekEmbedUrl(link, 750),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=750&autoplay=1"
  );
  assert.equal(
    seekEmbedUrl(link, 12.7),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=12&autoplay=1"
  );
  assert.equal(seekEmbedUrl(link, -1), null);
  assert.equal(seekEmbedUrl(link, Number.NaN), null);
});

test("platforms whose player can't seek get no seek URL", () => {
  for (const raw of [
    "https://www.instagram.com/reel/C1a2b3c4d5/",
    "https://www.facebook.com/watch/?v=123",
    "https://fb.watch/abc/",
  ]) {
    const link = parseVideoLink(raw);
    assert.ok(link, raw);
    assert.equal(seekEmbedUrl(link, 30), null, raw);
  }
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

test("Vimeo seeks with the #t= fragment and keeps an unlisted video's hash", () => {
  const link = parseVideoLink("https://vimeo.com/76979871/abc123")!;
  assert.equal(
    seekEmbedUrl(link, 754.9),
    "https://player.vimeo.com/video/76979871?dnt=1&h=abc123&autoplay=1#t=754s"
  );
});

test("times are read the ways a teacher types them", () => {
  assert.equal(parseTimestamp("2:30:00"), 9000);
  assert.equal(parseTimestamp("150:00"), 9000);
  assert.equal(parseTimestamp("4:05"), 245);
  assert.equal(parseTimestamp("150"), 9000);
  assert.equal(parseTimestamp("2h30m"), 9000);
  assert.equal(parseTimestamp("90s"), 90);
  assert.equal(parseTimestamp(""), null);
  assert.equal(parseTimestamp("1:75"), null);
  assert.equal(parseTimestamp("soon"), null);
});

test("a clip is whole seconds, and a backwards end is dropped", () => {
  assert.deepEqual(cleanClip(0, 9000.7), { start: null, end: 9000 });
  assert.deepEqual(cleanClip(600, 300), { start: 600, end: null });
  assert.deepEqual(cleanClip("x", -1), { start: null, end: null });
  assert.equal(describeClip({ start: null, end: 9000 }), "0:00–2:30:00");
  assert.equal(describeClip({ start: 3600, end: null }), "1:00:00 to the end");
  assert.equal(describeClip({ start: null, end: null }), null);
});

test("a YouTube lesson plays only its part, and watch-from keeps the end", () => {
  const link = parseVideoLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ")!;
  assert.equal(clipEmbedUrl(link, null), link.embedUrl);
  assert.equal(
    clipEmbedUrl(link, { start: 60, end: 9000 }),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=60&end=9000"
  );
  assert.equal(
    seekEmbedUrl(link, 120, { start: null, end: 9000 }),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=120&end=9000&autoplay=1"
  );
});

test("Vimeo starts at the part; platforms that can't seek play it all", () => {
  const vimeo = parseVideoLink("https://vimeo.com/76979871")!;
  assert.equal(clipEmbedUrl(vimeo, { start: 60, end: 900 }), "https://player.vimeo.com/video/76979871?dnt=1#t=60s");
  const insta = parseVideoLink("https://www.instagram.com/reel/abc123/")!;
  assert.equal(clipEmbedUrl(insta, { start: 60, end: 900 }), insta.embedUrl);
});
