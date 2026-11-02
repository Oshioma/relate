"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Globe2, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type CivilDate,
  MAX_YEAR,
  MIN_YEAR,
  SUGGESTED_TIME_ZONES,
  WEEKDAYS,
  addDays,
  addMonths,
  addYears,
  clampYear,
  daysInGregorianMonth,
  formatIsoDate,
  formatLongDate,
  isProlepticGregorian,
  parseIsoDate,
  sameDate,
} from "@/lib/true-calendar/dates";
import { fixedWeekday, formatFixedDate, gregorianToFixed } from "@/lib/true-calendar/fixed";
import { lunarMonthContaining } from "@/lib/true-calendar/astronomy";
import { parseYearInput } from "@/lib/true-calendar/url-state";
import { FixedGrid, GregorianGrid, LunarGrid } from "./calendar-grids";
import { MoonPanel } from "./moon-panel";
import { DayWisdom } from "./day-wisdom";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import type { ResearchStats } from "@/lib/data/true-calendar";
import { useCalendarPrefs, useCalendarState } from "./use-calendar-state";

// The True Calendar: two synchronised calendars for one selected day.
// Left, the Gregorian month; right, the International Fixed Calendar or the
// astronomical lunar calendar. Every control just changes the selected date
// (kept in the URL), and both sides and the Moon panel follow it.

export function TrueCalendarView({ bundle, stats, historyPath }: { bundle: ResearchBundle; stats: ResearchStats | null; historyPath: string }) {
  const state = useCalendarState();
  const [prefs, setPrefs] = useCalendarPrefs();
  // On a phone the two calendars share one slot; this picks which shows.
  const [mobileSide, setMobileSide] = useState<"left" | "right">("left");

  return !state.ready ? (
    <LoadingFrame />
  ) : (
    <Calendar state={state} prefs={prefs} setPrefs={setPrefs} mobileSide={mobileSide} setMobileSide={setMobileSide} bundle={bundle} stats={stats} historyPath={historyPath} />
  );
}

function LoadingFrame() {
  return (
    <div aria-busy="true" aria-live="polite" className="grid gap-4 md:grid-cols-2">
      <span className="sr-only">Working out today&apos;s date in your timezone…</span>
      {[0, 1].map((i) => (
        <div key={i} className="h-80 animate-pulse rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)]" />
      ))}
    </div>
  );
}

function Calendar({
  state,
  prefs,
  setPrefs,
  mobileSide,
  setMobileSide,
  bundle,
  stats,
  historyPath,
}: {
  bundle: ResearchBundle;
  stats: ResearchStats | null;
  historyPath: string;
  state: ReturnType<typeof useCalendarState>;
  prefs: ReturnType<typeof useCalendarPrefs>[0];
  setPrefs: ReturnType<typeof useCalendarPrefs>[1];
  mobileSide: "left" | "right";
  setMobileSide: (s: "left" | "right") => void;
}) {
  const { date, today, tz, view } = state;
  const select = (d: CivilDate) => state.setDate(clampYear(d));
  const fixed = gregorianToFixed(date);
  const fixedDay = fixedWeekday(fixed);
  const lunar = useMemo(() => lunarMonthContaining(date, tz), [date, tz]);
  const isToday = sameDate(date, today);
  const gridProps = { date, today, tz, southern: prefs.southernView, onSelect: select };

  return (
    <div className="space-y-5">
      <Toolbar state={state} select={select} />

      {/* The selected day in all three reckonings. */}
      <div className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-3" aria-live="polite">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-serif text-2xl">{formatLongDate(date)}</p>
          {isToday ? <span className="rounded-full bg-[var(--tc-gold)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--tc-bg)]">Today</span> : null}
        </div>
        <dl className="mt-1.5 grid gap-x-6 gap-y-1 text-base sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="text-[var(--tc-muted)]">Fixed calendar</dt>
            <dd>
              {fixedDay === null ? `${formatFixedDate(fixed)} (outside the week)` : `${WEEKDAYS[fixedDay]} ${formatFixedDate(fixed)}`}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-[var(--tc-muted)]">Lunar calendar</dt>
            <dd>
              Day {lunar.day} of lunar month {lunar.month.numberInYear}, {lunar.month.year}
            </dd>
          </div>
        </dl>
        {isProlepticGregorian(date) ? (
          <p className="mt-2 text-sm text-[var(--tc-muted)]">
            Before 15 October 1582 no one used the Gregorian calendar. This date is shown in it projected backwards (the proleptic Gregorian calendar), which is how astronomers line up ancient dates; it is not the date people used at the time.
          </p>
        ) : null}
      </div>

      {/* Phone: one calendar at a time, same selected date. */}
      <div role="tablist" aria-label="Which calendar to show" className="grid grid-cols-2 gap-1 rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] p-1 md:hidden">
        {(["left", "right"] as const).map((side) => (
          <button
            key={side}
            type="button"
            role="tab"
            aria-selected={mobileSide === side}
            onClick={() => setMobileSide(side)}
            className={cn("rounded-md py-1.5 text-base", mobileSide === side ? "bg-[var(--tc-selected)] text-[var(--tc-selected-ink)]" : "text-[var(--tc-ink)]")}
          >
            {side === "left" ? "Gregorian" : view === "lunar" ? "Lunar" : "Fixed"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-label="Gregorian calendar" className={cn("rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] p-3 sm:p-4", mobileSide !== "left" && "hidden md:block")}>
          <GregorianGrid {...gridProps} />
        </section>
        <section aria-label={view === "lunar" ? "Astronomical lunar calendar" : "International Fixed Calendar"} className={cn("rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] p-3 sm:p-4", mobileSide !== "right" && "hidden md:block")}>
          <div role="radiogroup" aria-label="Calendar on the right" className="mb-3 inline-flex rounded-md border border-[var(--tc-line)] p-0.5 text-sm">
            {(["fixed", "lunar"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                onClick={() => state.setView(v)}
                className={cn("rounded px-2.5 py-1", view === v ? "bg-[var(--tc-selected)] text-[var(--tc-selected-ink)]" : "text-[var(--tc-ink)] hover:bg-[var(--tc-hover)]")}
              >
                {v === "fixed" ? "International Fixed" : "True Astronomical Lunar"}
              </button>
            ))}
          </div>
          {view === "fixed" ? <FixedGrid {...gridProps} /> : <LunarGrid {...gridProps} lunar={lunar} />}
          <p className="mt-3 text-sm leading-relaxed text-[var(--tc-muted)]">
            {view === "fixed"
              ? "A mathematical civil calendar, not a lunar one: 13 months of 28 days, so every month starts on a Sunday. Year Day (31 December) and, in leap years, Leap Day (17 June, before Sol 1) sit outside the week. Its 28-day months run about a day and a half shorter than the Moon's cycle, so they drift against the phases."
              : "A generic astronomical lunar calendar, not any one culture's: each month begins on the local day of the astronomical new Moon (conjunction) in your timezone and runs to the next, so it has 29 or 30 days. Months are numbered in the Gregorian year they begin, 12 or 13 a year. Calendars that start the month at the first visible crescent, or insert a 13th month, follow their own rules."}
          </p>
          <label className="mt-2 flex items-center gap-2 text-sm text-[var(--tc-muted)]">
            <input type="checkbox" checked={prefs.southernView} onChange={(e) => setPrefs({ southernView: e.target.checked })} className="accent-[var(--tc-gold)]" />
            Draw the Moon as seen from the southern hemisphere
          </label>
        </section>
      </div>

      <MoonPanel date={date} tz={tz} prefs={prefs} onPrefs={setPrefs} />

      <DayWisdom bundle={bundle} stats={stats} date={date} tz={tz} historyPath={historyPath} isToday={isToday} />
    </div>
  );
}

function Toolbar({ state, select }: { state: ReturnType<typeof useCalendarState>; select: (d: CivilDate) => void }) {
  const { date, tz } = state;
  const [yearText, setYearText] = useState("");
  const [yearError, setYearError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const goToYear = (e: FormEvent) => {
    e.preventDefault();
    const year = parseYearInput(yearText);
    if (year === null || year < MIN_YEAR || year > MAX_YEAR) {
      setYearError(`Try a year like 2026, 1066 or 44 BCE (between ${1 - MIN_YEAR} BCE and ${MAX_YEAR}).`);
      return;
    }
    setYearError(null);
    setYearText("");
    select({ year, month: date.month, day: Math.min(date.day, daysInGregorianMonth(year, date.month)) });
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("date", formatIsoDate(date));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url.toString());
    }
  };

  const zones = SUGGESTED_TIME_ZONES.includes(tz as (typeof SUGGESTED_TIME_ZONES)[number]) ? SUGGESTED_TIME_ZONES : [tz, ...SUGGESTED_TIME_ZONES];
  const step = "inline-flex h-10 items-center gap-1 rounded-md border border-[var(--tc-line)] px-2 text-sm hover:bg-[var(--tc-hover)] focus-visible:outline-2 focus-visible:outline-[var(--tc-gold)]";
  const isoValue = date.year >= 1 && date.year <= 9999 ? formatIsoDate(date) : "";

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Move the selected date">
        <button type="button" onClick={state.goToday} className={cn(step, "bg-[var(--tc-selected)] font-medium text-[var(--tc-selected-ink)] hover:bg-[var(--tc-selected)]")}>
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          Today
        </button>
        <button type="button" className={step} onClick={() => select(addYears(date, -1))} aria-label="Previous year">
          <ChevronsLeft className="h-3.5 w-3.5" aria-hidden />
          Year
        </button>
        <button type="button" className={step} onClick={() => select(addMonths(date, -1))} aria-label="Previous month">
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Month
        </button>
        <button type="button" className={step} onClick={() => select(addDays(date, -1))} aria-label="Previous day">
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Day
        </button>
        <button type="button" className={step} onClick={() => select(addDays(date, 1))} aria-label="Next day">
          Day
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button type="button" className={step} onClick={() => select(addMonths(date, 1))} aria-label="Next month">
          Month
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button type="button" className={step} onClick={() => select(addYears(date, 1))} aria-label="Next year">
          Year
          <ChevronsRight className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button type="button" className={step} onClick={share} aria-label="Copy a link to this date">
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Link2 className="h-3.5 w-3.5" aria-hidden />}
          {copied ? "Copied" : "Share"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-1">
          <span className="sr-only">Jump to date</span>
          <input
            type="date"
            value={isoValue}
            onChange={(e) => {
              const d = parseIsoDate(e.target.value);
              if (d) select(d);
            }}
            className="h-10 rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 text-[var(--tc-ink)]"
          />
        </label>
        <form onSubmit={goToYear} className="flex items-center gap-1">
          <label htmlFor="tc-year" className="sr-only">
            Go to year
          </label>
          <input
            id="tc-year"
            value={yearText}
            onChange={(e) => setYearText(e.target.value)}
            placeholder="Year, e.g. 44 BCE"
            inputMode="text"
            autoComplete="off"
            aria-invalid={yearError ? true : undefined}
            aria-describedby={yearError ? "tc-year-error" : undefined}
            className="h-10 w-44 rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 text-[var(--tc-ink)] placeholder:text-[var(--tc-muted)]"
          />
          <button type="submit" className={step}>
            Go
          </button>
        </form>
        <label className="flex items-center gap-1">
          <Globe2 className="h-3.5 w-3.5 text-[var(--tc-muted)]" aria-hidden />
          <span className="sr-only">Timezone</span>
          <select
            value={state.tzChosen ? tz : ""}
            onChange={(e) => state.setTimeZone(e.target.value || null)}
            className="h-10 max-w-[15rem] rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-1 text-[var(--tc-ink)]"
          >
            <option value="">My timezone{state.tzChosen ? "" : ` (${tz})`}</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      {yearError ? (
        <p id="tc-year-error" role="alert" className="text-sm text-[var(--danger)] lg:basis-full">
          {yearError}
        </p>
      ) : null}
    </div>
  );
}
