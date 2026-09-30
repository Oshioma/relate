import { test } from "node:test";
import assert from "node:assert/strict";
import { wwwCounterpart } from "./custom-domain.ts";

test("wwwCounterpart pairs www and bare hostnames", () => {
  assert.equal(wwwCounterpart("www.mzunguzanzibar.com"), "mzunguzanzibar.com");
  assert.equal(wwwCounterpart("mzunguzanzibar.com"), "www.mzunguzanzibar.com");
  assert.equal(wwwCounterpart("WWW.Foo.com:3000"), "foo.com");
  assert.equal(wwwCounterpart("www.localhost"), null);
});
