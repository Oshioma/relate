import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  addMonths,
  addYears,
  civilDateAt,
  civilFromDays,
  daysFromCivil,
  formatIsoDate,
  formatLongDate,
  isGregorianLeapYear,
  parseIsoDate,
  startOfDayIn,
  todayIn,
  weekdayOf,
} from "./dates";

test("day count agrees with JavaScript's Date across 1900–2200", () => {
  for (let y = 1900; y <= 2200; y += 7) {
    for (const [m, d] of [[1, 1], [2, 28], [3, 1], [12, 31]]) {
      assert.equal(daysFromCivil({ year: y, month: m, day: d }) * 86400000, Date.UTC(y, m - 1, d));
    }
  }
});

test("civilFromDays inverts daysFromCivil, including BCE years", () => {
  for (let n = -2_200_000; n < 3_000_000; n += 997) {
    assert.equal(daysFromCivil(civilFromDays(n)), n);
  }
});

test("Gregorian leap years and the century rule", () => {
  assert.equal(isGregorianLeapYear(1900), false);
  assert.equal(isGregorianLeapYear(2000), true);
  assert.equal(isGregorianLeapYear(2024), true);
  assert.equal(isGregorianLeapYear(2100), false);
  assert.equal(isGregorianLeapYear(0), true);
});

test("weekdays", () => {
  assert.equal(weekdayOf({ year: 1970, month: 1, day: 1 }), 4); // Thursday
  assert.equal(weekdayOf({ year: 2026, month: 11, day: 1 }), 0); // Sunday
  assert.equal(weekdayOf({ year: 2000, month: 2, day: 29 }), 2); // Tuesday
});

test("month and year steps clamp at month ends and across year boundaries", () => {
  assert.deepEqual(addMonths({ year: 2026, month: 1, day: 31 }, 1), { year: 2026, month: 2, day: 28 });
  assert.deepEqual(addMonths({ year: 2024, month: 1, day: 31 }, 1), { year: 2024, month: 2, day: 29 });
  assert.deepEqual(addMonths({ year: 2026, month: 12, day: 15 }, 1), { year: 2027, month: 1, day: 15 });
  assert.deepEqual(addMonths({ year: 2026, month: 1, day: 15 }, -1), { year: 2025, month: 12, day: 15 });
  assert.deepEqual(addYears({ year: 2024, month: 2, day: 29 }, 1), { year: 2025, month: 2, day: 28 });
  assert.deepEqual(addDays({ year: 2026, month: 12, day: 31 }, 1), { year: 2027, month: 1, day: 1 });
});

test("ISO dates round-trip and reject impossible dates", () => {
  assert.deepEqual(parseIsoDate("2026-11-01"), { year: 2026, month: 11, day: 1 });
  assert.equal(parseIsoDate("2026-02-29"), null);
  assert.equal(parseIsoDate("2024-02-29") !== null, true);
  assert.equal(parseIsoDate("nonsense"), null);
  assert.equal(formatIsoDate({ year: -43, month: 3, day: 15 }), "-0043-03-15");
  assert.deepEqual(parseIsoDate("-0043-03-15"), { year: -43, month: 3, day: 15 });
  assert.equal(formatIsoDate({ year: 33, month: 4, day: 3 }), "0033-04-03");
  assert.equal(formatLongDate({ year: -43, month: 3, day: 15 }, false), "15 March 44 BCE");
});

test("today depends on the timezone near midnight", () => {
  // 21:30 UTC on 1 November 2026 is already 2 November in Zanzibar (UTC+3)
  // and in Auckland, but still 1 November in London and Los Angeles.
  const instant = new Date(Date.UTC(2026, 10, 1, 21, 30));
  assert.deepEqual(todayIn("Africa/Dar_es_Salaam", instant), { year: 2026, month: 11, day: 2 });
  assert.deepEqual(todayIn("Pacific/Auckland", instant), { year: 2026, month: 11, day: 2 });
  assert.deepEqual(todayIn("Europe/London", instant), { year: 2026, month: 11, day: 1 });
  assert.deepEqual(todayIn("America/Los_Angeles", instant), { year: 2026, month: 11, day: 1 });
  // Just before and after midnight in Zanzibar.
  assert.deepEqual(civilDateAt(new Date(Date.UTC(2026, 10, 1, 20, 59, 59)), "Africa/Dar_es_Salaam"), { year: 2026, month: 11, day: 1 });
  assert.deepEqual(civilDateAt(new Date(Date.UTC(2026, 10, 1, 21, 0, 0)), "Africa/Dar_es_Salaam"), { year: 2026, month: 11, day: 2 });
});

test("start of a local day, including a daylight-saving change", () => {
  assert.equal(startOfDayIn({ year: 2026, month: 11, day: 2 }, "Africa/Dar_es_Salaam").toISOString(), "2026-11-01T21:00:00.000Z");
  assert.equal(startOfDayIn({ year: 2026, month: 7, day: 1 }, "Europe/London").toISOString(), "2026-06-30T23:00:00.000Z");
  // São Paulo used to skip midnight when DST began (2018-11-04 00:00 → 01:00).
  const start = startOfDayIn({ year: 2018, month: 11, day: 4 }, "America/Sao_Paulo");
  assert.deepEqual(civilDateAt(start, "America/Sao_Paulo"), { year: 2018, month: 11, day: 4 });
  assert.deepEqual(civilDateAt(new Date(start.getTime() - 1000), "America/Sao_Paulo"), { year: 2018, month: 11, day: 3 });
});
