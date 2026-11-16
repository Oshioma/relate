"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CivilDate, SUGGESTED_TIME_ZONES, addDays, civilDateAt, daysFromCivil, formatIsoDate, isValidTimeZone, startOfDayIn } from "@/lib/true-calendar/dates";
import { QUARTER_NAMES, quartersBetween } from "@/lib/true-calendar/astronomy";
import { retrogradePeriods } from "@/lib/true-calendar/mercury";
import {
  type PersonalMoonEvent,
  SIGNS,
  type SignIndex,
  exportIngressCache,
  formatDuration,
  importIngressCache,
  nextHighlighted,
  personalEvents,
  siderealMoonSign,
  signName,
  sunSign,
} from "@/lib/true-calendar/zodiac";
import {
  DEFAULT_PERIODS,
  HIGHLIGHT_KINDS,
  HOUSE_GUIDANCE,
  guidanceDuring,
  type HighlightKind,
  MODERN_ATTRIBUTION,
  type PersonalProfile,
  profileFromRow,
  traditionReadings,
} from "@/lib/true-calendar/personal-moon";
import type { ResearchBundle } from "@/lib/true-calendar/research/daily";
import type { BirthProfileRow } from "@/lib/data/true-calendar";
import { useFormDraft } from "@/lib/use-form-draft";
import { deleteBirthProfile, saveBirthProfile } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/personal-moon-actions";

// Personal Moon: the Moon's passage through the tropical zodiac, read against
// the member's own Sun sign. Everything is calculated here in the browser from
// the member's private birth details; nothing personal is sent anywhere else,
// and the history feed's records are never changed by it (personal lines are
// added beside them only when a card is drawn).

const DAY = 86_400_000;
const INGRESS_STORE = "true-calendar:moon-ingresses";

export type MoonMode = "personal" | "all";

const ORD = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

export const KIND_STYLE: Record<HighlightKind, string> = {
  preceding: "border-dashed",
  sun: "border-solid",
  following: "border-dotted",
};

interface PersonalMoonValue {
  profile: PersonalProfile | null;
  sun: ReturnType<typeof sunSign> | null;
  /** Timezone for times (the member's preferred zone, else the calendar's). */
  timeZone: string;
  mode: MoonMode;
  setMode: (m: MoonMode) => void;
  bundle: ResearchBundle;
  spacePath: string;
  /** Stays of the Moon in each sign overlapping [from, to), read against the Sun sign. */
  events: (from: Date, to: Date) => PersonalMoonEvent[];
  /** The stays touching a local date in `tz`. */
  eventsOn: (date: CivilDate, tz: string) => PersonalMoonEvent[];
  open: (e: PersonalMoonEvent) => void;
  kindOf: (e: PersonalMoonEvent) => HighlightKind | null;
  titleOf: (e: PersonalMoonEvent) => string;
  setProfile: (p: PersonalProfile | null) => void;
}

const Ctx = createContext<PersonalMoonValue | null>(null);

/** The member's Personal Moon, or null outside the provider. */
export function usePersonalMoon(): PersonalMoonValue | null {
  return useContext(Ctx);
}

function loadIngressCache() {
  try {
    const raw = window.localStorage.getItem(INGRESS_STORE);
    if (raw) importIngressCache(JSON.parse(raw));
  } catch {
    // Blocked or corrupt storage just means recalculating.
  }
}

let ingressLoaded = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
function saveIngressCacheSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const all = exportIngressCache();
      // Keep the store small: the 36 most recent months calculated.
      const keys = Object.keys(all).sort().slice(-36);
      window.localStorage.setItem(INGRESS_STORE, JSON.stringify(Object.fromEntries(keys.map((k) => [k, all[k]]))));
    } catch {
      // Storage full or blocked: fine, it's only a cache.
    }
  }, 1500);
}

// One list per sign and 30-day window, shared by every component, so the same
// stay is always the same object and is never generated twice when windows
// overlap. Ingress times themselves are cached per month in zodiac.ts and
// kept in this browser between visits.
const windowCache = new Map<string, PersonalMoonEvent[]>();

function cachedEvents(sign: SignIndex, from: Date, to: Date): PersonalMoonEvent[] {
  if (!ingressLoaded && typeof window !== "undefined") {
    ingressLoaded = true;
    loadIngressCache();
  }
  const w0 = Math.floor(from.getTime() / (30 * DAY));
  const w1 = Math.floor(to.getTime() / (30 * DAY));
  const byId = new Map<string, PersonalMoonEvent>();
  for (let w = w0; w <= w1; w++) {
    const key = `${sign}:${w}`;
    let list = windowCache.get(key);
    if (!list) {
      list = personalEvents(sign, new Date(w * 30 * DAY), new Date((w + 1) * 30 * DAY));
      windowCache.set(key, list);
      if (typeof window !== "undefined") saveIngressCacheSoon();
    }
    for (const e of list) if (e.end > from && e.start < to && !byId.has(e.id)) byId.set(e.id, e);
  }
  return [...byId.values()].sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function PersonalMoonProvider({
  row,
  bundle,
  calendarTz,
  spacePath,
  children,
}: {
  row: BirthProfileRow | null;
  bundle: ResearchBundle;
  calendarTz: string;
  spacePath: string;
  children: ReactNode;
}) {
  const [profile, setProfile] = useState<PersonalProfile | null>(() => profileFromRow(row));
  const [mode, setMode] = useState<MoonMode>("all");
  const [openEvent, setOpenEvent] = useState<PersonalMoonEvent | null>(null);
  const sun = useMemo(
    () => (profile ? sunSign({ date: profile.birthDate, time: profile.birthTime, timeZone: profile.birthTimeZone ?? profile.displayTimeZone }) : null),
    [profile]
  );
  const timeZone = profile?.displayTimeZone && isValidTimeZone(profile.displayTimeZone) ? profile.displayTimeZone : calendarTz;
  const events = useCallback((from: Date, to: Date): PersonalMoonEvent[] => (sun ? cachedEvents(sun.sign, from, to) : []), [sun]);
  const eventsOn = useCallback(
    (date: CivilDate, tz: string) => events(startOfDayIn(date, tz), startOfDayIn(addDays(date, 1), tz)),
    [events]
  );
  const wording = profile?.wording ?? DEFAULT_PERIODS;
  const kindOf = useCallback((e: PersonalMoonEvent): HighlightKind | null => (e.kind === "other" ? null : e.kind), []);
  const titleOf = useCallback((e: PersonalMoonEvent) => (e.kind === "other" ? HOUSE_GUIDANCE[e.house].theme : wording[e.kind].title), [wording]);

  const value: PersonalMoonValue = {
    profile,
    sun,
    timeZone,
    mode,
    setMode,
    bundle,
    spacePath,
    events,
    eventsOn,
    open: setOpenEvent,
    kindOf,
    titleOf,
    setProfile,
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      {openEvent && sun ? <EventDetail event={openEvent} onClose={() => setOpenEvent(null)} /> : null}
    </Ctx.Provider>
  );
}

// --- Formatting -------------------------------------------------------------------

const formatters = new Map<string, Intl.DateTimeFormat>();
function fmt(d: Date, tz: string, withZone = true): string {
  const k = `${tz}|${withZone}`;
  let f = formatters.get(k);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", ...(withZone ? { timeZoneName: "short" } : {}) });
    formatters.set(k, f);
  }
  return f.format(d);
}

/** Re-renders every `ms` so countdowns stay current. */
function useNow(ms = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function status(e: PersonalMoonEvent, now: Date): string {
  if (now < e.start) return `starts in ${formatDuration(e.start.getTime() - now.getTime())}`;
  if (now < e.end) return `now, ${formatDuration(e.end.getTime() - now.getTime())} left`;
  return "ended";
}

const signLabel = (i: SignIndex) => `${SIGNS[i].symbol} ${signName(i)}`;

// --- The panel under the Moon -------------------------------------------------------

export function PersonalMoonPanel() {
  const pm = usePersonalMoon();
  const now = useNow();
  const [editing, setEditing] = useState(false);
  if (!pm) return null;
  const { profile, sun, timeZone } = pm;

  if (!profile || !sun || editing) {
    return (
      <section aria-labelledby="tc-personal-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
        <h2 id="tc-personal-heading" className="font-serif text-2xl">Personal Moon</h2>
        <p className="mt-1 max-w-3xl text-base text-[var(--tc-muted)]">
          Add your date of birth to see the Moon&apos;s passage through the zodiac read against your Sun sign: when it is in the sign before yours, in yours, and in the one after, with the exact times in your timezone. Your details stay private to you.
        </p>
        <BirthForm onDone={() => setEditing(false)} onCancel={profile ? () => setEditing(false) : undefined} />
      </section>
    );
  }

  const nowEvent = pm.events(new Date(now.getTime() - DAY), new Date(now.getTime() + DAY)).find((e) => e.start <= now && now < e.end) ?? null;
  const next = nextHighlighted(sun.sign, now);
  const preceding = (sun.sign + 11) % 12;
  const following = (sun.sign + 1) % 12;

  return (
    <section aria-labelledby="tc-personal-heading" className="rounded-lg border border-[var(--tc-line)] border-l-4 border-l-[var(--tc-personal)] bg-[var(--tc-panel)] px-4 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="tc-personal-heading" className="font-serif text-2xl">Personal Moon</h2>
        <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-sm text-[var(--tc-muted)] underline-offset-2 hover:text-[var(--tc-ink)] hover:underline">
          <Pencil aria-hidden className="size-3.5" /> Edit your details
        </button>
      </div>
      <p className="mt-1 text-base">
        Your Sun sign: <strong>{signLabel(sun.sign)}</strong>
        <span className="text-[var(--tc-muted)]">
          {" "}(Sun at {(sun.longitude % 30).toFixed(1)}° of the sign, tropical zodiac). Before it: {signName(preceding)}. After it: {signName(following)}.
        </span>
      </p>
      {!sun.certain ? (
        <p className="mt-1 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {sun.note} Until then we use {signName(sun.sign)}, the Sun&apos;s sign at midday.
        </p>
      ) : null}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {nowEvent ? (
          <button type="button" onClick={() => pm.open(nowEvent)} className="rounded-md border border-[var(--tc-line)] px-3 py-2 text-left hover:bg-[var(--tc-hover)]">
            <span className="block text-sm text-[var(--tc-muted)]">Right now</span>
            <span className="block text-base font-medium">
              Moon in {signLabel(nowEvent.sign)}, your {ORD(nowEvent.house)} solar house
            </span>
            <span className="block text-sm">
              {pm.titleOf(nowEvent)} · until {fmt(nowEvent.end, timeZone)} ({formatDuration(nowEvent.end.getTime() - now.getTime())} left)
            </span>
          </button>
        ) : null}
        {next ? (
          <button type="button" onClick={() => pm.open(next)} className="rounded-md border border-[var(--tc-personal)] bg-[var(--tc-personal-soft)] px-3 py-2 text-left hover:brightness-95">
            <span className="flex items-center gap-1 text-sm text-[var(--tc-personal)]">
              <CalendarClock aria-hidden className="size-4" /> Next personal Moon period in {formatDuration(next.start.getTime() - now.getTime())}
            </span>
            <span className="block text-base font-medium">
              {pm.titleOf(next)}: Moon in {signLabel(next.sign)}
            </span>
            <span className="block text-sm">
              {fmt(next.start, timeZone)} to {fmt(next.end, timeZone)} · {formatDuration(next.durationMs)}
            </span>
          </button>
        ) : null}
      </div>

      <HouseStrip sunSign={sun.sign} moonEvent={nowEvent} />

      <p className="mt-3 text-xs text-[var(--tc-muted)]">
        Times in {timeZone.replace(/_/g, " ")}. Sign changes are calculated from the Moon&apos;s real position (checked against NASA JPL Horizons), not a fixed 2½ days per sign. Readings: {MODERN_ATTRIBUTION}
      </p>
    </section>
  );
}

/** The twelve solar houses in a row, the Moon's present one marked. */
function HouseStrip({ sunSign: s, moonEvent }: { sunSign: SignIndex; moonEvent: PersonalMoonEvent | null }) {
  return (
    <div className="mt-3">
      <p className="text-sm text-[var(--tc-muted)]">Your twelve solar houses (house 1 is your Sun sign)</p>
      <ol className="mt-1 grid grid-cols-6 gap-1 sm:grid-cols-12" aria-label="Your solar houses">
        {Array.from({ length: 12 }, (_, i) => {
          const sign = (s + i) % 12;
          const house = i + 1;
          const here = moonEvent?.sign === sign;
          const hl = house === 12 || house === 1 || house === 2;
          return (
            <li
              key={i}
              aria-current={here ? "true" : undefined}
              title={`${ORD(house)} house: ${signName(sign)} (${HOUSE_GUIDANCE[house].theme})${here ? ". The Moon is here now." : ""}`}
              className={cn(
                "flex flex-col items-center rounded-md border px-1 py-1 text-center leading-tight",
                hl ? "border-[var(--tc-personal)]/60" : "border-[var(--tc-line)]",
                here && "bg-[var(--tc-personal)] text-[var(--tc-panel)]"
              )}
            >
              <span className="text-xs">{house}</span>
              <span aria-hidden className="text-base">{SIGNS[sign].symbol}</span>
              <span className="sr-only">{signName(sign)}{here ? ", Moon here now" : ""}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// --- Birth details form ---------------------------------------------------------------

function BirthForm({ onDone, onCancel }: { onDone: () => void; onCancel?: () => void }) {
  const pm = usePersonalMoon()!;
  const { formRef, clearDraft } = useFormDraft("true-calendar-personal-moon");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const p = pm.profile;
  const zones = useMemo(() => {
    let own = "UTC";
    try {
      own = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      own = "UTC";
    }
    return Array.from(new Set<string>([own, ...SUGGESTED_TIME_ZONES, ...(p?.birthTimeZone ? [p.birthTimeZone] : []), ...(p?.displayTimeZone ? [p.displayTimeZone] : [])]));
  }, [p]);

  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    start(async () => {
      const r = await saveBirthProfile(pm.spacePath, data);
      if ("error" in r) {
        setError(r.error);
        return;
      }
      clearDraft();
      const get = (k: string) => {
        const v = data.get(k);
        return typeof v === "string" && v.trim() ? v.trim() : null;
      };
      const wording: Record<string, { title: string; guidance: string }> = {};
      for (const k of HIGHLIGHT_KINDS) wording[k] = { title: get(`${k}_title`) ?? "", guidance: get(`${k}_guidance`) ?? "" };
      pm.setProfile(
        profileFromRow({
          birth_date: get("birth_date") ?? "",
          birth_time: get("birth_time"),
          birth_place: get("birth_place"),
          birth_time_zone: get("birth_time_zone"),
          display_time_zone: get("display_time_zone"),
          period_wording: wording,
        })
      );
      setError(null);
      onDone();
      router.refresh();
    });
  };

  const remove = () => {
    start(async () => {
      const r = await deleteBirthProfile(pm.spacePath);
      if ("error" in r) {
        setError(r.error);
        return;
      }
      clearDraft();
      pm.setProfile(null);
      onDone();
      router.refresh();
    });
  };

  const field = "mt-1 w-full rounded-md border border-[var(--tc-line)] bg-[var(--tc-bg)] px-2 py-1.5 text-base";
  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
      className="mt-3 space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Date of birth <span className="text-[var(--tc-muted)]">(required)</span>
          <input name="birth_date" type="date" required min="1700-01-01" max="2200-12-31" defaultValue={p ? formatIsoDate(p.birthDate) : ""} className={field} />
        </label>
        <label className="block text-sm">
          Birth time <span className="text-[var(--tc-muted)]">(optional; only matters if the Sun changed sign that day)</span>
          <input name="birth_time" type="time" defaultValue={p?.birthTime ?? ""} className={field} />
        </label>
        <label className="block text-sm">
          Birthplace <span className="text-[var(--tc-muted)]">(optional)</span>
          <input name="birth_place" type="text" maxLength={200} autoComplete="off" defaultValue={p?.birthPlace ?? ""} placeholder="e.g. Zanzibar" className={field} />
        </label>
        <label className="block text-sm">
          Birthplace timezone <span className="text-[var(--tc-muted)]">(optional, used with the birth time)</span>
          <select name="birth_time_zone" defaultValue={p?.birthTimeZone ?? ""} className={field}>
            <option value="">Not sure</option>
            {zones.map((z) => (
              <option key={z} value={z}>{z.replace(/_/g, " ")}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          Show times in
          <select name="display_time_zone" defaultValue={p?.displayTimeZone ?? ""} className={field}>
            <option value="">The calendar&apos;s timezone</option>
            {zones.map((z) => (
              <option key={z} value={z}>{z.replace(/_/g, " ")}</option>
            ))}
          </select>
        </label>
      </div>
      <details className="rounded-md border border-[var(--tc-line)] px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium">Your own words for the three periods (optional)</summary>
        <p className="mt-1 text-sm text-[var(--tc-muted)]">These names are modern wording, ours. Change them to whatever helps you; leave a box empty to keep ours.</p>
        {HIGHLIGHT_KINDS.map((k) => (
          <div key={k} className="mt-2 grid gap-2 sm:grid-cols-[14rem_1fr]">
            <label className="block text-sm">
              {k === "preceding" ? "Moon in the sign before yours" : k === "sun" ? "Moon in your sign" : "Moon in the sign after yours"}
              <input name={`${k}_title`} type="text" maxLength={80} defaultValue={p?.wording[k].title !== DEFAULT_PERIODS[k].title ? p?.wording[k].title : ""} placeholder={DEFAULT_PERIODS[k].title} className={field} />
            </label>
            <label className="block text-sm">
              What it means for you
              <textarea name={`${k}_guidance`} maxLength={600} rows={2} defaultValue={p?.wording[k].guidance !== DEFAULT_PERIODS[k].guidance ? p?.wording[k].guidance : ""} placeholder={DEFAULT_PERIODS[k].guidance} className={field} />
            </label>
          </div>
        ))}
      </details>
      {error ? <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" disabled={pending} className="rounded-full bg-[var(--tc-personal)] px-5 py-2 text-base font-medium text-[var(--tc-panel)] hover:brightness-110 disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-full border border-[var(--tc-line)] px-4 py-2 text-base hover:bg-[var(--tc-hover)]">
            Cancel
          </button>
        ) : null}
        {p ? (
          <button type="button" onClick={remove} disabled={pending} className="ml-auto inline-flex items-center gap-1 text-sm text-[var(--tc-muted)] hover:text-rose-700">
            <Trash2 aria-hidden className="size-4" /> Delete my details
          </button>
        ) : null}
      </div>
      <p className="text-xs text-[var(--tc-muted)]">Saved to your account where only you can read them. Your Sun sign and the Moon&apos;s times are worked out on this device.</p>
    </form>
  );
}

// --- Toggle, day lines, list --------------------------------------------------------

export function MoonModeToggle() {
  const pm = usePersonalMoon();
  if (!pm?.sun) return null;
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-[var(--tc-personal)]" role="radiogroup" aria-label="Which Moon events to show">
      {(
        [
          ["personal", "Personal Moon"],
          ["all", "All Moon Events"],
        ] as const
      ).map(([m, label]) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={pm.mode === m}
          onClick={() => pm.setMode(m)}
          className={cn("px-3 py-1.5 text-sm", pm.mode === m ? "bg-[var(--tc-personal)] font-medium text-[var(--tc-panel)]" : "hover:bg-[var(--tc-hover)]")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** The member's Moon periods on one date, for a day card. */
export function PersonalDayLines({ date, tz }: { date: CivilDate; tz: string }) {
  const pm = usePersonalMoon();
  if (!pm?.sun) return null;
  const list = pm.eventsOn(date, tz);
  if (list.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5" aria-label="Your Moon on this day">
      {list.map((e) => {
        const k = pm.kindOf(e);
        return (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => pm.open(e)}
              className={cn(
                "w-full rounded-md border-l-2 px-2 py-0.5 text-left text-sm hover:bg-[var(--tc-hover)]",
                k ? "border-l-[var(--tc-personal)] bg-[var(--tc-personal-soft)]" : "border-l-[var(--tc-line)]"
              )}
            >
              <span className="font-medium text-[var(--tc-personal)]">Personal</span> · Moon in {signLabel(e.sign)}, {ORD(e.house)} solar house
              {k ? <> · <strong>{pm.titleOf(e)}</strong></> : null}
              <span className="text-[var(--tc-muted)]">
                {" "}· {spanOnDay(e, date, tz, pm.timeZone)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** "from 13:09", "until 11:09", "all day" within one local day. */
function spanOnDay(e: PersonalMoonEvent, date: CivilDate, tz: string, showTz: string): string {
  const d0 = startOfDayIn(date, tz);
  const d1 = startOfDayIn(addDays(date, 1), tz);
  const hm = (d: Date) => fmt(d, showTz).replace(/^\w+ \d+ \w+,? /, "");
  if (e.start > d0 && e.end < d1) return `${hm(e.start)} to ${hm(e.end)}`;
  if (e.start > d0) return `from ${hm(e.start)}`;
  if (e.end < d1) return `until ${hm(e.end)}`;
  return "all day";
}

/** Highlighted kinds on each of `count` days from `first`, for grid marks. */
export function usePersonalDayKinds(first: CivilDate, count: number, tz: string): (HighlightKind | null)[] {
  const pm = usePersonalMoon();
  return useMemo(() => {
    if (!pm?.sun) return Array.from({ length: count }, () => null);
    const list = pm.events(startOfDayIn(first, tz), startOfDayIn(addDays(first, count), tz));
    return Array.from({ length: count }, (_, i) => {
      const d = addDays(first, i);
      const a = startOfDayIn(d, tz);
      const b = startOfDayIn(addDays(d, 1), tz);
      // The kind in force for most of the day.
      let best: HighlightKind | null = null;
      let most = 0;
      for (const e of list) {
        const overlap = Math.min(b.getTime(), e.end.getTime()) - Math.max(a.getTime(), e.start.getTime());
        if (overlap > most && e.kind !== "other") {
          most = overlap;
          best = e.kind;
        }
      }
      return most >= 6 * 3_600_000 ? best : null;
    });
  }, [pm, first, count, tz]);
}

export const KIND_LABEL: Record<HighlightKind, string> = {
  preceding: "Moon in the sign before yours",
  sun: "Moon in your Sun sign",
  following: "Moon in the sign after yours",
};

/** The key under a grid, shown when any visible day has a personal mark. */
export function PersonalGridKey({ kinds }: { kinds: (HighlightKind | null)[] }) {
  const pm = usePersonalMoon();
  if (!pm?.sun || !kinds.some(Boolean)) return null;
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--tc-muted)]">
      {HIGHLIGHT_KINDS.map((k) => (
        <span key={k} className="inline-flex items-center gap-1">
          <PersonalMark kind={k} /> {pm.profile?.wording[k].title ?? DEFAULT_PERIODS[k].title}
        </span>
      ))}
    </p>
  );
}

/** A small mark: open ring before, filled dot in, half dot after. */
export function PersonalMark({ kind, className }: { kind: HighlightKind; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 rounded-full border border-[var(--tc-personal)]",
        kind === "sun" && "bg-[var(--tc-personal)]",
        kind === "following" && "bg-[linear-gradient(90deg,var(--tc-personal)_50%,transparent_50%)]",
        className
      )}
    />
  );
}

/** Personal Moon mode: the member's Moon periods and the Moon's phases, in time order. */
export function PersonalEventList({ start, days, tz }: { start: CivilDate; days: number; tz: string }) {
  const pm = usePersonalMoon();
  const now = useNow();
  const fromMs = startOfDayIn(start, tz).getTime();
  const toMs = startOfDayIn(addDays(start, days), tz).getTime();
  const events = pm?.events;
  const list = useMemo(() => (events ? events(new Date(fromMs), new Date(toMs)) : []), [events, fromMs, toMs]);
  const quarters = useMemo(() => quartersBetween(new Date(fromMs), new Date(toMs)), [fromMs, toMs]);
  if (!pm?.sun) return null;
  type Item = { t: number; e?: PersonalMoonEvent; q?: (typeof quarters)[number] };
  const items: Item[] = [...list.map((e) => ({ t: e.start.getTime(), e })), ...quarters.map((q) => ({ t: q.instant.getTime(), q }))].sort((a, b) => a.t - b.t);
  return (
    <ol className="mt-5 space-y-2">
      {items.map((it) =>
        it.q ? (
          <li key={`q${it.t}`} className="flex items-center gap-2 px-3 text-sm text-[var(--tc-muted)]">
            <span className="font-medium text-[var(--tc-ink)]">{QUARTER_NAMES[it.q.kind]}</span> · {fmt(it.q.instant, pm.timeZone)}
          </li>
        ) : it.e ? (
          <li key={it.e.id}>
            <button
              type="button"
              onClick={() => pm.open(it.e!)}
              className={cn(
                "flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-2 text-left hover:bg-[var(--tc-hover)]",
                it.e.kind !== "other" ? cn("border-2 border-[var(--tc-personal)] bg-[var(--tc-personal-soft)]", KIND_STYLE[it.e.kind]) : "border-[var(--tc-line)] bg-[var(--tc-bg)]"
              )}
            >
              <span className="min-w-0">
                <span className="block text-base">
                  {it.e.kind !== "other" ? <PersonalMark kind={it.e.kind} className="mr-1.5" /> : null}
                  <strong>{pm.titleOf(it.e)}</strong> · Moon in {signLabel(it.e.sign)}, your {ORD(it.e.house)} solar house
                </span>
                <span className="block text-sm text-[var(--tc-muted)]">
                  {fmt(it.e.start, pm.timeZone)} to {fmt(it.e.end, pm.timeZone)} · {formatDuration(it.e.durationMs)} · {status(it.e, now)}
                </span>
              </span>
              <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 text-[var(--tc-muted)]" />
            </button>
          </li>
        ) : null
      )}
    </ol>
  );
}

// --- Event detail ------------------------------------------------------------------------

function EventDetail({ event: e, onClose }: { event: PersonalMoonEvent; onClose: () => void }) {
  const pm = usePersonalMoon()!;
  const now = useNow(15_000);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const k = pm.kindOf(e);
  const mercury = retrogradePeriods(e.start.getUTCFullYear(), e.end.getUTCFullYear()).find((p) => p.start < e.end && p.end > e.start) ?? null;
  const g = guidanceDuring(HOUSE_GUIDANCE[e.house], Boolean(mercury));
  const meaning = k ? pm.profile?.wording[k].guidance ?? DEFAULT_PERIODS[k].guidance : g.explanation;
  const readings = traditionReadings(pm.bundle, e.house);
  const discouraged = readings.filter((r) => r.favourability === "unfavourable");
  const next = pm.sun ? nextHighlighted(pm.sun.sign, now > e.start ? now : e.start) : null;
  const sidA = siderealMoonSign(e.start.getTime() + 60_000);
  const sidB = siderealMoonSign(e.end.getTime() - 60_000);
  const tz = pm.timeZone;
  const datesTouched = (() => {
    const a = civilDateAt(e.start, tz);
    const b = civilDateAt(new Date(e.end.getTime() - 1), tz);
    return daysFromCivil(b) - daysFromCivil(a) + 1;
  })();

  return (
    <div className="true-calendar fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tc-pm-detail-title"
        onClick={(ev) => ev.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4 text-[var(--tc-ink)] shadow-xl sm:rounded-2xl sm:px-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--tc-personal)]">Personal Moon{k ? ` · ${KIND_LABEL[k]}` : ""}</p>
            <h2 id="tc-pm-detail-title" className="font-serif text-3xl leading-tight">
              {pm.titleOf(e)}
            </h2>
            <p className="text-base">
              Moon in <strong>{signLabel(e.sign)}</strong> · your <strong>{ORD(e.house)} solar house</strong>
            </p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-[var(--tc-hover)]">
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <dl className="mt-3 grid gap-x-4 gap-y-1 text-base sm:grid-cols-[8rem_1fr]">
          <dt className="text-[var(--tc-muted)]">Starts</dt>
          <dd>{fmt(e.start, tz)}</dd>
          <dt className="text-[var(--tc-muted)]">Ends</dt>
          <dd>{fmt(e.end, tz)}</dd>
          <dt className="text-[var(--tc-muted)]">Lasts</dt>
          <dd>
            {formatDuration(e.durationMs)}, across {datesTouched} calendar days · <strong>{status(e, now)}</strong>
          </dd>
          <dt className="text-[var(--tc-muted)]">How often</dt>
          <dd>Monthly: the Moon comes back to {signName(e.sign)} about every 27⅓ days.</dd>
        </dl>

        <section className="mt-4">
          <h3 className="font-serif text-xl">What it means</h3>
          <p className="mt-1 text-base">{meaning}</p>
          <p className="mt-1 text-xs text-[var(--tc-muted)]">{k ? "Your own wording, or ours if you haven't changed it. " : ""}{MODERN_ATTRIBUTION}</p>
        </section>

        {mercury ? (
          <p className="mt-3 rounded-md border border-[var(--tc-line)] bg-[var(--tc-hover)] px-3 py-2 text-sm">
            <strong>Mercury is retrograde {mercury.start <= e.start && mercury.end >= e.end ? "for all of this time" : "for part of this time"}</strong> ({fmt(mercury.start, tz)} to {fmt(mercury.end, tz)}).
            Modern astrology reads that as a time to review, double-check and finish rather than start, especially talks, travel and contracts
            {g.adjusted ? ", so we've changed the suggestions below to match." : ". The suggestions below already fit that."}
          </p>
        ) : null}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <section>
            <h3 className="font-medium">Things to do (our suggestions)</h3>
            <ul className="mt-1 list-disc pl-5 text-base">
              {g.doList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-medium">Worth leaving for another time (our suggestions)</h3>
            <ul className="mt-1 list-disc pl-5 text-base">
              {g.avoidList.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-4">
          <h3 className="font-serif text-xl">Traditionally discouraged</h3>
          {discouraged.length > 0 ? (
            <ul className="mt-1 space-y-1 text-base">
              {discouraged.map((r) => (
                <li key={r.cultureKey}>
                  <strong>{r.tradition}</strong>: {r.practices[0] ?? r.meaning}{" "}
                  <span className="text-sm text-[var(--tc-muted)]">({r.sameFrame ? "same frame as yours" : "a different way of counting: see below"})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-base text-[var(--tc-muted)]">
              {readings.length > 0
                ? "None of the traditions in our database gives a rule against anything for this house, so we don't add one."
                : "The traditions' own records appear here once research batch 10 is imported and published."}
            </p>
          )}
        </section>

        <section className="mt-4">
          <h3 className="font-serif text-xl">What the traditions say</h3>
          <p className="mt-1 text-sm text-[var(--tc-muted)]">
            Each tradition counts its houses its own way. Only modern Western astrology counts them from your Sun sign; the others are shown for comparison and are not interchangeable.
          </p>
          {readings.length === 0 ? (
            <p className="mt-2 text-base text-[var(--tc-muted)]">Not imported yet. A reviewer imports and publishes research batch 10 on the Research page.</p>
          ) : (
            <ul className="mt-2 space-y-3">
              {readings.map((r) => (
                <li key={r.cultureKey} className={cn("rounded-md border px-3 py-2", r.sameFrame ? "border-[var(--tc-personal)]" : "border-[var(--tc-line)]")}>
                  <p className="text-base">
                    <strong>{r.tradition}</strong> · {r.placeName}
                  </p>
                  {r.meaning ? <p className="mt-0.5 text-base">{r.meaning}</p> : null}
                  {r.practices.map((x) => (
                    <p key={x} className="mt-0.5 text-sm">{x}</p>
                  ))}
                  <p className="mt-1 text-sm text-[var(--tc-muted)]">{r.frame}</p>
                  {r.sources.length > 0 ? (
                    <p className="mt-1 text-sm">
                      Source:{" "}
                      {r.sources.map((s, i) => (
                        <span key={s.title}>
                          {i > 0 ? "; " : ""}
                          {s.url ? (
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
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
          <p className="mt-3 text-sm text-[var(--tc-muted)]">
            In the sidereal zodiac used by Jyotiṣa (Lahiri), the Moon is in {sidA === sidB ? signName(sidA) : `${signName(sidA)} and then ${signName(sidB)}`} during this time, not {signName(e.sign)}: the two zodiacs are about 24° apart today.
          </p>
        </section>

        {next && next.id !== e.id ? (
          <button type="button" onClick={() => pm.open(next)} className="mt-4 flex w-full items-center justify-between rounded-md border border-[var(--tc-personal)] bg-[var(--tc-personal-soft)] px-3 py-2 text-left">
            <span>
              <span className="block text-sm text-[var(--tc-personal)]">Next personal Moon period in {formatDuration(next.start.getTime() - now.getTime())}</span>
              <span className="block text-base font-medium">
                {pm.titleOf(next)}: Moon in {signLabel(next.sign)}, {fmt(next.start, tz)}
              </span>
            </span>
            <ChevronRight aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
