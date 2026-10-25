import { test } from "node:test";
import assert from "node:assert/strict";
import { circlePicturesInHtml, isCirclePictureUrl, withCopiedPictures } from "./circle-pictures";

test("only Circle's own hosts count as Circle pictures", () => {
  assert.equal(isCirclePictureUrl("https://app.circle.so/rails/active_storage/representations/redirect/abc/me.jpg"), true);
  assert.equal(isCirclePictureUrl("https://assets-v2.circle.so/x8k2"), true);
  assert.equal(isCirclePictureUrl("https://circle.so/x.png"), true);
  assert.equal(isCirclePictureUrl("https://notcircle.so/x.png"), false);
  assert.equal(isCirclePictureUrl("https://circle.so.example.com/x.png"), false);
  assert.equal(isCirclePictureUrl("https://kzlobbvbnifqzvkmzokc.supabase.co/storage/v1/object/public/uploads/a.jpg"), false);
  assert.equal(isCirclePictureUrl("javascript:alert(1)"), false);
  assert.equal(isCirclePictureUrl(null), false);
  assert.equal(isCirclePictureUrl("not a url"), false);
});

test("finds each Circle <img> once, reading &amp; back as &", () => {
  const html =
    '<p>Hi</p><img src="https://assets-v2.circle.so/a?x=1&amp;y=2"><img alt="b" src=\'https://assets-v3.circle.so/b\'>' +
    '<img src="https://assets-v2.circle.so/a?x=1&amp;y=2"><img src="https://example.com/c.png">';
  assert.deepEqual(circlePicturesInHtml(html), ["https://assets-v2.circle.so/a?x=1&y=2", "https://assets-v3.circle.so/b"]);
  assert.deepEqual(circlePicturesInHtml(null), []);
});

test("swaps only the copied <img> addresses and leaves links alone", () => {
  const html =
    '<a href="https://assets-v2.circle.so/a">old</a><img src="https://assets-v2.circle.so/a"><img src="https://assets-v2.circle.so/b">';
  const out = withCopiedPictures(html, new Map([["https://assets-v2.circle.so/a", "https://ours.example/a.jpg"]]));
  assert.equal(
    out,
    '<a href="https://assets-v2.circle.so/a">old</a><img src="https://ours.example/a.jpg"><img src="https://assets-v2.circle.so/b">'
  );
  assert.equal(withCopiedPictures(html, new Map()), html);
});
