"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { fractionOf, positionAt, timelineExtentWindow, type TimeWindow } from "@/lib/timeline/time";
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
// This is the answer: the whole span, always, in twenty pixels. A mark wherever
// an event actually sits, and a box showing the stretch you are looking at.
// Drag the box to move, click anywhere to go there.
//
// It shows marks, not events. There is no room for a label at this height and
// no need for one — the question it answers is "is there anything over there?",
// and a tick answers that completely.

// Never thinner than this, whatever the maths says. A century out of 13.9
// billion years is a millionth of a pixel wide, and a handle you cannot see is
// a handle you cannot grab. Wide enough for two edge grips and a middle.
const MIN_BOX_PX = 30;

// How close to an edge counts as grabbing that edge rather than the box.
const EDGE_GRAB_PX = 9;

// ...but an edge grip may never eat more than this share of the box. THIS IS
// WHAT MAKES DRAGGING THE BOX MOVE IT.
//
// The grips were a flat nine pixels from each edge, measured against the box's
// TRUE width. A zoomed-in window is a couple of pixels wide by that measure
// even though it is drawn MIN_BOX_PX wide — so every press anywhere inside the
// visible box landed within nine pixels of an edge, and every drag resized
// instead of moving. Dragging right stretched the window rather than travelling
// through time, which is exactly the complaint.
//
// Capping the grips at a third of the DRAWN box leaves a middle that is always
// there to take hold of, at every zoom.
const EDGE_GRAB_SHARE = 1 / 3;

type DragMode = "move" | "from" | "to";

export function TimelineOverview({
  markers,
  window: view,
  onWindowChange,
  className,
}: {
  /** One mark per date claim across the whole timeline — positions only. */
  markers: { position: number; category: string }[];
  window: TimeWindow;
  onWindowChange: (next: TimeWindow) => void;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ mode: DragMode; grabOffset: number } | null>(null);

  // The rail's width is measured rather than assumed, because the DRAWN box and
  // the TRUE box are different things (see MIN_BOX_PX) and both the hit-testing
  // and the grips have to agree on which one is on screen. Doing that in pixels
  // needs the width during render, not only during a pointer event.
  const [railWidth, setRailWidth] = useState(0);
  useEffect(() => {
    const element = railRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => setRailWidth(entries[0].contentRect.width));
    observer.observe(element);
    setRailWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  // The bar always shows everything, whatever the strip is showing — that is
  // the whole of its job, so its own frame never changes.
  const full = useMemo(() => timelineExtentWindow(), []);

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
  const toFraction = useCallback((position: number) => fractionOf(full, position, "log"), [full]);

  const boxFrom = toFraction(view.from);
  const boxTo = toFraction(view.to);

  // WHAT IS ACTUALLY ON SCREEN, which is not always what the maths says.
  //
  // A narrow window is drawn MIN_BOX_PX wide so it can be seen and grabbed. Every
  // decision about the pointer has to be made against THAT box — the one under
  // the reader's finger — or the control answers gestures aimed at a box nobody
  // can see. The box is nudged back inside the rail when widening it would push
  // it off the right-hand end.
  const minBox = railWidth > 0 ? MIN_BOX_PX / railWidth : 0.02;
  const drawnWidth = Math.max(minBox, Math.min(1, boxTo - boxFrom));
  const drawnFrom = Math.max(0, Math.min(1 - drawnWidth, boxFrom));
  const drawnTo = drawnFrom + drawnWidth;

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

  /** The narrowest the window may get, expressed as a fraction of the whole bar. */
  const minFraction = useCallback(() => minBox, [minBox]);

  /** Move the window so its LEFT edge lands at this fraction, keeping its width. */
  const moveTo = useCallback(
    (fraction: number) => {
      const width = boxTo - boxFrom;
      const clamped = Math.max(0, Math.min(1 - width, fraction));
      onWindowChange({
        from: positionAt(full, clamped, "log"),
        to: positionAt(full, clamped + width, "log"),
      });
    },
    [boxFrom, boxTo, full, onWindowChange]
  );

  /**
   * DRAG AN EDGE, AND THE WINDOW STRETCHES.
   *
   * The other half of what this bar is for. Sliding the box moves you through
   * time at a fixed zoom; pulling its edges changes how much time you are
   * looking at — drag the left grip to the far left and the whole early
   * timeline comes into view, drag the right grip out and the late end does.
   * It is the same gesture as widening a window, which is what this is.
   *
   * Each edge moves alone. The opposite edge stays exactly where it is, so
   * stretching never shifts the end you were using as your reference.
   */
  const resizeTo = useCallback(
    (edge: "from" | "to", fraction: number) => {
      const gap = minFraction();
      if (edge === "from") {
        const next = Math.max(0, Math.min(fraction, boxTo - gap));
        onWindowChange({ from: positionAt(full, next, "log"), to: view.to });
      } else {
        const next = Math.min(1, Math.max(fraction, boxFrom + gap));
        onWindowChange({ from: view.from, to: positionAt(full, next, "log") });
      }
    },
    [boxFrom, boxTo, full, minFraction, onWindowChange, view.from, view.to]
  );

  /**
   * Which part of the box a press at this fraction is reaching for.
   *
   * Measured against the DRAWN box, and never letting the two grips meet in the
   * middle. Taking hold of the body of the box means MOVE — that is the gesture
   * that travels through time, and it has to be the one you get by default.
   * Only the outer third at each end stretches.
   */
  const modeAt = useCallback(
    (fraction: number): DragMode => {
      if (railWidth === 0) return "move";
      const edge = Math.min(EDGE_GRAB_PX / railWidth, drawnWidth * EDGE_GRAB_SHARE);
      if (Math.abs(fraction - drawnFrom) <= edge) return "from";
      if (Math.abs(fraction - drawnTo) <= edge) return "to";
      return "move";
    },
    [drawnFrom, drawnTo, drawnWidth, railWidth]
  );

  /**
   * Slide the box so it keeps the same grip under the pointer.
   *
   * The two ends are special. fractionAtClientX snaps the last few pixels to 0
   * and 1, and subtracting a grip offset from a snapped end lands short of it —
   * on a log bar "short of the end" can be a factor of two in years, so "drag
   * it all the way right" would stop somewhere in the Middle Ages and look
   * broken. At the ends the box is pinned to the end instead.
   */
  const moveByGrab = useCallback(
    (fraction: number, grabOffset: number) => {
      if (fraction >= 1) return moveTo(1);
      if (fraction <= 0) return moveTo(0);
      moveTo(fraction - grabOffset);
    },
    [moveTo]
  );

  /** Keyboard equivalents, so the control is not mouse-only. */
  const nudge = useCallback(
    (edge: "from" | "to", direction: -1 | 1) => {
      const step = Math.max(0.01, (boxTo - boxFrom) * 0.1) * direction;
      resizeTo(edge, edge === "from" ? boxFrom + step : boxTo + step);
    },
    [boxFrom, boxTo, resizeTo]
  );

  if (markers.length === 0) return null;

  return (
    <div className={cn("select-none", className)}>
      <div
        ref={railRef}
        role="presentation"
        className="relative h-9 w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/40"
        onPointerDown={(event) => {
          const fraction = fractionAtClientX(event.clientX);
          const mode = modeAt(fraction);
          event.currentTarget.setPointerCapture(event.pointerId);

          if (mode === "move") {
            // Grabbing inside the box moves it from where you took hold;
            // clicking outside it jumps, centring on where you clicked. Both
            // measured on the drawn box, which is the one that was grabbed.
            const inside = fraction >= drawnFrom && fraction <= drawnTo;
            drag.current = { mode, grabOffset: inside ? fraction - drawnFrom : drawnWidth / 2 };
            moveByGrab(fraction, drag.current.grabOffset);
            return;
          }
          drag.current = { mode, grabOffset: 0 };
          resizeTo(mode, fraction);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const fraction = fractionAtClientX(event.clientX);
          if (drag.current.mode === "move") moveByGrab(fraction, drag.current.grabOffset);
          else resizeTo(drag.current.mode, fraction);
        }}
        onPointerUp={(event) => {
          drag.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {/* Every event on the timeline, in its category's colour. */}
        {markers.map((marker, index) => {
          const left = toFraction(marker.position);
          if (left < 0 || left > 1) return null;
          return (
            <span
              key={`${marker.position}-${index}`}
              className={cn("absolute top-1.5 h-6 w-px opacity-80", timelineCategory(marker.category).dotClass)}
              style={{ left: `${left * 100}%` }}
            />
          );
        })}

        {/* The stretch on screen, with a grip at each end. */}
        <span
          className="pointer-events-none absolute inset-y-0 rounded-md border-2 border-accent bg-accent/15"
          style={{ left: `${drawnFrom * 100}%`, width: `${drawnWidth * 100}%` }}
        >
          {/* Drawn inside the box so they cannot drift away from its edges. */}
          <span className="absolute inset-y-1 left-0 w-1 rounded-full bg-accent" />
          <span className="absolute inset-y-1 right-0 w-1 rounded-full bg-accent" />
        </span>

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
          className="absolute inset-y-0 w-3 -translate-x-1/2 cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: `${drawnFrom * 100}%` }}
        />
        <button
          type="button"
          aria-label="Move the end of the visible stretch of time"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); nudge("to", -1); }
            if (event.key === "ArrowRight") { event.preventDefault(); nudge("to", 1); }
          }}
          className="absolute inset-y-0 w-3 -translate-x-1/2 cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: `${drawnTo * 100}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Everything on this timeline. Drag the box itself to travel through time — left towards the beginning, right
        towards now — or pull either end to widen what you are looking at.
      </p>
    </div>
  );
}
