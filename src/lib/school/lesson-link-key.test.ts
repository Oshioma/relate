import { test } from "node:test";
import assert from "node:assert/strict";
import { lessonLinkKey } from "./lesson-link-key";

test("spellings of the same page share one key", () => {
  const key = lessonLinkKey("https://www.example.com/articles/bees");
  assert.ok(key);
  for (const raw of [
    "http://example.com/articles/bees",
    "https://example.com/articles/bees/",
    "example.com/articles/bees",
    "https://www.example.com/articles/bees#the-hive",
    "https://www.example.com/articles/bees?utm_source=facebook&fbclid=abc",
    "  https://EXAMPLE.com/articles/bees  ",
  ]) {
    assert.equal(lessonLinkKey(raw), key, raw);
  }
});

test("different pages, or a query that picks the page, stay different", () => {
  assert.notEqual(lessonLinkKey("https://example.com/a"), lessonLinkKey("https://example.com/b"));
  assert.notEqual(lessonLinkKey("https://example.com/p?id=1"), lessonLinkKey("https://example.com/p?id=2"));
  assert.equal(lessonLinkKey("https://example.com/p?b=2&a=1"), lessonLinkKey("https://example.com/p?a=1&b=2"));
});

test("spellings of the same video share one key", () => {
  const key = lessonLinkKey("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(lessonLinkKey("https://youtu.be/dQw4w9WgXcQ?si=abc"), key);
  assert.equal(lessonLinkKey("https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=42s"), key);
});

test("nothing to key gives null", () => {
  assert.equal(lessonLinkKey(""), null);
  assert.equal(lessonLinkKey(null), null);
  assert.equal(lessonLinkKey("not a link at all"), null);
});
