"use client";

import { useCallback, useSyncExternalStore } from "react";
import { type CivilDate, isValidTimeZone, todayIn } from "@/lib/true-calendar/dates";
import { type RightCalendar, readCalendarUrl, writeCalendarUrl } from "@/lib/true-calendar/url-state";
import { SUGGESTED_PLACES, type Place } from "@/lib/true-calendar/astronomy";

// The calendar keeps its state in the address bar (date, which calendar is on
// the right, timezone), so the URL is the store: reading it is the state, and
// changing the date rewrites it with history.replaceState — no reload, no
// server round trip, and the link is always shareable.
//
// The server cannot know the viewer's timezone, so it renders a loading frame
// and the calendar appears once the browser has worked out "today".

const URL_EVENT = "true-calendar:url";

function subscribeUrl(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(URL_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(URL_EVENT, callback);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => null;

function browserTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return isValidTimeZone(tz) ? tz : "UTC";
  } catch {
    return "UTC";
  }
}

// A per-viewer preference kept in this browser only (place for rise/set,
// which way up to draw the Moon). Blocked storage just means no memory.
const PREFS_EVENT = "true-calendar:prefs";
const PREFS_KEY = "true-calendar:prefs";

export interface CalendarPrefs {
  place: Place | null;
  southernView: boolean;
}

const DEFAULT_PREFS: CalendarPrefs = { place: SUGGESTED_PLACES[0], southernView: false };
let prefsCache: { raw: string | null; value: CalendarPrefs } | null = null;

function readPrefs(): CalendarPrefs {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(PREFS_KEY);
  } catch {
    raw = null;
  }
  if (prefsCache && prefsCache.raw === raw) return prefsCache.value;
  let value = DEFAULT_PREFS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<CalendarPrefs>;
      const place =
        parsed.place && Number.isFinite(parsed.place.latitude) && Number.isFinite(parsed.place.longitude)
          ? { name: String(parsed.place.name ?? "My place"), latitude: parsed.place.latitude, longitude: parsed.place.longitude, timeZone: parsed.place.timeZone }
          : parsed.place === null
            ? null
            : DEFAULT_PREFS.place;
      value = { place, southernView: Boolean(parsed.southernView) };
    } catch {
      value = DEFAULT_PREFS;
    }
  }
  prefsCache = { raw, value };
  return value;
}

function subscribePrefs(callback: () => void) {
  window.addEventListener(PREFS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PREFS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCalendarPrefs(): [CalendarPrefs, (next: Partial<CalendarPrefs>) => void] {
  const prefs = useSyncExternalStore(subscribePrefs, readPrefs, () => DEFAULT_PREFS);
  const update = useCallback((next: Partial<CalendarPrefs>) => {
    const merged = { ...readPrefs(), ...next };
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
    } catch {
      prefsCache = { raw: null, value: merged };
    }
    window.dispatchEvent(new Event(PREFS_EVENT));
  }, []);
  return [prefs, update];
}

export interface CalendarState {
  ready: boolean;
  /** The selected date (today when the URL has none). */
  date: CivilDate;
  /** Today in the active timezone, from the real clock. */
  today: CivilDate;
  view: RightCalendar;
  tz: string;
  /** True when the timezone came from the URL rather than the browser. */
  tzChosen: boolean;
  setDate: (date: CivilDate) => void;
  goToday: () => void;
  setView: (view: RightCalendar) => void;
  setTimeZone: (tz: string | null) => void;
}

// A clock that ticks once a minute, so "today" rolls over at local midnight
// on a page left open overnight.
function subscribeClock(callback: () => void) {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => 0;

const PLACEHOLDER: CivilDate = { year: 2000, month: 1, day: 1 };

export function useCalendarState(): CalendarState {
  const search = useSyncExternalStore(subscribeUrl, getSearch, getServerSearch);
  const minute = useSyncExternalStore(subscribeClock, getMinute, getServerMinute);

  const write = useCallback((patch: Parameters<typeof writeCalendarUrl>[1]) => {
    const next = writeCalendarUrl(window.location.search, patch);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${next}${window.location.hash}`);
    window.dispatchEvent(new Event(URL_EVENT));
  }, []);

  const setDate = useCallback((date: CivilDate) => write({ date }), [write]);
  const goToday = useCallback(() => write({ date: null }), [write]);
  const setView = useCallback((view: RightCalendar) => write({ view }), [write]);
  const setTimeZone = useCallback((tz: string | null) => write({ tz }), [write]);

  if (search === null) {
    return { ready: false, date: PLACEHOLDER, today: PLACEHOLDER, view: "fixed", tz: "UTC", tzChosen: false, setDate, goToday, setView, setTimeZone };
  }
  const parsed = readCalendarUrl(search);
  const tz = parsed.tz ?? browserTimeZone();
  const today = todayIn(tz, new Date(minute * 60_000));
  return {
    ready: true,
    date: parsed.date ?? today,
    today,
    view: parsed.view,
    tz,
    tzChosen: parsed.tz !== null,
    setDate,
    goToday,
    setView,
    setTimeZone,
  };
}
