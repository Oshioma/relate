"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  panWindow,
  presentPosition,
  TIMELINE_JUMPS,
  zoomWindow,
  type TimeScale,
  type TimeWindow,
} from "@/lib/timeline/time";
import { barFraction, PULL_PX_PER_DOUBLING, thumbPixels, thumbCentre, windowAfterPull, windowWithThumbAt } from "@/lib/timeline/scrollbar-grip";
import { readWheelGesture, type WheelGesture } from "@/lib/timeline/wheel-intent";
import { timelineCategory } from "@/lib/timeline/taxonomy";

// WHERE EVERYTHING IS, AND WHERE YOU ARE.
//
// The strip below this shows a window onto time. The trouble with a window is
// that it cannot show you what is outside it — and on a timeline spanning
// thirteen billion years, that is almost everything. A reader zoomed into the
// Bronze Age has no way of knowing whether the next event is a century away or
// four billion years away, so panning becomes guesswork and usually finds
// nothing at all.
//
// This is the answer: the whole span, always, in one bar. A mark wherever
// an event actually sits, and a thumb marking the middle of what you are looking at.
// Drag the thumb to move, click anywhere to go there.
//
// IT IS THE TIMELINE'S SCROLLBAR. Drawn directly above the strip as a track
// and a thumb, because that is the control everyone already knows how to use
// for "move quickly through something long": grab it and throw it. Unlike a
// native scrollbar it spans ALL of time on a log scale — a pixel-for-year
// scrollbar for thirteen billion years would put recorded history inside its
// last pixel — and its thumb has ends you can pull to zoom.
//
// It shows marks, not events. There is no room for a label at this height and
// no need for one — the question it answers is "is there anything over there?",
// and a tick answers that completely.

// THE THUMB IS ONE SIZE WHEREVER IT IS, a share of the bar's width
// (thumbPixels in scrollbar-grip.ts), centred on the strip's middle date.

// THE ZOOM HANDLES are solid tabs at each end of the thumb, this wide, and
// everything between them is the body that MOVES — the gesture that travels
// through time. At the smallest thumb that still leaves 32px of body.
const HANDLE_PX = 16;

// A press this close OUTSIDE a handle still takes hold of it: a handle is a
// small target, and missing it by a pixel should not jump the strip.
const HANDLE_SLOP_PX = 4;

type DragMode = "move" | "from" | "to";

// THE ERAS, WRITTEN UNDER THE TRACK, so the bar reads as a map of time rather
// than a row of ticks: deep past on the left, now towards the right, the
// future after it. Each label sits where its era begins. The keys are the era
// jumps' own, so the names here and on the span cards can never disagree.
const ERA_LABELS: { key: string; label: string }[] = [
  { key: "earth", label: "Deep time" },
  { key: "life", label: "Life" },
  { key: "humans", label: "Early humans" },
  { key: "ancient", label: "Ancient" },
  { key: "medieval", label: "Medieval" },
  { key: "modern", label: "Modern" },
];

// Rough width of a label at uppercase text-[11px], for hiding the ones that would
// collide. Measured text is not worth a canvas here: a label that is dropped
// a few pixels early costs nothing, and one that overlaps its neighbour reads
// as a rendering bug.
const ERA_CHAR_PX = 7.4;
const ERA_GAP_PX = 10;

export function TimelineOverview({
  markers,
  window: view,
  onWindowChange,
  scale = "linear",
  className,
}: {
  /** One mark per date claim across the whole timeline — positions only. */
  markers: { position: number; category: string }[];
  window: TimeWindow;
  onWindowChange: (next: TimeWindow) => void;
  /** How the STRIP spaces its years, so the centre date here is the one its centre line marks. */
  scale?: TimeScale;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  // A drag remembers the window it started from, so neither a move nor a pull
  // can drift. A move also keeps how far from the thumb's centre it took hold
  // (so that spot stays under the pointer); a pull keeps where it started.
  const drag = useRef<{ mode: DragMode; anchor: number; base: TimeWindow } | null>(null);
  // What a press here WOULD do, so the cursor can say so before the press:
  // a hand over the thumb, a resize arrow over its ends, a pointer elsewhere.
  const [hover, setHover] = useState<DragMode | "jump" | null>(null);
  const [dragging, setDragging] = useState<DragMode | null>(null);
  // How far the end being pulled has moved outwards, in pixels, so the thumb
  // can stretch with the pointer while the pull lasts: the edge you hold
  // follows your hand, and springs back when you let go.
  const [stretch, setStretch] = useState(0);

  // The rail's width is measured rather than assumed: the thumb's width in
  // pixels depends on it, and the hit-testing and the grips have to agree on
  // where it is on screen. That needs the width during render, not only during
  // a pointer event.
  const [railWidth, setRailWidth] = useState(0);
  useEffect(() => {
    const element = railRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => setRailWidth(entries[0].contentRect.width));
    observer.observe(element);
    setRailWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  // A SWIPE ON THE SCROLLBAR MOVES THROUGH TIME, the same as one on the strip.
  //
  // It looks like a scrollbar, so it is where a reader's fingers go — and it
  // had no wheel handling at all, so a two-finger swipe over it did nothing
  // while the thumb sat there looking stuck. Same rules as the strip
  // (wheel-intent.ts): sideways or Shift+wheel travels, at the strip's own
  // speed rather than the bar's (a pixel on this bar can be millions of years);
  // pinch or Ctrl/Cmd+wheel zooms about the middle; a plain vertical scroll is
  // left to the page. Native and non-passive, because React's wheel handler
  // cannot preventDefault.
  const latest = useRef({ view, onWindowChange, scale });
  useEffect(() => {
    latest.current = { view, onWindowChange, scale };
  }, [view, onWindowChange, scale]);
  // The swipe in progress, read as a whole gesture rather than event by event
  // (readWheelGesture), for the same reason as on the strip.
  const gesture = useRef<WheelGesture | null>(null);
  useEffect(() => {
    const element = railRef.current;
    if (!element) return;
    function handleWheel(event: WheelEvent) {
      // Uncancelable events are the page's unless they continue a sideways
      // swipe this bar already owns — see the strip's handler.
      const read = readWheelGesture(gesture.current, event, event.timeStamp, event.cancelable);
      gesture.current = read.gesture;
      const intent = read.action;
      if (intent.kind === "page") return;
      if (event.cancelable) event.preventDefault();
      if (intent.kind === "hold") return;
      const { view: current, onWindowChange: change, scale: strip } = latest.current;
      const width = Math.max(1, element!.getBoundingClientRect().width);
      if (intent.kind === "pan") change(panWindow(current, intent.pixels / width, strip));
      else change(zoomWindow(current, intent.factor, 0.5, strip));
    }
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, []);

  // THE BAR IS ALWAYS SPACED BY MAGNITUDE, whatever the strip is doing.
  //
  // Linear spacing makes this control useless, and the arithmetic is brutal:
  // 13.9 billion years across a 975px bar is 14.3 MILLION YEARS PER PIXEL.
  // Every event after the Big Bang — the pyramids, the Norman Conquest, the
  // Moon landing, now — falls inside the final 0.00 pixels. They stack
  // invisibly against the right edge, the window box pins there too, and
  // dragging "all the way right" still cannot reach the present, because the
  // present is a fraction of one pixel from the end.
  //
  // Log spacing is what makes the bar navigable: the same four events land at
  // 291, 772, 822 and 912 pixels instead of all at 975. This is a navigator,
  // not a ruler — the span above it reports the true number of years, and the
  // strip below honours whichever scale the reader chose.
  //
  // The bar's own spacing (barFraction) also gives the future a smaller share
  // than the past; see scrollbar-grip.ts.
  const toFraction = barFraction;

  // THE MIDDLE DATE IS NOT WRITTEN HERE. It is the headline of the ruler just
  // above (span-ruler.tsx), with a picture of that time beside it; a second
  // copy on this bar was the same date twice. The bar marks WHERE it is: the
  // thumb's centre, with a line down it.

  // THE THUMB, in bar fractions. It may hang half off either end of the rail
  // when the middle date is at an end of time; the rail clips it, rather than
  // the thumb being nudged inwards to a place that marks a different date.
  const thumbWidth = railWidth > 0 ? thumbPixels(railWidth) / railWidth : 0.12;
  const centre = thumbCentre(view, scale);
  const drawnFrom = centre - thumbWidth / 2;
  const drawnTo = centre + thumbWidth / 2;
  // While an end is pulled, that end follows the pointer. Never pushed in so
  // far that the handles meet.
  const stretchFraction =
    railWidth > 0 ? Math.max(-(thumbWidth / 2 - (2 * HANDLE_PX + 4) / railWidth / 2), stretch / railWidth) : 0;
  const shownFrom = drawnFrom - (dragging === "from" ? stretchFraction : 0);
  const shownTo = drawnTo + (dragging === "to" ? stretchFraction : 0);

  // THE STRIP'S REAL STRETCH OF TIME, as a faint band behind the thumb. The
  // thumb is a handle — the same size wherever it is — so on its own it says
  // nothing about how much time is on screen. The band does: pull a handle
  // out and it widens across the bar to show the time you have opened up.
  const spanFrom = Math.max(0, Math.min(1, barFraction(view.from)));
  const spanTo = Math.max(0, Math.min(1, barFraction(view.to)));
  // Within a few pixels of either end, snap to the actual end of the timeline.
  // Without this the last pixel is still worth millions of years and "drag it
  // all the way over" never quite arrives — you stop just short of the present
  // and cannot tell why.
  const SNAP_PX = 6;
  const fractionAtClientX = useCallback((clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    if (clientX - rect.left <= SNAP_PX) return 0;
    if (rect.right - clientX <= SNAP_PX) return 1;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  /**
   * PULL AN END, AND THE ZOOM CHANGES.
   *
   * The other half of what this bar is for. Sliding the thumb moves you through
   * time at a fixed zoom; pulling either end outwards shows more time and
   * pushing it in shows less, about the middle date, so the date you are
   * reading stays put. The thumb itself stays the same size: it marks the
   * middle, not the edges.
   */
  const pullTo = useCallback(
    (edge: "from" | "to", fraction: number, start: number, base: TimeWindow) => {
      const outwardPx = (fraction - start) * railWidth * (edge === "to" ? 1 : -1);
      setStretch(outwardPx);
      onWindowChange(windowAfterPull(base, outwardPx, scale));
    },
    [onWindowChange, railWidth, scale]
  );

  /**
   * Which part of the thumb a press at this fraction is reaching for: a
   * handle zooms, anything else — the body, or the track around it — moves.
   */
  const modeAt = useCallback(
    (fraction: number): DragMode => {
      if (railWidth === 0) return "move";
      const handle = HANDLE_PX / railWidth;
      const slop = HANDLE_SLOP_PX / railWidth;
      if (fraction >= drawnFrom - slop && fraction <= drawnFrom + handle) return "from";
      if (fraction <= drawnTo + slop && fraction >= drawnTo - handle) return "to";
      return "move";
    },
    [drawnFrom, drawnTo, railWidth]
  );

  /**
   * Slide the thumb so the spot you took hold of stays under the pointer, at
   * the zoom the drag started with. The thumb is the same size everywhere, so
   * this is the same on both sides of the bar. Dragged past either end, the
   * window stops at that end of time.
   */
  const moveTo = useCallback(
    (fraction: number, offset: number, base: TimeWindow) => {
      onWindowChange(windowWithThumbAt(base, fraction - offset, scale));
    },
    [onWindowChange, scale]
  );

  /** Keyboard equivalents of a pull, so the control is not mouse-only: half a doubling per press. */
  const nudge = useCallback(
    (edge: "from" | "to", direction: -1 | 1) => {
      const outward = edge === "to" ? direction : -direction;
      onWindowChange(windowAfterPull(view, (outward * PULL_PX_PER_DOUBLING) / 2, scale));
    },
    [onWindowChange, scale, view]
  );

  // Where each era label goes, dropping any that would run into the one
  // before it. "Now" is always kept: it is the one landmark every reader
  // navigates from.
  const eraLabels = useMemo(() => {
    if (railWidth === 0) return [];
    const now = presentPosition();
    const candidates = [
      ...ERA_LABELS.flatMap(({ key, label }) => {
        const jump = TIMELINE_JUMPS.find((item) => item.key === key);
        return jump ? [{ key, label, fraction: barFraction(jump.window.from) }] : [];
      }),
      { key: "now", label: "Now", fraction: barFraction(now) },
    ].sort((a, b) => a.fraction - b.fraction);

    const nowItem = candidates.find((item) => item.key === "now")!;
    const nowStart = nowItem.fraction * railWidth;
    const placed: typeof candidates = [];
    let lastEnd = -Infinity;
    for (const item of candidates) {
      const start = item.fraction * railWidth;
      const end = start + item.label.length * ERA_CHAR_PX;
      if (item.key !== "now") {
        if (start < lastEnd + ERA_GAP_PX) continue;
        if (end > railWidth) continue;
        // Never crowd "Now" out from the left.
        if (item.fraction < nowItem.fraction && end + ERA_GAP_PX > nowStart) continue;
      }
      placed.push(item);
      lastEnd = end;
    }
    return placed;
  }, [railWidth]);

  if (markers.length === 0) return null;

  const cursor =
    dragging === "move"
      ? "cursor-grabbing"
      : dragging || hover === "from" || hover === "to"
        ? "cursor-ew-resize"
        : hover === "move"
          ? "cursor-grab"
          : "cursor-pointer";
  const thumbLit = dragging !== null || hover === "move" || hover === "from" || hover === "to";
  const handleLit = (edge: "from" | "to") => dragging === edge || (!dragging && hover === edge);

  return (
    <div className={cn("select-none", className)}>
      <div
        ref={railRef}
        role="presentation"
        // touch-pan-y, THE SAME AS THE STRIP AND THE COMPARE LANES.
        //
        // This rail had NO touch-action at all, which made it the likeliest
        // surface behind "scrolling left scrolls down on the page": it is a
        // thin bar directly above the strip, easy to graze while panning, and
        // with nothing declared the browser scrolled the page with the
        // vertical part of a swipe while these handlers moved the window with
        // the horizontal part.
        //
        // pan-y makes the browser choose one: vertical is a page scroll and
        // never arrives here, horizontal arrives here and the page holds still.
        className={cn(
          // A TRACK: recessed, full-width, rounded like every scrollbar track,
          // so it is recognisably the thing you drag to travel.
          "relative h-10 w-full touch-pan-y overflow-hidden rounded-full border border-border bg-muted shadow-inner",
          cursor
        )}
        onPointerDown={(event) => {
          const fraction = fractionAtClientX(event.clientX);
          const mode = modeAt(fraction);
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(mode);

          if (mode === "move") {
            // Grabbing the thumb moves it from where you took hold; clicking
            // the track outside it jumps, centring there.
            const inside = fraction >= drawnFrom && fraction <= drawnTo;
            const offset = inside ? fraction - centre : 0;
            drag.current = { mode, anchor: offset, base: view };
            if (!inside) moveTo(fraction, offset, view);
            return;
          }
          drag.current = { mode, anchor: fraction, base: view };
        }}
        onPointerMove={(event) => {
          const fraction = fractionAtClientX(event.clientX);
          if (!drag.current) {
            const mode = modeAt(fraction);
            const next = mode === "move" && (fraction < drawnFrom || fraction > drawnTo) ? "jump" : mode;
            if (next !== hover) setHover(next);
            return;
          }
          if (drag.current.mode === "move") moveTo(fraction, drag.current.anchor, drag.current.base);
          else pullTo(drag.current.mode, fraction, drag.current.anchor, drag.current.base);
        }}
        onPointerUp={(event) => {
          drag.current = null;
          setDragging(null);
          setStretch(0);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setDragging(null);
          setStretch(0);
        }}
        onPointerLeave={() => {
          if (!drag.current) setHover(null);
        }}
      >
        {/* Every event on the timeline, in its category's colour. */}
        {markers.map((marker, index) => {
          const left = toFraction(marker.position);
          if (left < 0 || left > 1) return null;
          return (
            <span
              key={`${marker.position}-${index}`}
              className={cn("absolute inset-y-2.5 w-px opacity-70", timelineCategory(marker.category).dotClass)}
              style={{ left: `${left * 100}%` }}
            />
          );
        })}

        {/* The strip's real stretch of time: faint, behind everything. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 border-x border-dashed border-accent/50 bg-accent/10"
          style={{ left: `${spanFrom * 100}%`, width: `max(1px, ${(spanTo - spanFrom) * 100}%)` }}
        />

        {/* THE THUMB: the middle of what is on screen. A solid pill rather than an
            outline, so it reads as a thing to take hold of; brighter with a halo
            when the pointer is over it or holding it. Its ends are solid handles
            because, unlike a native thumb, pulling them changes how much time
            is shown. */}
        <span
          className={cn(
            "pointer-events-none absolute inset-y-1 overflow-hidden rounded-full border border-accent transition-[background-color,box-shadow]",
            thumbLit ? "bg-accent/50 shadow-[0_0_0_3px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.25)]" : "bg-accent/30 shadow-sm"
          )}
          style={{ left: `${shownFrom * 100}%`, width: `${(shownTo - shownFrom) * 100}%` }}
        >
          {/* The handles, drawn inside the thumb so they cannot drift from its ends. */}
          {(["from", "to"] as const).map((edge) => (
            <span
              key={edge}
              className={cn(
                "absolute inset-y-0 flex items-center justify-center transition-colors",
                edge === "from" ? "left-0" : "right-0",
                handleLit(edge) ? "bg-accent" : "bg-accent/60"
              )}
              style={{ width: HANDLE_PX }}
            >
              <span className="h-3.5 w-1.5 border-x-2 border-white/90" />
            </span>
          ))}
          {/* Grip dots: the middle is the part you take hold of. */}
          <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 grid-cols-3 gap-[3px] opacity-70">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="size-[3px] rounded-full bg-foreground" />
            ))}
          </span>
        </span>

        {/* THE MIDDLE DATE'S LINE, down the centre of the thumb: the exact spot
            on this bar of the date the chip names. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10"
          style={{
            left: `${centre * 100}%`,
            width: 3,
            marginLeft: -1.5,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.18), 0 0 5px rgba(0,0,0,0.18)",
          }}
        />

        {/* The grips as real controls: focusable, keyboard-operable, and
            announced. The pointer drag above is handled on the rail so it
            survives the pointer leaving these few pixels mid-drag, but a
            control that only works with a mouse is not a control. */}
        <button
          type="button"
          aria-label="Move the start of the visible stretch of time"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); nudge("from", -1); }
            if (event.key === "ArrowRight") { event.preventDefault(); nudge("from", 1); }
          }}
          className="absolute inset-y-0 cursor-ew-resize rounded-l-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: `${shownFrom * 100}%`, width: HANDLE_PX }}
        />
        <button
          type="button"
          aria-label="Move the end of the visible stretch of time"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); nudge("to", -1); }
            if (event.key === "ArrowRight") { event.preventDefault(); nudge("to", 1); }
          }}
          className="absolute inset-y-0 -translate-x-full cursor-ew-resize rounded-r-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: `${shownTo * 100}%`, width: HANDLE_PX }}
        />
      </div>

      {/* The eras along the bottom of the track, each at the point it begins. */}
      <div aria-hidden className="relative mt-1 h-4 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {eraLabels.map((item) => (
          <span
            key={item.key}
            className={cn(
              "absolute top-0 whitespace-nowrap border-l pl-1 leading-4",
              item.key === "now" ? "border-accent text-foreground" : "border-border"
            )}
            style={{ left: `${item.fraction * 100}%` }}
          >
            {item.label}
          </span>
        ))}
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        All of time, spaced by order of magnitude. Drag the thumb to travel through time, pull its dark ends to show
        more or less time (the faint band is what is on screen), or click anywhere on the track to go there.
      </p>
    </div>
  );
}
