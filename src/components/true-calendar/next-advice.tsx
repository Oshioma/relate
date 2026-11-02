"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Fish, Leaf, type LucideIcon, Sparkles, Sprout, Store, Users, Utensils, X } from "lucide-react";
import Link from "@/components/ui/link";
import { type CivilDate, GREGORIAN_MONTHS, WEEKDAYS_SHORT, addDays, compareDates, weekdayOf } from "@/lib/true-calendar/dates";
import { lunarMonthContaining, moonDays } from "@/lib/true-calendar/astronomy";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import type { ResearchStats } from "@/lib/data/true-calendar";
import {
  ADVICE_CATEGORIES,
  DATE_STATUS_BADGES,
  DATE_STATUS_LABELS,
  QUARTER_TITLES,
  type AdviceCategory,
  type AdviceDay,
  type AdviceFilter,
  type AdviceItem,
  type DayRow,
  adviceAhead,
  adviceDays,
  filterFeed,
} from "@/lib/true-calendar/research/ahead";
import { EvidenceChips } from "./history-bits";
import { MoonGlyph } from "./moon-glyph";

// "Next Advice From the Past": one chronological calendar of traditional
// knowledge. Each date in the range that has a sourced record gets one card:
// the date and the calculated Moon on the left, every culture's
// interpretation as compact rows on the right. Dates are ordered by day
// number, never by category or text. Lunar nights counted from the calculated
// new Moon are marked approximate on their own row. Research with no
// defensible date sits in "Traditional cycles awaiting date alignment" below
// the timeline. Nothing here is generated to fill an empty date.

const FIRST_DAYS = 10;
const MORE_DAYS = 10;
const ROWS_SHOWN = 3;
const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const CATEGORY_UI: Record<AdviceCategory, { short: string; icon: LucideIcon }> = {
  farming: { short: "Farming", icon: Sprout },
  fishing: { short: "Fishing", icon: Fish },
  food: { short: "Food", icon: Utensils },
  community: { short: "Community", icon: Users },
  ceremony: { short: "Spirituality", icon: Sparkles },
  conservation: { short: "Conservation", icon: Leaf },
  trade: { short: "Trade", icon: Store },
};

const monthShort = (d: CivilDate) => GREGORIAN_MONTHS[d.month - 1].slice(0, 3);
const shortDate = (d: CivilDate) => `${d.day} ${monthShort(d)}`;

export function NextAdvice({ bundle, stats, date, tz, historyPath }: { bundle: ResearchBundle; stats: ResearchStats | null; date: CivilDate; tz: string; historyPath: string }) {
  const [range, setRange] = useState<Range>(30);
  // How many ranges forwards (or backwards) from the selected date.
  const [page, setPage] = useState(0);
  const start = useMemo(() => addDays(date, page * range), [date, page, range]);
  // The Moon for the range plus a month, so every counted night is known.
  const moons = useMemo(() => moonDays(start, range + 31, tz), [start, range, tz]);
  const feed = useMemo(() => adviceAhead(bundle, start, moons, { monthStart: lunarMonthContaining(start, tz).month.start }), [bundle, start, moons, tz]);
  // "See related advice" on a History page links here with ?advice=<culture>.
  // The calendar renders only in the browser (it waits for the local date), so
  // reading the address here is safe.
  const [linkedCulture] = useState(() => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("advice")));
  const [filter, setFilter] = useState<AdviceFilter>({ category: "all", culture: linkedCulture ?? "all", tier: "all" });
  const [shown, setShown] = useState(FIRST_DAYS);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (linkedCulture) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [linkedCulture]);
  // A new selected date starts again from that date.
  const [forDate, setForDate] = useState(date);
  if (compareDates(forDate, date) !== 0) {
    setForDate(date);
    setPage(0);
    setShown(FIRST_DAYS);
  }

  const days = useMemo(() => adviceDays(feed, moons, start, range, filter), [feed, moons, start, range, filter]);
  const undated = useMemo(() => {
    const f = filterFeed(feed, filter);
    return [...f.dated, ...f.lunar, ...f.seasonal].filter((i) => !i.date && i.cultureKey !== "sky");
  }, [feed, filter]);
  const everything = [...feed.dated, ...feed.lunar, ...feed.seasonal];
  const cultureName = filter.culture === "all" ? null : (everything.find((i) => i.cultureKey === filter.culture)?.cultureName ?? filter.culture);

  const set = (patch: Partial<AdviceFilter>) => {
    setFilter((f) => ({ ...f, ...patch }));
    setShown(FIRST_DAYS);
  };
  const go = (p: number) => {
    setPage(p);
    setShown(FIRST_DAYS);
  };
  const last = addDays(start, range - 1);

  return (
    <section
      ref={sectionRef}
      id="tc-next-advice"
      aria-labelledby="tc-next-advice-heading"
      className="scroll-mt-4 rounded-2xl border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-5 sm:px-6 sm:py-6"
    >
      <h2 id="tc-next-advice-heading" className="font-serif text-3xl font-semibold sm:text-4xl">Next Advice From the Past</h2>
      <p className="mt-1 text-lg text-[var(--tc-muted)]">Traditional knowledge for each day ahead, in date order.</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by kind of knowledge">
        <Chip active={filter.category === "all"} onClick={() => set({ category: "all" })}>All</Chip>
        {ADVICE_CATEGORIES.map((c) => {
          const ui = CATEGORY_UI[c.key];
          const Icon = ui.icon;
          return (
            <Chip key={c.key} active={filter.category === c.key} onClick={() => set({ category: c.key })} title={c.label}>
              <Icon aria-hidden className="size-4" />
              {ui.short}
            </Chip>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex overflow-hidden rounded-full border border-[var(--tc-line)]" role="group" aria-label="How many days">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => {
                setRange(r);
                go(0);
              }}
              className={`px-3 py-1.5 text-sm ${range === r ? "bg-emerald-900 font-medium text-white dark:bg-emerald-300 dark:text-emerald-950" : "hover:bg-[var(--tc-hover)]"}`}
            >
              Next {r} days
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(page - 1)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--tc-line)] px-3 py-1.5 text-sm hover:bg-[var(--tc-hover)]"
            aria-label={`Previous ${range} days`}
          >
            <ChevronLeft aria-hidden className="size-4" /> Earlier
          </button>
          <button
            type="button"
            onClick={() => go(page + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--tc-line)] px-3 py-1.5 text-sm hover:bg-[var(--tc-hover)]"
            aria-label={`Following ${range} days`}
          >
            Later <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-[var(--tc-muted)]">
        {WEEKDAYS_SHORT[weekdayOf(start)]} {shortDate(start)} {start.year} to {WEEKDAYS_SHORT[weekdayOf(last)]} {shortDate(last)} {last.year}.
        {page !== 0 ? (
          <>
            {" "}
            <button type="button" onClick={() => go(0)} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">
              Back to {shortDate(date)}
            </button>
          </>
        ) : null}
        {cultureName ? (
          <>
            {" "}Showing {cultureName} only.{" "}
            <button type="button" onClick={() => set({ culture: "all" })} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[var(--tc-ink)]">
              <X aria-hidden className="size-3.5" /> Show every culture
            </button>
          </>
        ) : null}
      </p>

      {everything.length === 0 ? (
        <p className="mt-5 text-base text-[var(--tc-muted)]">
          No research has been published yet. Knowledge appears here as soon as a reviewer publishes it.{" "}
          <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">Browse the traditions in History</Link>.
        </p>
      ) : days.length === 0 ? (
        <p className="mt-5 text-base text-[var(--tc-muted)]">No sourced knowledge of this kind falls in these {range} days.</p>
      ) : (
        <ol className="mt-5 space-y-3">
          {days.slice(0, shown).map((d) => (
            <DayCard key={d.id} day={d} historyPath={historyPath} />
          ))}
        </ol>
      )}

      {days.length > shown ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + MORE_DAYS)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tc-hover)] px-6 py-3 text-lg font-medium hover:brightness-95"
          >
            See more days ({days.length - shown} more) <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      ) : null}

      {undated.length > 0 ? <AwaitingAlignment items={undated} historyPath={historyPath} /> : null}

      {stats && stats.records > 0 ? (
        <p className="mt-4 text-center text-sm text-[var(--tc-muted)]">
          From {stats.records} published research records across {stats.cultures} cultures.{" "}
          <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">Browse them in History</Link>.
        </p>
      ) : null}
    </section>
  );
}

function Chip({ active, onClick, title, children }: { active: boolean; onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-base ${
        active
          ? "border-emerald-900 bg-emerald-900 font-medium text-white dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
          : "border-[var(--tc-line)] bg-[var(--tc-panel)] text-[var(--tc-ink)] hover:bg-[var(--tc-hover)]"
      }`}
    >
      {children}
    </button>
  );
}

/** One date: the date and its Moon on the left, the cultures on the right. */
function DayCard({ day, historyPath }: { day: AdviceDay; historyPath: string }) {
  const [more, setMore] = useState(false);
  const { date, moon, quarter } = day;
  const lit = Math.round(moon.state.illumination * 100);
  const rows = more ? day.rows : day.rows.slice(0, ROWS_SHOWN);
  const hidden = day.rows.slice(ROWS_SHOWN);
  const hiddenCultures = new Set(hidden.map((r) => r.item.cultureKey)).size;
  return (
    <li className={`rounded-2xl border border-[var(--tc-line)] shadow-sm ${quarter ? "bg-amber-50/70 dark:bg-amber-950/30" : "bg-[var(--tc-bg)]"}`}>
      <div className="grid grid-cols-[4.75rem_1fr] gap-3 p-3 sm:grid-cols-[6rem_1fr] sm:gap-4">
        <div className="flex flex-col items-center text-center leading-tight sm:row-span-2">
          <div className="text-sm text-[var(--tc-muted)] sm:text-base">{WEEKDAYS_SHORT[weekdayOf(date)]}</div>
          <div className="font-serif text-4xl font-semibold sm:text-5xl">{date.day}</div>
          <div className="text-sm sm:text-base">
            {monthShort(date)} {date.year}
          </div>
          <div className="mt-2 rounded-full bg-slate-900 p-1.5">
            <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={30} title={`${moon.name}, ${lit}% lit`} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2">
            {quarter ? <span className="font-serif text-2xl font-semibold leading-tight">{QUARTER_TITLES[quarter]}</span> : <span className="font-medium">{moon.name}</span>}
            <span className="text-sm text-[var(--tc-muted)]">{lit}% lit · calculated</span>
          </p>
        </div>
        {/* On a phone the cultures run the full width under the date. */}
        <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
          {day.rows.length === 0 ? (
            <p className="mt-1 text-sm text-[var(--tc-muted)]">No imported tradition is dated to this day yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-[var(--tc-line)]">
              {rows.map((r) => (
                <Row key={r.item.id} row={r} historyPath={historyPath} />
              ))}
            </ul>
          )}
          {hidden.length > 0 ? (
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              aria-expanded={more}
              className="mt-1 text-sm font-medium text-[var(--tc-gold)] underline-offset-2 hover:underline"
            >
              {more ? "− Show fewer" : `+ Show more cultures (${hidden.length} more${hiddenCultures > 1 ? ` from ${hiddenCultures} cultures` : ""})`}
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/** "Unnamed night (No. 24)" reads better as where it sits in its source. */
function rowName(item: AdviceItem): string {
  if (item.name.startsWith("Unnamed")) return item.cycle.split(";")[0];
  return item.night !== undefined ? `${item.name} (night ${item.night})` : item.name;
}

function StatusPill({ row }: { row: DayRow }) {
  const s = row.item.status;
  if (row.approximate) {
    return (
      <span title={DATE_STATUS_LABELS.counted} className="rounded-full border border-sky-700/30 bg-sky-50 px-2 text-xs text-sky-900 dark:bg-sky-950 dark:text-sky-200">
        Approximate
      </span>
    );
  }
  if (row.kind === "observance") {
    return (
      <span title={DATE_STATUS_LABELS[s]} className="rounded-full border border-emerald-600/40 bg-emerald-50 px-2 text-xs text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
        {DATE_STATUS_BADGES[s]}
      </span>
    );
  }
  if (row.kind === "astronomical") {
    return <span title={DATE_STATUS_LABELS.astronomical} className="rounded-full border border-amber-600/40 bg-amber-50 px-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">Moon phase</span>;
  }
  return null;
}

/** One culture's interpretation: what the tradition says, then the modern application. */
function Row({ row, historyPath }: { row: DayRow; historyPath: string }) {
  const { item } = row;
  const [open, setOpen] = useState(false);
  const hasDetail = item.says.length > 1 || item.modern.length > 1 || Boolean(item.caution) || item.evidence.length > 0;
  return (
    <li className="py-2 text-base leading-snug first:pt-0">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span>
          <span className="font-semibold">{item.cultureName}</span>
          <span className="text-[var(--tc-muted)]"> — </span>
          <span className="font-semibold">{rowName(item)}</span>
        </span>
        <StatusPill row={row} />
      </p>
      <p className="mt-0.5">
        <span className="text-[var(--tc-muted)]">What the tradition says: </span>
        {item.says[0]}
      </p>
      {item.modern.length > 0 ? (
        <p className="mt-0.5">
          <span className="text-emerald-800 dark:text-emerald-300">Practical application: </span>
          {item.modern[0]}
        </p>
      ) : null}
      {item.conflicts.length > 0 ? (
        <details className="mt-0.5 text-sm">
          <summary className="cursor-pointer font-medium text-amber-800 dark:text-amber-300">Accounts differ ({item.conflicts.length})</summary>
          <ul className="mt-1 space-y-1 border-l-2 border-amber-600/40 pl-3">
            {item.conflicts.map((c, i) => (
              <li key={i}>
                {c.text} <SourceLinks sources={c.sources} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {open ? (
        <div className="mt-1 space-y-1 border-l-2 border-[var(--tc-line)] pl-3 text-sm">
          {item.says.slice(1).map((t, i) => (
            <p key={`s${i}`}>
              <span className="text-[var(--tc-muted)]">Another account: </span>
              {t}
            </p>
          ))}
          {item.modern.slice(1).map((t, i) => (
            <p key={`m${i}`}>
              <span className="text-[var(--tc-muted)]">Another application: </span>
              {t}
            </p>
          ))}
          {item.cycle ? <p className="text-[var(--tc-muted)]">{item.cycle}</p> : null}
          {item.caution ? <p className="text-amber-800 dark:text-amber-300">{item.caution}</p> : null}
          <EvidenceChips tags={item.evidence} />
        </div>
      ) : null}
      <p className="mt-0.5 flex flex-wrap gap-x-2 text-sm text-[var(--tc-muted)]">
        {item.sources.length > 0 ? (
          <span>
            Source: <SourceLinks sources={item.sources} />
          </span>
        ) : null}
        <Link href={`${historyPath}/${item.cultureKey}`} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">
          {item.cultureName} in History
        </Link>
        {hasDetail ? (
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="underline-offset-2 hover:text-[var(--tc-ink)] hover:underline">
            {open ? "Less" : "More detail"}
          </button>
        ) : null}
      </p>
    </li>
  );
}

/** Research with no defensible date: Greek month days, market cycles, seasons and months. */
function AwaitingAlignment({ items, historyPath }: { items: AdviceItem[]; historyPath: string }) {
  const [open, setOpen] = useState(false);
  const sorted = [...items].sort((a, b) => a.cultureName.localeCompare(b.cultureName) || a.order - b.order);
  return (
    <div className="mt-6 border-t border-[var(--tc-line)] pt-4">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-2 text-lg font-medium">
        <ChevronRight aria-hidden className={`size-5 transition-transform ${open ? "rotate-90" : ""}`} />
        Traditional cycles awaiting date alignment ({items.length})
      </button>
      <p className="mt-1 text-sm text-[var(--tc-muted)]">There is no defensible way yet to place these on today&apos;s calendar, so they have no date.</p>
      {open ? (
        <ul className="mt-3 divide-y divide-[var(--tc-line)] rounded-2xl border border-[var(--tc-line)] bg-[var(--tc-bg)] px-3 py-2">
          {sorted.map((item) => (
            <Row key={item.id} row={{ item, kind: "other", approximate: false }} historyPath={historyPath} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SourceLinks({ sources }: { sources: AdviceItem["sources"] }) {
  return (
    <>
      {sources.map((s, i) => (
        <span key={s.key}>
          {i > 0 ? "; " : null}
          {s.url ? (
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--tc-ink)]">
              {s.title}
            </a>
          ) : (
            s.title
          )}
        </span>
      ))}
    </>
  );
}
