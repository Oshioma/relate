import { test } from "node:test";
import assert from "node:assert/strict";
import { toShareUrl } from "./share-url";
import { guideUrl } from "./guides/where-to-stay/page-data";

test("a link on this site moves onto the community's own domain", () => {
  const here = "https://mzunguzanzibar.relate.click";
  assert.equal(toShareUrl(`${here}/guides/where-to-stay-in-zanzibar#paje`, here, "https://mzunguzanzibar.com"), "https://mzunguzanzibar.com/guides/where-to-stay-in-zanzibar#paje");
  assert.equal(toShareUrl("/events?x=1", here, "https://mzunguzanzibar.com"), "https://mzunguzanzibar.com/events?x=1");
});

test("links elsewhere, or with no custom domain, are left alone", () => {
  const here = "https://mzunguzanzibar.relate.click";
  assert.equal(toShareUrl("https://example.com/a", here, "https://mzunguzanzibar.com"), "https://example.com/a");
  assert.equal(toShareUrl(`${here}/a`, here, null), `${here}/a`);
});

test("the guide's canonical URL prefers the custom domain on any host", () => {
  assert.equal(guideUrl("mzunguzanzibar.relate.click", "mzunguzanzibar", undefined, "https://mzunguzanzibar.com").absolute, "https://mzunguzanzibar.com/guides/where-to-stay-in-zanzibar");
});
