import assert from "node:assert/strict";
import { test } from "node:test";
import { isExternalHref } from "./external-links";

test("links to other sites are external", () => {
  assert.equal(isExternalHref("https://www.zanzibarrooms.com/stays/1", "relate.click"), true);
  assert.equal(isExternalHref("https://mzunguzanzibar.com/guides", "relate.click"), true);
  assert.equal(isExternalHref("http://example.com", "www.mzunguzanzibar.com"), true);
  assert.equal(isExternalHref("//example.com/x", "relate.click"), true);
});

test("links on the same site stay in the same window", () => {
  assert.equal(isExternalHref("/c/mzunguzanzibar/spaces", "relate.click"), false);
  assert.equal(isExternalHref("#top", "relate.click"), false);
  assert.equal(isExternalHref("https://relate.click/pricing", "relate.click"), false);
  assert.equal(isExternalHref("https://www.mzunguzanzibar.com/x", "mzunguzanzibar.com"), false);
  assert.equal(isExternalHref("https://mzunguzanzibar.com/x", "www.mzunguzanzibar.com"), false);
  assert.equal(isExternalHref("http://localhost:3000/x", "localhost:3000"), false);
});

test("non-web links are left alone", () => {
  assert.equal(isExternalHref("mailto:hi@example.com", "relate.click"), false);
  assert.equal(isExternalHref("tel:+447951769553", "relate.click"), false);
  assert.equal(isExternalHref("javascript:void(0)", "relate.click"), false);
});
