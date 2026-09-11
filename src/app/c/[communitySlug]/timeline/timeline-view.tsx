"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Layers,
  List,
  Maximize2,
  Milestone,
  Minus,
  Plus,
  Scale,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TimelineClaimSource, TimelineSource, TimelineTrack } from "@/types/database";
import type { TimelineEventWithClaims, TimelineFilters } from "@/lib/data/timeline";
import { TIMELINE_WINDOW_CAP } from "@/lib/data/timeline";
import { TimelineCanvas } from "./timeline-canvas";
import { CompareLanes } from "./compare-lanes";
import { TimelineList } from "./timeline-list";
import { SpanRuler } from "./span-ruler";
import { TimelineOverview } from "./timeline-overview";
import { EventDetail } from "./event-detail";
import { AddEventFlow } from "./add-event-flow";
import {
  loadTimelineEvent,
  loadTimelineWindow,
  searchTimeline,
  seedDeepTimeDataset,
  seedHannibalDataset,
  seedShowcaseEvent,
  seedStarterTracks,
} from "./actions";
import { TIMELINE_CATEGORIES, CHRONOLOGIES, TIMELINE_SOURCE_TYPES, timelineCategory } from "@/lib/timeline/taxonomy";
import {
  claimHeadline,
  claimMidpoint,
  clampWindow,
  presentPosition,
  windowAround,
  zoomWindow,
  LOOKBACK_END_YEAR,
  LOOKBACK_SPANS,
  durationParts,
  formatYear,
  claimInterval,
  claimsDisagree,
  lookbackWindow,
  TIMELINE_JUMPS,
  type TimeScale,
  type TimeWindow,
} from "@/lib/timeline/time";

// The timeline page.
//
// It owns exactly one piece of truth — the WINDOW, a range of years — and
// everything else follows from it: what is drawn, what is fetched, what the
// ruler is counting. Moving through time changes the window; the data catches
// up a quarter-second later. That order matters. Fetching first would make
// every drag feel like it was waiting for the network, when in fact the browser
// already has enough to draw the next frame.

const REFETCH_DEBOUNCE_MS = 260;

type Mode = "timeline" | "compare";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "cursor-pointer rounded-full border-0 px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        value ? "bg-accent-soft font-medium text-accent" : "bg-muted/60 text-muted-foreground hover:bg-muted"
      )}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// A SPAN, AS A CARD WITH THE NUMBER BIG.
//
// These were pills reading "5,000 years" in 12px grey — a row of nearly
// identical words that you had to read one at a time to tell apart. The thing
// that distinguishes them is the NUMBER, so the number is what the card is:
// set large, in tabular figures so the digits line up down the row, with the
// unit under it and what you will actually be looking at underneath that.
//
// The caption line does different work on each row and is passed in rather
// than derived: an era card says "Medieval", a look-back card says the years
// it will put on screen.
function SpanCard({
  value,
  unit,
  caption,
  active,
  accent = false,
  icon,
  onClick,
}: {
  value: string;
  unit: string;
  caption: string;
  active?: boolean;
  /** The community's own timeline, which is a different kind of jump from a fixed era. */
  accent?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group shrink-0 basis-[120px] rounded-xl border px-3 py-2.5 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-accent bg-accent-soft"
          : accent
            ? "border-transparent bg-accent-soft/60 hover:bg-accent-soft"
            : "border-border bg-card hover:border-accent/60 hover:bg-muted/50"
      )}
    >
      <span
        className={cn(
          "flex items-baseline gap-1 text-[21px] font-semibold leading-none tabular-nums",
          active || accent ? "text-accent" : "text-foreground"
        )}
      >
        {icon}
        {value}
      </span>
      <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {unit}
      </span>
      <span className="mt-1 block truncate text-[11px] font-medium text-muted-foreground">{caption}</span>
    </button>
  );
}

export function TimelineView({
  communitySlug,
  initialEvents,
  initialWindow,
  initialTotal,
  extent,
  markers,
  hasShowcase,
  hasHannibal,
  hasDeepTime,
  showcaseNeedsPictures,
  citations,
  initialTruncated,
  sources,
  tracks,
  facets,
  canContribute,
  isStaff,
  userId,
  pendingCount,
  focusSlug,
}: {
  communitySlug: string;
  initialEvents: TimelineEventWithClaims[];
  initialWindow: TimeWindow;
  initialTotal: number;
  /** The stretch this community's events actually occupy. Null when it has none. */
  extent: { from: number; to: number } | null;
  /** One mark per date claim, for the overview bar — positions only. */
  markers: { position: number; category: string }[];
  /** Whether the worked example is already here, so it is offered only once. */
  hasShowcase: boolean;
  /** Whether the Hannibal dataset is already here. True for non-staff, who are never offered it. */
  hasHannibal: boolean;
  /** Whether the Middle Pleistocene dataset is already here. Same rule. */
  hasDeepTime: boolean;
  /** Its pictures are missing, or point at somebody else's server and don't load. */
  showcaseNeedsPictures: boolean;
  /** Every extra claim→source link in the community, for the detail panel. */
  citations: TimelineClaimSource[];
  initialTruncated: boolean;
  sources: TimelineSource[];
  tracks: TimelineTrack[];
  facets: { people: string[]; civilisations: string[]; categories: string[] };
  canContribute: boolean;
  isStaff: boolean;
  userId: string | null;
  pendingCount: number;
  focusSlug: string | null;
}) {
  const router = useRouter();

  const [view, setView] = useState<TimeWindow>(initialWindow);
  const [events, setEvents] = useState(initialEvents);
  const [truncated, setTruncated] = useState(initialTruncated);
  const [loading, setLoading] = useState(false);
  // Bumped whenever something was written — closing the add flow, closing an
  // event after approving or deleting it. The window and the filters haven't
  // changed in those moments, so without this the effect below has no reason to
  // re-run and the new entry simply doesn't appear.
  const [reloadToken, setReloadToken] = useState(0);

  // Read straight from props rather than held in state: router.refresh() gives
  // this component new props but keeps its state, so a count in state would go
  // on saying "nothing on it yet" after the first event was added.
  const total = initialTotal;

  const [mode, setMode] = useState<Mode>("timeline");
  // Linear by default, always. A log axis is a distortion — a useful one, but a
  // reader who has not chosen it must never be shown it.
  const [scale, setScale] = useState<TimeScale>("linear");
  const [seeding, setSeeding] = useState(false);
  // Its own flag: the two seed cards can both be on screen, and one spinner
  // for both would put "Adding…" on the button nobody pressed.
  const [seedingHannibal, setSeedingHannibal] = useState(false);
  const [seedingDeepTime, setSeedingDeepTime] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [, startSeed] = useTransition();
  const [showList, setShowList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [adding, setAdding] = useState(false);

  const [category, setCategory] = useState("");
  const [trackId, setTrackId] = useState("");
  const [chronology, setChronology] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [person, setPerson] = useState("");
  const [civilisation, setCivilisation] = useState("");
  const [disputedOnly, setDisputedOnly] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

  const [term, setTerm] = useState("");
  const [results, setResults] = useState<TimelineEventWithClaims[] | null>(null);
  // Scrolled to when the selection changes: a click on the strip can be a long
  // way above the panel, and detail that appears off-screen reads as a click
  // that did nothing — the exact bug the strip had before.
  const detailRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<TimelineEventWithClaims | null>(
    focusSlug ? initialEvents.find((event) => event.slug === focusSlug) ?? null : null
  );
  const [compareTrackIds, setCompareTrackIds] = useState<string[]>(() => tracks.slice(0, 4).map((track) => track.id));

  const filters: TimelineFilters = useMemo(
    () => ({
      category: category || null,
      trackId: trackId || null,
      chronology: chronology || null,
      sourceType: sourceType || null,
      person: person || null,
      civilisation: civilisation || null,
      disputedOnly,
      includePending: pendingOnly || isStaff,
    }),
    [category, trackId, chronology, sourceType, person, civilisation, disputedOnly, pendingOnly, isStaff]
  );

  // --- Progressive loading --------------------------------------------------
  //
  // The window and the filters together are the query. Debounced, because a
  // drag produces one of these per frame and the server is not the thing that
  // should be keeping up with a finger.
  //
  // FETCH WIDER THAN THE SCREEN, AND THEN USUALLY DON'T FETCH AT ALL.
  //
  // Every pan used to be a 260ms wait plus a round trip before anything
  // appeared, and in between the strip showed the previous window's events —
  // which are, by definition, somewhere else — so it looked empty for most of a
  // second on every drag. The fix is not a faster server; it is not asking it.
  //
  // A window's worth of time is loaded either side of what is on screen, so
  // panning up to a full screen in either direction is arithmetic on data the
  // page already holds. Only leaving that loaded stretch costs a request.
  //
  // The padding is only safe while the whole community fits inside the window
  // cap: above that a wider query could hit the cap and silently drop events
  // that are actually in view, so a big timeline keeps the exact-window
  // behaviour it has always had.
  const requestId = useRef(0);
  const loadedRef = useRef<{ from: number; to: number; key: string } | null>(null);

  // AND THE FILTERS ARE APPLIED HERE, NOT THERE.
  //
  // Every press of a category chip was a round trip — "Archaeology" meant
  // waiting on the network to find out which of twenty-eight events say
  // archaeology. Once a window is loaded whole, every filter this page offers
  // can be answered from what is already in memory: a category is a field, a
  // lane is a list of ids on the event, a source type is a lookup in the source
  // list the page was given, and "where sources disagree" is the same function
  // the server runs. So the filters are client-side and instant.
  //
  // The server still does the filtering for a timeline too big to load whole,
  // because there the capped window has to be a window of MATCHING events or
  // the filter would silently show only the first four hundred.
  const canFilterHere = total > 0 && total <= TIMELINE_WINDOW_CAP;
  const serverFilters: TimelineFilters = useMemo(
    () => (canFilterHere ? { includePending: filters.includePending } : filters),
    [canFilterHere, filters]
  );
  const loadKey = `${JSON.stringify(serverFilters)}#${reloadToken}`;

  useEffect(() => {
    const span = view.to - view.from;
    const loaded = loadedRef.current;
    if (loaded && loaded.key === loadKey && view.from >= loaded.from && view.to <= loaded.to) {
      // Already in hand. This is the branch that makes scrolling feel instant.
      setLoading(false);
      return;
    }

    const pad = total > 0 && total <= TIMELINE_WINDOW_CAP ? span : 0;
    const wanted = clampWindow({ from: view.from - pad, to: view.to + pad });

    const id = ++requestId.current;
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const payload = await loadTimelineWindow(communitySlug, wanted.from, wanted.to, serverFilters);
        // A slow response for a window the reader has already left must not
        // overwrite a fast one for the window they are in.
        if (id !== requestId.current) return;
        setEvents(payload.events);
        setTruncated(payload.truncated);
        // AND THE OPEN PANEL, which is a copy of one of these events taken at
        // the moment it was clicked. Without this an edit saved from the panel
        // left the panel showing what the event used to be called — the strip
        // reloaded around it and the panel did not.
        setSelected((current) =>
          current ? payload.events.find((event) => event.id === current.id) ?? current : current
        );
        // Remember what this payload actually covers, so the next pan inside it
        // costs nothing. A truncated answer covers only what was asked for.
        loadedRef.current = payload.truncated
          ? { from: view.from, to: view.to, key: loadKey }
          : { from: wanted.from, to: wanted.to, key: loadKey };
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, REFETCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [communitySlug, view.from, view.to, serverFilters, loadKey, total]);

  // WHOLE TIMELINE — everything this community has, in one frame.
  //
  // Not a fetch. The extent came down with the page, so this is arithmetic on
  // two numbers the client already holds: set the window to span them and the
  // ordinary windowed loader does the rest, on the path it always uses.
  //
  // That matters more than it sounds. The first version of this button read
  // every event through a server action of its own and showed a spinner while
  // it did — a whole second code path, with its own way to be slow and its own
  // way to hang, to answer a question the page could already answer. There is
  // no spinner here because there is nothing to wait for.
  //
  // The padding keeps the earliest and latest events off the very edges, where
  // a marker sits half out of view and reads as cut off.
  const fitEverything = useCallback(() => {
    if (!extent) return;
    const span = Math.max(50, extent.to - extent.from);
    const pad = span * 0.04;
    setView(clampWindow({ from: extent.from - pad, to: extent.to + pad }));
    setMode("timeline");
  }, [extent]);

  // Bring the panel into view when the selection changes — but only when it
  // changes, so scrolling away from an open panel doesn't yank you back on
  // every unrelated re-render.
  // WHICH CARD AM I ON? A row of spans with nothing marked is a row of guesses:
  // the reader has just pressed one and cannot tell which. Matched loosely,
  // because panning a few pixels should not un-select the span you chose, and
  // exactly enough that two neighbouring spans are never both lit.
  const matchesWindow = useCallback(
    (candidate: TimeWindow) => {
      const span = view.to - view.from;
      const tolerance = Math.max(1, span * 0.02);
      return Math.abs(candidate.from - view.from) <= tolerance && Math.abs(candidate.to - view.to) <= tolerance;
    },
    [view.from, view.to]
  );

  const selectedId = selected?.id ?? null;
  useEffect(() => {
    if (!selectedId) return;
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedId]);

  // --- Search ---------------------------------------------------------------
  // Whether a search is running at all is derived from the box, not stored — so
  // clearing it needs no state change and no effect to do the clearing.
  const searching = term.trim().length >= 2;
  useEffect(() => {
    if (!searching) return;
    const handle = setTimeout(async () => {
      setResults(await searchTimeline(communitySlug, term));
    }, 300);
    return () => clearTimeout(handle);
  }, [term, communitySlug, searching]);

  const goTo = useCallback((event: TimelineEventWithClaims) => {
    if (event.claims.length > 0) {
      const position = claimMidpoint(event.claims[0]);
      // A window proportional to the event's own age: fifty years around a
      // modern event, fifty million around a geological one. A fixed span would
      // put the reader either inside a blank century or outside their own event.
      const span = Math.max(60, Math.abs(position) * 0.03);
      setView(windowAround(position, span));
    }
    setSelected(event);
    setTerm("");
    setResults(null);
  }, []);

  /** Source ids of the chosen type, for "show me what archaeology says". */
  const sourceIdsOfType = useMemo(() => {
    if (!sourceType) return null;
    return new Set(sources.filter((source) => source.source_type === sourceType).map((source) => source.id));
  }, [sources, sourceType]);

  // The same questions the server asks, asked of the events already in hand.
  const matchesFilters = useCallback(
    (event: TimelineEventWithClaims) => {
      if (category && event.category !== category) return false;
      if (trackId && !event.trackIds.includes(trackId)) return false;
      if (person && !event.people.includes(person)) return false;
      if (civilisation && !event.civilisations.includes(civilisation)) return false;
      if (chronology && !event.claims.some((claim) => claim.chronology === chronology)) return false;
      if (sourceIdsOfType && !event.claims.some((claim) => claim.source_id && sourceIdsOfType.has(claim.source_id)))
        return false;
      if (disputedOnly && !claimsDisagree(event.claims)) return false;
      return true;
    },
    [category, trackId, person, civilisation, chronology, sourceIdsOfType, disputedOnly]
  );

  // Loaded is wider than shown (see the loader above), so the list is filtered
  // back to the window: a reader scrolling the list should see what the strip
  // is showing, not the margin either side of it that happens to be in memory.
  const inWindow = useMemo(
    () =>
      events.filter(
        (event) =>
          matchesFilters(event) &&
          event.claims.some((claim) => {
            const interval = claimInterval(claim);
            return interval.hi >= view.from && interval.lo <= view.to;
          })
      ),
    [events, matchesFilters, view.from, view.to]
  );
  const visible = pendingOnly ? inWindow.filter((event) => event.status === "pending") : inWindow;
  const activeResults = searching ? results : null;
  const displayed = activeResults ?? visible;
  const activeFilterCount = [category, trackId, chronology, sourceType, person, civilisation].filter(Boolean).length +
    (disputedOnly ? 1 : 0) + (pendingOnly ? 1 : 0);

  // Nothing at all, ever — as opposed to nothing in this window, which the
  // canvas says for itself.
  if (total === 0 && events.length === 0 && !isStaff && !canContribute) {
    return (
      <EmptyState
        icon={<Milestone className="h-6 w-6" />}
        title="Build your learning timeline"
        description="Explore history, science and civilisation across billions of years — and compare what different sources say happened when."
      />
    );
  }

  return (
    <div>
      {/* ---- Header ---------------------------------------------------- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Timeline</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {total === 0
              ? "Nothing on it yet."
              : `${total} event${total === 1 ? "" : "s"}, from the deep past to what hasn't happened yet.`}
          </p>
        </div>
        {canContribute && (
          <Button type="button" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add event
          </Button>
        )}
      </div>

      {isStaff && pendingCount > 0 && (
        <button
          type="button"
          onClick={() => setPendingOnly((current) => !current)}
          className={cn(
            "mb-4 flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
            pendingOnly ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent hover:opacity-90"
          )}
        >
          {pendingCount} timeline entr{pendingCount === 1 ? "y is" : "ies are"} waiting for your approval
          <span className="ml-auto text-xs opacity-80">{pendingOnly ? "Show everything" : "Review them"}</span>
        </button>
      )}

      {/* ---- One line: search, categories, filters ----------------------
          Three stacked rows of controls pushed the timeline itself below
          the fold on a laptop. They are one row now, wrapping only when
          the width genuinely runs out: the search box takes what is left
          after the chips and the filters, which is the right way round —
          the chips and filters are fixed-size and the search is elastic. */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
      {/* ---- Search ------------------------------------------------------ */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search the timeline — an event, a person, a civilisation, a source…"
            className="pl-9"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {activeResults && activeResults.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
              {activeResults.map((event) => {
                const meta = timelineCategory(event.category);
                return (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => goTo(event)}
                      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-muted"
                    >
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", meta.dotClass)} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{event.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {event.claims.length > 0 ? claimHeadline(event.claims[0]).headline : "No date yet"}
                          {event.claims.length > 1 ? ` · ${event.claims.length} proposed dates` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {activeResults && activeResults.length === 0 && (
            <p className="absolute inset-x-0 top-full z-30 mt-1 rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-muted-foreground shadow-lg">
              Nothing matches “{term}”.
            </p>
          )}
        </div>
      {/* ---- Category rail + filters ------------------------------------- */}
        <div className="flex min-w-0 gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("")}
            aria-pressed={category === ""}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === "" ? "bg-accent text-accent-foreground shadow-sm" : "bg-accent-soft/60 text-foreground hover:bg-accent-soft"
            )}
          >
            All
          </button>
          {TIMELINE_CATEGORIES.filter((meta) => facets.categories.includes(meta.key) || meta.key === "history").map((meta) => {
            const Icon = meta.icon;
            const active = category === meta.key;
            return (
              <button
                key={meta.key}
                type="button"
                onClick={() => setCategory(active ? "" : meta.key)}
                aria-pressed={active}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-accent text-accent-foreground shadow-sm" : "bg-accent-soft/60 text-foreground hover:bg-accent-soft"
                )}
              >
                <Icon className="h-4 w-4" />
                {meta.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((open) => !open)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              activeFilterCount > 0 ? "bg-accent-soft text-accent" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && <span className="tabular-nums">({activeFilterCount})</span>}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showFilters && "rotate-180")} />
          </button>

          <button
            type="button"
            onClick={() => setDisputedOnly((current) => !current)}
            aria-pressed={disputedOnly}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              disputedOnly ? "bg-danger/12 text-danger" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            <Scale className="h-4 w-4" />
            Where sources disagree
          </button>

          <div className="ml-auto flex rounded-full bg-muted p-0.5">
            {(
              [
                { key: "timeline", label: "Timeline", icon: Milestone },
                { key: "compare", label: "Compare", icon: Layers },
              ] as const
            ).map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setMode(option.key)}
                  aria-pressed={mode === option.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    mode === option.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mb-3 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
          {tracks.length > 0 && (
            <FilterSelect
              label="Lane"
              value={trackId}
              onChange={setTrackId}
              options={tracks.map((track) => ({ value: track.id, label: track.name }))}
            />
          )}
          <FilterSelect
            label="Civilisation"
            value={civilisation}
            onChange={setCivilisation}
            options={facets.civilisations.map((name) => ({ value: name, label: name }))}
          />
          <FilterSelect
            label="Person"
            value={person}
            onChange={setPerson}
            options={facets.people.map((name) => ({ value: name, label: name }))}
          />
          <FilterSelect
            label="Viewpoint"
            value={chronology}
            onChange={setChronology}
            options={CHRONOLOGIES.map((option) => ({ value: option.key, label: option.label }))}
          />
          <FilterSelect
            label="Kind of source"
            value={sourceType}
            onChange={setSourceType}
            options={TIMELINE_SOURCE_TYPES.map((option) => ({ value: option.key, label: option.label }))}
          />
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setTrackId("");
                setChronology("");
                setSourceType("");
                setPerson("");
                setCivilisation("");
                setDisputedOnly(false);
                setPendingOnly(false);
              }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ---- Compare lane picker ----------------------------------------- */}
      {mode === "compare" && (
        <div className="mb-3">
          {tracks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-5 text-center">
              <p className="text-sm font-medium text-foreground">No compare lanes yet</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Lanes are the parallel rows Compare reads — Ancient Egypt, Mesopotamia, China, Science. Add the starter
                set and file events into them as you go.
              </p>
              {isStaff && (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3"
                  onClick={async () => {
                    await seedStarterTracks(communitySlug);
                    router.refresh();
                  }}
                >
                  Add the starter lanes
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {tracks.map((track) => {
                const on = compareTrackIds.includes(track.id);
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() =>
                      setCompareTrackIds((current) =>
                        on ? current.filter((id) => id !== track.id) : [...current, track.id]
                      )
                    }
                    aria-pressed={on}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      on ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {track.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---- Choose a span --------------------------------------------
          Above the timeline rather than below it, because this is the first
          thing a reader does: pick how much time to look at, then look at it.

          ONE ROW, SCROLLING. Wrapped across two rows these took a quarter of
          the screen before the timeline began. On one line they are a rail you
          push along — eras first, then the look-backs from today, with a rule
          between the two kinds. */}
      <div className="-mx-4 mb-3 flex w-0 min-w-full gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {/* Everything this community has, framed. First in the row because it
            is the jump people actually want — the fixed eras beside it are
            spans of history, this one is a span of YOUR timeline. */}
        {extent && (
          <SpanCard
            accent
            icon={<Maximize2 className="h-4 w-4" />}
            {...durationParts(Math.max(1, extent.to - extent.from))}
            caption="Whole timeline"
            active={matchesWindow({ from: extent.from, to: extent.to })}
            onClick={fitEverything}
          />
        )}
        {TIMELINE_JUMPS.map((jump) => (
          <SpanCard
            key={jump.key}
            {...durationParts(jump.window.to - jump.window.from)}
            caption={jump.label}
            active={matchesWindow(jump.window)}
            onClick={() => setView(jump.window)}
          />
        ))}

        {/* The eras above are PLACES; what follows is DEPTHS. Every one of them
            ends at the same point just past today and only the reach changes,
            so going along the row is one continuous zoom out from the present —
            which is the question a learner asks far more often than "show me
            the Medieval period". */}
        <div className="mx-1 w-px shrink-0 self-stretch bg-border" aria-hidden />

        {LOOKBACK_SPANS.map((years) => {
          const span = lookbackWindow(years);
          return (
            <SpanCard
              key={years}
              {...durationParts(years)}
              // Both ends, so the row needs no heading to say what it is: these
              // all finish just past today, and only the reach back changes.
              caption={`${formatYear(Math.floor(span.from), { compact: true })} – ${LOOKBACK_END_YEAR}`}
              active={matchesWindow(span)}
              onClick={() => setView(span)}
            />
          );
        })}
      </div>

      {/* ---- How much time is on screen ------------------------------------
          Above the strip in both windowed modes, and absent from "whole",
          where the answer is "all of it" and a measurement of the view would
          be measuring nothing. */}
      <SpanRuler window={view} scale={scale} />

      {/* Where everything is, and where you are in it. Above the strip, under
          the measurement, so the three read as one instrument: how wide, what
          is out there, and then the detail. */}
      <TimelineOverview
        markers={markers}
        window={view}
        onWindowChange={setView}
        className="mt-3"
      />

      {/* ---- The timeline itself ------------------------------------------ */}
      {mode === "timeline" ? (
        // ONE canvas, sized by a class. A phone gets a shorter strip for the
        // SHAPE of time and the list below for actually reaching an event, so
        // nobody is asked to hit a four-pixel dot — but it is the same strip,
        // not a second copy of it in the DOM.
        <TimelineCanvas
          events={displayed}
          window={view}
          scale={scale}
          onWindowChange={setView}
          present={presentPosition()}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          loading={loading}
          truncated={truncated}
          className="h-[260px] sm:h-[440px] xl:h-[560px]"
        />
      ) : (
        <CompareLanes
          tracks={tracks}
          selectedTrackIds={compareTrackIds}
          events={displayed}
          window={view}
          scale={scale}
          onWindowChange={setView}
          onSelect={setSelected}
          selectedId={selected?.id ?? null}
        />
      )}

      {/* ---- Zoom rail -----------------------------------------------------
          Nothing to zoom when the page is already showing everything, so the
          rail and the era jumps go away rather than sitting there inert. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setView((current) => zoomWindow(current, 1 / 1.8))}
            aria-label="Zoom in"
            className="rounded-full px-2.5 py-1.5 text-foreground hover:bg-card"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView((current) => zoomWindow(current, 1.8))}
            aria-label="Zoom out"
            className="rounded-full px-2.5 py-1.5 text-foreground hover:bg-card"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* LINEAR OR LOG.
            Two buttons rather than a switch, because a switch has an "off" and
            neither of these is off — they are two ways of spacing the same
            time, and the reader is choosing between them rather than enabling
            something. */}
        <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
          {(
            [
              { key: "linear", label: "Years", hint: "A year is the same width wherever it falls." },
              { key: "log", label: "Log", hint: "Each ten-fold step in age gets equal width, so deep time and last week are both readable. Distances are distorted." },
            ] as const
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setScale(option.key)}
              aria-pressed={scale === option.key}
              title={option.hint}
              className={cn(
                "rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                scale === option.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowList((open) => !open)}
          className="ml-auto hidden items-center gap-1.5 rounded-full bg-muted/60 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <List className="h-4 w-4" />
          {showList ? "Hide the list" : "Read as a list"}
        </button>
      </div>

      {/* ---- The event you clicked -----------------------------------------
          Inline, under the strip, rather than in a drawer over the top of it.
          A panel that covers the timeline hides the very thing the event needs
          to be read against — what else was happening then — and on a phone it
          took the whole screen. Here the strip stays visible above it, so the
          marker you clicked is still in view while you read what it is. */}
      {selected && (
        <div ref={detailRef} className="mt-5 scroll-mt-4 rounded-xl border border-border bg-card p-5 sm:p-6">
          <EventDetail
            event={selected}
            sources={sources}
            citations={citations}
            tracks={tracks}
            userId={userId}
            communitySlug={communitySlug}
            canContribute={canContribute}
            isStaff={isStaff}
            onClose={() => {
              setSelected(null);
              setReloadToken((token) => token + 1);
            }}
            // The strip moves; the panel stays. With the detail beside the
            // timeline rather than over it, jumping to "what else was happening
            // then" no longer has to close what you were reading.
            onShowContext={(from, to) => setView({ from, to })}
          // A save writes to the database and refreshes the server components;
          // this is what tells the client-side copy of the timeline to go and
          // look again, so a renamed event is renamed on the strip too.
          onSaved={() => setReloadToken((token) => token + 1)}
          />
        </div>
      )}

      {/* ---- List ----------------------------------------------------------
          Also one list, not two. Always on a phone, where it is the primary way
          in; on a desktop only when asked for, because there the strip is doing
          that job. */}
      <div className={cn("mt-4", showList ? "block" : "block sm:hidden")}>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:hidden">
          In order
        </h2>
        <TimelineList
          events={displayed}
          onSelect={setSelected}
          selectedId={selected?.id ?? null}
          emptyMessage="Nothing in this stretch of time. Move the timeline, or clear the filters."
        />
      </div>

      {total === 0 && events.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Milestone className="h-6 w-6" />}
            title="Build your learning timeline"
            description="Explore history, science and civilisation across billions of years — and compare what different sources say happened when."
            action={
              canContribute ? (
                <Button type="button" onClick={() => setAdding(true)}>
                  <Plus className="h-4 w-4" /> Add your first event
                </Button>
              ) : undefined
            }
          />

        </div>
      )}

      {/* ---- The worked example --------------------------------------------
          Offered to staff until it is taken, then never again — hasShowcase
          is the whole of the logic. Not gated on an empty timeline, which is
          where this started and which meant a community with four events of
          their own could never reach it. Not seeded automatically either: a
          community's timeline is theirs, and a monument they did not choose
          appearing in it uninvited is worse than not offering at all. */}
      {isStaff && !hasShowcase && (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground">Want to see what a well-sourced event looks like?</p>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Add the Great Pyramid of Giza as a worked example: one event with five proposed dates — the archaeological
            consensus, a radiocarbon study, two alternative arguments and a medieval legend — each with its own source,
            its own reasoning, and the objections to it. It is there to show how this timeline handles a real
            disagreement without pretending there is a single certain answer.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            disabled={seeding}
            onClick={() => {
              setSeeding(true);
              startSeed(async () => {
                const result = await seedShowcaseEvent(communitySlug);
                setSeeding(false);
                if (result && "error" in result) {
                  setSeedError(result.error);
                  return;
                }
                setReloadToken((token) => token + 1);
                router.refresh();
              });
            }}
          >
            {seeding ? "Adding…" : "Add the worked example"}
          </Button>
          {seedError && <p className="mt-2 text-sm text-danger">{seedError}</p>}
        </div>
      )}

      {/* ---- A worked example whose pictures never arrived --------------------
          Two ways to get here, and they look identical to a reader. A copy
          taken before the photographs were part of the worked example has none
          at all, because seeding is a no-op once the event exists. A copy taken
          after that has them as links to Wikimedia, which show as empty boxes.
          Neither is something a reader can fix from the page, and neither is
          something to fix without being asked — so it is offered here, to the
          people who can say yes. The same action does it, in place. */}
      {isStaff && hasShowcase && showcaseNeedsPictures && (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground">The worked example is missing its photographs</p>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Either it was added before the pictures were part of it, or it is still fetching them from Wikimedia every
            time somebody opens the event — which is why they show as empty boxes. Bring them in and they are copied
            once into this community&rsquo;s own storage, with the photographer and licence kept in the caption
            underneath each one.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            disabled={seeding}
            onClick={() => {
              setSeeding(true);
              startSeed(async () => {
                const result = await seedShowcaseEvent(communitySlug);
                setSeeding(false);
                if (result && "error" in result) {
                  setSeedError(result.error);
                  return;
                }
                // Nothing arrived. Say WHICH step failed and why: "couldn't
                // be fetched just now" was true of a refused connection, a 403,
                // an HTML error page and a rejected upload alike, and gave
                // nobody anything to act on.
                if (result && "broughtIn" in result && result.broughtIn === 0) {
                  const why = "reason" in result && result.reason ? result.reason : null;
                  setSeedError(
                    why
                      ? `The photographs weren't brought in — ${why}.`
                      : "The photographs weren't brought in, and the server didn't say why. Try again in a moment."
                  );
                }
                setReloadToken((token) => token + 1);
                router.refresh();
              });
            }}
          >
            {seeding ? "Bringing them in…" : "Bring the pictures in"}
          </Button>
          {seedError && <p className="mt-2 text-sm text-danger">{seedError}</p>}
        </div>
      )}

      {/* ---- The Hannibal dataset --------------------------------------------
          Seventeen events rather than one, and a different lesson from the
          worked example: not a single argued-over date, but a whole campaign
          in which every kind of evidence a historian uses turns up somewhere —
          a lost bronze tablet, coins, a prisoner's report, two ancient
          narratives that disagree about casualty figures, a modern radiocarbon
          study, and a legend about vinegar. Offered to staff until it is
          taken. Nothing is seeded into a community that has not asked. */}
      {isStaff && !hasHannibal && (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground">Add the Hannibal dataset?</p>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Seventeen events from the Second Punic War — Hannibal&rsquo;s birth, the oath, Saguntum, the Alps, Cannae,
            the march on Rome — built to show how historical knowledge is actually assembled: contemporary objects,
            a near-contemporary witness, two ancient histories that disagree, later legend, and modern scholarship,
            each kept apart and labelled. Where the ancient sources give different numbers, both numbers are shown.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            disabled={seedingHannibal}
            onClick={() => {
              setSeedingHannibal(true);
              startSeed(async () => {
                const result = await seedHannibalDataset(communitySlug);
                setSeedingHannibal(false);
                if (result && "error" in result) {
                  setSeedError(result.error);
                  return;
                }
                if (result && "failed" in result && result.failed > 0) {
                  setSeedError(
                    `Added ${result.added} of ${result.added + result.failed} events — ${result.failed} could not be added.`
                  );
                }
                setReloadToken((token) => token + 1);
                router.refresh();
              });
            }}
          >
            {seedingHannibal ? "Adding the events…" : "Add the Hannibal dataset"}
          </Button>
          {seedError && <p className="mt-2 text-sm text-danger">{seedError}</p>}
        </div>
      )}

      {/* ---- The deep time dataset -------------------------------------------
          The same idea as the Hannibal set, asked of a period with no texts at
          all: ten records where every date is an inference from teeth, magnetised
          rock, isotopes or DNA, and several of them sit nowhere near each other
          on the strip because the evidence puts them where it puts them. */}
      {isStaff && !hasDeepTime && (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground">Add the deep time dataset?</p>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Ten records from the Middle Pleistocene — Homo heidelbergensis, Acheulean handaxes, Boxgrove, the ice age
            cycles, the Neanderthal divergence, the Brunhes&ndash;Matuyama magnetic reversal. There are no texts from
            any of it, so every date is an inference from teeth, magnetised rock, ocean isotopes or DNA, and where the
            specialists disagree by a quarter of a million years the disagreement is shown rather than averaged away.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            disabled={seedingDeepTime}
            onClick={() => {
              setSeedingDeepTime(true);
              startSeed(async () => {
                const result = await seedDeepTimeDataset(communitySlug);
                setSeedingDeepTime(false);
                if (result && "error" in result) {
                  setSeedError(result.error);
                  return;
                }
                if (result && "failed" in result && result.failed > 0) {
                  setSeedError(
                    `Added ${result.added} of ${result.added + result.failed} events — ${result.failed} could not be added.`
                  );
                }
                setReloadToken((token) => token + 1);
                router.refresh();
              });
            }}
          >
            {seedingDeepTime ? "Adding the records…" : "Add the deep time dataset"}
          </Button>
          {seedError && <p className="mt-2 text-sm text-danger">{seedError}</p>}
        </div>
      )}

      {/* ---- Detail panel --------------------------------------------------- */}


      {adding && userId && (
        <AddEventFlow
          communitySlug={communitySlug}
          userId={userId}
          tracks={tracks}
          isStaff={isStaff}
          onClose={async (createdSlug) => {
            setAdding(false);
            setReloadToken((token) => token + 1);
            if (!createdSlug) return;
            const created = await loadTimelineEvent(communitySlug, createdSlug);
            if (created) goTo(created);
          }}
        />
      )}
    </div>
  );
}
