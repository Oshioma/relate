"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { layoutTimeline } from "@/lib/timeline/layout";
import {
  axisTicks,
  fractionOf,
  scaleBandFor,
  SCALE_BAND_LABELS,
  clampWindow,
  type TimeWindow,
} from "@/lib/timeline/time";
import { timelineCategory } from "@/lib/timeline/taxonomy";
import { useTimeNavigation } from "./use-time-navigation";

// The map of time.
//
// Everything here is one idea: the window is a range of YEARS, and pixels are
// only ever derived from it. Panning adds to the range, zooming multiplies its
// width, and nothing is ever stored in pixel space — which is why the same code
// works at "the whole of time" and at "March 2026" without a mode switch, and
// why a pinch behaves identically at both.
//
// It is deliberately not a charting library. A generic chart wants a domain it
// can hold in a float and ticks it can space evenly; this needs 13.8 billion
// years and a ruler that changes what it is COUNTING as you go, which is a
// smaller problem to solve directly than to configure around.

const ROW_HEIGHT = 34;
const RULER_HEIGHT = 46;

export function TimelineCanvas({
  events,
  window: view,
  onWindowChange,
  present,
  selectedId,
  onSelect,
  className,
  loading = false,
  truncated = false,
}: {
  events: TimelineEventWithClaims[];
  window: TimeWindow;
  onWindowChange: (next: TimeWindow) => void;
  present: number;
  selectedId: string | null;
  onSelect: (event: TimelineEventWithClaims) => void;
  /** Height comes from a class rather than a number, so one canvas can be short on a phone and tall on a desktop. */
  className?: string;
  loading?: boolean;
  truncated?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Both dimensions are measured rather than passed in, so the strip can be
  // sized by a responsive class and still know how many rows of events it has
  // room for. Rendering a second copy of this component at a different height
  // was the alternative, and it doubled the DOM, the observers and the layout
  // work on every pan.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0].contentRect;
      setSize({ width: box.width, height: box.height });
    });
    observer.observe(element);
    setSize({ width: element.clientWidth, height: element.clientHeight });
    return () => observer.disconnect();
  }, []);

  const width = size.width;
  const rowsAvailable = Math.max(1, Math.floor((size.height - RULER_HEIGHT - 12) / ROW_HEIGHT));
  const layout = useMemo(
    () => layoutTimeline(events, view, width, rowsAvailable),
    [events, view, width, rowsAvailable]
  );

  const ticks = useMemo(
    () => (width > 0 ? axisTicks(view.from, view.to, { target: Math.max(3, Math.round(width / 130)) }) : []),
    [view, width]
  );

  const band = scaleBandFor(view.to - view.from);

  const nav = useTimeNavigation(containerRef, view, onWindowChange);

  const presentX = fractionOf(view, present) * width;
  const showPresent = presentX > -40 && presentX < width + 40;
  const eventsTop = RULER_HEIGHT + 8;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="application"
        aria-label="Timeline. Drag to move through time, pinch or scroll to zoom."
        tabIndex={0}
        onPointerDown={nav.onPointerDown}
        onPointerMove={nav.onPointerMove}
        onPointerUp={nav.onPointerUp}
        onPointerCancel={nav.onPointerUp}
        onKeyDown={nav.onKeyDown}
        onDoubleClick={nav.onDoubleClick}
        className={cn(
          "relative w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-card",
          "cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        {/* Anything after today is a plan or a prediction, not a record. The
            tint says so continuously rather than per-event, so an event's own
            marker doesn't have to carry a badge to be understood. */}
        {showPresent && presentX < width && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 bg-accent-soft/25"
            style={{ left: Math.max(0, presentX), right: 0 }}
          />
        )}

        {/* The ruler. Its labels change what they are counting as you zoom —
            billions of years, then millennia, then decades, then months. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
          {ticks.map((tick) => {
            const x = fractionOf(view, tick.position) * width;
            if (x < -60 || x > width + 60) return null;
            return (
              <div key={tick.position} className="absolute inset-y-0" style={{ left: x }}>
                <div className={cn("h-full w-px", tick.major ? "bg-border" : "bg-border/50")} />
                <span
                  className={cn(
                    "absolute top-2 left-1.5 whitespace-nowrap text-[11px] tabular-nums",
                    tick.major ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {tick.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 border-b border-border" style={{ top: RULER_HEIGHT }} />

        {showPresent && (
          <div className="pointer-events-none absolute inset-y-0" style={{ left: presentX }}>
            <div className="h-full w-px bg-accent" />
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
              Today
            </span>
          </div>
        )}

        {/* Events */}
        {layout.events.map((placed) => {
          const meta = timelineCategory(placed.event.category);
          const selected = placed.event.id === selectedId;
          const top = eventsTop + placed.row * ROW_HEIGHT;
          const pending = placed.event.status === "pending";

          return (
            <div key={placed.event.id} className="absolute" style={{ top, left: 0, right: 0, height: ROW_HEIGHT }}>
              {/* The disagreement itself: a rail spanning every date any source
                  proposes, so "the sources are 220 years apart" is something you
                  SEE before you read it. */}
              {placed.disputed && (
                <div
                  aria-hidden
                  className="absolute top-[11px] h-[3px] rounded-full bg-danger/25"
                  style={{ left: placed.xFrom, width: Math.max(2, placed.xTo - placed.xFrom) }}
                />
              )}

              {placed.claims.map((claim, index) => {
                const barWidth = claim.x2 - claim.x;
                const isBar = barWidth > 3;
                return isBar ? (
                  <div
                    key={claim.id}
                    aria-hidden
                    className={cn(
                      "absolute top-[8px] h-[9px] rounded-full",
                      meta.dotClass,
                      claim.isApproximate ? "opacity-55" : "opacity-85"
                    )}
                    style={{ left: claim.x, width: Math.max(4, barWidth) }}
                  />
                ) : (
                  <div
                    key={claim.id}
                    aria-hidden
                    className={cn(
                      "absolute top-[8px] h-[9px] w-[9px] rounded-full ring-2 ring-card",
                      meta.dotClass,
                      index > 0 && "opacity-70"
                    )}
                    style={{ left: claim.x - 4 }}
                  />
                );
              })}

              <button
                type="button"
                onClick={() => {
                  // A pan that ends over a label must not also open it.
                  if (nav.wasDragged()) return;
                  onSelect(placed.event);
                }}
                title={placed.event.title}
                className={cn(
                  "absolute top-0 flex h-[26px] max-w-[220px] items-center gap-1.5 rounded-full pl-1 pr-2 text-[13px]",
                  "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "bg-accent-soft ring-1 ring-accent"
                )}
                style={{ left: Math.max(0, placed.xTo + 6) }}
              >
                {placed.showLabel && (
                  <>
                    <span className="truncate font-medium text-foreground">{placed.event.title}</span>
                    {placed.disputed && (
                      <span className="shrink-0 rounded-full bg-danger/12 px-1.5 text-[10px] font-semibold text-danger">
                        {placed.event.claims.length} dates
                      </span>
                    )}
                    {pending && (
                      <span className="shrink-0 rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
                        Pending
                      </span>
                    )}
                  </>
                )}
                {!placed.showLabel && <span className="sr-only">{placed.event.title}</span>}
              </button>
            </div>
          );
        })}

        {/* A crowd, honestly drawn. Tapping one zooms into its own span, which
            is the only way to see 900 events inside a single pixel. */}
        {layout.clusters.map((cluster) => (
          <button
            key={cluster.key}
            type="button"
            onClick={() => onWindowChange(clampWindow({ from: cluster.from, to: cluster.to }))}
            className="absolute flex h-[22px] items-center gap-1 rounded-full bg-muted px-2 text-[11px] font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-accent-soft"
            style={{ top: eventsTop + cluster.row * ROW_HEIGHT + 2, left: Math.max(0, cluster.x - 12) }}
            title={`${cluster.count} events here — zoom in`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {cluster.count}
          </button>
        ))}

        {events.length === 0 && !loading && (
          <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-sm text-muted-foreground">
            Nothing on the timeline in this stretch of time. Zoom out, or move left and right to look elsewhere.
          </p>
        )}

        {/* The scale badge sits under the ruler on a phone and beside it on a
            desktop: at 390px wide the ticks reach the right edge, and a badge
            in the corner landed on top of "4 bya". */}
        <div className="pointer-events-none absolute right-3 bottom-2 flex items-center gap-2 sm:bottom-auto sm:top-2">
          {loading && <span className="text-[11px] text-muted-foreground">Loading…</span>}
          <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {SCALE_BAND_LABELS[band]}
          </span>
        </div>
      </div>

      {truncated && (
        <p className="mt-2 text-xs text-muted-foreground">
          There is more here than fits on screen — zoom in to see everything in this stretch of time.
        </p>
      )}
    </div>
  );
}
