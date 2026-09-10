"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Layers,
  List,
  ListOrdered,
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
import type { TimelineSource, TimelineTrack } from "@/types/database";
import type { TimelineEventWithClaims, TimelineFilters } from "@/lib/data/timeline";
import { TimelineCanvas } from "./timeline-canvas";
import { CompareLanes } from "./compare-lanes";
import { TimelineList } from "./timeline-list";
import { WholeTimeline } from "./whole-timeline";
import { SpanRuler } from "./span-ruler";
import { EventDetail } from "./event-detail";
import { AddEventFlow } from "./add-event-flow";
import {
  loadTimelineEvent,
  loadTimelineWindow,
  loadWholeTimeline,
  searchTimeline,
  seedStarterTracks,
  type TimelineWindowPayload,
} from "./actions";
import { TIMELINE_CATEGORIES, CHRONOLOGIES, TIMELINE_SOURCE_TYPES, timelineCategory } from "@/lib/timeline/taxonomy";
import {
  claimHeadline,
  claimMidpoint,
  presentPosition,
  windowAround,
  zoomWindow,
  TIMELINE_JUMPS,
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

// "whole" is the third way of looking at the same events: not a window onto
// time but all of it, in order, on one page — for reading through, checking
// over, or printing at the end of term.
type Mode = "timeline" | "compare" | "whole";

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

export function TimelineView({
  communitySlug,
  initialEvents,
  initialWindow,
  initialTotal,
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
  // Everything, loaded once and kept. Null until the button is first pressed:
  // a read that ignores the window is exactly the read the window exists to
  // avoid, so nobody pays for it who hasn't asked.
  const [whole, setWhole] = useState<TimelineWindowPayload | null>(null);
  const [loadingWhole, setLoadingWhole] = useState(false);
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
  const requestId = useRef(0);
  useEffect(() => {
    const id = ++requestId.current;
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const payload = await loadTimelineWindow(communitySlug, view.from, view.to, filters);
        // A slow response for a window the reader has already left must not
        // overwrite a fast one for the window they are in.
        if (id !== requestId.current) return;
        setEvents(payload.events);
        setTruncated(payload.truncated);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, REFETCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [communitySlug, view.from, view.to, filters, reloadToken]);

  // Re-read the lot whenever it is being shown and the filters change, so
  // "whole timeline" always means "everything you asked to see" rather than
  // whatever was true the first time the button was pressed.
  const wholeRequestId = useRef(0);
  useEffect(() => {
    if (mode !== "whole") return;
    const id = ++wholeRequestId.current;
    // Deferred like the window loader above, so the spinner state is set from a
    // callback rather than synchronously in the effect body — a setState in the
    // body cascades a render before the fetch has even started.
    const handle = setTimeout(async () => {
      setLoadingWhole(true);
      try {
        const payload = await loadWholeTimeline(communitySlug, filters);
        if (id !== wholeRequestId.current) return;
        setWhole(payload);
      } finally {
        if (id === wholeRequestId.current) setLoadingWhole(false);
      }
    }, 0);
    return () => clearTimeout(handle);
  }, [mode, communitySlug, filters, reloadToken]);

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

  const visible = pendingOnly ? events.filter((event) => event.status === "pending") : events;
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

      {/* ---- Search ------------------------------------------------------ */}
      <div className="relative mb-3">
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
      <div className="-mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
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

      <div className="mb-3 flex flex-wrap items-center gap-2">
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
              { key: "whole", label: "Whole timeline", icon: ListOrdered },
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

      {/* ---- How much time is on screen ------------------------------------
          Above the strip in both windowed modes, and absent from "whole",
          where the answer is "all of it" and a measurement of the view would
          be measuring nothing. */}
      {mode !== "whole" && <SpanRuler window={view} />}

      {/* ---- The timeline itself ------------------------------------------ */}
      {mode === "whole" ? (
        <WholeTimeline
          payload={whole}
          loading={loadingWhole}
          filtered={activeFilterCount > 0}
          onSelect={setSelected}
          selectedId={selected?.id ?? null}
        />
      ) : mode === "timeline" ? (
        // ONE canvas, sized by a class. A phone gets a shorter strip for the
        // SHAPE of time and the list below for actually reaching an event, so
        // nobody is asked to hit a four-pixel dot — but it is the same strip,
        // not a second copy of it in the DOM.
        <TimelineCanvas
          events={displayed}
          window={view}
          onWindowChange={setView}
          present={presentPosition()}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          loading={loading}
          truncated={truncated}
          className="h-[260px] sm:h-[440px]"
        />
      ) : (
        <CompareLanes
          tracks={tracks}
          selectedTrackIds={compareTrackIds}
          events={displayed}
          window={view}
          onWindowChange={setView}
          onSelect={setSelected}
          selectedId={selected?.id ?? null}
        />
      )}

      {/* ---- Zoom rail -----------------------------------------------------
          Nothing to zoom when the page is already showing everything, so the
          rail and the era jumps go away rather than sitting there inert. */}
      <div className={cn("mt-3 flex flex-wrap items-center gap-2", mode === "whole" && "hidden")}>
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

        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {TIMELINE_JUMPS.map((jump) => (
            <button
              key={jump.key}
              type="button"
              onClick={() => setView(jump.window)}
              className="shrink-0 rounded-full bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {jump.label}
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

      {/* ---- List ----------------------------------------------------------
          Also one list, not two. Always on a phone, where it is the primary way
          in; on a desktop only when asked for, because there the strip is doing
          that job. */}
      <div className={cn("mt-4", mode === "whole" ? "hidden" : showList ? "block" : "block sm:hidden")}>
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

      {/* ---- Detail panel --------------------------------------------------- */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto bg-background p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <EventDetail
              event={selected}
              sources={sources}
              tracks={tracks}
              userId={userId}
              communitySlug={communitySlug}
              canContribute={canContribute}
              isStaff={isStaff}
              onClose={() => {
                setSelected(null);
                setReloadToken((token) => token + 1);
              }}
              onShowContext={(from, to) => {
                setView({ from, to });
                setSelected(null);
              }}
            />
          </div>
        </div>
      )}

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
