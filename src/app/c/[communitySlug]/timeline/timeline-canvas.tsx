"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { layoutTimeline } from "@/lib/timeline/layout";
import {
  axisTicks,
  fractionOf,
  type TimeScale,
  scaleBandFor,
  SCALE_BAND_LABELS,
  clampWindow,
  type TimeWindow,
} from "@/lib/timeline/time";
import { timelineCategory, timelineCategoryLabel } from "@/lib/timeline/taxonomy";
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
const RULER_HEIGHT = 52;
/** The gap between a marker and its caption — the same 6px the layout reserves. */
const LABEL_GAP = 6;

export function TimelineCanvas({
  events,
  window: view,
  scale = "linear",
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
  /** Linear years, or spaced by order of magnitude. See TimeScale in time.ts. */
  scale?: TimeScale;
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

  // WHAT IS THIS? — answered without opening it.
  //
  // A caption on the strip is a truncated title and a date. Reading the strip
  // means asking "what is that one?" over and over, and the only way to find
  // out was to open it, read it, close it and lose your place. A preview on
  // hover answers the question where the question is asked.
  //
  // Hover only, and deliberately: a tap on a phone opens the event, which is
  // the right thing there, and a preview that fights the tap would make the
  // strip worse rather than better.
  const [preview, setPreview] = useState<{ id: string; x: number; y: number } | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showPreview = (id: string, x: number, y: number) => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    // Long enough that sweeping the pointer across a row doesn't flash a card
    // per caption; short enough that stopping on one feels immediate.
    previewTimer.current = setTimeout(() => setPreview({ id, x, y }), 260);
  };
  const hidePreview = () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    setPreview(null);
  };
  useEffect(() => () => { if (previewTimer.current) clearTimeout(previewTimer.current); }, []);

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
    () => layoutTimeline(events, view, width, rowsAvailable, scale),
    [events, view, width, rowsAvailable, scale]
  );

  const ticks = useMemo(
    () => (width > 0 ? axisTicks(view.from, view.to, { target: Math.max(3, Math.round(width / 190)), scale }) : []),
    [view, width, scale]
  );

  const band = scaleBandFor(view.to - view.from);

  const nav = useTimeNavigation(containerRef, view, onWindowChange, scale);

  // The event under the pointer, looked up from the layout each render so a
  // reload or an edit can never leave the card describing a stale copy.
  const previewPlaced = preview ? layout.events.find((item) => item.event.id === preview.id) ?? null : null;
  const previewEvent = previewPlaced?.event ?? null;
  const previewDate = previewPlaced?.dateLabel ?? null;
  const previewCandidate = previewEvent?.image_url || previewEvent?.media?.[0]?.url || null;
  // A PICTURE THAT DOES NOT LOAD IS WORSE THAN NO PICTURE. A hotlinked image
  // whose host is unreachable renders as a blank box inside the card — the same
  // empty rectangle that made the worked example look broken. Once an address
  // has failed, it is treated as absent and the category band is shown instead.
  const previewImage = previewCandidate && !failedImages.has(previewCandidate) ? previewCandidate : null;

  const presentX = fractionOf(view, present, scale) * width;
  const showPresent = presentX > -40 && presentX < width + 40;
  const eventsTop = RULER_HEIGHT + 8;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="application"
        aria-label="Timeline. Drag to move through time, pinch or scroll to zoom."
        tabIndex={0}
        onPointerDown={(event) => {
          hidePreview();
          nav.onPointerDown(event);
        }}
        onPointerMove={nav.onPointerMove}
        onPointerUp={nav.onPointerUp}
        onPointerCancel={nav.onPointerUp}
        onPointerLeave={hidePreview}
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
            const x = fractionOf(view, tick.position, scale) * width;
            if (x < -60 || x > width + 60) return null;
            return (
              <div key={tick.position} className="absolute inset-y-0" style={{ left: x }}>
                <div className={cn("h-full w-px", tick.major ? "bg-border" : "bg-border/50")} />
                <span
                  className={cn(
                    // The dates are the ruler. They were 11px — legible if you
                    // were looking for them, invisible if you were reading the
                    // events. At 16px they are the first thing you see on the
                    // strip, which is what a date on a timeline should be.
                    "absolute top-1.5 left-2 whitespace-nowrap text-base tabular-nums",
                    tick.major ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
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
            {/* Flipped to the left of the line when the present is near the
                right edge, for the same reason event captions are: a chip
                reading "Toda" helps nobody. */}
            <span
              className={cn(
                "absolute bottom-1.5 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground",
                presentX > width - 64 ? "right-1.5" : "left-1.5"
              )}
            >
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
          // Where the caption is actually drawn. The preview hangs off THIS
          // rather than off the event's marker: an event whose earliest claim
          // is off the left edge has its marker at a negative x, and a card
          // anchored there opened in the far corner of the strip instead of
          // beside the words the reader was pointing at.
          const labelLeft =
            placed.labelSide === "left"
              ? Math.max(0, placed.xFrom - LABEL_GAP - placed.labelWidth)
              : Math.max(0, placed.xTo + LABEL_GAP);

          return (
            // A ROW IS A FULL-WIDTH TRANSPARENT DIV, AND IT WAS EATING CLICKS.
            //
            // Every event gets one of these, spanning the whole strip so its
            // marker and caption can be positioned inside it. Two events in the
            // same row therefore produce two overlapping full-width divs — and
            // the later one in the DOM sits on top of the earlier one's caption.
            // Clicking that caption hit the transparent div instead of the
            // button, and nothing happened. (Playwright put it plainly:
            // "<div class='absolute'> intercepts pointer events".)
            //
            // The row is scaffolding, so it takes no pointer events at all and
            // the button inside it takes its own back. Everything else in here
            // is decoration, and a press on it now falls through to the canvas
            // underneath, which is what pans the timeline — so a drag that
            // starts on an event's rail drags time, as it should.
            <div
              key={placed.event.id}
              className="pointer-events-none absolute"
              style={{ top, left: 0, right: 0, height: ROW_HEIGHT }}
            >
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
                // No `title` attribute: the browser's own tooltip would open
                // over the preview card below, saying less, a second later.
                onPointerEnter={(pointerEvent) => {
                  // Mouse only. A touch "hover" fires on the way to a tap and
                  // would put a card over the thing being tapped.
                  if (pointerEvent.pointerType !== "mouse") return;
                  showPreview(placed.event.id, labelLeft, top);
                }}
                onPointerLeave={hidePreview}
                onFocus={() => showPreview(placed.event.id, labelLeft, top)}
                onBlur={hidePreview}
                className={cn(
                  "pointer-events-auto absolute top-0 flex h-[26px] items-center gap-1.5 rounded-full pl-1 pr-2 text-[13px]",
                  "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  // Flipped captions hug their own marker, so the text sits
                  // beside the dot it belongs to rather than trailing away
                  // from it across empty axis.
                  placed.labelSide === "left" && "justify-end pl-2 pr-1 text-right",
                  selected && "bg-accent-soft ring-1 ring-accent"
                )}
                // THE LABEL MAY NOT DRAW WIDER THAN THE SPACE RESERVED FOR IT.
                //
                // The layout packs rows by reserving labelWidth per event and
                // then hides any caption whose neighbour is closer than that.
                // The reservation was capped at 190px while the button was
                // capped at 220px and `truncate` had nothing to truncate
                // against — so a long title drew past its own reservation and
                // straight through the label next to it. Four titles on one
                // row came out superimposed and unreadable.
                //
                // Binding the rendered width to the reserved width makes the
                // reservation true by construction: truncate now engages at
                // exactly the point the packer assumed it would.
                style={{ left: labelLeft, maxWidth: placed.labelWidth }}
              >
                {placed.showLabel && (
                  <>
                    <span className="truncate font-medium text-foreground">{placed.event.title}</span>
                    {/* WHEN, NEXT TO WHAT. A caption that reads only "First
                        Moon landing" makes the reader measure it off the ruler
                        by eye; the date beside it answers the question the
                        strip exists to answer. Where the sources disagree this
                        is the whole envelope of their proposals rather than
                        one of them picked out — see eventDateLabel.
                        `shrink-0` so the title truncates and the date never
                        does: half a date is worse than none. */}
                    {placed.dateLabel && (
                      <span className="shrink-0 text-[12px] font-medium text-muted-foreground tabular-nums">
                        {placed.dateLabel}
                      </span>
                    )}
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

        {/* THE PREVIEW CARD.
            Drawn last so it is over everything, and pointer-events-none so it
            can never eat the click it is describing. Placed against whichever
            edge keeps it on the strip: past the middle it hangs left, near the
            bottom it sits above the row rather than below it. */}
        {previewEvent && (
          <div
            aria-hidden
            className="pointer-events-none absolute z-20 w-[260px] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
            style={{
              left: Math.max(8, Math.min(width - 268, preview!.x + (preview!.x > width / 2 ? -268 : 12))),
              top:
                preview!.y + 210 > size.height
                  ? Math.max(RULER_HEIGHT + 4, preview!.y - 200)
                  : preview!.y + 30,
            }}
          >
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt=""
                className="h-[120px] w-full object-cover"
                loading="lazy"
                onError={() =>
                  setFailedImages((known) => {
                    const next = new Set(known);
                    next.add(previewImage);
                    return next;
                  })
                }
              />
            ) : (
              // NO PICTURE IS NOT AN EMPTY BOX. Most events have no image and
              // never will; a grey rectangle where one would go makes every one
              // of them look broken. The category's own colour and name is a
              // truthful thing to show instead.
              <div className={cn("flex h-[54px] items-center gap-2 px-3", timelineCategory(previewEvent.category).chipClass)}>
                <span className={cn("h-2 w-2 shrink-0 rounded-full", timelineCategory(previewEvent.category).dotClass)} />
                <span className="truncate text-xs font-semibold uppercase tracking-[0.12em]">
                  {timelineCategoryLabel(previewEvent.category)}
                </span>
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-semibold leading-snug text-foreground">{previewEvent.title}</p>
              {previewDate && <p className="mt-0.5 text-xs font-medium text-muted-foreground tabular-nums">{previewDate}</p>}
              {previewEvent.summary && (
                <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {previewEvent.summary}
                </p>
              )}
              {previewEvent.claims.length > 1 && (
                <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                  {previewEvent.claims.length} proposed dates — click to see where they disagree
                </p>
              )}
            </div>
          </div>
        )}

        {events.length === 0 && !loading && (
          <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-sm text-muted-foreground">
            Nothing on the timeline in this stretch of time. Zoom out, or move left and right to look elsewhere.
          </p>
        )}

        {/* The scale badge sits under the ruler on a phone and beside it on a
            desktop: at 390px wide the ticks reach the right edge, and a badge
            in the corner landed on top of "4 bya".
            The LOG ruler reaches the right edge at every width — "Now" is the
            last tick and the present is always on screen — so there it stays at
            the bottom on desktop too, for the same reason. */}
        <div
          className={cn(
            "pointer-events-none absolute right-3 bottom-2 flex items-center gap-2",
            scale === "linear" && "sm:bottom-auto sm:top-2"
          )}
        >
          {loading && <span className="text-[11px] text-muted-foreground">Loading…</span>}
          <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {scale === "log" ? "Log scale — spacing distorted" : SCALE_BAND_LABELS[band]}
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
