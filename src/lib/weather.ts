import "server-only";
import { isTidalLocationType } from "@/lib/community-templates";

// Live conditions for place-based communities, from Open-Meteo's free,
// no-key APIs (https://open-meteo.com — data is CC BY 4.0, so keep the
// attribution line in the UI):
//
//   - geocoding-api  → turns the community's free-text location_name into
//                      coordinates (cached ~30 days; places don't move)
//   - api            → current conditions + daily forecast
//   - marine-api     → hourly sea-level height, from which high/low tide
//                      times are derived for island/coastal communities
//
// Everything degrades to null rather than throwing: a weather hiccup should
// never break a community's home page.

const GEOCODE_REVALIDATE = 60 * 60 * 24 * 30;
const WEATHER_REVALIDATE = 60 * 30;
const TIDES_REVALIDATE = 60 * 60 * 3;

interface Coordinates {
  lat: number;
  lng: number;
  // "Nungwi, Tanzania" — the geocoder's resolved name, shown so a wrong
  // match is visible (the fix is refining the community's location name).
  resolvedName: string;
}

export interface CurrentConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export interface DailyForecast {
  /** Local calendar date, "YYYY-MM-DD". */
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
}

export interface TideEvent {
  kind: "high" | "low";
  /** Local time at the community, "YYYY-MM-DDTHH:MM". */
  time: string;
  /** Sea level height above mean sea level, metres. */
  height: number;
  /** Minutes from now (community-local) until this tide; negative = already turned. */
  minutesUntil: number;
}

export interface CommunityWeather {
  resolvedName: string;
  current: CurrentConditions;
  daily: DailyForecast[];
  /** Non-null only for tidal (island/coastal) communities with marine data. */
  tides: TideEvent[] | null;
}

async function fetchJson(url: string, revalidate: number): Promise<unknown> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function geocodeLocation(name: string): Promise<Coordinates | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const data = (await fetchJson(url, GEOCODE_REVALIDATE)) as {
    results?: { latitude: number; longitude: number; name: string; country?: string }[];
  } | null;

  const hit = data?.results?.[0];
  if (!hit) return null;
  return {
    lat: hit.latitude,
    lng: hit.longitude,
    resolvedName: hit.country ? `${hit.name}, ${hit.country}` : hit.name,
  };
}

async function fetchForecast(coords: Coordinates): Promise<Pick<CommunityWeather, "current" | "daily"> | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;

  const data = (await fetchJson(url, WEATHER_REVALIDATE)) as {
    current?: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      weather_code: number;
    };
    daily?: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  } | null;

  if (!data?.current || !data.daily) return null;

  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    daily: data.daily.time.map((date, i) => ({
      date,
      weatherCode: data.daily!.weather_code[i],
      maxTemp: data.daily!.temperature_2m_max[i],
      minTemp: data.daily!.temperature_2m_min[i],
    })),
  };
}

/** One point on the sea-level curve, for charting. */
export interface TidePoint {
  time: string;
  height: number;
}

export interface TideOutlook {
  resolvedName: string;
  /** Every high/low across today and tomorrow (community-local), past included. */
  events: TideEvent[];
  /** The next tide still to come — the headline number. */
  next: TideEvent | null;
  /** Hourly sea-level curve across the same window, for the chart. */
  curve: TidePoint[];
  /** Where "now" falls along the curve, 0..1 — the chart's now-marker. */
  nowFraction: number;
}

// The marine API has no high/low-tide endpoint, but hourly sea-level height
// carries the tidal signal — each local extremum of the curve is a high or
// low tide. Hourly samples put the reported time within ±30min of the true
// turn, which is plenty for "when's low tide?" on a community page.
async function fetchTideOutlook(coords: Coordinates): Promise<TideOutlook | null> {
  const url =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${coords.lat}&longitude=${coords.lng}` +
    `&hourly=sea_level_height_msl&timezone=auto&forecast_days=2`;

  const data = (await fetchJson(url, TIDES_REVALIDATE)) as {
    utc_offset_seconds?: number;
    hourly?: { time: string[]; sea_level_height_msl: (number | null)[] };
  } | null;

  const times = data?.hourly?.time;
  const heights = data?.hourly?.sea_level_height_msl;
  if (!times || !heights || heights.every((h) => h === null)) return null;

  // Hourly times come back as local wall-clock strings with no offset;
  // pinning them to UTC and shifting "now" by the same offset lets both be
  // compared without any timezone-database work.
  const offsetMs = (data?.utc_offset_seconds ?? 0) * 1000;
  const localNow = Date.now() + offsetMs;
  const asMs = (time: string) => Date.parse(`${time}:00Z`);

  const events: TideEvent[] = [];
  for (let i = 1; i < times.length - 1; i++) {
    const prev = heights[i - 1];
    const here = heights[i];
    const next = heights[i + 1];
    if (prev === null || here === null || next === null) continue;

    const kind = here >= prev && here > next ? "high" : here <= prev && here < next ? "low" : null;
    if (kind) {
      events.push({ kind, time: times[i], height: here, minutesUntil: Math.round((asMs(times[i]) - localNow) / 60000) });
    }
  }
  if (!events.length) return null;

  const curve: TidePoint[] = times.flatMap((time, i) => (heights[i] === null ? [] : [{ time, height: heights[i]! }]));
  const first = asMs(curve[0].time);
  const last = asMs(curve[curve.length - 1].time);
  const nowFraction = Math.min(1, Math.max(0, (localNow - first) / Math.max(1, last - first)));

  return {
    resolvedName: coords.resolvedName,
    events,
    next: events.find((e) => e.minutesUntil >= 0) ?? null,
    curve,
    nowFraction,
  };
}

/**
 * The full tide picture for a community's Tides & Weather space: every
 * high/low today and tomorrow plus the sea-level curve behind them. Null for
 * non-tidal communities (see isTidalLocationType), missing locations, and
 * points the marine model has no sea-level data for.
 */
export async function getCommunityTides(community: {
  location_type: string | null;
  location_name: string | null;
}): Promise<TideOutlook | null> {
  if (!community.location_name || !isTidalLocationType(community.location_type)) return null;

  const coords = await geocodeLocation(community.location_name);
  if (!coords) return null;
  return fetchTideOutlook(coords);
}

/**
 * Everything the weather card needs for one community. Weather for any place
 * community with a location; tides added when the place is an island or
 * coastal area. Null when the community has no location or every provider
 * call failed.
 */
export async function getCommunityWeather(community: {
  location_type: string | null;
  location_name: string | null;
}): Promise<CommunityWeather | null> {
  if (!community.location_name) return null;

  const coords = await geocodeLocation(community.location_name);
  if (!coords) return null;

  const [forecast, outlook] = await Promise.all([
    fetchForecast(coords),
    isTidalLocationType(community.location_type) ? fetchTideOutlook(coords) : Promise.resolve(null),
  ]);
  if (!forecast) return null;

  const upcoming = outlook?.events.filter((e) => e.minutesUntil >= 0).slice(0, 4) ?? null;
  return { resolvedName: coords.resolvedName, ...forecast, tides: upcoming?.length ? upcoming : null };
}

// ---------------------------------------------------------------------------
// Formatting helpers. Open-Meteo already localises every timestamp to the
// community's timezone, so these parse the strings directly instead of going
// through Date-in-server-timezone (which would shift them).
// ---------------------------------------------------------------------------

/** "2026-07-22T14:00" → "2:00 PM" */
export function formatLocalHour(localTime: string): string {
  const [h = 0, m = 0] = (localTime.split("T")[1] ?? "").split(":").map(Number);
  const suffix = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Rough countdown to a tide turn — hourly source data, so never over-precise. */
export function formatMinutesUntil(minutes: number): string {
  if (minutes < 45) return "about now";
  const h = Math.round(minutes / 60);
  return h <= 1 ? "in about 1 hour" : `in about ${h} hours`;
}

/** "2026-07-22" → "Wed" (weekday of a calendar date is timezone-independent). */
export function formatWeekday(localDate: string): string {
  return new Date(`${localDate.split("T")[0]}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

// WMO weather interpretation codes, grouped to what a community member needs
// to know. `icon` is a key the card maps to a lucide icon.
export type WeatherIcon = "sun" | "partly-cloudy" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export function describeWeatherCode(code: number): { label: string; icon: WeatherIcon } {
  if (code === 0) return { label: "Clear sky", icon: "sun" };
  if (code === 1) return { label: "Mostly clear", icon: "sun" };
  if (code === 2) return { label: "Partly cloudy", icon: "partly-cloudy" };
  if (code === 3) return { label: "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "drizzle" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "rain" };
  if (code === 85 || code === 86) return { label: "Snow showers", icon: "snow" };
  if (code >= 95) return { label: "Thunderstorm", icon: "storm" };
  return { label: "Mixed conditions", icon: "cloud" };
}
