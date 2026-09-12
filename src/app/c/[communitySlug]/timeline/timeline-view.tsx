"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Globe2,
  Layers,
  List,
  MapPin,
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
import type {
  TimelineClaimSource,
  TimelineEventLink,
  TimelinePeriodLink,
  TimelineSource,
  TimelineTrack,
} from "@/types/database";
import type { TimelineEventWithClaims, TimelineFilters, TimelineLinkedRecord } from "@/lib/data/timeline";
import { TIMELINE_WINDOW_CAP } from "@/lib/data/timeline";
import { TimelineCanvas } from "./timeline-canvas";
import { CompareLanes } from "./compare-lanes";
import { TimelineList } from "./timeline-list";
import { SpanRuler } from "./span-ruler";
import { TimelineOverview } from "./timeline-overview";
import { EventDetail } from "./event-detail";
import { PeriodDetail } from "./period-detail";
import { periodExtent, periodMatches, periodRegions, type PeriodWithClaims } from "@/lib/timeline/periods";
import { revealDetailAt } from "@/lib/timeline/reveal-detail";
import { AddEventFlow } from "./add-event-flow";
import {
  loadTimelineEvent,
  loadTimelineWindow,
  searchTimeline,
  seedDeepTimeDataset,
  seedEarlySapiensDataset,
  seedHannibalDataset,
  refreshSeededDatasets,
  seedAtlantisDataset,
  seedLemuriaDataset,
  seedCosmologyDataset,
  seedFloodPhysicalDataset,
  seedFloodMesopotamiaDataset,
  seedFloodEurasiaDataset,
  seedFloodChinaDataset,
  seedFloodSubmergedDataset,
  seedFloodAmericasDataset,
  seedFloodRegionsDataset,
  checkTimelinePictures,
  seedShowcaseEvent,
  seedStarterTracks,
  seedTimePeriods,
} from "./actions";
import {
  TIMELINE_CATEGORIES,
  CHRONOLOGIES,
  TIMELINE_SOURCE_TYPES,
  timelineCategory,
  periodTypeLabel,
} from "@/lib/timeline/taxonomy";
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

// AN OFFER OF A READY-MADE DATASET.
//
// Three of these now, and they differ only in their words and their action, so
// they are one component. Staff only, and withdrawn once taken: nothing is
// written into a community's timeline that the community did not ask for.
function DatasetOffer({
  title,
  children,
  busyLabel,
  label,
  onAdd,
}: {
  title: string;
  children: React.ReactNode;
  busyLabel: string;
  label: string;
  onAdd: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{children}</p>
      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          setError(null);
          Promise.resolve(onAdd())
            .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : String(reason)))
            .finally(() => setBusy(false));
        }}
      >
        {busy ? busyLabel : label}
      </Button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
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
  hasEarlySapiens,
  periods,
  periodLinks,
  eventLinks,
  linkedRecords,
  hasPeriods,
  hasAtlantis,
  hasLemuria,
  hasCosmology,
  hasFloodPhysical,
  hasFloodMesopotamia,
  hasFloodEurasia,
  hasFloodChina,
  hasFloodSubmerged,
  hasFloodAmericas,
  hasFloodRegions,
  datasetGaps,
  recordsMissingPictures,
  hannibalNeedsPictures,
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
  /** Whether the early Homo sapiens dataset is already here. Same rule. */
  hasEarlySapiens: boolean;
  /** The context bands. Empty for a community that has none, which is fine — the strip works without them. */
  periods: PeriodWithClaims[];
  /** The edges between periods, for "related periods" on the card. */
  periodLinks: TimelinePeriodLink[];
  /** Asserted relationships between records — all of them; the drawer picks out its own. */
  eventLinks: TimelineEventLink[];
  /** The records those edges point at, which are usually outside the window. */
  linkedRecords: TimelineLinkedRecord[];
  /** Whether the fifteen periods are already here. True for non-staff, who are never offered them. */
  hasPeriods: boolean;
  /** Whether the Atlantis dataset is already here. Same rule. */
  hasAtlantis: boolean;
  /** Whether the Lemuria dataset is already here. Same rule. */
  hasLemuria: boolean;
  hasCosmology: boolean;
  hasFloodPhysical: boolean;
  hasFloodMesopotamia: boolean;
  hasFloodEurasia: boolean;
  hasFloodChina: boolean;
  hasFloodSubmerged: boolean;
  hasFloodAmericas: boolean;
  hasFloodRegions: boolean;
  /** Seeded datasets this community has only part of — label, how many, of how many. */
  datasetGaps: { label: string; have: number; total: number }[];
  /** Records here whose dataset defines a picture for them and which have none. */
  recordsMissingPictures: number;
  /** The Hannibal dataset is here, but was taken before it had pictures. */
  hannibalNeedsPictures: boolean;
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
  // EVERY ANSWER THESE BUTTONS GIVE NEEDS A PLACE THAT IS ALWAYS ON THE PAGE.
  //
  // This was seedError: a string, rendered in exactly three places, each one
  // INSIDE a dataset-offer block that withdraws as soon as its dataset is
  // seeded. On a timeline that has been set up, all three are gone — so
  // seventeen call sites wrote their answer into a variable nothing displayed.
  // A failed "Add the Lemuria dataset" said nothing. "Check for corrections"
  // said nothing. The buttons looked broken because, from the outside, they
  // were.
  //
  // The picture check was fixed by giving it its own panel, and that fixed one
  // button out of seventeen. This is the same fix made once, for all of them:
  // one report, one place, stays until dismissed.
  //
  // A TONE, because not every answer is a failure. "Put back 2 missing records"
  // rendered in danger red was the other half of the same bug.
  const [seedReport, setSeedReport] = useState<{ tone: "error" | "note"; text: string } | null>(null);
  // Kept as functions with the old name so the sixteen error call sites read
  // exactly as they did, and so adding a button cannot accidentally reintroduce
  // a string with nowhere to go.
  const setSeedError = (text: string) => setSeedReport({ tone: "error", text });
  const setSeedNote = (text: string) => setSeedReport({ tone: "note", text });
  const seedReportRef = useRef<HTMLDivElement | null>(null);
  // Once per report, not once per render. See the ref on the panel below.
  useEffect(() => {
    if (!seedReport) return;
    seedReportRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [seedReport]);
  // THE PICTURE REPORT NEEDS ITS OWN STATE AND ITS OWN PLACE ON THE PAGE.
  // It used to write into seedError, which is only rendered inside three of the
  // dataset-offer blocks — so once those datasets were seeded and their offers
  // withdrew, the report had nowhere to appear and the button looked like it
  // did nothing at all.
  const [pictureReport, setPictureReport] = useState<
    | null
    | { kind: "none" }
    | { kind: "all-good"; checked: number }
    | { kind: "problems"; checked: number; problems: { slug: string; title: string; where: string; detail: string }[] }
    // The failure has to land in the same panel as the answer. Sending it to
    // seedError instead would put it back in the three places that withdraw.
    | { kind: "error"; message: string }
  >(null);
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
  // The band you clicked. A separate slot from `selected` rather than one
  // "thing being read", because a period and an event are different questions
  // and a reader often wants both: which period am I in, and what is this event
  // inside it. Opening one closes the other only where that would be confusing
  // — see selectPeriod.
  // THE ID, NOT THE OBJECT. Holding the period itself meant holding a copy that
  // went stale the moment the server sent a newer one — the same bug the event
  // panel had after a rename. The id is the thing the reader chose; the period
  // is looked up from the current props on every render, so it cannot be old.
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const periodDetailRef = useRef<HTMLDivElement>(null);

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

  // REVEAL THE RECORD WITHOUT TAKING THE STRIP WITH IT.
  //
  // These both used scrollIntoView({ block: "start" }), which aligns the
  // detail to the top of the viewport and so puts the canvas entirely above
  // the fold — you click a card to look at it and lose the instrument you
  // were reading it on. revealDetailAt works out a position that shows the
  // detail and keeps the strip, and returns null when the page should not
  // move at all. See reveal-detail.ts.
  const reveal = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const target = revealDetailAt({
      detailTop: node.getBoundingClientRect().top + window.scrollY,
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
    });
    if (target !== null) window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const selectedId = selected?.id ?? null;
  useEffect(() => {
    if (!selectedId) return;
    reveal(detailRef.current);
  }, [selectedId, reveal]);

  useEffect(() => {
    if (!selectedPeriodId) return;
    reveal(periodDetailRef.current);
  }, [selectedPeriodId, reveal]);

  const periodsById = useMemo(() => new Map(periods.map((period) => [period.id, period])), [periods]);
  const selectedPeriod = selectedPeriodId ? periodsById.get(selectedPeriodId) ?? null : null;

  /** Which periods this one is joined to, and which way round. */
  const relatedPeriods = useMemo(() => {
    if (!selectedPeriod) return [];
    const out: { period: PeriodWithClaims; relation: "contains" | "related"; direction: "parent" | "child" }[] = [];
    for (const link of periodLinks) {
      if (link.from_period_id === selectedPeriod.id) {
        const other = periodsById.get(link.to_period_id);
        if (other) out.push({ period: other, relation: link.relation, direction: "child" });
      } else if (link.to_period_id === selectedPeriod.id) {
        const other = periodsById.get(link.from_period_id);
        if (other) out.push({ period: other, relation: link.relation, direction: "parent" });
      }
    }
    return out;
  }, [selectedPeriod, periodLinks, periodsById]);

  // PERIODS ARE SEARCHABLE BY NAME AND BY ALIAS. "Age of Dinosaurs" and
  // "Mesozoic Era" are one period, and a reader who types either should land on
  // it — not on nothing, and not on a second period somebody created because
  // the search came up empty.
  const periodResults = useMemo(
    () => (term.trim().length >= 2 ? periods.filter((period) => periodMatches(period, term)) : []),
    [periods, term]
  );

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
    // Jump to the first claim that is actually somewhere. An event whose only
    // claims are positionless has nowhere to jump to, so the strip stays put
    // and the record simply opens.
    const position = event.claims.map(claimMidpoint).find((midpoint) => midpoint != null) ?? null;
    if (position != null) {
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
            // No position, never in the window — the same answer the server's
            // own start_position filter gives, so the list and the strip agree.
            if (!interval) return false;
            return interval.hi >= view.from && interval.lo <= view.to;
          })
      ),
    [events, matchesFilters, view.from, view.to]
  );
  // EVERY SPAN THE RAIL OFFERS, IN ONE ASCENDING SEQUENCE.
  //
  // Three kinds of jump — this community's own extent, the named eras, and the
  // look-backs from today — sorted together by how much time each one puts on
  // screen. Sorting them as one list is the whole of the fix: separately they
  // each ascended and the rail restarted in the middle.
  const spanCards = useMemo(() => {
    const cards: {
      key: string;
      span: number;
      caption: string;
      window: TimeWindow;
      accent?: boolean;
      icon?: React.ReactNode;
      /** Where plain `setView(window)` is not quite what this card should do. */
      onSelect?: () => void;
    }[] = [];

    if (extent) {
      cards.push({
        key: "whole",
        span: Math.max(1, extent.to - extent.from),
        caption: "Whole timeline",
        window: { from: extent.from, to: extent.to },
        accent: true,
        icon: <Maximize2 className="h-4 w-4" />,
        // Padded, and it leaves Compare mode — framing everything is a
        // different intention from jumping to a span.
        onSelect: fitEverything,
      });
    }

    for (const jump of TIMELINE_JUMPS) {
      cards.push({
        key: `jump-${jump.key}`,
        span: jump.window.to - jump.window.from,
        caption: jump.label,
        window: jump.window,
      });
    }

    for (const years of LOOKBACK_SPANS) {
      const span = lookbackWindow(years);
      cards.push({
        key: `back-${years}`,
        span: years,
        // Both ends, so a look-back card is recognisable as one without a
        // heading over it — they all finish just past today and only the reach
        // back changes.
        caption: `${formatYear(Math.floor(span.from), { compact: true })} – ${LOOKBACK_END_YEAR}`,
        window: span,
      });
    }

    return cards.sort((a, b) => a.span - b.span);
  }, [extent, fitEverything]);

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

          {/* PERIODS FIRST IN THE RESULTS, and marked as periods. A reader who
              types "Bronze Age" wants the frame, not the eleven events with
              "bronze" in them — and showing a period in the same list as the
              events without saying which is which would teach that they are the
              same kind of thing. */}
          {searching && periodResults.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
              {periodResults.map((period) => (
                <li key={period.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPeriodId(period.id);
                      const extent = periodExtent(period, presentPosition());
                      if (extent) setView(clampWindow({ from: extent.from, to: extent.to }));
                      setTerm("");
                    }}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-muted"
                  >
                    <Layers className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{period.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {periodTypeLabel(period.period_type)}
                        {period.aliases.length > 0 ? ` · also called ${period.aliases.join(", ")}` : ""}
                        {periodRegions(period).length > 1
                          ? ` · ${periodRegions(period).length} regional boundaries`
                          : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {activeResults && activeResults.length > 0 && (
                <li className="border-t border-border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Events
                </li>
              )}
              {(activeResults ?? []).map((event) => {
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

          {periodResults.length === 0 && activeResults && activeResults.length > 0 && (
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
          {activeResults && activeResults.length === 0 && periodResults.length === 0 && (
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

          ONE ROW, ONE SEQUENCE, SHORTEST FIRST. These used to be two rails with
          a rule between them — the named eras, then the look-backs from today —
          each ascending on its own and therefore starting over halfway along.
          Reading left to right you went 70, 560, 1,100 … 13.9 billion, and then
          back to 2,000. The grouping was real (an era is a PLACE in time, a
          look-back is a DEPTH from now) and it was not worth the reader losing
          their place: a rail of numbers that counts up and then restarts is a
          rail nobody trusts to be in any order at all.

          So it is one continuous zoom out, whatever kind each card is, and the
          kind shows in the caption underneath rather than in the arrangement. */}
      <div className="-mx-4 mb-3 flex w-0 min-w-full gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {spanCards.map((card) => (
          <SpanCard
            key={card.key}
            accent={card.accent}
            icon={card.icon}
            {...durationParts(card.span)}
            caption={card.caption}
            active={matchesWindow(card.window)}
            onClick={card.onSelect ?? (() => setView(card.window))}
          />
        ))}
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
          periods={periods}
          selectedPeriodId={selectedPeriod?.id ?? null}
          onSelectPeriod={(period) => setSelectedPeriodId((current) => (current === period.id ? null : period.id))}
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

        {/* THE LIMITS OF THE DATASET, WHERE SOMEBODY READING IT WILL SEE THEM.
            Not tucked into staff tools: which regions are missing, and why, is
            part of what this timeline means rather than a maintenance note. */}
        <Link
          href={`/c/${communitySlug}/timeline/coverage`}
          className="hidden items-center gap-1.5 rounded-full bg-muted/60 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <Globe2 className="h-4 w-4" />
          What this covers
        </Link>

        {/* COMPARING BY CONTENT, because most of these records have no date to
            compare by. The link sits beside the coverage one: both are about
            reading the dataset as a whole rather than one record in it. */}
        <Link
          href={`/c/${communitySlug}/timeline/comparison`}
          className="hidden items-center gap-1.5 rounded-full bg-muted/60 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <Scale className="h-4 w-4" />
          Compare the traditions
        </Link>

        <Link
          href={`/c/${communitySlug}/timeline/map`}
          className="hidden items-center gap-1.5 rounded-full bg-muted/60 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <MapPin className="h-4 w-4" />
          Where these are
        </Link>
      </div>

      {/* ---- The event you clicked -----------------------------------------
          Inline, under the strip, rather than in a drawer over the top of it.
          A panel that covers the timeline hides the very thing the event needs
          to be read against — what else was happening then — and on a phone it
          took the whole screen. Here the strip stays visible above it, so the
          marker you clicked is still in view while you read what it is. */}
      {/* ---- The band you clicked ------------------------------------------
          Above the event panel, because it is the wider frame: if both are
          open, the reader is looking at an event inside a period and that is
          the order they want to read them in. */}
      {selectedPeriod && (
        <div ref={periodDetailRef} className="mt-5 scroll-mt-4">
          <PeriodDetail
            period={selectedPeriod}
            periods={periods}
            related={relatedPeriods}
            events={events}
            sources={sources}
            citations={citations}
            onClose={() => setSelectedPeriodId(null)}
            onShowContext={(from, to) => setView(clampWindow({ from, to }))}
            onSelectPeriod={(next) => setSelectedPeriodId(next.id)}
            onSelectEvent={setSelected}
          />
        </div>
      )}

      {selected && (
        <div ref={detailRef} className="mt-5 scroll-mt-4 rounded-xl border border-border bg-card p-5 sm:p-6">
          <EventDetail
            event={selected}
            sources={sources}
            citations={citations}
            links={eventLinks}
            linkedRecords={linkedRecords}
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
      {isStaff && (!hasHannibal || hannibalNeedsPictures) && (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground">
            {hasHannibal ? "The Hannibal dataset is missing its pictures" : "Add the Hannibal dataset?"}
          </p>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {hasHannibal ? (
              <>
                Its events were added before the pictures were part of it. Bring them in and six of them gain a
                picture — a Barcid coin, the disputed bust from Capua, Turner&rsquo;s storm, the woodcut that invented
                the elephants-in-the-snow image — each copied into this community&rsquo;s own storage, with the
                creator and licence in the caption, and each captioned for what it actually is rather than as
                evidence.
              </>
            ) : (
              <>
                Seventeen events from the Second Punic War — Hannibal&rsquo;s birth, the oath, Saguntum, the Alps,
                Cannae, the march on Rome — built to show how historical knowledge is actually assembled:
                contemporary objects, a near-contemporary witness, two ancient histories that disagree, later legend,
                and modern scholarship, each kept apart and labelled. Where the ancient sources give different
                numbers, both numbers are shown.
              </>
            )}
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
            {seedingHannibal
              ? "Working…"
              : hasHannibal
                ? "Bring the Hannibal pictures in"
                : "Add the Hannibal dataset"}
          </Button>
        </div>
      )}

      {/* ---- The other ready-made datasets ------------------------------------
          The same idea as the Hannibal set, asked of periods with no texts at
          all: every date is an inference from teeth, magnetised rock, isotopes,
          pigment or DNA, and several of the records sit nowhere near each other
          on the strip because the evidence puts them where it puts them. */}
      {isStaff && !hasDeepTime && (
        <DatasetOffer
          title="Add the deep time dataset?"
          busyLabel="Adding the records…"
          label="Add the deep time dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedDeepTimeDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Ten records from the Middle Pleistocene — Homo heidelbergensis, Acheulean handaxes, Boxgrove, the ice age
          cycles, the Neanderthal divergence, the Brunhes&ndash;Matuyama magnetic reversal. There are no texts from any
          of it, so every date is an inference from teeth, magnetised rock, ocean isotopes or DNA, and where the
          specialists disagree by a quarter of a million years the disagreement is shown rather than averaged away.
        </DatasetOffer>
      )}



      {isStaff && !hasEarlySapiens && (
        <DatasetOffer
          title="Add the early Homo sapiens dataset?"
          busyLabel="Adding the records…"
          label="Add the early Homo sapiens dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedEarlySapiensDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Five records from around a hundred thousand years ago — Qafzeh, ochre, shell beads, the Neanderthals next
          door, and the burials. Built to separate what was dug up from what it is taken to mean: a body in a pit with
          two antlers on its chest is an observation, and a funeral is an interpretation, and this dataset never lets
          the second be printed as the first.
        </DatasetOffer>
      )}

      {isStaff && !hasPeriods && (
        <DatasetOffer
          title="Add the time periods?"
          busyLabel="Adding the periods…"
          label="Add the time periods"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedTimePeriods(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Fifteen named stretches of time, drawn as quiet bands behind the events — the Mesozoic, the Bronze Age, the
          Middle Palaeolithic, the medieval period. Each one says what KIND of name it is: a geological era ratified by
          a standards body is a different sort of thing from a convention archaeologists use differently in every
          region, and a strip that draws them identically teaches otherwise. None of them has a date. They have
          boundary claims — the Iron Age has six, one per region, more than a thousand years apart — and you can open
          any band to see who put the boundary there and why.
        </DatasetOffer>
      )}

      {isStaff && !hasAtlantis && (
        <DatasetOffer
          title="Add the Atlantis dataset?"
          busyLabel="Adding the records…"
          label="Add the Atlantis dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedAtlantisDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Twelve proposed dates for the destruction of Atlantis, two hundred thousand years apart — Plato, Donnelly,
          Scott-Elliot, Cayce, Steiner, Gurdjieff, the Younger Dryas correlation and the Minoan identifications. The
          entry takes no view on whether Atlantis existed. What it teaches is the difference between a date that is
          written in a source, a date somebody calculated from a source, and a date that exists only as a remembered
          remark — and Plato&apos;s famous 9600 BCE turns out to be the second of those. The mainstream academic
          position comes with it, in full, on the one record here that can actually be dated.
        </DatasetOffer>
      )}

      {isStaff && !hasLemuria && (
        <DatasetOffer
          title="Add the Lemuria dataset?"
          busyLabel="Adding the records…"
          label="Add the Lemuria dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedLemuriaDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Thirteen records on two clocks at once. Sclater proposed Lemuria in 1864 to explain lemurs — no people, no
          civilisation — and Theosophy took the word twenty-four years later and put a root race behind it, 34½ million
          years back. Every claim here carries BOTH dates: when somebody said it, and when they say it happened. Zoom
          out far enough to see the claims and you can no longer see the claimants, which is the lesson. The geology
          that actually answers Sclater&apos;s question is here too — Gondwana, the India&ndash;Madagascar split, and
          the genuinely sunken continental crust under Mauritius, correctly dated and correctly described.
        </DatasetOffer>
      )}

      {isStaff && !hasCosmology && (
        <DatasetOffer
          title="Add the beginning of the universe?"
          busyLabel="Adding the records…"
          label="Add the cosmology dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedCosmologyDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          The hardest record here, and the one that changed what this timeline can hold: one of the serious answers is
          that there is no date. The classical Steady State model of Bondi, Gold and Hoyle says the universe has no
          finite beginning — a claim made in named papers, not a date nobody has found — so it is stored as a claim
          with no position and is not drawn on the strip, because it claims none. Beside it sit Planck&apos;s two
          measured ages (they differ, and both are shown), the cyclic models that put something before the Big Bang,
          the Hindu cycles as LENGTHS rather than dates, and Ussher&apos;s 4004 BCE — which the Bible does not say and
          Ussher calculated. Every claim names what it dates, because the age of cosmic expansion and the creation of
          the world are different propositions and stacking them as rival figures would be the lie.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodPhysical && (
        <DatasetOffer
          title="Add the ice age floods and sea level?"
          busyLabel="Adding the records…"
          label="Add the ice age floods dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodPhysicalDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          The floods that actually happened, dated from ice and rock — and seeded before any flood tradition, on
          purpose, because a physical event that exists as the explanation for a story has already been bent to fit
          it. Meltwater Pulse 1A raised the sea fourteen metres in under 350 years; the Missoula floods were forty or
          more, not one; Meltwater Pulse 1B may not have happened at all, and both sides of that argument are here.
          Every date is stored as its sources publish it — years before 1950 — because &ldquo;14,650 years ago&rdquo;
          is 12,700 BCE and not 14,650 BCE, and the 1,949-year difference is enough to manufacture a correlation out
          of nothing. The Bonneville flood carries the same lesson in a different unit: its famous
          &ldquo;14,500 years ago&rdquo; is a radiocarbon age, and the calendar age is three thousand years older.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodMesopotamia && (
        <DatasetOffer
          title="Add the Mesopotamian flood traditions?"
          busyLabel="Adding the records…"
          label="Add the flood traditions dataset"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodMesopotamiaDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Eight records on three clocks. None of the Mesopotamian flood texts gives a date, so none is assigned one:
          Utnapishtim&apos;s story says only &ldquo;before&rdquo;, the tablets it survives on are seventh century BCE,
          and the flood deposit at Shuruppak around 2900 BCE is something people have PROPOSED it remembers — three
          different kinds of statement, kept as three. The excavations are here too, and they carry the best lesson in
          the set: in one season in 1929, Ur and Kish each announced a flood layer and each identified it with Genesis,
          and the two are not even contemporary with each other. And Genesis gives no year at all — Ussher&apos;s 2348
          BCE is the Masoretic count, the Septuagint gives about 3298 BCE, and the Samaritan text is here without a
          year because none could be verified.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodEurasia && (
        <DatasetOffer
          title="Add the Greek, Indian and Iranian traditions?"
          busyLabel="Adding the records…"
          label="Add these flood traditions"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodEurasiaDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Six records, each breaking a different assumption. GREECE has a precise ancient date for Deucalion&apos;s
          flood — 1528/27 BCE — assigned by an unknown compiler on a marble slab twelve centuries later, and Plato has
          an Egyptian priest telling Solon the Greeks remember one deluge when there were many. INDIA shows a tradition
          changing: in the oldest surviving version the fish that saves Manu is just a fish, and its identification
          with Viṣṇu is a later development with a record of its own. IRAN is the stress case — Yima is warned, builds
          an enclosure and preserves the best of every living kind, which is the whole shape of a flood story with no
          flood in it. The catastrophe is a killing winter, and this timeline will not call it a deluge even though the
          standard English translation&apos;s own chapter heading does.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodRegions && (
        <DatasetOffer
          title="Add North America, the Pacific and northern Europe?"
          busyLabel="Adding the records…"
          label="Add these traditions"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodRegionsDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Six records that break the last assumptions. The Haudenosaunee Sky Woman account has NO FLOOD IN IT — the
          world below was always water, nothing is destroyed and land is made rather than uncovered — and compendia
          file it as a flood myth and then count it as evidence that flood stories are universal. The Anishinaabe
          account shares its earth-diver shape and stays a separate record, because a shared shape stops being a
          finding the moment two nations are merged to display it. In the Norse account the frost giants drown in
          Ymir&apos;s blood and there are no people in the story at all. The Māori flood is prayed for, by people, to
          settle an argument about doctrine. The Hawaiian one is a rising sea in the native historians and closer to
          Genesis in a collector who drew Christian material into Hawaiian genealogy. And the last record is about the
          evidence itself: fewer than two dozen sub-Saharan African traditions appear in the standard indexes, and
          Frazer said there were none — which is a fact about collecting, not about Africa.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodAmericas && (
        <DatasetOffer
          title="Add the Mesoamerican and Andean traditions?"
          busyLabel="Adding the records…"
          label="Add these flood traditions"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodAmericasDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          Four records, and not one of them dates a flood — because not one of the sources does. The Popol Vuh&apos;s
          wooden people are not humanity: they are a failed attempt at it, destroyed because they could not speak the
          names of their makers, and the survivors became monkeys. The Aztec Fourth Sun ends in water, and the Leyenda
          de los Soles gives a real elapsed count — four hundred years, two ages and seventy-six — anchored to nothing
          that can be converted. In the Huarochirí account a llama warns its owner, the refuge is a mountain already
          crowded with animals, nobody is chosen and there is no ark. That manuscript was compiled around 1608 by
          indigenous assistants working for a judge in the campaign to destroy the beliefs he was having written down,
          and its own redactor notes that Christians read it as Noah&apos;s flood &ldquo;but they believe it was Villca
          Coto mountain that saved them&rdquo;. The circumstances are their own dated record.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodSubmerged && (
        <DatasetOffer
          title="Add the drowned lands, and the coasts people remember?"
          busyLabel="Adding the records…"
          label="Add the drowned lands"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodSubmergedDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          The same question from both ends. Doggerland, the Sunda Shelf and the floor of the Persian Gulf were land and
          are not — measurements, dated by seismic survey and radiocarbon, and drowned over thousands of years rather
          than in an afternoon. Against them, two South Australian accounts: the Ngarrindjeri Ngurunderi narrative, in
          which Backstairs Passage could be walked, and the Narungga account of Spencer Gulf as marshy country with
          freshwater lagoons. A published method reads each for the water depth that would make it literally true and
          dates THAT — which is not the same as dating the story, and the difference is the whole record. Every account
          carries two claims kept apart: when the water rose, which is geology, and that the telling remembers it,
          which is a proposal most scientists doubt. The nations stay distinct; there is no &ldquo;Aboriginal flood
          myth&rdquo; here and there will not be one.
        </DatasetOffer>
      )}

      {isStaff && !hasFloodChina && (
        <DatasetOffer
          title="Add the Chinese Great Flood?"
          busyLabel="Adding the records…"
          label="Add the Chinese flood records"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await seedFloodChinaDataset(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          The sharpest case in the flood material, because the argument is in the journals. In 2016 Science published a
          paper placing an outburst flood at Jishi Gorge around 1920 BCE and identifying it as the flood Yu controlled —
          and Science then published a Comment arguing the events are not even contemporary. Both are here, because
          seeding one would turn a live dispute into a finding. The tradition is also a different shape from every
          other on this timeline: no ark, no chosen survivor, no end of humanity. Gun fails by damming the water and Yu
          succeeds by giving it a path to the sea, and the moral is about method.
        </DatasetOffer>
      )}

      {/* ---- Are the pictures actually there? --------------------------------
          A picture is added by writing a URL into a file, and nobody can tell
          whether it resolves until somebody opens the record. A broken one is
          silent: the page renders, the layout holds, and a grey box sits where
          a photograph should be. This asks. It changes nothing. */}
      {isStaff && (
        <DatasetOffer
          title="Check the pictures?"
          busyLabel="Asking every picture…"
          label="Check every picture"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                setPictureReport(null);
                const result = await checkTimelinePictures(communitySlug);
                if (result && "error" in result) setPictureReport({ kind: "error", message: result.error });
                else if (result && "checked" in result) {
                  if (result.checked === 0) setPictureReport({ kind: "none" });
                  else if (result.problems.length === 0)
                    setPictureReport({ kind: "all-good", checked: result.checked });
                  else setPictureReport({ kind: "problems", checked: result.checked, problems: result.problems });
                }
                resolve();
              });
            })
          }
        >
          {recordsMissingPictures > 0 && (
            <span className="mb-3 block rounded-lg border-l-4 border-l-danger bg-danger/5 p-3 text-foreground">
              <span className="block font-semibold">
                {recordsMissingPictures === 1
                  ? "One record here has a picture available that it never received."
                  : `${recordsMissingPictures} records here have a picture available that they never received.`}
              </span>
              <span className="mt-1 block">
                Pictures were added to these datasets after most communities had already taken them, and the card that
                offers a dataset withdraws once you have it — so there was nowhere to press. Use{" "}
                <span className="font-medium">Check for corrections</span>, below, which now fills them in. Checking
                the pictures will not: it only tests the ones that are here.
              </span>
            </span>
          )}
          Every picture on every record here, fetched from the server to see whether it still answers. Nothing is
          changed and nothing is removed — the report names the records so a broken one can be fixed or dropped
          deliberately. A picture that answers with an error page rather than an image is reported too, because that
          is what a renamed file looks like and a status check alone would call it healthy.
        </DatasetOffer>
      )}

      {/* THE ANSWER, WHERE THE QUESTION WAS ASKED. It stays until dismissed:
          a report that vanishes on the next render is indistinguishable from a
          button that does nothing, which is exactly how this read before. */}
      {isStaff && pictureReport && (
        <div className="mt-3 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Picture check
            </h3>
            <button
              type="button"
              onClick={() => setPictureReport(null)}
              aria-label="Dismiss the picture check"
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {pictureReport.kind === "error" && (
            <p className="mt-2 text-sm text-danger">
              <span className="font-medium">The check could not run.</span> {pictureReport.message}
            </p>
          )}

          {pictureReport.kind === "none" && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">No pictures to check.</span> Nothing on this timeline has
              an image yet — so there is nothing broken, and nothing missing that was expected.
            </p>
          )}

          {pictureReport.kind === "all-good" && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                All {pictureReport.checked} {pictureReport.checked === 1 ? "picture" : "pictures"} load.
              </span>{" "}
              Each was asked for from the server and answered with an image.
            </p>
          )}

          {pictureReport.kind === "problems" && (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {pictureReport.problems.length} of {pictureReport.checked} did not load.
                </span>{" "}
                Nothing has been changed — this is a report.
              </p>

              {/* WHEN EVERY PICTURE FAILS THE SAME WAY, THE PICTURES ARE NOT
                  THE PROBLEM. A server behind a proxy that refuses outbound
                  requests answers 403 for every URL alike, and the honest
                  report then names twelve healthy records as broken — which
                  sends somebody editing good data to fix a network. Twelve
                  files going bad at once in identical fashion is not what
                  rot looks like; a blocked server is exactly what it looks
                  like, so say so before the list rather than after it. */}
              {pictureReport.problems.length === pictureReport.checked &&
                pictureReport.checked > 2 &&
                new Set(pictureReport.problems.map((problem) => problem.detail)).size === 1 && (
                  <p className="mt-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Read this before editing anything.</span> Every
                    picture failed in the same way — {pictureReport.problems[0].detail}. That is what a server which
                    cannot reach the internet looks like, not what {pictureReport.checked} separately broken
                    addresses look like. Check whether this server is allowed to make outbound requests before
                    changing any record below.
                  </p>
                )}
              <ul className="mt-3 space-y-2">
                {pictureReport.problems.map((problem, index) => (
                  <li key={`${problem.slug}-${index}`} className="text-sm">
                    <a
                      href={`/c/${communitySlug}/timeline/${problem.slug}`}
                      className="font-medium text-foreground hover:text-accent hover:underline"
                    >
                      {problem.title}
                    </a>
                    <span className="text-muted-foreground">
                      {" "}
                      — {problem.where === "cover" ? "cover image" : "picture"}: {problem.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* ---- Bringing a dataset that is already here up to date --------------
          The seeders skip an event that already exists, which is what makes
          running one twice harmless — and also means a correction to a seed
          file never reaches a community that took the dataset earlier. This is
          the way back. Offered to staff whenever this community has any seeded
          records at all; pressing it on an up-to-date community says so and
          changes nothing. */}
      {isStaff && (hasShowcase || hasHannibal || hasDeepTime || hasEarlySapiens || hasAtlantis || hasLemuria || hasCosmology || hasFloodPhysical || hasFloodMesopotamia || hasFloodEurasia || hasFloodChina) && (
        <DatasetOffer
          title="Bring the seeded datasets back up to date?"
          busyLabel="Checking the records…"
          label="Check for corrections"
          onAdd={() =>
            new Promise<void>((resolve) => {
              startSeed(async () => {
                const result = await refreshSeededDatasets(communitySlug);
                if (result && "error" in result) setSeedError(result.error);
                else if (result && "updated" in result) {
                  // Two different repairs, reported separately: a date that was
                  // WRONG and has been corrected, and a connection that was
                  // MISSING and has been added. Rolling them into one number
                  // would tell a reader their dates had changed when nothing of
                  // the sort had happened.
                  const parts: string[] = [];
                  // RESTORED RECORDS COME FIRST AND ARE NAMED. A number alone
                  // would tell somebody their timeline had changed without
                  // telling them how — and if they removed one of these on
                  // purpose, seeing its name is how they find out it is back.
                  if (result.restored > 0) {
                    parts.push(
                      `Put back ${result.restored} missing ${result.restored === 1 ? "record" : "records"}: ${result.restoredTitles.join(", ")}.`
                    );
                  }
                  if (result.pictured > 0) {
                    parts.push(
                      `Added ${result.pictured} ${result.pictured === 1 ? "picture" : "pictures"} to records that had none.`
                    );
                  }
                  // SAY THAT MORE ARE COMING, or the run looks like it failed
                  // halfway. Each press brings in a fixed number so the request
                  // always finishes; the rest wait for the next one.
                  if (result.picturesStillMissing > 0) {
                    parts.push(
                      `${result.picturesStillMissing} more ${
                        result.picturesStillMissing === 1 ? "record is" : "records are"
                      } still waiting for pictures — press this again to continue.`
                    );
                  }
                  if (result.updated > 0) {
                    parts.push(
                      `Updated ${result.updated} ${result.updated === 1 ? "date" : "dates"}${
                        result.changed.length > 0 ? ` on ${result.changed.join(", ")}` : ""
                      }.`
                    );
                  }
                  if (result.linked > 0) {
                    parts.push(
                      `Added ${result.linked} ${result.linked === 1 ? "connection" : "connections"} between records.`
                    );
                  }
                  // "Nothing changed" is the headline whenever nothing did —
                  // the kept count goes after it rather than standing alone,
                  // which read as though something had happened.
                  if (parts.length === 0) parts.push("Nothing needed changing — every seeded record here already matches.");
                  if (result.classified > 0) {
                    parts.push(
                      `Classified ${result.classified} ${result.classified === 1 ? "picture" : "pictures"} by what they show.`
                    );
                  }
                  if (result.keptBecauseEdited > 0) {
                    parts.push(
                      result.keptBecauseEdited === 1
                        ? "1 date was left alone because somebody here had edited it."
                        : `${result.keptBecauseEdited} dates were left alone because somebody here had edited them.`
                    );
                  }
                  setSeedNote(parts.join(" "));
                }
                setReloadToken((token) => token + 1);
                router.refresh();
                resolve();
              });
            })
          }
        >
          {datasetGaps.length > 0 && (
            <span className="mb-3 block rounded-lg border-l-4 border-l-danger bg-danger/5 p-3 text-foreground">
              <span className="block font-semibold">
                {datasetGaps.length === 1
                  ? "One dataset here is incomplete."
                  : `${datasetGaps.length} datasets here are incomplete.`}
              </span>
              <span className="mt-1 block">
                {datasetGaps.map((gap) => `${gap.label} (${gap.have} of ${gap.total})`).join(", ")}.
              </span>
              <span className="mt-1 block">
                A dataset&apos;s own card disappears as soon as any one of its records exists, so a run that stopped
                partway leaves a timeline that looks finished and is not. Pressing the button below adds exactly the
                missing records and nothing else.
              </span>
            </span>
          )}
          Research does not stop when a dataset ships. When a seeded date turns out to rest on something different from
          what the file first said — as Steiner&apos;s 7227 BC did, which is counted back from a boundary he gives
          rather than stated by him — the correction cannot reach a community that already took the dataset, because
          the seeders deliberately never overwrite what is already there. This checks. It updates only the wording,
          method, evidence and source of dates it can match exactly, it never adds or removes a date, and it leaves
          untouched anything anybody here has edited. It also adds any CONNECTIONS BETWEEN RECORDS the dataset has
          gained since — who said Mu and Lemuria were the same place, and which tradition puts which continent first —
          because those arrived after both datasets had already shipped.
          {" "}
          <strong className="font-semibold text-foreground">
            It also puts back any record from a dataset you have that has since gone missing.
          </strong>{" "}
          The card that offers a dataset withdraws once you have taken it, so until now a record deleted afterwards
          could not be added again from anywhere in the app. Anything restored is named in the result, so if you
          removed one on purpose you can see it is back and remove it again.
        </DatasetOffer>
      )}

      {/* WHAT THE LAST BUTTON SAID. One place, always on the page, stays until
          dismissed. Before this existed the answer was written into a variable
          rendered only inside offers that withdraw once their dataset is
          seeded, so on a set-up timeline every one of these buttons was silent.
          Placed with the offers rather than at the top of the page because this
          is where the button that produced it is. */}
      {isStaff && seedReport && (
        <div
          // A message below the fold is a message nobody reads, which is the
          // failure this panel exists to fix — so it brings itself into view.
          // ONCE. This was an inline callback ref, and React calls one of
          // those on every render, not just on mount: while a report was
          // showing, every re-render dragged the page back down to it and the
          // reader could not scroll away. The effect below runs on the report
          // itself changing, which is the thing worth reacting to.
          ref={seedReportRef}
          className={cn(
            "mt-3 rounded-xl border p-4 sm:p-5",
            seedReport.tone === "error" ? "border-danger/40 bg-danger/5" : "border-border bg-card"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p
              className={cn(
                "text-sm",
                seedReport.tone === "error" ? "font-medium text-danger" : "text-foreground"
              )}
            >
              {seedReport.text}
            </p>
            <button
              type="button"
              onClick={() => setSeedReport(null)}
              aria-label="Dismiss this message"
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
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
