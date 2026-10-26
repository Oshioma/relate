import { test } from "node:test";
import assert from "node:assert/strict";
import { pickHomepagePhotos, readPhotoUrl } from "./homepage-photos";

const a = { id: "a", cover_image_url: "https://x.test/a.jpg" };
const b = { id: "b", cover_image_url: "https://x.test/b.jpg" };
const c = { id: "c", cover_image_url: "https://x.test/c.jpg" };
const bare = { id: "bare", cover_image_url: null };

test("readPhotoUrl keeps an https address and drops anything else", () => {
  assert.equal(readPhotoUrl(" https://x.test/p.jpg "), "https://x.test/p.jpg");
  assert.equal(readPhotoUrl("http://x.test/p.jpg"), null);
  assert.equal(readPhotoUrl("javascript:alert(1)"), null);
  assert.equal(readPhotoUrl(""), null);
  assert.equal(readPhotoUrl(null), null);
});

test("with nothing picked, the featured covers fill the slots in order", () => {
  assert.deepEqual(pickHomepagePhotos(null, [bare, a, b, c], null), {
    heroCommunity: a,
    whyPhoto: b.cover_image_url,
    closingPhoto: c.cover_image_url,
  });
  assert.deepEqual(pickHomepagePhotos(null, [a], null), {
    heroCommunity: a,
    whyPhoto: a.cover_image_url,
    closingPhoto: a.cover_image_url,
  });
  assert.deepEqual(pickHomepagePhotos(null, [bare], null), { heroCommunity: null, whyPhoto: null, closingPhoto: null });
});

test("the admin's picks win over the automatic choice", () => {
  assert.deepEqual(
    pickHomepagePhotos({ why_photo_url: "https://x.test/why.jpg", closing_photo_url: "https://x.test/end.jpg" }, [a, b, c], c),
    { heroCommunity: c, whyPhoto: "https://x.test/why.jpg", closingPhoto: "https://x.test/end.jpg" }
  );
  // A bad stored address falls back rather than breaking the page.
  assert.equal(pickHomepagePhotos({ why_photo_url: "data:image/png;base64,xx" }, [a, b], null).whyPhoto, b.cover_image_url);
});
