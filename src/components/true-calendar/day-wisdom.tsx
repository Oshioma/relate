"use client";

import { useMemo } from "react";
import Link from "@/components/ui/link";
import { type CivilDate, daysFromCivil, weekdayOf, WEEKDAYS, GREGORIAN_MONTHS } from "@/lib/true-calendar/dates";
import { moonDays } from "@/lib/true-calendar/astronomy";
import type { ResearchStats } from "@/lib/data/true-calendar";
import { type ResearchBundle, notesForDay } from "@/lib/true-calendar/research/daily";
import { adviceAhead, adviceDays } from "@/lib/true-calendar/research/ahead";
import type { DailyNoteRecord } from "@/lib/true-calendar/research/model";
import { DayCard, NextAdvice } from "./next-advice";

// "What does this day mean for me?" — the selected day as a knowledge hub:
// every tradition's published knowledge that falls on it (the same engine as
// the timeline below, so the two always agree), the periods it sits inside
// (a named month, Mercury retrograde), and any modern note for the date.
// Every row says how its date was worked out and how often it comes round,
// and links to the culture's History page for the "why".

export function DayWisdom({ bundle, stats, date, tz, historyPath, isToday }: { bundle: ResearchBundle; stats: ResearchStats | null; date: CivilDate; tz: string; historyPath: string; isToday: boolean }) {
  const notes = useMemo(() => notesForDay(bundle, date), [bundle, date]);

  if (bundle.cultures.length === 0) {
    return (
      <section aria-labelledby="tc-wisdom-heading" className="rounded-lg border border-dashed border-[var(--tc-line)] px-4 py-4">
        <h2 id="tc-wisdom-heading" className="font-serif text-2xl">Ancient wisdom for today</h2>
        <p className="mt-1 text-base text-[var(--tc-muted)]">
          What this day meant in other calendars and traditions appears here as each tradition&apos;s research is checked against its sources. Nothing is shown until it is sourced.{" "}
          <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">Browse the traditions in History</Link>.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <DayHub bundle={bundle} date={date} tz={tz} historyPath={historyPath} isToday={isToday} notes={notes} />
      <NextAdvice bundle={bundle} stats={stats} date={date} tz={tz} historyPath={historyPath} />
    </div>
  );
}

/**
 * Everything for the selected day, from every tradition: the same engine as
 * the timeline below, with every culture shown and the periods the day sits in.
 */
function DayHub({ bundle, date, tz, historyPath, isToday, notes }: { bundle: ResearchBundle; date: CivilDate; tz: string; historyPath: string; isToday: boolean; notes: Note[] }) {
  const day = useMemo(() => {
    const moons = moonDays(date, 32, tz);
    const feed = adviceAhead(bundle, date, moons, { tz });
    return adviceDays(feed, moons, date, 1, undefined, new Set([daysFromCivil(date)]))[0] ?? null;
  }, [bundle, date, tz]);
  // The months and spans the day is inside, each with its full record.
  const periodRows = day ? day.periods.filter((p) => !day.rows.some((r) => r.item.id === p.item.id)) : [];
  return (
    <section aria-labelledby="tc-wisdom-today" className="rounded-2xl border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-5 sm:px-6">
      <h2 id="tc-wisdom-today" className="font-serif text-3xl font-semibold">{isToday ? "Today, in every tradition" : `${shortDate(date)}, in every tradition`}</h2>
      <p className="mt-1 text-base text-[var(--tc-muted)]">
        Everything the published research says about this day: one Moon, many civilisations. Each line says how its date was worked out and how often it comes round.
      </p>
      {day ? (
        <div className="mt-4">
          <DayCard day={day} tz={tz} historyPath={historyPath} expanded as="div" />
        </div>
      ) : null}
      {periodRows.length > 0 ? (
        <div className="mt-4">
          <h3 className="font-serif text-xl">You are in these periods</h3>
          <ul className="mt-2 space-y-2">
            {periodRows.map((p) => (
              <li key={p.item.id} className="rounded-xl border border-[var(--tc-line)] bg-[var(--tc-bg)] px-3 py-2">
                <p className="text-base">
                  <span className="font-semibold">{p.item.cultureName}</span>
                  <span className="text-[var(--tc-muted)]"> — </span>
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-[var(--tc-muted)]">, day {p.day} of {p.length} · {p.item.recurrence}</span>
                </p>
                <p className="mt-0.5">
                  <span className="text-[var(--tc-muted)]">What the tradition says: </span>
                  {p.item.says.join(" ")}
                </p>
                {p.item.caution ? (
                  <details className="mt-0.5 text-sm">
                    <summary className="cursor-pointer text-[var(--tc-muted)]">How this month is placed on today&apos;s calendar</summary>
                    <p className="mt-1 text-amber-800 dark:text-amber-300">{p.item.caution}</p>
                  </details>
                ) : null}
                <p className="mt-0.5 text-sm text-[var(--tc-muted)]">
                  <Link href={`${historyPath}/${p.item.cultureKey}`} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">
                    {p.item.cultureName} in History
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {notes.map((n) => (
        <NoteCard key={n.key} note={n} />
      ))}
    </section>
  );
}

function shortDate(d: CivilDate): string {
  return `${WEEKDAYS[weekdayOf(d)]} ${d.day} ${GREGORIAN_MONTHS[d.month - 1]}`;
}

type Note = Omit<DailyNoteRecord, "sources">;

// A modern suggestion for the day. It belongs to no tradition, so it is kept
// apart from the entries above and always says so.
function NoteCard({ note }: { note: Note }) {
  return (
    <div className="mt-4 rounded-md border border-dashed border-[var(--tc-line)] px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tc-muted)]">Modern practical application · optional, not a tradition&apos;s instruction</p>
      <p className="mt-1 text-lg font-medium">{note.title}</p>
      {note.explanation ? <p className="mt-1 text-base leading-relaxed">{note.explanation}</p> : null}
      <p className="mt-1 text-sm text-[var(--tc-muted)]">
        {note.disclaimer ?? "A modern reflection, not a tradition's instruction for this date."}
      </p>
    </div>
  );
}

