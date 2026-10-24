import { test } from "node:test";
import assert from "node:assert/strict";
import { CURRENCIES, normalizeCurrency } from "./currencies";

test("normalizeCurrency accepts supported codes in any case", () => {
  assert.equal(normalizeCurrency("GBP"), "gbp");
  assert.equal(normalizeCurrency(" usd "), "usd");
});

test("normalizeCurrency rejects typos and unsupported codes", () => {
  assert.equal(normalizeCurrency("uds"), null);
  assert.equal(normalizeCurrency(""), null);
  assert.equal(normalizeCurrency(null), null);
  assert.equal(normalizeCurrency("jpy"), null);
});

test("every listed code is a unique lowercase three-letter code", () => {
  const codes = CURRENCIES.map((c) => c.code);
  assert.equal(new Set(codes).size, codes.length);
  for (const code of codes) assert.match(code, /^[a-z]{3}$/);
});
