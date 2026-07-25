// Best-effort "Open now" detection over the free-text `businesses.opening_hours`
// field. This is a heuristic, not a full schedule parser: opening hours are typed
// by members in whatever shape they like ("Daily, 8am – 10pm", "Mon–Fri 9–5",
// "24/7"). We recognise the common shapes and return "unknown" whenever we can't
// confidently parse, so the UI simply shows nothing rather than a wrong badge.

export type OpenState = "open" | "closed" | "unknown";

type Interval = { days: Set<number>; start: number; end: number };

const ALL_DAYS = new Set([0, 1, 2, 3, 4, 5, 6]);

// Sunday = 0, matching Date.getDay().
const DAY_INDEX: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, weds: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

function dayIndex(token: string): number | null {
  const key = token.toLowerCase().replace(/\.$/, "");
  return key in DAY_INDEX ? DAY_INDEX[key] : null;
}

// Days named or ranged in a clause: "mon-fri", "sat & sun", "weekends", "daily".
function parseDays(text: string): Set<number> | null {
  const lower = text.toLowerCase();
  if (/\b(daily|every\s?day|all\s?week|everyday)\b/.test(lower)) return new Set(ALL_DAYS);
  if (/\bweekends?\b/.test(lower)) return new Set([0, 6]);
  if (/\bweekdays?\b/.test(lower)) return new Set([1, 2, 3, 4, 5]);

  const range = lower.match(/([a-z]{3,9})\s*(?:-|to|–|—|through)\s*([a-z]{3,9})/);
  if (range) {
    const from = dayIndex(range[1]);
    const to = dayIndex(range[2]);
    if (from !== null && to !== null) {
      const days = new Set<number>();
      for (let i = 0; i < 7; i++) {
        const d = (from + i) % 7;
        days.add(d);
        if (d === to) break;
      }
      return days;
    }
  }

  const singles = lower.match(/[a-z]{3,9}/g) ?? [];
  const days = new Set<number>();
  for (const token of singles) {
    const idx = dayIndex(token);
    if (idx !== null) days.add(idx);
  }
  return days.size > 0 ? days : null;
}

// Minutes-since-midnight for one time token: "8am", "9:30", "17:00", "10 pm".
function parseTime(hour: string, minute: string | undefined, meridiem: string | undefined): number | null {
  let h = Number(hour);
  const m = minute ? Number(minute) : 0;
  if (!Number.isInteger(h) || h < 0 || h > 24 || m < 0 || m > 59) return null;
  if (meridiem) {
    const pm = meridiem.toLowerCase().startsWith("p");
    if (h === 12) h = pm ? 12 : 0;
    else if (pm) h += 12;
  }
  return h * 60 + m;
}

const TIME = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i;
const TIME_RANGE = new RegExp(`${TIME.source}\\s*(?:-|to|–|—|until|till)\\s*${TIME.source}`, "i");

function parseTimeRange(text: string): { start: number; end: number } | null {
  const lower = text.toLowerCase();
  if (/\b(24\s?\/\s?7|24\s?hours?|open\s?24|all\s?day|round\s?the\s?clock)\b/.test(lower)) {
    return { start: 0, end: 24 * 60 };
  }
  const m = text.match(TIME_RANGE);
  if (!m) return null;
  const start = parseTime(m[1], m[2], m[3]);
  let end = parseTime(m[4], m[5], m[6]);
  if (start === null || end === null) return null;

  // "9-5" with no am/pm almost always means 9:00–17:00, not an overnight shift.
  // When neither side named a meridiem and the end lands before the start in
  // the morning, read the end as afternoon.
  const noMeridiem = !m[3] && !m[6];
  if (noMeridiem && end <= start && end <= 11 * 60) {
    end += 12 * 60;
  }
  return { start, end };
}

// Split into clauses on newlines, semicolons and commas, then pair each clause's
// day scope with its time range — carrying a day scope forward to the next clause
// so "Daily, 8am – 10pm" and "Mon–Fri, 9–5" both resolve correctly.
function parseIntervals(openingHours: string): Interval[] {
  const clauses = openingHours.split(/[\n;,]+/).map((c) => c.trim()).filter(Boolean);
  const intervals: Interval[] = [];
  let pendingDays: Set<number> | null = null;

  for (const clause of clauses) {
    const days = parseDays(clause);
    const range = parseTimeRange(clause);
    if (range) {
      const scope = days ?? pendingDays ?? new Set(ALL_DAYS);
      intervals.push({ days: scope, start: range.start, end: range.end });
      pendingDays = null;
    } else if (days) {
      pendingDays = days;
    }
  }
  return intervals;
}

function withinInterval(interval: Interval, day: number, minutes: number): boolean {
  if (interval.end > interval.start) {
    return interval.days.has(day) && minutes >= interval.start && minutes < interval.end;
  }
  // Overnight range (e.g. 20:00–02:00): open late on its start day, or early on
  // the following day.
  const prevDay = (day + 6) % 7;
  return (
    (interval.days.has(day) && minutes >= interval.start) ||
    (interval.days.has(prevDay) && minutes < interval.end)
  );
}

export function getOpenState(openingHours: string | null | undefined, now: Date = new Date()): OpenState {
  if (!openingHours || !openingHours.trim()) return "unknown";
  const normalized = openingHours.replace(/[–—]/g, "-");
  const intervals = parseIntervals(normalized);
  if (intervals.length === 0) return "unknown";

  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return intervals.some((interval) => withinInterval(interval, day, minutes)) ? "open" : "closed";
}
