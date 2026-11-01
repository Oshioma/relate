"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type CivilDate,
  GREGORIAN_MONTHS,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  addDays,
  addMonths,
  addYears,
  daysInGregorianMonth,
  formatLongDate,
  formatYear,
  sameDate,
  weekdayOf,
} from "@/lib/true-calendar/dates";
import { FIXED_MONTHS, type FixedDate, addFixedMonths, fixedGridMonth, fixedToGregorian, formatFixedDate, gregorianToFixed } from "@/lib/true-calendar/fixed";
import { type DayMoon, type LunarDate, QUARTER_NAMES, moonDays, stepLunarMonth } from "@/lib/true-calendar/astronomy";
import { isGregorianLeapYear } from "@/lib/true-calendar/dates";
import { MoonGlyph } from "./moon-glyph";

// The three month grids. All of them are plain buttons in a role="grid", so
// they work with a keyboard: arrows move a day / a week, Page Up/Down a month
// (with Shift, a year), Home jumps to today. Moving selection keeps focus on
// the selected day.

export interface GridProps {
  date: CivilDate;
  today: CivilDate;
  tz: string;
  southern: boolean;
  onSelect: (date: CivilDate) => void;
}

function useGridKeys({ date, today, onSelect }: Pick<GridProps, "date" | "today" | "onSelect">) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = ref.current;
    if (!grid || !grid.contains(document.activeElement)) return;
    grid.querySelector<HTMLButtonElement>("[aria-selected='true']")?.focus();
  }, [date]);
  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, () => CivilDate> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      PageUp: () => (e.shiftKey ? addYears(date, -1) : addMonths(date, -1)),
      PageDown: () => (e.shiftKey ? addYears(date, 1) : addMonths(date, 1)),
      Home: () => today,
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    onSelect(move());
  };
  return { ref, onKeyDown };
}

export function PanelHeader({
  title,
  subtitle,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2 pb-3">
      <div className="min-w-0">
        <h3 className="font-serif text-2xl leading-tight tracking-tight text-[var(--tc-ink)]">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-sm text-[var(--tc-muted)]">{subtitle}</p> : null}
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton label={prevLabel} onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        <IconButton label={nextLabel} onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

export function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--tc-line)] text-[var(--tc-ink)] transition-colors hover:bg-[var(--tc-hover)] focus-visible:outline-2 focus-visible:outline-[var(--tc-gold)]"
    >
      {children}
    </button>
  );
}

function WeekdayHeader() {
  return (
    <div className="grid grid-cols-7 pb-1" aria-hidden>
      {WEEKDAYS_SHORT.map((d) => (
        <div key={d} className="text-center text-xs font-medium uppercase tracking-[0.12em] text-[var(--tc-muted)]">
          {d.slice(0, 2)}
        </div>
      ))}
    </div>
  );
}

const QUARTER_SHORT = { new: "New", first: "1st Q", full: "Full", last: "Last Q" } as const;

function DayCell({
  selected,
  isToday,
  muted,
  label,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  isToday: boolean;
  muted?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="gridcell"
      aria-selected={selected}
      aria-current={isToday ? "date" : undefined}
      aria-label={label}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
      className={cn(
        "relative flex min-h-[4rem] flex-col items-center justify-start gap-0.5 rounded-md px-0.5 pt-1 pb-1 text-[var(--tc-ink)] transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--tc-gold)]",
        selected ? "bg-[var(--tc-selected)] text-[var(--tc-selected-ink)]" : "hover:bg-[var(--tc-hover)]",
        isToday && !selected && "ring-1 ring-inset ring-[var(--tc-gold)]",
        muted && !selected && "opacity-45",
        className
      )}
    >
      {children}
    </button>
  );
}

function moonLabel(m: DayMoon | undefined): string {
  if (!m) return "";
  return m.quarter ? `, ${QUARTER_NAMES[m.quarter.kind]}` : `, ${m.name}, ${Math.round(m.state.illumination * 100)}% lit`;
}

function QuarterTag({ moon, selected }: { moon: DayMoon | undefined; selected: boolean }) {
  if (!moon?.quarter) return null;
  return (
    <span className={cn("text-[11px] leading-none font-medium tracking-wide", selected ? "text-[var(--tc-selected-ink)]" : "text-[var(--tc-gold)]")}>
      {QUARTER_SHORT[moon.quarter.kind]}
    </span>
  );
}

// --- Gregorian -----------------------------------------------------------------

export function GregorianGrid({ date, today, tz, southern, onSelect }: GridProps) {
  const { ref, onKeyDown } = useGridKeys({ date, today, onSelect });
  const first: CivilDate = { year: date.year, month: date.month, day: 1 };
  const lead = weekdayOf(first);
  const length = daysInGregorianMonth(date.year, date.month);
  const weeks = Math.ceil((lead + length) / 7);
  const gridStart = addDays(first, -lead);
  const moons = moonDays(gridStart, weeks * 7, tz);

  return (
    <div>
      <PanelHeader
        title={`${GREGORIAN_MONTHS[date.month - 1]} ${formatYear(date.year)}`}
        subtitle="Gregorian calendar"
        onPrev={() => onSelect(addMonths(date, -1))}
        onNext={() => onSelect(addMonths(date, 1))}
        prevLabel="Previous month"
        nextLabel="Next month"
      />
      <WeekdayHeader />
      <div ref={ref} role="grid" aria-label={`${GREGORIAN_MONTHS[date.month - 1]} ${formatYear(date.year)}`} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-0.5">
        {moons.map((moon, i) => {
          const d = addDays(gridStart, i);
          const selected = sameDate(d, date);
          const outside = d.month !== date.month;
          return (
            <DayCell
              key={i}
              selected={selected}
              isToday={sameDate(d, today)}
              muted={outside}
              label={`${formatLongDate(d)}${moonLabel(moon)}`}
              onClick={() => onSelect(d)}
            >
              <span className="text-base tabular-nums leading-none">{d.day}</span>
              <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={17} southern={southern} />
              <QuarterTag moon={moon} selected={selected} />
            </DayCell>
          );
        })}
      </div>
    </div>
  );
}

// --- International Fixed ----------------------------------------------------------

function shortGregorian(d: CivilDate): string {
  return `${d.day} ${GREGORIAN_MONTHS[d.month - 1].slice(0, 3)}`;
}

export function FixedGrid({ date, today, tz, southern, onSelect }: GridProps) {
  const { ref, onKeyDown } = useGridKeys({ date, today, onSelect });
  const fixed = gregorianToFixed(date);
  const month = fixedGridMonth(fixed);
  const year = fixed.year;
  const firstG = fixedToGregorian({ kind: "day", year, month, day: 1 });
  const extra: FixedDate | null = month === 13 ? { kind: "year-day", year } : month === 6 && isGregorianLeapYear(year) ? { kind: "leap-day", year } : null;
  const count = 28 + (extra ? 1 : 0);
  const moons = moonDays(firstG, count, tz);
  const step = (n: number) => {
    const target = addFixedMonths(fixed, n);
    onSelect(fixedToGregorian(target));
  };

  return (
    <div>
      <PanelHeader
        title={`${FIXED_MONTHS[month - 1]} ${formatYear(year)}`}
        subtitle={`International Fixed Calendar · month ${month} of 13`}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        prevLabel="Previous fixed month"
        nextLabel="Next fixed month"
      />
      <WeekdayHeader />
      <div ref={ref} role="grid" aria-label={`${FIXED_MONTHS[month - 1]} ${formatYear(year)}, International Fixed Calendar`} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: 28 }, (_, i) => {
          const g = addDays(firstG, i);
          const moon = moons[i];
          const selected = sameDate(g, date);
          return (
            <DayCell
              key={i}
              selected={selected}
              isToday={sameDate(g, today)}
              label={`${WEEKDAYS[i % 7]} ${i + 1} ${FIXED_MONTHS[month - 1]} (fixed), ${formatLongDate(g)}${moonLabel(moon)}`}
              onClick={() => onSelect(g)}
            >
              <span className="text-base tabular-nums leading-none">{i + 1}</span>
              <span className={cn("text-[11px] leading-none tabular-nums", selected ? "text-[var(--tc-selected-ink)]" : "text-[var(--tc-muted)]")}>{shortGregorian(g)}</span>
              <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={14} southern={southern} />
            </DayCell>
          );
        })}
        {extra ? (
          (() => {
            const g = fixedToGregorian(extra);
            const moon = moons[28];
            const selected = sameDate(g, date);
            return (
              <DayCell
                selected={selected}
                isToday={sameDate(g, today)}
                label={`${formatFixedDate(extra)}, outside the week, ${formatLongDate(g)}${moonLabel(moon)}`}
                onClick={() => onSelect(g)}
                className="col-span-7 min-h-0 flex-row justify-center gap-2 py-2"
              >
                <span className="text-base font-medium">{extra.kind === "leap-day" ? "Leap Day" : "Year Day"}</span>
                <span className={cn("text-sm", selected ? "text-[var(--tc-selected-ink)]" : "text-[var(--tc-muted)]")}>
                  {shortGregorian(g)} · outside the week{extra.kind === "leap-day" ? " · before Sol 1" : ""}
                </span>
                <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={15} southern={southern} />
              </DayCell>
            );
          })()
        ) : null}
      </div>
    </div>
  );
}

// --- Astronomical lunar -----------------------------------------------------------

export function LunarGrid({ date, today, tz, southern, onSelect, lunar }: GridProps & { lunar: LunarDate }) {
  const { ref, onKeyDown } = useGridKeys({ date, today, onSelect });
  const { month } = lunar;
  const moons = moonDays(month.start, month.length, tz);

  return (
    <div>
      <PanelHeader
        title={`Lunar month ${month.numberInYear} of ${formatYear(month.year)}`}
        subtitle={`Astronomical lunar calendar · ${month.length} days · Brown lunation ${month.brownLunation}`}
        onPrev={() => onSelect(stepLunarMonth(lunar, -1, tz))}
        onNext={() => onSelect(stepLunarMonth(lunar, 1, tz))}
        prevLabel="Previous lunar month"
        nextLabel="Next lunar month"
      />
      <div className="grid grid-cols-7 pb-1" aria-hidden>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className="text-center text-xs font-medium uppercase tracking-[0.12em] text-[var(--tc-muted)]">
            {n === 1 ? "Day" : ""}
          </div>
        ))}
      </div>
      <div ref={ref} role="grid" aria-label={`Lunar month ${month.numberInYear} of ${formatYear(month.year)}`} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-0.5">
        {moons.map((moon, i) => {
          const g = addDays(month.start, i);
          const selected = sameDate(g, date);
          return (
            <DayCell
              key={i}
              selected={selected}
              isToday={sameDate(g, today)}
              label={`Lunar day ${i + 1}, ${formatLongDate(g)}${moonLabel(moon)}`}
              onClick={() => onSelect(g)}
            >
              <span className="text-base tabular-nums leading-none">{i + 1}</span>
              <MoonGlyph illumination={moon.state.illumination} waxing={moon.state.waxing} size={19} southern={southern} />
              {moon.quarter ? (
                <QuarterTag moon={moon} selected={selected} />
              ) : (
                <span className={cn("text-[11px] leading-none tabular-nums", selected ? "text-[var(--tc-selected-ink)]" : "text-[var(--tc-muted)]")}>{shortGregorian(g)}</span>
              )}
            </DayCell>
          );
        })}
      </div>
    </div>
  );
}
