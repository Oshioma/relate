import { test } from "node:test";
import assert from "node:assert/strict";

import { interpolateWindow, jumpWindow, parseJumpDate } from "./jump-date";
import { fractionOf, positionAt } from "./time";

const position = (text: string) => {
  const parsed = parseJumpDate(text);
  assert.ok(parsed.ok, `expected "${text}" to parse: ${!parsed.ok ? parsed.reason : ""}`);
  return parsed.position;
};

test("the forms a reader types all land on the same year", () => {
  // 10,500 BCE is astronomical −10,499: there is no year zero.
  for (const text of ["10500 BCE", "10,500 BCE", "10 500 BCE", "10500 BC", "10,500 B.C.", "BC 10500", "c. 10,500 BCE", "-10500"]) {
    assert.equal(position(text), -10_499, text);
  }
});

test("CE and AD, before or after, and bare years", () => {
  for (const text of ["500 CE", "500 AD", "AD 500", "A.D. 500", "500"]) assert.equal(position(text), 500, text);
  assert.equal(position("1066"), 1066);
});

test("0 is the turn of the eras", () => {
  assert.equal(position("0"), 0);
  assert.equal(parseJumpDate("0 BC").ok, false, "there is no year 0 BC");
});

test("years ago and BP count back from 1950, like the ruler", () => {
  assert.equal(position("12,900 BP"), 1950 - 12_900);
  assert.equal(position("65 million years ago"), 1950 - 65_000_000);
  assert.equal(position("65 mya"), 1950 - 65_000_000);
  assert.equal(position("65 Ma"), 1950 - 65_000_000);
  assert.equal(position("4.5 bya"), 1950 - 4_500_000_000);
  assert.equal(position("4.5 billion years ago"), 1950 - 4_500_000_000);
  assert.equal(position("12 ka"), 1950 - 12_000);
  assert.equal(position("100,000 years ago"), 1950 - 100_000);
});

test("nonsense and out-of-range dates say why instead of guessing", () => {
  for (const text of ["", "yesterday", "12/10/1492", "-500 BC"]) {
    const parsed = parseJumpDate(text);
    assert.equal(parsed.ok, false, text);
  }
  const tooOld = parseJumpDate("20 billion years ago");
  assert.ok(!tooOld.ok && /outside the timeline/.test(tooOld.reason));
});

const NOW = 2026.75;

test("a jump centres the date and keeps a sensible zoom", () => {
  const current = { from: -3000, to: -2000 };
  const next = jumpWindow(current, -10_499, "linear", NOW);
  assert.equal((next.from + next.to) / 2, -10_499);
  assert.equal(next.to - next.from, 1000, "the zoom should be kept when it already suits the date");
});

test("zoomed out to all of time, a jump to a recent date comes in", () => {
  const all = { from: -13_800_000_000, to: 2030 };
  const next = jumpWindow(all, 500, "linear", NOW);
  assert.ok(next.to - next.from <= 2000, `span ${next.to - next.from}`);
  assert.ok(next.from <= 500 && next.to >= 500);
});

test("zoomed into a month, a jump into deep time comes out", () => {
  const month = { from: 2026, to: 2026.08 };
  const next = jumpWindow(month, 1950 - 65_000_000, "linear", NOW);
  assert.ok(next.to - next.from >= 30_000, `span ${next.to - next.from}`);
});

test("on the log axis the date sits at the drawn centre", () => {
  const current = { from: -1_000_000, to: 1000 };
  const next = jumpWindow(current, -10_499, "log", NOW);
  // fractionOf uses the real present; the centre must be close, not exact.
  const centre = positionAt(next, 0.5, "log");
  assert.ok(Math.abs(centre - -10_499) < 5, `centre ${centre}`);
  assert.ok(Math.abs(fractionOf(next, -10_499, "log") - 0.5) < 0.001);
});

test("the flight starts and ends exactly on its windows", () => {
  const a = { from: 1900, to: 2000 };
  const b = { from: -65_100_000, to: -64_900_000 };
  assert.deepEqual(interpolateWindow(a, b, 0, NOW), a);
  assert.deepEqual(interpolateWindow(a, b, 1, NOW), b);
  const mid = interpolateWindow(a, b, 0.5, NOW);
  const span = mid.to - mid.from;
  assert.ok(span > 100 && span < 200_000, `the span should change geometrically, got ${span}`);
});
