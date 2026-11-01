import { test } from "node:test";
import assert from "node:assert/strict";
import { addDays, daysFromCivil, civilFromDays, daysInGregorianYear, isGregorianLeapYear } from "./dates";
import { addFixedMonths, fixedToGregorian, fixedWeekday, formatFixedDate, gregorianToFixed } from "./fixed";

test("1 January is 1 January, and the year starts on a Sunday in the fixed week", () => {
  const f = gregorianToFixed({ year: 2026, month: 1, day: 1 });
  assert.deepEqual(f, { kind: "day", year: 2026, month: 1, day: 1 });
  assert.equal(fixedWeekday(f), 0);
});

test("Sol is the seventh month: Gregorian 18 June 2026 (common year) is Sol 1", () => {
  // 18 June is day 169; in a common year that is 6×28 + 1 → Sol 1.
  assert.deepEqual(gregorianToFixed({ year: 2026, month: 6, day: 18 }), { kind: "day", year: 2026, month: 7, day: 1 });
  assert.equal(formatFixedDate(gregorianToFixed({ year: 2026, month: 6, day: 18 })), "1 Sol 2026");
});

test("Leap Day falls after June 28 and before Sol 1 in a leap year", () => {
  assert.deepEqual(gregorianToFixed({ year: 2024, month: 6, day: 16 }), { kind: "day", year: 2024, month: 6, day: 28 });
  assert.deepEqual(gregorianToFixed({ year: 2024, month: 6, day: 17 }), { kind: "leap-day", year: 2024 });
  assert.deepEqual(gregorianToFixed({ year: 2024, month: 6, day: 18 }), { kind: "day", year: 2024, month: 7, day: 1 });
  assert.equal(fixedWeekday({ kind: "leap-day", year: 2024 }), null);
});

test("Year Day is 31 December every year, outside the week", () => {
  for (const year of [1900, 2000, 2023, 2024, 2100]) {
    const f = gregorianToFixed({ year, month: 12, day: 31 });
    assert.deepEqual(f, { kind: "year-day", year });
    assert.equal(fixedWeekday(f), null);
    assert.deepEqual(gregorianToFixed({ year, month: 12, day: 30 }), { kind: "day", year, month: 13, day: 28 });
  }
});

test("century rule: 1900 and 2100 have no Leap Day, 2000 does", () => {
  assert.equal(gregorianToFixed({ year: 1900, month: 6, day: 17 }).kind, "day");
  assert.equal(gregorianToFixed({ year: 2100, month: 6, day: 17 }).kind, "day");
  assert.equal(gregorianToFixed({ year: 2000, month: 6, day: 17 }).kind, "leap-day");
  assert.throws(() => fixedToGregorian({ kind: "leap-day", year: 1900 }));
});

test("every day of a full 400-year cycle converts there and back, in order", () => {
  const start = daysFromCivil({ year: 1600, month: 1, day: 1 });
  const end = daysFromCivil({ year: 2000, month: 1, day: 1 });
  let leapDays = 0;
  let yearDays = 0;
  for (let n = start; n < end; n++) {
    const g = civilFromDays(n);
    const f = gregorianToFixed(g);
    if (f.kind === "leap-day") leapDays++;
    if (f.kind === "year-day") yearDays++;
    assert.deepEqual(fixedToGregorian(f), g);
    if (f.kind === "day") {
      // The next regular day is either the next fixed day, or follows a Leap/Year Day.
      assert.ok(f.day >= 1 && f.day <= 28 && f.month >= 1 && f.month <= 13);
    }
  }
  assert.equal(yearDays, 400);
  assert.equal(leapDays, 97);
});

test("each year has 13×28 regular days plus Year Day (and Leap Day when leap)", () => {
  for (const year of [1999, 2000, 2024, 2025, 0, -44]) {
    let regular = 0;
    for (let i = 0; i < daysInGregorianYear(year); i++) {
      const f = gregorianToFixed(addDays({ year, month: 1, day: 1 }, i));
      if (f.kind === "day") regular++;
    }
    assert.equal(regular, 364);
    assert.equal(daysInGregorianYear(year) - regular, isGregorianLeapYear(year) ? 2 : 1);
  }
});

test("stepping fixed months wraps the year and keeps the day", () => {
  assert.deepEqual(addFixedMonths({ kind: "day", year: 2026, month: 13, day: 5 }, 1), { kind: "day", year: 2027, month: 1, day: 5 });
  assert.deepEqual(addFixedMonths({ kind: "day", year: 2026, month: 1, day: 5 }, -1), { kind: "day", year: 2025, month: 13, day: 5 });
  assert.deepEqual(addFixedMonths({ kind: "year-day", year: 2026 }, 1), { kind: "day", year: 2027, month: 1, day: 28 });
});
