"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Fish,
  Leaf,
  type LucideIcon,
  Moon,
  RefreshCw,
  Sparkles,
  Sprout,
  Store,
  Users,
  Utensils,
  X,
} from "lucide-react";
import Link from "@/components/ui/link";
import { type CivilDate, GREGORIAN_MONTHS, WEEKDAYS_SHORT, addDays, weekdayOf } from "@/lib/true-calendar/dates";
import { lunarMonthContaining, moonDay, moonDays } from "@/lib/true-calendar/astronomy";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import type { ResearchStats } from "@/lib/data/true-calendar";
import {
  ADVICE_CATEGORIES,
  DATE_STATUS_BADGES,
  DATE_STATUS_LABELS,
  type AdviceCategory,
  type AdviceEntry,
  type AdviceEvent,
  type AdviceFilter,
  type AdviceItem,
  type DateStatus,
  adviceAhead,
  adviceEvents,
  filterEvents,
  filterFeed,
} from "@/lib/true-calendar/research/ahead";
import { EvidenceChips } from "./history-bits";
import { MoonGlyph } from "./moon-glyph";

// "Next Advice From the Past": the events ahead of the selected date, in
// strict date order. Every New Moon, First Quarter, Full Moon and Last Quarter
// is one card with the research that falls on that date underneath, grouped by
// culture. Māori and Hawaiian nights are counted from the calculated new Moon,
// so they say "Approximate lunar alignment" and are never presented as a
// historical observance on that date. Runs of nights with the same kind of
// practical guidance become activity windows. Each interpretation shows the
// tradition's own meaning, the modern application kept apart, its source and
// the culture's History page. Traditions with no date rule are listed
// separately below. Nothing here is generated to fill a gap.

const FIRST = 10;
const MORE = 10;
const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const CATEGORY_UI: Record<AdviceCategory, { short: string; icon: LucideIcon; tint: string }> = {
  farming: { short: "Farming", icon: Sprout, tint: "from-emerald-200 to-lime-100 text-emerald-800 dark:from-emerald-900 dark:to-emerald-950 dark:text-emerald-200" },
  fishing: { short: "Fishing", icon: Fish, tint: "from-sky-300 to-cyan-100 text-sky-900 dark:from-sky-900 dark:to-cyan-950 dark:text-sky-200" },
  food: { short: "Food", icon: Utensils, tint: "from-amber-200 to-orange-100 text-amber-900 dark:from-amber-900 dark:to-orange-950 dark:text-amber-200" },
  community: { short: "Community", icon: Users, tint: "from-rose-200 to-amber-100 text-rose-900 dark:from-rose-900 dark:to-amber-950 dark:text-rose-200" },
  ceremony: { short: "Spirituality", icon: Sparkles, tint: "from-violet-200 to-amber-100 text-violet-900 dark:from-violet-900 dark:to-amber-950 dark:text-violet-200" },
  conservation: { short: "Conservation", icon: Leaf, tint: "from-green-200 to-teal-100 text-green-900 dark:from-green-900 dark:to-teal-950 dark:text-green-200" },
  trade: { short: "Trade", icon: Store, tint: "from-yellow-200 to-amber-100 text-yellow-900 dark:from-yellow-900 dark:to-amber-950 dark:text-yellow-200" },
};
const PLAIN_TINT = "from-stone-200 to-amber-50 text-stone-700 dark:from-stone-800 dark:to-stone-900 dark:text-stone-200";

const BADGE_STYLE: Record<DateStatus, string> = {
  official: "border-emerald-600/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  verified: "border-emerald-600/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  secondary: "border-emerald-600/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  astronomical: "border-amber-600/40 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  provisional: "border-amber-600/40 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  counted: "border-sky-700/30 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  lunar_pending: "border-[var(--tc-line)] bg-[var(--tc-panel)] text-[var(--tc-muted)]",
  recurring: "border-[var(--tc-line)] bg-[var(--tc-panel)] text-[var(--tc-ink)]",
  disputed: "border-rose-600/40 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

const shortDate = (d: CivilDate) => `${d.day} ${GREGORIAN_MONTHS[d.month - 1].slice(0, 3)}`;

export function NextAdvice({ bundle, stats, date, tz, historyPath }: { bundle: ResearchBundle; stats: ResearchStats | null; date: CivilDate; tz: string; historyPath: string }) {
  const [range, setRange] = useState<Range>(30);
  // The Moon for the longest range plus a month, so every counted night and
  // every quarter in range is known. Always from the selected date.
  const moons = useMemo(() => moonDays(date, 90 + 31, tz), [date, tz]);
  const feed = useMemo(() => adviceAhead(bundle, date, moons, { monthStart: lunarMonthContaining(date, tz).month.start }), [bundle, date, moons, tz]);
  // "See related advice" on a History page links here with ?advice=<culture>.
  // The calendar renders only in the browser (it waits for the local date), so
  // reading the address here is safe.
  const [linkedCulture] = useState(() => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("advice")));
  const [filter, setFilter] = useState<AdviceFilter>({ category: "all", culture: linkedCulture ?? "all", tier: "all" });
  const [shown, setShown] = useState(FIRST);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (linkedCulture) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [linkedCulture]);

  const events = useMemo(() => filterEvents(adviceEvents(feed, moons, date, range), filter), [feed, moons, date, range, filter]);
  const undated = useMemo(() => {
    const f = filterFeed(feed, filter);
    return [...f.dated, ...f.lunar, ...f.seasonal].filter((i) => !i.date);
  }, [feed, filter]);
  const everything = [...feed.dated, ...feed.lunar, ...feed.seasonal];
  const cultureName = filter.culture === "all" ? null : (everything.find((i) => i.cultureKey === filter.culture)?.cultureName ?? filter.culture);

  const set = (patch: Partial<AdviceFilter>) => {
    setFilter((f) => ({ ...f, ...patch }));
    setShown(FIRST);
  };
  const last = addDays(date, range - 1);

  return (
    <section
      ref={sectionRef}
      id="tc-next-advice"
      aria-labelledby="tc-next-advice-heading"
      className="scroll-mt-4 rounded-2xl border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-5 sm:px-6 sm:py-6"
    >
      <h2 id="tc-next-advice-heading" className="font-serif text-3xl font-semibold sm:text-4xl">Next Advice From the Past</h2>
      <p className="mt-1 text-lg text-[var(--tc-muted)]">Traditional knowledge to use in the days and weeks ahead.</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind of knowledge">
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
        <div className="inline-flex overflow-hidden rounded-full border border-[var(--tc-line)]" role="group" aria-label="How far ahead">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => {
                setRange(r);
                setShown(FIRST);
              }}
              className={`px-3 py-1.5 text-sm ${range === r ? "bg-emerald-900 font-medium text-white dark:bg-emerald-300 dark:text-emerald-950" : "hover:bg-[var(--tc-hover)]"}`}
            >
              Next {r} days
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-[var(--tc-muted)]">
        From {WEEKDAYS_SHORT[weekdayOf(date)]} {shortDate(date)} {date.year} to {shortDate(last)} {last.year}, in date order.
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
      ) : events.length === 0 ? (
        <p className="mt-5 text-base text-[var(--tc-muted)]">Nothing of this kind in the next {range} days.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {events.slice(0, shown).map((e) => (
            <EventCard key={e.id} event={e} tz={tz} historyPath={historyPath} />
          ))}
        </ul>
      )}

      {events.length > shown ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + MORE)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tc-hover)] px-6 py-3 text-lg font-medium hover:brightness-95"
          >
            See more ancient wisdom ({events.length - shown} more) <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      ) : null}

      {undated.length > 0 ? <UndatedTraditions items={undated} historyPath={historyPath} /> : null}

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

function DateTile({ date, end, approximate }: { date: CivilDate; end: CivilDate | null; approximate: boolean }) {
  return (
    <div className="flex flex-col items-center justify-start px-1 pt-1 text-center leading-tight">
      <div className="text-base text-[var(--tc-muted)] sm:text-lg">{end ? "From" : WEEKDAYS_SHORT[weekdayOf(date)]}</div>
      <div className="font-serif text-4xl font-semibold sm:text-5xl">{date.day}</div>
      <div className="text-sm sm:text-base">{GREGORIAN_MONTHS[date.month - 1].slice(0, 3)} {date.year}</div>
      {end ? <div className="mt-0.5 text-xs text-[var(--tc-muted)] sm:text-sm">to {shortDate(end)}</div> : null}
      {approximate ? (
        <div className="mt-1 rounded-full border border-[var(--tc-line)] px-2 text-xs text-[var(--tc-muted)]" title="Approximate lunar alignment, not a verified traditional date">Approx.</div>
      ) : null}
    </div>
  );
}

function PictureTile({ event, tz }: { event: AdviceEvent; tz: string }) {
  if (event.kind === "moon") {
    const moon = moonDay(event.date, tz);
    return (
      <div className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950">
        <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={64} title={event.title} />
      </div>
    );
  }
  const cat = event.categories[0];
  const ui = cat ? CATEGORY_UI[cat] : null;
  const Icon = ui?.icon ?? Sparkles;
  return (
    <div className={`flex h-24 items-center justify-center rounded-xl bg-gradient-to-br ${ui?.tint ?? PLAIN_TINT}`}>
      <Icon aria-hidden className="size-12 opacity-80" strokeWidth={1.5} />
    </div>
  );
}

function Badge({ status, category }: { status: DateStatus; category?: AdviceCategory }) {
  const Icon =
    status === "official" || status === "verified" || status === "secondary"
      ? CircleCheck
      : status === "astronomical"
        ? Moon
        : status === "recurring"
          ? RefreshCw
          : category
            ? CATEGORY_UI[category].icon
            : Moon;
  return (
    <span
      title={DATE_STATUS_LABELS[status]}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium sm:shrink-0 sm:whitespace-nowrap ${BADGE_STYLE[status]}`}
    >
      <Icon aria-hidden className="size-4" />
      {DATE_STATUS_BADGES[status]}
    </span>
  );
}

function EventCard({ event, tz, historyPath }: { event: AdviceEvent; tz: string; historyPath: string }) {
  const [open, setOpen] = useState(false);
  const approximate = event.entries.some((e) => e.item.status === "counted");
  const highlight = ["official", "verified", "secondary"].includes(event.status);
  const detailsId = `tc-event-${event.id.replace(/[^a-zA-Z0-9-]/g, "-")}`;
  // Interpretations grouped by culture, practice first (already sorted).
  const groups = new Map<string, AdviceEntry[]>();
  for (const e of event.entries) groups.set(e.item.cultureKey, [...(groups.get(e.item.cultureKey) ?? []), e]);
  const cautions = [...new Set(event.entries.map((e) => e.item.caution).filter(Boolean) as string[])];
  const cat = event.categories[0];
  const summary =
    event.kind === "moon"
      ? event.entries.length > 0
        ? `What ${groups.size === 1 ? "one tradition" : `${groups.size} traditions`} in our research say${groups.size === 1 ? "s" : ""} about this date.`
        : "No imported research is counted to this date yet."
      : event.kind === "window"
        ? `${event.entries.length} nights in a row with ${cat ? CATEGORY_UI[cat].short.toLowerCase() : "practical"} guidance in this calendar.`
        : null;

  return (
    <li className={`overflow-hidden rounded-2xl border border-[var(--tc-line)] shadow-sm ${highlight ? "bg-amber-50/70 dark:bg-amber-950/30" : "bg-[var(--tc-bg)]"}`}>
      <div className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1 p-3 sm:grid-cols-[5.5rem_7rem_1fr] sm:gap-x-4">
        <div className="sm:row-span-2">
          <DateTile date={event.date} end={event.end} approximate={approximate && event.kind !== "moon"} />
        </div>
        <div className="hidden sm:row-span-2 sm:block">
          <PictureTile event={event} tz={tz} />
        </div>
        <div className="min-w-0 py-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <span className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">{event.title}</span>
              <span className="ml-2 text-base text-[var(--tc-muted)]">
                {event.cultureName}
                {event.region ? ` · ${event.region}` : null}
              </span>
            </div>
            <Badge status={event.status} category={cat} />
          </div>
          {summary ? <p className="mt-1 text-base text-[var(--tc-muted)]">{summary}</p> : null}
        </div>
        {/* On a phone the research runs the full width under the date. */}
        <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-3">
          {event.entries.length > 0 ? (
            <div className="mt-2 space-y-3">
              {[...groups].map(([cultureKey, entries]) => (
                <div key={cultureKey}>
                  {event.kind === "moon" || groups.size > 1 ? (
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">
                      {entries[0].item.cultureName}
                      {event.kind === "moon" ? <span className="font-normal normal-case tracking-normal text-sky-800 dark:text-sky-300">Approximate lunar alignment</span> : null}
                    </p>
                  ) : null}
                  <ul className="mt-1 space-y-2">
                    {entries.map((e) => (
                      <Interpretation key={`${e.item.id}|${e.date.day}`} entry={e} showDate={event.kind === "window"} historyPath={historyPath} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {cautions.length > 0 ? (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--tc-muted)] underline-offset-2 hover:text-[var(--tc-ink)] hover:underline"
            >
              <ChevronRight aria-hidden className={`size-4 transition-transform ${open ? "rotate-90" : ""}`} />
              {approximate ? "Why these dates are estimates" : "Cautions"}
            </button>
          ) : null}
          {open ? (
            <div id={detailsId} className="mt-1 space-y-1 border-l-2 border-amber-600/40 pl-3 text-sm text-amber-800 dark:text-amber-300">
              {cautions.map((c, i) => (
                <p key={i}>{c}</p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function Interpretation({ entry, showDate, historyPath }: { entry: AdviceEntry; showDate: boolean; historyPath: string }) {
  const { item } = entry;
  const href = `${historyPath}/${item.cultureKey}`;
  const label = item.night !== undefined && !item.name.startsWith("Unnamed") ? `${item.name} (night ${item.night})` : item.name;
  return (
    <li className="text-base leading-snug">
      <p>
        {showDate ? <span className="mr-1 text-sm text-[var(--tc-muted)]">{WEEKDAYS_SHORT[weekdayOf(entry.date)]} {shortDate(entry.date)}:</span> : null}
        <span className="font-semibold">{label}</span>
        <span className="text-[var(--tc-muted)]"> · traditional meaning: </span>
        {item.says[0]}
      </p>
      {item.says.length > 1 ? (
        <details className="mt-0.5 text-sm">
          <summary className="cursor-pointer text-[var(--tc-muted)]">Other accounts ({item.says.length - 1})</summary>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {item.says.slice(1).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </details>
      ) : null}
      {item.modern.length > 0 ? (
        <p className="mt-0.5">
          <span className="font-semibold text-emerald-800 dark:text-emerald-300">Practical today (modern, optional):</span> {item.modern[0]}
        </p>
      ) : null}
      {item.conflicts.length > 0 ? (
        <details className="mt-0.5 text-sm">
          <summary className="cursor-pointer font-medium text-amber-800 dark:text-amber-300">Historical interpretations differ</summary>
          <ul className="mt-1 space-y-1 border-l-2 border-amber-600/40 pl-3">
            {item.conflicts.map((c, i) => (
              <li key={i}>
                {c.text} <SourceLinks sources={c.sources} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <p className="mt-0.5 text-sm text-[var(--tc-muted)]">
        {item.sources.length > 0 ? (
          <>
            Source: <SourceLinks sources={item.sources} />
            {" · "}
          </>
        ) : null}
        <Link href={href} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">{item.cultureName} in History</Link>
      </p>
    </li>
  );
}

/** Traditions with no date rule: Greek month days, market cycles, seasons and months. */
function UndatedTraditions({ items, historyPath }: { items: AdviceItem[]; historyPath: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 border-t border-[var(--tc-line)] pt-4">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-2 text-lg font-medium">
        <ChevronRight aria-hidden className={`size-5 transition-transform ${open ? "rotate-90" : ""}`} />
        Traditions without a date ({items.length})
      </button>
      <p className="mt-1 text-sm text-[var(--tc-muted)]">
        Ancient Greek month days, market cycles, seasons and months. Their place in today&apos;s calendar has not been worked out, so they are not given dates.
      </p>
      {open ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-xl border border-[var(--tc-line)] bg-[var(--tc-bg)] p-3">
              <div className="flex flex-col items-center justify-center gap-1 text-center leading-tight">
                {item.status === "recurring" ? <RefreshCw aria-hidden className="size-6 text-[var(--tc-muted)]" /> : <CalendarDays aria-hidden className="size-6 text-[var(--tc-muted)]" />}
                <div className="text-xs text-[var(--tc-muted)]">{item.position || (item.status === "recurring" ? "Recurring" : "No date")}</div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span>
                    <span className="font-serif text-xl font-semibold">{item.name}</span>
                    <span className="ml-2 text-sm text-[var(--tc-muted)]">
                      {item.cultureName}
                      {item.region ? ` · ${item.region}` : null}
                    </span>
                  </span>
                  <Badge status={item.status} category={item.categories[0]} />
                </div>
                <ul className="mt-1">
                  <Interpretation entry={{ item, date: item.date ?? { year: 0, month: 1, day: 1 } }} showDate={false} historyPath={historyPath} />
                </ul>
                {item.caution ? <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{item.caution}</p> : null}
                <div className="mt-1">
                  <EvidenceChips tags={item.evidence} />
                </div>
              </div>
            </li>
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
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--tc-ink)]">{s.title}</a>
          ) : (
            s.title
          )}
        </span>
      ))}
    </>
  );
}
