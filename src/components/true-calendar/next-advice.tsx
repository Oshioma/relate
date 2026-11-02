"use client";

import { useMemo, useState } from "react";
import Link from "@/components/ui/link";
import { type CivilDate, GREGORIAN_MONTHS, WEEKDAYS, weekdayOf } from "@/lib/true-calendar/dates";
import { moonDays } from "@/lib/true-calendar/astronomy";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import {
  ADVICE_CATEGORIES,
  type AdviceCategory,
  type AdviceItem,
  DATE_STATUS_LABELS,
  type DateStatus,
  adviceAhead,
  groupUndated,
  matchesFilter,
} from "@/lib/true-calendar/research/ahead";
import { EvidenceChips } from "./history-bits";

// "Next advice from the past": what the imported research says is coming up,
// from any tradition, not limited to the week. Dated items say how their date
// is known; recurring knowledge without a verified date is listed apart, by
// calendar, and never given a date.

const DATED_STEP = 6;
const ROWS_STEP = 3;

const STATUS_STYLE: Record<DateStatus, string> = {
  published: "border-emerald-600/40 text-emerald-800 dark:text-emerald-300",
  astronomical: "border-sky-600/40 text-sky-800 dark:text-sky-300",
  provisional: "border-amber-600/50 text-amber-800 dark:text-amber-300",
  undated: "border-[var(--tc-line)] text-[var(--tc-muted)]",
};

export function NextAdvice({ bundle, date, tz, historyPath }: { bundle: ResearchBundle; date: CivilDate; tz: string; historyPath: string }) {
  const { dated, undated } = useMemo(() => adviceAhead(bundle, date, moonDays(date, 35, tz)), [bundle, date, tz]);
  const [category, setCategory] = useState<AdviceCategory | "all">("all");
  const [culture, setCulture] = useState<string>("all");
  const [datedShown, setDatedShown] = useState(DATED_STEP);
  const [rowsShown, setRowsShown] = useState(ROWS_STEP);

  const cultures = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of [...dated, ...undated]) m.set(i.cultureKey, i.cultureName);
    return [...m].sort((a, b) => a[1].localeCompare(b[1]));
  }, [dated, undated]);

  const datedFiltered = dated.filter((i) => matchesFilter(i, category, culture));
  const groups = groupUndated(undated.filter((i) => matchesFilter(i, category, culture)));
  const more = datedFiltered.length > datedShown || groups.length > rowsShown;

  return (
    <section aria-labelledby="tc-next-advice-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
      <h2 id="tc-next-advice-heading" className="font-serif text-2xl">Next advice from the past</h2>
      <p className="mt-1 text-base text-[var(--tc-muted)]">
        What the traditions in our research say is coming up, nearest first. Each item says how its date is known, and modern readings are marked as modern.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filter advice">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>All cultures</FilterChip>
        {ADVICE_CATEGORIES.map((c) => (
          <FilterChip key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>{c.label}</FilterChip>
        ))}
        {cultures.length > 1 ? (
          <label className="ml-auto flex items-center gap-2 text-sm text-[var(--tc-muted)]">
            Tradition
            <select
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 py-1 text-base text-[var(--tc-ink)]"
            >
              <option value="all">All</option>
              {cultures.map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {dated.length === 0 && undated.length === 0 ? (
        <p className="mt-4 text-base text-[var(--tc-muted)]">
          Nothing from the research has been published yet. Items appear here as soon as a reviewer publishes them.{" "}
          <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">Browse the traditions in History</Link>.
        </p>
      ) : (
        <>
          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">Coming up</h3>
          {datedFiltered.length === 0 ? (
            <p className="mt-1 text-base text-[var(--tc-muted)]">No dated record matches this filter yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {datedFiltered.slice(0, datedShown).map((item) => (
                <DatedCard key={item.id} item={item} historyPath={historyPath} />
              ))}
            </ul>
          )}

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">Upcoming lunar cycle — date to be verified</h3>
          <p className="mt-1 text-sm text-[var(--tc-muted)]">
            Recurring nights and days whose Gregorian date depends on a local rule (when the month starts, which community&apos;s count) that is not yet verified. They come round every cycle; we don&apos;t guess the date.
          </p>
          {groups.length === 0 ? (
            <p className="mt-1 text-base text-[var(--tc-muted)]">No recurring record matches this filter yet.</p>
          ) : (
            <div className="mt-3 space-y-4">
              {groups.slice(0, rowsShown).map((g) => (
                <div key={g.key}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-serif text-lg">{g.label}</span>
                    <span className="text-sm text-[var(--tc-muted)]">{g.items.length} {g.items.length === 1 ? "record" : "records"}</span>
                    <Link href={`${historyPath}/${g.cultureKey}`} className="text-sm text-[var(--tc-gold)] underline-offset-2 hover:underline">History</Link>
                  </div>
                  <ul className="mt-2 flex snap-x gap-2 overflow-x-auto pb-2">
                    {g.items.map((item) => (
                      <UndatedCard key={item.id} item={item} historyPath={historyPath} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {more ? (
            <button
              type="button"
              onClick={() => {
                setDatedShown((n) => n + DATED_STEP);
                setRowsShown((n) => n + ROWS_STEP);
              }}
              className="mt-4 rounded-md border border-[var(--tc-line)] px-4 py-2 text-base font-medium hover:bg-[var(--tc-hover)]"
            >
              See more ancient wisdom
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm ${active ? "border-[var(--tc-gold)] bg-[var(--tc-hover)] font-medium" : "border-[var(--tc-line)] text-[var(--tc-muted)] hover:text-[var(--tc-ink)]"}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: DateStatus }) {
  return <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>{DATE_STATUS_LABELS[status]}</span>;
}

function DatedCard({ item, historyPath }: { item: AdviceItem; historyPath: string }) {
  const d = item.date!;
  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-md border border-[var(--tc-line)] px-3 py-2.5 sm:grid-cols-[5rem_1fr_auto]">
      <div className="text-center leading-tight">
        <div className="text-xs uppercase tracking-wider text-[var(--tc-muted)]">{WEEKDAYS[weekdayOf(d)].slice(0, 3)}</div>
        <div className="font-serif text-3xl">{d.day}</div>
        <div className="text-sm">{GREGORIAN_MONTHS[d.month - 1].slice(0, 3)} {d.year}</div>
      </div>
      <div className="min-w-0">
        <ItemBody item={item} historyPath={historyPath} />
      </div>
      <div className="col-span-2 sm:col-span-1 sm:text-right">
        <StatusBadge status={item.status} />
      </div>
    </li>
  );
}

function UndatedCard({ item, historyPath }: { item: AdviceItem; historyPath: string }) {
  return (
    <li className="w-72 shrink-0 snap-start rounded-md border border-[var(--tc-line)] px-3 py-2.5">
      <StatusBadge status={item.status} />
      <div className="mt-1">
        <ItemBody item={item} historyPath={historyPath} compact />
      </div>
    </li>
  );
}

function ItemBody({ item, historyPath, compact }: { item: AdviceItem; historyPath: string; compact?: boolean }) {
  const href = `${historyPath}/${item.cultureKey}`;
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-serif text-xl">{item.name}</span>
        <span className="text-sm text-[var(--tc-muted)]">{item.cycle}</span>
      </div>
      {!compact ? (
        <div className="text-sm text-[var(--tc-muted)]">
          <Link href={href} className="font-medium text-[var(--tc-ink)] underline-offset-2 hover:underline">{item.cultureName}</Link>
          {item.region ? ` · ${item.region}` : null}
        </div>
      ) : null}
      <p className="mt-1 text-base leading-snug">
        <span className="text-[var(--tc-muted)]">The tradition: </span>
        {item.says.join(". ")}
      </p>
      {item.modern.length > 0 ? (
        <p className="mt-1 text-base leading-snug">
          <span className="text-[var(--tc-muted)]">Today (a modern reading): </span>
          {item.modern.join(" ")}
        </p>
      ) : null}
      {item.caution ? <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{item.caution}</p> : null}
      <EvidenceChips tags={item.evidence} className="mt-1" />
      <p className="mt-1 text-sm text-[var(--tc-muted)]">
        {item.sources.length > 0 ? (
          <>
            Source:{" "}
            {item.sources.map((s, i) => (
              <span key={s.key}>
                {i > 0 ? "; " : null}
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--tc-ink)]">{s.title}</a>
                ) : (
                  s.title
                )}
              </span>
            ))}
            {" · "}
          </>
        ) : null}
        <Link href={href} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">Read the history</Link>
      </p>
    </>
  );
}
