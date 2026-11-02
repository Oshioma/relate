"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/components/ui/link";
import { type CivilDate, GREGORIAN_MONTHS, WEEKDAYS, weekdayOf } from "@/lib/true-calendar/dates";
import { moonDays } from "@/lib/true-calendar/astronomy";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import type { ResearchStats } from "@/lib/data/true-calendar";
import {
  ADVICE_CATEGORIES,
  CONFIDENCE_TIERS,
  DATE_STATUS_LABELS,
  type AdviceCategory,
  type AdviceFilter,
  type AdviceItem,
  type ConfidenceTier,
  type DateStatus,
  adviceAhead,
  filterFeed,
} from "@/lib/true-calendar/research/ahead";
import { EvidenceChips } from "./history-bits";

// "Next advice from the past": what the published research says is coming up,
// from any tradition, not limited to the week. Three groups (dated, lunar,
// seasonal and recurring); every card says how its date is known, keeps the
// tradition's own words apart from our modern reading, and links its sources
// and the culture's History page. Nothing here is generated to fill a gap.

const STEP = 5;

const STATUS_STYLE: Record<DateStatus, string> = {
  official: "border-emerald-600/50 text-emerald-800 dark:text-emerald-300",
  verified: "border-emerald-600/50 text-emerald-800 dark:text-emerald-300",
  secondary: "border-amber-600/50 text-amber-800 dark:text-amber-300",
  astronomical: "border-sky-600/40 text-sky-800 dark:text-sky-300",
  provisional: "border-amber-600/50 text-amber-800 dark:text-amber-300",
  lunar_pending: "border-[var(--tc-line)] text-[var(--tc-muted)]",
  recurring: "border-[var(--tc-line)] text-[var(--tc-muted)]",
  disputed: "border-rose-600/40 text-rose-800 dark:text-rose-300",
};

const GROUPS = [
  { key: "dated", title: "Upcoming dated observances", blurb: "Dates a source lists, or that a sourced cycle anchor counts to. Each says which.", empty: "No dated observance matches yet." },
  {
    key: "lunar",
    title: "Upcoming lunar knowledge",
    blurb: "Guidance tied to lunar nights and Moon phases. A Moon phase is calculated; a named night waits for its tradition's own month rule (when the month starts, and which community's count), so it shows \"Lunar date pending verification\" instead of a guessed date.",
    empty: "No lunar knowledge matches yet.",
  },
  {
    key: "seasonal",
    title: "Seasonal and recurring wisdom",
    blurb: "Market cycles, seasons and other recurring calendars, in their own region's terms. Their alignment with today's date has not been verified, and seasons from another region do not carry over to Zanzibar.",
    empty: "No seasonal or recurring knowledge matches yet.",
  },
] as const;

export function NextAdvice({ bundle, stats, date, tz, historyPath }: { bundle: ResearchBundle; stats: ResearchStats | null; date: CivilDate; tz: string; historyPath: string }) {
  const feed = useMemo(() => adviceAhead(bundle, date, moonDays(date, 35, tz)), [bundle, date, tz]);
  // "See related advice" on a History page links here with ?advice=<culture>.
  // The calendar renders only in the browser (it waits for the local date), so
  // reading the address here is safe.
  const [linkedCulture] = useState(() => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("advice")));
  const [filter, setFilter] = useState<AdviceFilter>({ category: "all", culture: linkedCulture ?? "all", tier: "all" });
  const [shown, setShown] = useState({ dated: STEP, lunar: STEP, seasonal: STEP });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (linkedCulture) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [linkedCulture]);

  const cultures = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of [...feed.dated, ...feed.lunar, ...feed.seasonal]) m.set(i.cultureKey, i.cultureName);
    return [...m].sort((a, b) => a[1].localeCompare(b[1]));
  }, [feed]);
  const filtered = filterFeed(feed, filter);
  const total = feed.dated.length + feed.lunar.length + feed.seasonal.length;
  const set = (patch: Partial<AdviceFilter>) => {
    setFilter((f) => ({ ...f, ...patch }));
    setShown({ dated: STEP, lunar: STEP, seasonal: STEP });
  };

  return (
    <section ref={sectionRef} id="tc-next-advice" aria-labelledby="tc-next-advice-heading" className="scroll-mt-4 space-y-3">
      <ResearchCounters stats={stats} historyPath={historyPath} />

      <div className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
        <h2 id="tc-next-advice-heading" className="font-serif text-2xl">Next Advice From the Past</h2>
        <p className="mt-0.5 text-base text-[var(--tc-muted)]">Traditional knowledge worth knowing, from cultures around the world.</p>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by kind of knowledge">
          <FilterChip active={filter.category === "all"} onClick={() => set({ category: "all" })}>All knowledge</FilterChip>
          {ADVICE_CATEGORIES.map((c) => (
            <FilterChip key={c.key} active={filter.category === c.key} onClick={() => set({ category: c.key as AdviceCategory })}>{c.label}</FilterChip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--tc-muted)]">
          <label className="flex items-center gap-2">
            Culture
            <select value={filter.culture} onChange={(e) => set({ culture: e.target.value })} className="rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 py-1 text-base text-[var(--tc-ink)]">
              <option value="all">All cultures</option>
              {cultures.map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
              {filter.culture !== "all" && !cultures.some(([k]) => k === filter.culture) ? <option value={filter.culture}>{filter.culture}</option> : null}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Source confidence
            <select value={filter.tier} onChange={(e) => set({ tier: e.target.value as ConfidenceTier | "all" })} className="rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 py-1 text-base text-[var(--tc-ink)]">
              <option value="all">Any</option>
              {CONFIDENCE_TIERS.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>

        {total === 0 ? (
          <p className="mt-4 text-base text-[var(--tc-muted)]">
            No research has been published yet. Knowledge appears here as soon as a reviewer publishes it.{" "}
            <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">Browse the traditions in History</Link>.
          </p>
        ) : (
          GROUPS.map((g) => {
            const items = filtered[g.key];
            const n = shown[g.key];
            return (
              <div key={g.key} className="mt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">
                  {g.title} <span className="font-normal normal-case tracking-normal">({items.length})</span>
                </h3>
                <p className="mt-0.5 text-sm text-[var(--tc-muted)]">{g.blurb}</p>
                {items.length === 0 ? (
                  <p className="mt-2 text-base text-[var(--tc-muted)]">{g.empty}</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {items.slice(0, n).map((item) => (
                      <AdviceCard key={item.id} item={item} historyPath={historyPath} />
                    ))}
                  </ul>
                )}
                {items.length > n ? (
                  <button
                    type="button"
                    onClick={() => setShown((s) => ({ ...s, [g.key]: s[g.key] + STEP }))}
                    className="mt-2 rounded-md border border-[var(--tc-line)] px-3 py-1.5 text-base font-medium hover:bg-[var(--tc-hover)]"
                  >
                    Show more ({items.length - n} more)
                  </button>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function ResearchCounters({ stats, historyPath }: { stats: ResearchStats | null; historyPath: string }) {
  if (!stats) return null;
  const cell = "rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-3 py-2";
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Published research">
      <div className={`${cell} flex flex-col-reverse`}>
        <dt className="text-sm text-[var(--tc-muted)]">Research records</dt>
        <dd className="font-serif text-3xl">{stats.records}</dd>
      </div>
      <div className={`${cell} flex flex-col-reverse`}>
        <dt className="text-sm text-[var(--tc-muted)]">With practical guidance</dt>
        <dd className="font-serif text-3xl">{stats.actionable}</dd>
      </div>
      <div className={`${cell} flex flex-col-reverse`}>
        <dt className="text-sm text-[var(--tc-muted)]">
          <Link href={historyPath} className="underline-offset-2 hover:text-[var(--tc-ink)] hover:underline">Cultures represented</Link>
        </dt>
        <dd className="font-serif text-3xl">{stats.cultures}</dd>
      </div>
      <div className={`${cell} flex flex-col-reverse`}>
        <dt className="text-sm text-[var(--tc-muted)]">Upcoming dated observances</dt>
        <dd className="font-serif text-3xl">{stats.upcomingDated}</dd>
      </div>
    </dl>
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

function Indicator({ item }: { item: AdviceItem }) {
  if (item.date) {
    const d = item.date;
    return (
      <div className="text-center leading-tight">
        <div className="text-xs uppercase tracking-wider text-[var(--tc-muted)]">{WEEKDAYS[weekdayOf(d)].slice(0, 3)}</div>
        <div className="font-serif text-2xl">{d.day}</div>
        <div className="text-xs">{GREGORIAN_MONTHS[d.month - 1].slice(0, 3)} {d.year}</div>
      </div>
    );
  }
  return (
    <div className="text-center leading-tight text-[var(--tc-muted)]">
      <div aria-hidden className="text-xl">{item.group === "lunar" ? "☾" : "↻"}</div>
      <div className="text-xs">{item.position}</div>
    </div>
  );
}

function AdviceCard({ item, historyPath }: { item: AdviceItem; historyPath: string }) {
  const href = `${historyPath}/${item.cultureKey}`;
  return (
    <li className="grid grid-cols-[3.75rem_1fr] gap-3 rounded-md border border-[var(--tc-line)] px-3 py-2">
      <Indicator item={item} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-serif text-lg">{item.name}</span>
          <span className="text-sm text-[var(--tc-muted)]">
            <Link href={href} className="font-medium text-[var(--tc-ink)] underline-offset-2 hover:underline">{item.cultureName}</Link>
            {item.region ? ` · ${item.region}` : null}
          </span>
          <span className={`ml-auto inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{DATE_STATUS_LABELS[item.status]}</span>
        </div>
        {item.cycle ? <p className="text-sm text-[var(--tc-muted)]">{item.cycle}</p> : null}

        {item.conflicts.length > 0 ? (
          <details className="mt-1 text-base">
            <summary className="cursor-pointer font-medium text-amber-800 dark:text-amber-300">Historical interpretations differ. See each account</summary>
            <ul className="mt-1 space-y-1 border-l-2 border-amber-600/40 pl-3">
              {item.conflicts.map((c, i) => (
                <li key={i}>
                  {c.text} <SourceLinks sources={c.sources} />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        <p className="mt-1 text-base leading-snug">
          <span className="text-[var(--tc-muted)]">The tradition says: </span>
          {item.says.join(". ")}
        </p>
        {item.modern.length > 0 ? (
          <p className="mt-0.5 text-base leading-snug">
            <span className="text-[var(--tc-muted)]">Today, you could (our modern reading): </span>
            {item.modern.join(" ")}
          </p>
        ) : null}
        {item.caution ? <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-300">{item.caution}</p> : null}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--tc-muted)]">
          <EvidenceChips tags={item.evidence} />
          {item.sources.length > 0 ? (
            <span>
              Source: <SourceLinks sources={item.sources} />
            </span>
          ) : null}
          <Link href={href} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">History</Link>
        </div>
      </div>
    </li>
  );
}

function SourceLinks({ sources }: { sources: AdviceItem["sources"] }) {
  return (
    <>
      {sources.map((s, i) => (
        <span key={s.key} className="text-sm text-[var(--tc-muted)]">
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
