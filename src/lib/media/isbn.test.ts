import { test } from "node:test";
import assert from "node:assert/strict";
import { amazonAsinFromUrl, isbn10Of, isbnFromUrl, isValidIsbn10, isValidIsbn13 } from "./isbn";

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

test("an ISBN-13 converts to its ISBN-10 when it has one", () => {
  assert.equal(isbn10Of("9780306406157"), "0306406152");
  assert.equal(isbn10Of("9780064400558"), "0064400557");
  assert.equal(isbn10Of("0306406152"), "0306406152");
  assert.equal(isbn10Of("9791234567896"), null);
  assert.equal(isbn10Of("nonsense"), null);
});

test("an Amazon ASIN is found whether or not it is an ISBN", () => {
  assert.equal(amazonAsinFromUrl("https://www.amazon.co.uk/Falsification-Science/dp/B08WK2H7SJ/ref=sr_1_2?crid=x"), "B08WK2H7SJ");
  assert.equal(amazonAsinFromUrl("https://www.amazon.com/dp/0679774009?lv=shuf"), "0679774009");
  assert.equal(amazonAsinFromUrl("https://www.amazon.co.za/Climate/dp/1399902253"), "1399902253");
  assert.equal(amazonAsinFromUrl("https://www.waterstones.com/book/x/9781509804764"), null);
  assert.equal(amazonAsinFromUrl("https://www.amazon.co.uk/s?k=books"), null);
});
