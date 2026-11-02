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
import { type CivilDate, GREGORIAN_MONTHS, WEEKDAYS_SHORT, weekdayOf } from "@/lib/true-calendar/dates";
import { lunarMonthContaining, moonDay, moonDays } from "@/lib/true-calendar/astronomy";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import type { ResearchStats } from "@/lib/data/true-calendar";
import {
  ADVICE_CATEGORIES,
  DATE_STATUS_BADGES,
  DATE_STATUS_LABELS,
  type AdviceCategory,
  type AdviceFilter,
  type AdviceItem,
  type DateStatus,
  adviceAhead,
  adviceList,
  filterFeed,
} from "@/lib/true-calendar/research/ahead";
import { EvidenceChips } from "./history-bits";
import { MoonGlyph } from "./moon-glyph";

// "Next Advice From the Past": one list of what the published research says is
// coming up. Every card has a date where one can be worked out:
// a listed date, a calculated Moon phase, or a lunar night counted from the
// calculated new Moon (the card's details say which rule was used). Only
// cycles with no known anchor (the Igbo market week) stay undated, at the end.
// The tradition's own words are kept apart from modern readings, and every
// card links its sources. Nothing here is generated to fill a gap.

const FIRST = 5;
const MORE = 10;

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
  counted: "border-[var(--tc-line)] bg-[var(--tc-panel)] text-[var(--tc-ink)]",
  lunar_pending: "border-[var(--tc-line)] bg-[var(--tc-panel)] text-[var(--tc-muted)]",
  recurring: "border-[var(--tc-line)] bg-[var(--tc-panel)] text-[var(--tc-ink)]",
  disputed: "border-rose-600/40 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

export function NextAdvice({ bundle, stats, date, tz, historyPath }: { bundle: ResearchBundle; stats: ResearchStats | null; date: CivilDate; tz: string; historyPath: string }) {
  const feed = useMemo(
    () => adviceAhead(bundle, date, moonDays(date, 35, tz), { monthStart: lunarMonthContaining(date, tz).month.start }),
    [bundle, date, tz],
  );
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

  const everything = useMemo(() => [...feed.dated, ...feed.lunar, ...feed.seasonal], [feed]);
  // One list: listed dates, the Moon, then each tradition in turn; undated last.
  const items = useMemo(() => adviceList(filterFeed(feed, filter)), [feed, filter]);
  const cultureName = filter.culture === "all" ? null : (everything.find((i) => i.cultureKey === filter.culture)?.cultureName ?? filter.culture);

  const set = (patch: Partial<AdviceFilter>) => {
    setFilter((f) => ({ ...f, ...patch }));
    setShown(FIRST);
  };

  return (
    <section
      ref={sectionRef}
      id="tc-next-advice"
      aria-labelledby="tc-next-advice-heading"
      className="scroll-mt-4 rounded-2xl border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-5 sm:px-6 sm:py-6"
    >
      <h2 id="tc-next-advice-heading" className="font-serif text-3xl font-semibold sm:text-4xl">Next Advice From the Past</h2>
      <p className="mt-1 text-lg text-[var(--tc-muted)]">Traditional knowledge to use in the days and weeks ahead.</p>

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
      {cultureName ? (
        <p className="mt-2 text-sm text-[var(--tc-muted)]">
          Showing {cultureName} only.{" "}
          <button type="button" onClick={() => set({ culture: "all" })} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[var(--tc-ink)]">
            <X aria-hidden className="size-3.5" /> Show every culture
          </button>
        </p>
      ) : null}

      {everything.length === 0 ? (
        <p className="mt-5 text-base text-[var(--tc-muted)]">
          No research has been published yet. Knowledge appears here as soon as a reviewer publishes it.{" "}
          <Link href={historyPath} className="underline underline-offset-2 hover:text-[var(--tc-ink)]">Browse the traditions in History</Link>.
        </p>
      ) : items.length === 0 ? (
        <p className="mt-5 text-base text-[var(--tc-muted)]">Nothing of this kind yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.slice(0, shown).map((item, i) => (
            <AdviceCard key={item.id} item={item} tz={tz} historyPath={historyPath} highlight={i === 0 && ["official", "verified", "secondary"].includes(item.status)} />
          ))}
        </ul>
      )}

      {items.length > shown ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + MORE)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tc-hover)] px-6 py-3 text-lg font-medium hover:brightness-95"
          >
            See more ancient wisdom <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      ) : null}

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

function DateTile({ item }: { item: AdviceItem }) {
  if (item.date) {
    const d = item.date;
    return (
      <div className="flex flex-col items-center justify-center px-1 text-center leading-tight">
        <div className="text-base text-[var(--tc-muted)] sm:text-lg">{WEEKDAYS_SHORT[weekdayOf(d)]}</div>
        <div className="font-serif text-4xl font-semibold sm:text-5xl">{d.day}</div>
        <div className="text-sm sm:text-base">{GREGORIAN_MONTHS[d.month - 1].slice(0, 3)} {d.year}</div>
        {item.status === "counted" || item.status === "provisional" ? (
          <div className="mt-1 rounded-full border border-[var(--tc-line)] px-2 text-xs text-[var(--tc-muted)]" title="Worked out by us, not a verified traditional date">Approx.</div>
        ) : null}
      </div>
    );
  }
  const recurring = item.status === "recurring";
  const Icon = recurring ? RefreshCw : CalendarDays;
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-1 text-center leading-tight">
      <Icon aria-hidden className="size-8 text-[var(--tc-muted)]" />
      <div className="text-sm font-medium sm:text-base">{recurring ? "Recurring" : "Date pending"}</div>
      {item.position ? <div className="text-xs text-[var(--tc-muted)] sm:text-sm">{item.position}</div> : null}
    </div>
  );
}

function PictureTile({ item, tz }: { item: AdviceItem; tz: string }) {
  if (item.cultureKey === "sky" && item.date) {
    const moon = moonDay(item.date, tz);
    return (
      <div className="flex h-full min-h-24 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950">
        <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={64} title={item.name} />
      </div>
    );
  }
  const cat = item.categories[0];
  const ui = cat ? CATEGORY_UI[cat] : null;
  const Icon = ui?.icon ?? (item.group === "lunar" ? Moon : Sparkles);
  return (
    <div className={`flex h-full min-h-24 items-center justify-center rounded-xl bg-gradient-to-br ${ui?.tint ?? PLAIN_TINT}`}>
      <Icon aria-hidden className="size-12 opacity-80" strokeWidth={1.5} />
    </div>
  );
}

function Badge({ item }: { item: AdviceItem }) {
  const cat = item.categories[0];
  const Icon =
    item.status === "official" || item.status === "verified" || item.status === "secondary"
      ? CircleCheck
      : item.status === "astronomical"
        ? Moon
        : item.status === "recurring"
          ? RefreshCw
          : cat
            ? CATEGORY_UI[cat].icon
            : Moon;
  return (
    <span
      title={DATE_STATUS_LABELS[item.status]}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium ${BADGE_STYLE[item.status]}`}
    >
      <Icon aria-hidden className="size-4" />
      {DATE_STATUS_BADGES[item.status]}
    </span>
  );
}

function AdviceCard({ item, tz, historyPath, highlight }: { item: AdviceItem; tz: string; historyPath: string; highlight: boolean }) {
  const [open, setOpen] = useState(false);
  const href = item.cultureKey === "sky" ? null : `${historyPath}/${item.cultureKey}`;
  const practical = item.modern[0] ?? null;
  const traditionally = !practical && item.says.length > 1 ? item.says[1] : null;
  const detailsId = `tc-advice-${item.id.replace(/[^a-zA-Z0-9-]/g, "-")}`;

  return (
    <li className={`overflow-hidden rounded-2xl border border-[var(--tc-line)] shadow-sm ${highlight ? "bg-amber-50/70 dark:bg-amber-950/30" : "bg-[var(--tc-bg)]"}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="grid w-full grid-cols-[4.5rem_1fr_auto] items-stretch gap-3 p-3 text-left hover:bg-[var(--tc-hover)] sm:grid-cols-[5.5rem_7rem_1fr_auto] sm:gap-4"
      >
        <DateTile item={item} />
        <div className="hidden sm:block">
          <PictureTile item={item} tz={tz} />
        </div>
        <div className="min-w-0 py-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <span className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">{item.name}</span>
              <span className="ml-2 text-base text-[var(--tc-muted)]">
                {item.cultureName}
                {item.region ? ` · ${item.region}` : null}
              </span>
            </div>
            <Badge item={item} />
          </div>
          <p className="mt-1.5 text-base leading-snug sm:text-lg">{item.says[0]}</p>
          {practical ? (
            <p className="mt-1 text-base leading-snug sm:text-lg">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">Practical today:</span> {practical}
            </p>
          ) : traditionally ? (
            <p className="mt-1 text-base leading-snug sm:text-lg">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">Traditionally:</span> {traditionally}
            </p>
          ) : null}
          {item.conflicts.length > 0 ? <p className="mt-1 text-sm font-medium text-amber-800 dark:text-amber-300">Historical interpretations differ. Open to see each account.</p> : null}
        </div>
        <ChevronRight aria-hidden className={`size-6 self-center text-[var(--tc-muted)] transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open ? (
        <div id={detailsId} className="space-y-2 border-t border-[var(--tc-line)] px-4 py-3 text-base sm:pl-[13.5rem]">
          {item.says.length > 1 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">What the tradition says</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {item.says.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {item.modern.length > 0 ? (
            <p>
              <span className="text-[var(--tc-muted)]">Modern reading (optional, not historical): </span>
              {item.modern.join(" ")}
            </p>
          ) : null}
          {item.conflicts.length > 0 ? (
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">Historical interpretations differ</p>
              <ul className="mt-1 space-y-1 border-l-2 border-amber-600/40 pl-3">
                {item.conflicts.map((c, i) => (
                  <li key={i}>
                    {c.text} <SourceLinks sources={c.sources} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-sm text-[var(--tc-muted)]">
            <span className="font-medium text-[var(--tc-ink)]">How this date is known: </span>
            {DATE_STATUS_LABELS[item.status]}.{item.cycle ? ` ${item.cycle}.` : null}
          </p>
          {item.caution ? <p className="text-sm text-amber-800 dark:text-amber-300">{item.caution}</p> : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--tc-muted)]">
            <EvidenceChips tags={item.evidence} />
            {item.sources.length > 0 ? (
              <span>
                Source: <SourceLinks sources={item.sources} />
              </span>
            ) : null}
            {href ? (
              <Link href={href} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">More about the {item.cultureName} in History</Link>
            ) : null}
          </div>
        </div>
      ) : null}
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
