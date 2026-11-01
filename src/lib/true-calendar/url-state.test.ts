import { test } from "node:test";
import assert from "node:assert/strict";
import { parseYearInput, readCalendarUrl, writeCalendarUrl } from "./url-state";

test("a deep link restores date, view and timezone", () => {
  assert.deepEqual(readCalendarUrl("?date=2026-11-01&view=lunar&tz=Africa/Dar_es_Salaam"), {
    date: { year: 2026, month: 11, day: 1 },
    view: "lunar",
    tz: "Africa/Dar_es_Salaam",
  });
});

test("no date, a bad date or a bad timezone falls back to today / the viewer's zone", () => {
  assert.deepEqual(readCalendarUrl(""), { date: null, view: "fixed", tz: null });
  assert.deepEqual(readCalendarUrl("?date=2026-02-30&tz=Mars/Olympus"), { date: null, view: "fixed", tz: null });
});

test("writing keeps unrelated parameters and drops defaults", () => {
  assert.equal(writeCalendarUrl("?join=1", { date: { year: 2026, month: 3, day: 5 }, view: "fixed" }), "?join=1&date=2026-03-05");
  assert.equal(writeCalendarUrl("?date=2026-03-05&view=lunar", { date: null, view: "fixed" }), "");
});

test("year input accepts BCE/CE and astronomical numbers", () => {
  assert.equal(parseYearInput("44 BCE"), -43);
  assert.equal(parseYearInput("1 BC"), 0);
  assert.equal(parseYearInput("-43"), -43);
  assert.equal(parseYearInput("1066 CE"), 1066);
  assert.equal(parseYearInput("2026"), 2026);
  assert.equal(parseYearInput("0 BCE"), null);
  assert.equal(parseYearInput("soon"), null);
});
