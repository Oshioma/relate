"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { type CivilDate, addDays, civilDateAt, formatLongDate, sameDate, startOfDayIn } from "@/lib/true-calendar/dates";
import {
  type Place,
  type QuarterKind,
  MICROMOON_MIN_KM,
  QUARTER_NAMES,
  RELIABLE_YEARS,
  SEASON_NAMES,
  SUGGESTED_PLACES,
  SUPERMOON_MAX_KM,
  fullMoonSize,
  isReliableYear,
  moonDay,
  moonDistanceKm,
  nextLunarEclipse,
  nextQuarter,
  nextSeasonEvent,
  nextSolarEclipse,
  riseSetOn,
  seasonEventsOn,
  tidalPhase,
} from "@/lib/true-calendar/astronomy";
import { MoonGlyph } from "./moon-glyph";
import type { CalendarPrefs } from "./use-calendar-state";

// What the sky is doing on the selected day: phase, age, light, the next new
// and full Moon, supermoon/micromoon, eclipses, equinoxes and solstices, the
// spring/neap relationship, and — for a chosen place — rise and set times.
// All calculated in the browser; nothing here is fetched or stored.

function formatInstant(instant: Date, tz: string, withDate = true): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    ...(withDate ? { weekday: "short", day: "numeric", month: "short", year: "numeric" } : {}),
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(instant);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--tc-line)] py-1.5 last:border-b-0">
      <dt className="text-xs text-[var(--tc-muted)]">{label}</dt>
      <dd className="text-right text-sm text-[var(--tc-ink)] tabular-nums">{children}</dd>
    </div>
  );
}

const TIDE_TEXT = {
  spring: "Spring-tide period: Sun and Moon are in line (new or full Moon), so the tidal range is at its largest.",
  neap: "Neap-tide period: the Moon is near a quarter, at right angles to the Sun, so the tidal range is at its smallest.",
  between: "Between spring and neap tides.",
} as const;

export function MoonPanel({ date, tz, prefs, onPrefs }: { date: CivilDate; tz: string; prefs: CalendarPrefs; onPrefs: (p: Partial<CalendarPrefs>) => void }) {
  const data = useMemo(() => {
    const day = moonDay(date, tz);
    const startOfDay = startOfDayIn(date, tz);
    const endOfDay = startOfDayIn(addDays(date, 1), tz);
    const nextNew = nextQuarter(endOfDay, "new");
    const nextFull = nextQuarter(endOfDay, "full");
    const next = (kind: QuarterKind, e: { instant: Date }) => ({ kind, instant: e.instant, size: kind === "full" ? fullMoonSize(moonDistanceKm(e.instant)) : null });
    const lunarEclipse = nextLunarEclipse(startOfDay);
    const solarEclipse = nextSolarEclipse(startOfDay);
    const seasonsToday = seasonEventsOn(date, tz);
    const nextSeason = nextSeasonEvent(endOfDay);
    return {
      day,
      nextNew: next("new", nextNew),
      nextFull: next("full", nextFull),
      todaysFullSize: day.quarter?.kind === "full" ? fullMoonSize(moonDistanceKm(day.quarter.instant)) : null,
      lunarEclipse,
      lunarEclipseToday: sameDate(civilDateAt(lunarEclipse.peak, tz), date),
      solarEclipse,
      solarEclipseToday: sameDate(civilDateAt(solarEclipse.peak, tz), date),
      seasonsToday,
      nextSeason,
    };
  }, [date, tz]);

  const place = prefs.place;
  const riseSet = useMemo(() => (place ? riseSetOn(date, tz, place) : null), [date, tz, place]);
  const { day } = data;
  const reliable = isReliableYear(date.year);
  const highlights: string[] = [];
  if (day.quarter) highlights.push(`${QUARTER_NAMES[day.quarter.kind]} at ${formatInstant(day.quarter.instant, tz, false)}`);
  if (data.todaysFullSize === "supermoon") highlights.push("Supermoon");
  if (data.todaysFullSize === "micromoon") highlights.push("Micromoon");
  if (data.lunarEclipseToday) highlights.push(`${data.lunarEclipse.kind[0].toUpperCase()}${data.lunarEclipse.kind.slice(1)} lunar eclipse${data.lunarEclipse.kind === "total" ? " (a “Blood Moon”)" : ""}, peak ${formatInstant(data.lunarEclipse.peak, tz, false)}`);
  if (data.solarEclipseToday) highlights.push(`${data.solarEclipse.kind[0].toUpperCase()}${data.solarEclipse.kind.slice(1)} solar eclipse somewhere on Earth, peak ${formatInstant(data.solarEclipse.peak, tz, false)}`);
  for (const s of data.seasonsToday) highlights.push(`${SEASON_NAMES[s.kind]} at ${formatInstant(s.instant, tz, false)}`);

  return (
    <section aria-labelledby="tc-moon-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <MoonGlyph illumination={day.state.illumination} waxing={day.state.waxing} size={72} southern={prefs.southernView} title={`${day.name}, ${Math.round(day.state.illumination * 100)}% lit`} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tc-gold)]">The Moon · astronomically calculated</p>
          <h3 id="tc-moon-heading" className="font-serif text-2xl leading-tight text-[var(--tc-ink)]">{day.name}</h3>
          <p className="mt-0.5 text-sm text-[var(--tc-muted)]">
            {formatLongDate(date)} · {Math.round(day.state.illumination * 100)}% lit · {day.state.ageDays.toFixed(1)} days old · {day.state.waxing ? "waxing" : "waning"}
          </p>
          {highlights.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {highlights.map((h) => (
                <li key={h} className="rounded-full border border-[var(--tc-gold)] px-2.5 py-0.5 text-xs text-[var(--tc-ink)]">
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
        <dl>
          <Row label="Phase, age and light at">12:00 local</Row>
          <Row label="Distance from Earth">{Math.round(day.state.distanceKm).toLocaleString("en-GB")} km</Row>
          <Row label="Next new Moon after this day">{formatInstant(data.nextNew.instant, tz)}</Row>
          <Row label="Next full Moon after this day">
            {formatInstant(data.nextFull.instant, tz)}
            {data.nextFull.size ? <span className="ml-1 text-[var(--tc-gold)]">({data.nextFull.size})</span> : null}
          </Row>
          <Row label="Next lunar eclipse">
            {data.lunarEclipse.kind} · {formatInstant(data.lunarEclipse.peak, tz)}
          </Row>
          <Row label="Next solar eclipse (somewhere on Earth)">
            {data.solarEclipse.kind} · {formatInstant(data.solarEclipse.peak, tz)}
          </Row>
          <Row label={`Next ${SEASON_NAMES[data.nextSeason.kind].split(" ")[1]}`}>
            {SEASON_NAMES[data.nextSeason.kind]} · {formatInstant(data.nextSeason.instant, tz)}
          </Row>
        </dl>
        <div>
          <p className="text-xs text-[var(--tc-muted)]">Tides</p>
          <p className="mt-0.5 text-sm text-[var(--tc-ink)]">{TIDE_TEXT[tidalPhase(day.state.elongation)]}</p>
          <p className="mt-1 text-xs text-[var(--tc-muted)]">
            This is the astronomical relationship only. Real coasts lag it by a day or two and shape it strongly, so no heights or times are shown.
          </p>
          <PlacePicker place={place} onChange={(p) => onPrefs({ place: p })} />
          {place && riseSet ? (
            <dl className="mt-1">
              <Row label="Moonrise">{riseSet.moonrise ? formatInstant(riseSet.moonrise, tz, false) : "No moonrise this day"}</Row>
              <Row label="Moonset">{riseSet.moonset ? formatInstant(riseSet.moonset, tz, false) : "No moonset this day"}</Row>
              <Row label="Sunrise">{riseSet.sunrise ? formatInstant(riseSet.sunrise, tz, false) : "None"}</Row>
              <Row label="Sunset">{riseSet.sunset ? formatInstant(riseSet.sunset, tz, false) : "None"}</Row>
            </dl>
          ) : null}
          {place?.timeZone && place.timeZone !== tz ? (
            <p className="mt-1 text-xs text-[var(--tc-muted)]">Times are in the calendar&apos;s timezone ({tz}), not {place.name}&apos;s.</p>
          ) : null}
        </div>
      </div>

      <details className="mt-4 text-xs text-[var(--tc-muted)]">
        <summary className="cursor-pointer select-none text-[var(--tc-ink)]">How these are calculated</summary>
        <div className="mt-2 space-y-1.5 leading-relaxed">
          <p>
            Positions come from Astronomy Engine (open source, by Don Cross), which is checked against the US Naval Observatory&apos;s NOVAS and NASA JPL Horizons to about one arcminute. Times are calculated, never looked up.
          </p>
          <p>
            New Moon is the moment of conjunction (the Moon passes the Sun in longitude) and Full Moon the moment of opposition. Neither depends on where you are; the local date they fall on does. The first visible crescent is a separate observation, usually one to two days after conjunction, and depends on your place and the sky.
          </p>
          <p>
            Supermoon here means a full Moon nearer than {SUPERMOON_MAX_KM.toLocaleString("en-GB")} km, and micromoon one farther than {MICROMOON_MIN_KM.toLocaleString("en-GB")} km (the definition timeanddate.com uses). Other definitions exist, so lists elsewhere can differ slightly.
          </p>
          <p>Solar eclipses listed are visible from somewhere on Earth, not necessarily from your place.</p>
          {!reliable ? (
            <p className="text-[var(--tc-ink)]">
              Outside {RELIABLE_YEARS.from}–{RELIABLE_YEARS.to} the Moon&apos;s position is still well modelled, but the Earth&apos;s rotation is not known exactly, so clock times here can be off by minutes (around 1700) to hours (in antiquity). Treat dates near midnight as uncertain.
            </p>
          ) : null}
        </div>
      </details>
    </section>
  );
}

function PlacePicker({ place, onChange }: { place: Place | null; onChange: (p: Place | null) => void }) {
  const [status, setStatus] = useState<string | null>(null);
  const value = place ? (SUGGESTED_PLACES.find((p) => p.name === place.name) ? place.name : "__mine") : "__none";
  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      setStatus("This browser can't share a location.");
      return;
    }
    setStatus("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus(null);
        // Rounded to about 1 km: enough for rise and set, and all that is kept (in this browser only).
        onChange({ name: "My location", latitude: Math.round(pos.coords.latitude * 100) / 100, longitude: Math.round(pos.coords.longitude * 100) / 100 });
      },
      () => setStatus("Location not shared."),
      { maximumAge: 3_600_000, timeout: 15_000 }
    );
  };
  return (
    <div className="mt-3">
      <label className="flex items-center gap-2 text-xs text-[var(--tc-muted)]">
        <MapPin className="h-3.5 w-3.5" aria-hidden />
        <span>Rise and set for</span>
        <select
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "__none") onChange(null);
            else if (v === "__locate") locateMe();
            else if (v !== "__mine") onChange(SUGGESTED_PLACES.find((p) => p.name === v) ?? null);
          }}
          className="min-w-0 flex-1 rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 py-1 text-xs text-[var(--tc-ink)]"
        >
          {SUGGESTED_PLACES.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
          {value === "__mine" && place ? <option value="__mine">{place.name}</option> : null}
          <option value="__locate">Use my location…</option>
          <option value="__none">No place</option>
        </select>
      </label>
      {status ? <p className="mt-1 text-xs text-[var(--tc-muted)]">{status}</p> : null}
    </div>
  );
}
