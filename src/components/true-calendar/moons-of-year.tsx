"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CivilDate, GREGORIAN_MONTHS, civilDateAt } from "@/lib/true-calendar/dates";
import { lunarMonthContaining } from "@/lib/true-calendar/astronomy";
import { type MoonOfYear, moonIndexFor, moonsOfYear, withTraditions } from "@/lib/true-calendar/moons-of-year";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import { MoonGlyph } from "./moon-glyph";

// One card per Moon of the year (new Moon to new Moon), the selected day's
// Moon highlighted. A card opens in place to show what the sky does in that
// Moon and which named months of the traditions fall in it, each with its
// own date rule and sources. Nothing here gives a Moon a meaning of our own.

const short = (d: CivilDate) => `${d.day} ${GREGORIAN_MONTHS[d.month - 1].slice(0, 3)}`;

function formatInstant(instant: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(instant);
}

const ECLIPSE_WORDS: Record<string, string> = {
  "lunar:total": "Total eclipse of the Moon (a \"blood Moon\")",
  "lunar:partial": "Partial eclipse of the Moon",
  "lunar:penumbral": "Faint (penumbral) eclipse of the Moon",
  "solar:total": "Total eclipse of the Sun",
  "solar:annular": "Ring (annular) eclipse of the Sun",
  "solar:partial": "Partial eclipse of the Sun",
};

function badges(m: MoonOfYear): string[] {
  return [
    m.fullMoonSize === "supermoon" ? "Supermoon" : m.fullMoonSize === "micromoon" ? "Micromoon" : null,
    ...m.eclipses.map((e) => (e.kind === "lunar" ? "Moon eclipse" : "Sun eclipse")),
    ...m.seasons.map((s) => s.name),
  ].filter((b): b is string => Boolean(b));
}

export function MoonsOfYear({ date, tz, bundle, southern }: { date: CivilDate; tz: string; bundle: ResearchBundle; southern: boolean }) {
  const year = useMemo(() => lunarMonthContaining(date, tz).month.year, [date, tz]);
  const moons = useMemo(() => withTraditions(moonsOfYear(year, tz), bundle), [year, tz, bundle]);
  const current = moonIndexFor(moons, date);
  const [open, setOpen] = useState<{ year: number; index: number } | null>(null);
  const openIndex = open?.year === year ? open.index : null;

  if (moons.length === 0) return null;
  return (
    <section aria-labelledby="tc-moons-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] p-4">
      <h2 id="tc-moons-heading" className="font-serif text-xl">
        The {moons.length} Moons of {year}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--tc-muted)]">
        Each card is one Moon, new Moon to new Moon, counted from the first new Moon of {year} in your timezone. A year has 12 or 13. Tap a card to see what that Moon holds and which traditions name it.
      </p>
      <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {moons.map((m, i) => {
          const isOpen = openIndex === i;
          const isCurrent = current === i;
          const names = [...new Set(m.traditions.map((t) => t.label.replace(/ \(.*\)$/, "").replace(/^Araḫ /, "")))];
          return (
            <li key={m.number} className={cn(isOpen && "col-span-full")}>
              <div
                className={cn(
                  "h-full rounded-lg border",
                  isCurrent ? "border-[var(--tc-gold)] bg-[var(--tc-hover)] ring-1 ring-[var(--tc-gold)]" : "border-[var(--tc-line)]"
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`tc-moon-${m.number}`}
                  onClick={() => setOpen(isOpen ? null : { year, index: i })}
                  className="flex w-full items-start gap-2.5 rounded-lg p-2.5 sm:p-3 text-left hover:bg-[var(--tc-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tc-gold)]"
                >
                  <MoonGlyph illumination={1} waxing size={22} southern={southern} className="mt-0.5 hidden shrink-0 sm:block" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="whitespace-nowrap font-serif text-lg">Moon {m.number}</span>
                      {isCurrent ? <span className="whitespace-nowrap rounded-full bg-[var(--tc-gold)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--tc-bg)]">This Moon</span> : null}
                    </span>
                    <span className="block text-sm tabular-nums text-[var(--tc-muted)]">
                      <span className="whitespace-nowrap">{short(m.start)}</span> to <span className="whitespace-nowrap">{short(m.end)}</span>
                    </span>
                    {m.fullMoon ? <span className="block text-sm">Full Moon <span className="whitespace-nowrap">{short(civilDateAt(m.fullMoon, tz))}</span></span> : null}
                    {names.length > 0 ? <span className="mt-1 block truncate text-xs text-[var(--tc-muted)]">{names.join(" · ")}</span> : null}
                    {badges(m).length > 0 ? (
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {badges(m).map((b) => (
                          <span key={b} className="whitespace-nowrap rounded-full border border-[var(--tc-line)] px-1.5 py-0.5 text-[11px] text-[var(--tc-ink)]">
                            {b}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-[var(--tc-muted)] transition-transform", isOpen && "rotate-180")} aria-hidden />
                </button>
                {isOpen ? <MoonDetail moon={m} tz={tz} id={`tc-moon-${m.number}`} /> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function MoonDetail({ moon: m, tz, id }: { moon: MoonOfYear; tz: string; id: string }) {
  return (
    <div id={id} className="space-y-4 border-t border-[var(--tc-line)] px-3 pb-4 pt-3 text-base">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">In the sky</h3>
        <ul className="mt-1.5 space-y-1">
          <li>
            New Moon {formatInstant(m.newMoon, tz)}. This Moon lasts {m.length} days, to {short(m.end)}.
          </li>
          {m.fullMoon ? (
            <li>
              Full Moon {formatInstant(m.fullMoon, tz)}
              {m.fullMoonSize === "supermoon"
                ? ": a supermoon, the Moon close to Earth, so it looks a little bigger and brighter."
                : m.fullMoonSize === "micromoon"
                  ? ": a micromoon, the Moon far from Earth, so it looks a little smaller."
                  : "."}
            </li>
          ) : null}
          {m.eclipses.map((e) => (
            <li key={e.peak.toISOString()}>
              {ECLIPSE_WORDS[`${e.kind}:${e.type}`] ?? "Eclipse"}, at its peak {formatInstant(e.peak, tz)}. Whether you can see it depends on where you are.
            </li>
          ))}
          {m.seasons.map((s) => (
            <li key={s.kind}>
              {s.name} {formatInstant(s.instant, tz)}.
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-xs text-[var(--tc-muted)]">Calculated for your timezone. Comes round every Moon (about 29½ days); eclipses, supermoons and the seasons fall in different Moons each year.</p>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">What the traditions call this Moon</h3>
        {m.traditions.length === 0 ? (
          <p className="mt-1.5 text-[var(--tc-muted)]">None of the traditions in our research has a named month we can place on this Moon. We don&apos;t give it a name of our own.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {m.traditions.map((t) => (
              <li key={t.key} className="rounded-md border border-[var(--tc-line)] p-3">
                <p className="text-xs uppercase tracking-wider text-[var(--tc-muted)]">
                  {t.cultureName} · once a year, for a whole month
                </p>
                <p className="font-serif text-lg">
                  {t.label}
                  {t.translation ? <span className="text-base text-[var(--tc-muted)]"> · &ldquo;{t.translation}&rdquo;</span> : null}
                </p>
                {t.says.map((s) => (
                  <p key={s} className="mt-1">
                    {s}
                  </p>
                ))}
                {t.observances.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">What they say to do this month</p>
                    <ul className="mt-1 space-y-1.5">
                      {t.observances.map((o) => (
                        <li key={`${o.name}-${o.date ? short(o.date) : ""}`} className="flex gap-2">
                          <span className="w-14 shrink-0 text-sm tabular-nums text-[var(--tc-muted)]">{o.date ? short(o.date) : "No date"}</span>
                          <span>
                            <span className="font-medium">{o.name}</span>
                            {o.description ? `: ${o.description}` : null}
                            {o.practices.map((p) => (
                              <span key={p} className="block text-[var(--tc-ink)]">
                                {p}
                              </span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[var(--tc-muted)]">Our sources for this tradition don&apos;t give advice for particular days of this month.</p>
                )}
                <p className="mt-2 text-sm text-[var(--tc-muted)]">
                  Their month runs {short(t.start)} to {short(t.end)}.                   {t.rule}
                  {t.caution ? ` ${t.caution}` : null}
                </p>
                {t.sources.length > 0 ? (
                  <p className="mt-1 text-sm text-[var(--tc-muted)]">
                    Sources:{" "}
                    {t.sources.map((s, i) => (
                      <span key={s.title}>
                        {i > 0 ? "; " : null}
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--tc-line)] underline-offset-2 hover:text-[var(--tc-ink)]">
                            {s.title}
                          </a>
                        ) : (
                          s.title
                        )}
                      </span>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
