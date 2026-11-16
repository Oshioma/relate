"use client";

import { type CivilDate, GREGORIAN_MONTHS, daysFromCivil, formatYear } from "@/lib/true-calendar/dates";
import { MERCURY_NOTES, type MercuryDay, mercuryOn } from "@/lib/true-calendar/mercury";

// Mercury retrograde for the selected day: always shown, retrograde or not,
// with what it means behind a disclosure. The astronomy is calculated; the
// astrology is labelled as a modern reading.

const short = (d: CivilDate) => `${d.day} ${GREGORIAN_MONTHS[d.month - 1].slice(0, 3)}`;
const span = (m: MercuryDay) => `${short(m.startDate)} – ${short(m.endDate)} ${formatYear(m.endDate.year)}`;

export function mercuryHeadline(m: MercuryDay, date: CivilDate): string {
  if (m.station === "retrograde") return `Mercury turns retrograde today, until ${short(m.endDate)}`;
  if (m.station === "direct") return `Mercury turns direct today: the last day of retrograde (${span(m)})`;
  if (m.retrograde) return `Mercury retrograde, day ${m.day} of ${m.length} (${span(m)})`;
  const wait = daysFromCivil(m.startDate) - daysFromCivil(date);
  return `Mercury direct. Next retrograde ${span(m)}, in ${wait} day${wait === 1 ? "" : "s"}`;
}

export function MercuryStatus({ date, tz }: { date: CivilDate; tz: string }) {
  const m = mercuryOn(date, tz);
  return (
    <div className="mt-2 text-base">
      <p className="flex items-center gap-2">
        <span aria-hidden className={`inline-block h-1.5 w-6 rounded-full ${m.retrograde ? "bg-rose-500/80 dark:bg-rose-400/80" : "bg-[var(--tc-line)]"}`} />
        <span className={m.retrograde ? "font-medium" : "text-[var(--tc-muted)]"}>{mercuryHeadline(m, date)}</span>
      </p>
      <MercuryNotes />
    </div>
  );
}

export function MercuryNotes() {
  return (
    <details className="mt-1 text-sm">
      <summary className="cursor-pointer text-[var(--tc-muted)] hover:text-[var(--tc-ink)]">What Mercury retrograde means</summary>
      <div className="mt-2 space-y-2 border-l-2 border-rose-500/40 pl-3 leading-relaxed">
        <p>
          <span className="font-medium">In the sky: </span>
          {MERCURY_NOTES.astronomy}
        </p>
        <p>
          <span className="font-medium">In modern astrology: </span>
          {MERCURY_NOTES.astrology}
        </p>
        <p>
          <span className="font-medium">Where the idea comes from: </span>
          {MERCURY_NOTES.history}
        </p>
        <p className="text-[var(--tc-muted)]">{MERCURY_NOTES.science}</p>
        <p className="text-[var(--tc-muted)]">
          Sources:{" "}
          {MERCURY_NOTES.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 ? "; " : null}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--tc-ink)]">
                {s.title}
              </a>
            </span>
          ))}
          . Dates calculated with Astronomy Engine.
        </p>
      </div>
    </details>
  );
}
