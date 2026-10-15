import { test } from "node:test";
import assert from "node:assert/strict";
import { isbnFromUrl, isValidIsbn10, isValidIsbn13 } from "./isbn";

test("an Amazon book link carries its ISBN-10 as the ASIN", () => {
  assert.equal(isbnFromUrl("https://www.amazon.com/dp/1842706470?lv=shuf&channelId=500"), "1842706470");
  assert.equal(isbnFromUrl("https://www.amazon.co.uk/gp/product/0141354828/ref=x"), "0141354828");
  assert.equal(isbnFromUrl("https://www.amazon.com/Charlottes-Web-E-B-White/dp/0064400557"), "0064400557");
});

test("an ASIN that is not an ISBN is left alone", () => {
  assert.equal(isbnFromUrl("https://www.amazon.com/dp/B08N5WRWNW"), null);
  assert.equal(isbnFromUrl("https://www.amazon.com/dp/1234567890"), null);
});

test("ISBN-13s in a path are found, and other links give nothing", () => {
  assert.equal(isbnFromUrl("https://www.waterstones.com/book/the-gruffalo/9781509804764"), "9781509804764");
  assert.equal(isbnFromUrl("https://openlibrary.org/isbn/9780064400558"), "9780064400558");
  assert.equal(isbnFromUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), null);
  assert.equal(isbnFromUrl("not a link"), null);
});

test("checksums", () => {
  assert.ok(isValidIsbn10("0306406152"));
  assert.ok(isValidIsbn10("080442957X"));
  assert.equal(isValidIsbn10("0306406153"), false);
  assert.ok(isValidIsbn13("9780306406157"));
  assert.equal(isValidIsbn13("9780306406158"), false);
});
