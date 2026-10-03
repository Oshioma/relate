import { clampWindow, type TimeScale, type TimeWindow } from "./time";

// WHERE THE READER IS, WRITTEN INTO THE ADDRESS.
//
// The page has always READ ?from&to — that is how "what was happening at the
// same time?" links and shared links open on the right stretch of time. It
// never WROTE them, so opening a record's full page and pressing Back put the
// reader on the default window: their position, zoom, selection and filters
// all gone. Writing the same parameters back closes that loop, and makes the
// address bar a shareable link to exactly what is on screen.
//
// Defaults are omitted so an untouched timeline keeps a clean address, and
// parameters this module does not own are left alone.

export type TimelineFiltersState = {
  category: string;
  trackId: string;
  chronology: string;
  sourceType: string;
  person: string;
  civilisation: string;
  /** One of the record tags, e.g. "benin-kingdom-context" — the "everything filed with this" view. */
  tag: string;
  disputedOnly: boolean;
  pendingOnly: boolean;
};

export type TimelineUrlState = TimelineFiltersState & {
  window: TimeWindow;
  scale: TimeScale;
  /** The selected event's slug. */
  focus: string | null;
  /** The selected period's id. */
  period: string | null;
};

export const EMPTY_TIMELINE_FILTERS: TimelineFiltersState = {
  category: "",
  trackId: "",
  chronology: "",
  sourceType: "",
  person: "",
  civilisation: "",
  tag: "",
  disputedOnly: false,
  pendingOnly: false,
};

// One table, so reading and writing can never disagree about a name.
const TEXT_PARAMS = [
  ["category", "category"],
  ["trackId", "track"],
  ["chronology", "chronology"],
  ["sourceType", "source"],
  ["person", "person"],
  ["civilisation", "civilisation"],
  ["tag", "tag"],
] as const satisfies readonly (readonly [keyof TimelineFiltersState, string])[];

const FLAG_PARAMS = [
  ["disputedOnly", "disputed"],
  ["pendingOnly", "pending"],
] as const satisfies readonly (readonly [keyof TimelineFiltersState, string])[];

const OWNED_KEYS = ["from", "to", "scale", "focus", "period", ...TEXT_PARAMS.map(([, key]) => key), ...FLAG_PARAMS.map(([, key]) => key)];

type ParamSource = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * A window edge rounded to what the screen can show.
 *
 * At ten thousand years wide a fraction of a year is invisible, and at a month
 * wide it is the whole point — so the precision follows the span rather than
 * being fixed, keeping the address short without moving the view a pixel.
 */
export function roundEdge(value: number, span: number): number {
  const step = Math.pow(10, Math.floor(Math.log10(Math.max(span, 1e-9) / 10_000)));
  if (step >= 1) return Math.round(value / step) * step;
  const decimals = Math.min(10, Math.round(-Math.log10(step)));
  return Number(value.toFixed(decimals));
}

/** The window from ?from&to, or null when they are missing or nonsense. */
export function readWindow(params: ParamSource): TimeWindow | null {
  const fromText = first(params.from);
  const toText = first(params.to);
  if (!fromText || !toText) return null;
  const from = Number(fromText);
  const to = Number(toText);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return null;
  return clampWindow({ from, to });
}

/** Everything but the window, with defaults for whatever is absent. */
export function readTimelineUrlState(params: ParamSource): Omit<TimelineUrlState, "window"> {
  const state: Omit<TimelineUrlState, "window"> = {
    ...EMPTY_TIMELINE_FILTERS,
    scale: first(params.scale) === "log" ? "log" : "linear",
    focus: first(params.focus) || null,
    period: first(params.period) || null,
  };
  for (const [field, key] of TEXT_PARAMS) state[field] = first(params[key]) ?? "";
  for (const [field, key] of FLAG_PARAMS) state[field] = first(params[key]) === "1";
  return state;
}

/**
 * The query string for this state, keeping any parameters it does not own.
 * Returned with its leading "?" (or as "" when nothing is left).
 */
export function timelineSearch(state: TimelineUrlState, existing: string = ""): string {
  const params = new URLSearchParams(existing);
  for (const key of OWNED_KEYS) params.delete(key);

  const span = state.window.to - state.window.from;
  params.set("from", String(roundEdge(state.window.from, span)));
  params.set("to", String(roundEdge(state.window.to, span)));
  if (state.scale !== "linear") params.set("scale", state.scale);
  if (state.focus) params.set("focus", state.focus);
  if (state.period) params.set("period", state.period);
  for (const [field, key] of TEXT_PARAMS) if (state[field]) params.set(key, state[field]);
  for (const [field, key] of FLAG_PARAMS) if (state[field]) params.set(key, "1");

  const text = params.toString();
  return text ? `?${text}` : "";
}
