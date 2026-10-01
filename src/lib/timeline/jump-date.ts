import {
  astronomicalFromEra,
  astronomicalFromYearsAgo,
  clampWindow,
  formatYear,
  logValueOf,
  positionFromLogValue,
  presentPosition,
  TIMELINE_MAX_YEAR,
  TIMELINE_MIN_YEAR,
  type TimeScale,
  type TimeWindow,
} from "./time";

// "JUMP TO DATE" — a typed date, and the window that goes with it.
//
// People write a date the way they read it, not the way it is stored, so the
// parser accepts the forms a reader actually types:
//
//   10500 BCE · 10,500 BCE · 2600 BC · B.C. 2600 · 500 CE · 500 AD · AD 500
//   1066 · 0 · -2600 · c. 2600 BC
//   12,900 BP · 65 million years ago · 65 mya · 4.5 bya · 12 ka
//
// A bare number is a CE year (and a minus sign means BCE), because that is
// what "1066" and "-44" mean to a reader. "0" is the turn of the eras — the
// line on the ruler marked 0 — not a year anyone lived through. "Years ago"
// and BP count back from 1950, the same reference the ruler uses for its own
// "million years ago" labels, so a typed date lands under the label that
// matches it.

export type JumpParse = { ok: true; position: number; label: string } | { ok: false; reason: string };

const MULTIPLIERS: Record<string, number> = {
  k: 1_000,
  thousand: 1_000,
  m: 1_000_000,
  mn: 1_000_000,
  million: 1_000_000,
  b: 1_000_000_000,
  bn: 1_000_000_000,
  billion: 1_000_000_000,
};

// Geological shorthand: a number of these, before present.
const AGO_ABBREVIATIONS: Record<string, number> = {
  ka: 1_000,
  kya: 1_000,
  ma: 1_000_000,
  mya: 1_000_000,
  ga: 1_000_000_000,
  gya: 1_000_000_000,
  bya: 1_000_000_000,
};

const NUMBER = String.raw`(-?\d+(?:\.\d+)?)`;
// \b so the "b" of billion can never swallow the "b" of BCE.
const MULTIPLIER = String.raw`(?:(k|thousand|mn|million|m|bn|billion|b)\b)?`;

function normalise(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // "c. 2600 BC", "circa", "~": approximately is how the reader feels, not
      // a different date.
      .replace(/^(c\.|ca\.|circa|about|around|~)\s*/, "")
      // "B.C.E." → "bce", "A.D." → "ad". Only dots after a letter, so a
      // decimal point in "4.5 bya" is left alone.
      .replace(/([a-z])\./g, "$1")
      // Thousands separators, including the thin and ordinary spaces some
      // people use: "10,500", "10 500", "10_500".
      .replace(/(\d)[,_   ](?=\d{3}\b)/g, "$1")
      .replace(/\s+/g, " ")
  );
}

/** Read a typed date. Never throws; an unreadable date says why. */
export function parseJumpDate(input: string): JumpParse {
  const text = normalise(input);
  if (!text) return { ok: false, reason: "Type a date, for example 10,500 BCE or 500 AD." };

  const position = readPosition(text);
  if (position === null) {
    return { ok: false, reason: `Couldn't read “${input.trim()}” as a date. Try 10,500 BCE, 500 AD or 65 million years ago.` };
  }
  if (!Number.isFinite(position) || position < TIMELINE_MIN_YEAR || position > TIMELINE_MAX_YEAR) {
    return { ok: false, reason: "That date is outside the timeline, which runs from the Big Bang to 3000 CE." };
  }
  return { ok: true, position, label: position === 0 ? "0" : formatYear(Math.round(position)) };
}

function readPosition(text: string): number | null {
  // Before present: "12900 bp", "65 million years ago", "4.5 bya", "12 ka".
  const ago = text.match(new RegExp(String.raw`^${NUMBER} ?${MULTIPLIER} ?(?:years?|yrs?|y)? ?(ago|bp|before present)$`));
  if (ago) {
    const amount = Number(ago[1]) * (ago[2] ? MULTIPLIERS[ago[2]] : 1);
    return amount < 0 ? null : astronomicalFromYearsAgo(amount);
  }
  const abbreviated = text.match(new RegExp(String.raw`^${NUMBER} ?(ka|kya|ma|mya|ga|gya|bya)$`));
  if (abbreviated) {
    const amount = Number(abbreviated[1]) * AGO_ABBREVIATIONS[abbreviated[2]];
    return amount < 0 ? null : astronomicalFromYearsAgo(amount);
  }

  // An era, before or after the number: "2600 bc", "ad 500", "2 million bce".
  const suffixed = text.match(new RegExp(String.raw`^${NUMBER} ?${MULTIPLIER} ?(bce|bc|ce|ad)?$`));
  const prefixed = text.match(new RegExp(String.raw`^(bce|bc|ce|ad) ?${NUMBER} ?${MULTIPLIER}$`));
  const [rawNumber, rawMultiplier, rawEra] = suffixed
    ? [suffixed[1], suffixed[2], suffixed[3]]
    : prefixed
      ? [prefixed[2], prefixed[3], prefixed[1]]
      : [null, null, null];
  if (rawNumber === null) return null;

  const value = Number(rawNumber) * (rawMultiplier ? MULTIPLIERS[rawMultiplier] : 1);
  if (!rawEra) {
    // Bare: positive is CE, negative is BCE, zero is the turn of the eras.
    if (value === 0) return 0;
    return value > 0 ? value : astronomicalFromEra(-value, "BCE");
  }
  // "-500 BC" has no sensible reading; "0 BC" and "0 AD" don't exist.
  if (value <= 0) return null;
  return astronomicalFromEra(value, rawEra === "bce" || rawEra === "bc" ? "BCE" : "CE");
}

/**
 * The window to travel to: the date in the centre, at the current zoom where
 * that is sensible.
 *
 * "Sensible" has two edges. Zoomed out to all of time, a jump to 500 CE must
 * come in, or the date is centred inside a window where recorded history is a
 * fraction of a pixel — so the span is capped at about the date's own age.
 * Zoomed into a single month, a jump to 65 million years ago must come out,
 * because no record that old is dated to a month — so the span has a floor
 * proportional to that age too. Anywhere between, the zoom is left alone.
 */
export function jumpWindow(current: TimeWindow, position: number, scale: TimeScale = "linear", now: number = presentPosition()): TimeWindow {
  const age = Math.abs(now - position);

  if (scale === "log") {
    // On the log axis "the centre" is the centre of the drawn picture, so the
    // window is built in log space: same log width, centred on the date.
    const half = (logValueOf(current.to, now) - logValueOf(current.from, now)) / 2;
    const centre = logValueOf(position, now);
    return clampWindow({ from: positionFromLogValue(centre - half, now), to: positionFromLogValue(centre + half, now) });
  }

  const ceiling = Math.max(200, age * 1.2);
  const floor = Math.max(0.05, age * 0.0005);
  const span = Math.min(ceiling, Math.max(floor, current.to - current.from));
  return clampWindow({ from: position - span / 2, to: position + span / 2 });
}

/**
 * A point along the flight from one window to another, t from 0 to 1.
 *
 * Interpolated the way a map flies rather than the way a slider slides: the
 * span changes geometrically (so a zoom from billions of years to centuries
 * spends equal time at each order of magnitude), and the centre travels in log
 * distance from now (so a trip from 2026 to 65 million years ago does not cross
 * all of recorded history in the first frame).
 */
export function interpolateWindow(from: TimeWindow, to: TimeWindow, t: number, now: number = presentPosition()): TimeWindow {
  if (t <= 0) return from;
  if (t >= 1) return to;
  const spanA = Math.max(1e-6, from.to - from.from);
  const spanB = Math.max(1e-6, to.to - to.from);
  const span = Math.exp(Math.log(spanA) + (Math.log(spanB) - Math.log(spanA)) * t);
  const centreA = logValueOf((from.from + from.to) / 2, now);
  const centreB = logValueOf((to.from + to.to) / 2, now);
  const centre = positionFromLogValue(centreA + (centreB - centreA) * t, now);
  return clampWindow({ from: centre - span / 2, to: centre + span / 2 });
}
