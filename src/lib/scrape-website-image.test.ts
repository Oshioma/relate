import { test } from "node:test";
import assert from "node:assert/strict";
import { extractImagesFromHtml, isTrackingPixel } from "./scrape-website-image";

test("tracking pixels are never picked as a page's image", () => {
  const html = `
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=927335629450310&amp;ev=PageView&amp;noscript=1"/></noscript>
    <img src="https://www.google-analytics.com/collect?v=1&tid=UA-1" />
    <img src="https://example.com/spacer.gif" width="1" height="1">
    <img src="https://example.com/uploads/festival-stage.jpg" width="1200" height="800">
  `;
  assert.deepEqual(extractImagesFromHtml(html, "https://example.com/event"), ["https://example.com/uploads/festival-stage.jpg"]);
});

test("isTrackingPixel recognises common trackers and 1px tags, not ordinary photos", () => {
  assert.ok(isTrackingPixel("https://www.facebook.com/tr?id=1&ev=PageView&noscript=1"));
  assert.ok(isTrackingPixel("https://bat.bing.com/action/0?ti=1"));
  assert.ok(isTrackingPixel("https://example.com/a.gif", '<img width="1" height="1" src="https://example.com/a.gif">'));
  assert.ok(!isTrackingPixel("https://example.com/uploads/2026/02/ZM259.JPG-scaled.jpeg", '<img width="1024" src="x">'));
  assert.ok(!isTrackingPixel("https://cdn.example.com/pixels/beach-10.jpg"));
});

test("share images still come first", () => {
  const html = `<meta property="og:image" content="https://example.com/share.jpg"><img src="https://example.com/inline.jpg">`;
  assert.deepEqual(extractImagesFromHtml(html, "https://example.com/"), ["https://example.com/share.jpg", "https://example.com/inline.jpg"]);
});
