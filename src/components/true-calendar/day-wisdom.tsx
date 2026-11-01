"use client";

import { useMemo } from "react";
import Link from "@/components/ui/link";
import { type CivilDate, addDays, formatIsoDate, weekdayOf, WEEKDAYS, GREGORIAN_MONTHS } from "@/lib/true-calendar/dates";
import { moonDays } from "@/lib/true-calendar/astronomy";
import { type DayEntry, type ResearchBundle, entriesForDay } from "@/lib/true-calendar/research/daily";
import { EvidenceChips } from "./history-bits";

// "What does this day mean for me?" — the published research that applies to
// the selected day, the next day and the week ahead. Every entry says why it
// applies (a cycle position, the Moon's phase, a published date) and links to
// the culture's History page for the "why". Historical practice and modern
// suggestions are labelled separately and never merged.

export function DayWisdom({ bundle, date, tz, historyPath, isToday }: { bundle: ResearchBundle; date: CivilDate; tz: string; historyPath: string; isToday: boolean }) {
  const week = useMemo(() => {
    const moons = moonDays(date, 7, tz);
    return moons.map((moon, i) => {
      const d = addDays(date, i);
      return { date: d, entries: entriesForDay(bundle, d, moon) };
    });
  }, [bundle, date, tz]);

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

  const [first, second] = week;
  return (
    <div className="space-y-5">
      <DaySection id="tc-wisdom-today" heading={isToday ? "Ancient wisdom for today" : `Ancient wisdom for ${shortDate(first.date)}`} entries={first.entries} historyPath={historyPath} />
      <DaySection id="tc-wisdom-tomorrow" heading={isToday ? "Tomorrow's guidance" : `The day after: ${shortDate(second.date)}`} entries={second.entries} historyPath={historyPath} compact />

      <section aria-labelledby="tc-outlook-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
        <h2 id="tc-outlook-heading" className="font-serif text-2xl">Seven-day outlook</h2>
        <ol className="mt-3 divide-y divide-[var(--tc-line)]">
          {week.map(({ date: d, entries }) => (
            <li key={formatIsoDate(d)} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:gap-4">
              <span className="w-40 shrink-0 text-base font-medium">{shortDate(d)}</span>
              {entries.length === 0 ? (
                <span className="text-base text-[var(--tc-muted)]">Nothing sourced marks this day.</span>
              ) : (
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-base">
                  {entries.map((e) => (
                    <li key={`${e.culture.key}|${e.kind}`}>
                      <Link href={`${historyPath}/${e.culture.key}`} className="font-medium underline-offset-2 hover:underline">
                        {e.culture.name}
                      </Link>
                      <span className="text-[var(--tc-muted)]">: {e.reason}{e.approximate ? " (approximate)" : ""}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function shortDate(d: CivilDate): string {
  return `${WEEKDAYS[weekdayOf(d)]} ${d.day} ${GREGORIAN_MONTHS[d.month - 1]}`;
}

function DaySection({ id, heading, entries, historyPath, compact }: { id: string; heading: string; entries: DayEntry[]; historyPath: string; compact?: boolean }) {
  return (
    <section aria-labelledby={id} className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
      <h2 id={id} className="font-serif text-2xl">{heading}</h2>
      {entries.length === 0 ? (
        <p className="mt-1 text-base text-[var(--tc-muted)]">
          No sourced tradition marks this day yet. <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">See what each tradition counts in History</Link>.
        </p>
      ) : (
        <ul className="mt-3 space-y-4">
          {entries.map((e) => (
            <EntryCard key={`${e.culture.key}|${e.kind}`} entry={e} historyPath={historyPath} compact={compact} />
          ))}
        </ul>
      )}
    </section>
  );
}

function EntryCard({ entry, historyPath, compact }: { entry: DayEntry; historyPath: string; compact?: boolean }) {
  const tags = [
    ...(entry.position?.evidence ?? []),
    ...entry.observances.flatMap((o) => o.evidence),
    ...entry.meanings.flatMap((m) => m.evidence),
    ...entry.correspondences.flatMap((c) => c.evidence),
  ];
  const href = `${historyPath}/${entry.culture.key}`;
  // Research often repeats one line across a day, its observance and its
  // practice; say each thing once.
  const seen = new Set<string>();
  const once = (t: string | null | undefined) => {
    const k = (t ?? "").trim().toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  };
  const positionMeaning = once(entry.position?.meaning) ? entry.position?.meaning : null;
  const observances = entry.observances.map((o) => ({ ...o, description: once(o.description) ? o.description : null }));
  const meanings = entry.meanings.filter((m) => once(m.meaning));
  return (
    <li className="border-l-2 border-[var(--tc-gold)] pl-3">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <Link href={href} className="font-serif text-xl underline-offset-2 hover:underline">{entry.culture.name}</Link>
        <span className="text-base text-[var(--tc-muted)]">{entry.reason}</span>
        {entry.approximate ? <span className="text-sm text-amber-700 dark:text-amber-300">approximate: depends on what is seen locally</span> : null}
      </div>
      <EvidenceChips tags={tags} className="mt-1" />

      {!compact ? (
        <div className="mt-2 space-y-2 text-base leading-relaxed">
          {positionMeaning ? <p>{positionMeaning}</p> : null}
          {observances.filter((o) => o.description || o.name !== entry.position?.name).map((o) => (
            <p key={o.key}>
              <span className="font-medium">{o.name}</span>
              {o.description ? `: ${o.description}` : null}
            </p>
          ))}
          {meanings.map((m) => (
            <p key={m.key}>
              {m.interpretation === "alternative" ? <span className="text-[var(--tc-muted)]">Another reading: </span> : null}
              {m.meaning}
            </p>
          ))}
          {entry.correspondences.map((c) => (
            <p key={c.key} className="text-[var(--tc-muted)]">
              Listed for this date by a published source{c.certainty !== "exact" ? ` (${c.certainty})` : ""}.{c.notes ? ` ${c.notes}` : ""}
            </p>
          ))}
          {entry.recommendations.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-[var(--tc-hover)] px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tc-muted)]">Historical practice</p>
                <ul className="mt-1 space-y-1">
                  {entry.recommendations.map((r) => (
                    <li key={r.key}>{r.historical_practice}</li>
                  ))}
                </ul>
              </div>
              {entry.recommendations.some((r) => r.modern_interpretation) ? (
                <div className="rounded-md border border-dashed border-[var(--tc-line)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tc-muted)]">A modern way to use it</p>
                  <ul className="mt-1 space-y-1">
                    {entry.recommendations.filter((r) => r.modern_interpretation).map((r) => (
                      <li key={r.key}>{r.modern_interpretation}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : entry.position?.meaning || entry.observances[0]?.description ? (
        <p className="mt-1 text-base">{entry.position?.meaning ?? entry.observances[0]?.description}</p>
      ) : null}
      <Link href={href} className="mt-1 inline-block text-sm text-[var(--tc-gold)] underline-offset-2 hover:underline">Why? Read the history</Link>
    </li>
  );
}
