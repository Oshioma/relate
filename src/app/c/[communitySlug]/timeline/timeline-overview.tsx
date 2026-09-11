"use client";

import { useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { fractionOf, positionAt, timelineExtentWindow, type TimeScale, type TimeWindow } from "@/lib/timeline/time";
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
const MIN_BOX_PX = 22;

// How close to an edge counts as grabbing that edge rather than the box.
const EDGE_GRAB_PX = 9;

type DragMode = "move" | "from" | "to";

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
  scale?: TimeScale;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ mode: DragMode; grabOffset: number } | null>(null);

  // The bar always shows everything, whatever the strip is showing — that is
  // the whole of its job, so its own frame never changes.
  const full = useMemo(() => timelineExtentWindow(), []);

  const toFraction = useCallback((position: number) => fractionOf(full, position, scale), [full, scale]);

  const boxFrom = toFraction(view.from);
  const boxTo = toFraction(view.to);

  const fractionAtClientX = useCallback((clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  /** The narrowest the window may get, expressed as a fraction of the whole bar. */
  const minFraction = useCallback(() => {
    const width = railRef.current?.getBoundingClientRect().width ?? 0;
    return width > 0 ? MIN_BOX_PX / width : 0.01;
  }, []);

  /** Move the window so its LEFT edge lands at this fraction, keeping its width. */
  const moveTo = useCallback(
    (fraction: number) => {
      const width = boxTo - boxFrom;
      const clamped = Math.max(0, Math.min(1 - width, fraction));
      onWindowChange({
        from: positionAt(full, clamped, scale),
        to: positionAt(full, clamped + width, scale),
      });
    },
    [boxFrom, boxTo, full, onWindowChange, scale]
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
        onWindowChange({ from: positionAt(full, next, scale), to: view.to });
      } else {
        const next = Math.min(1, Math.max(fraction, boxFrom + gap));
        onWindowChange({ from: view.from, to: positionAt(full, next, scale) });
      }
    },
    [boxFrom, boxTo, full, minFraction, onWindowChange, scale, view.from, view.to]
  );

  /** Which part of the box a press at this fraction is reaching for. */
  const modeAt = useCallback(
    (fraction: number): DragMode => {
      const width = railRef.current?.getBoundingClientRect().width ?? 0;
      if (width === 0) return "move";
      const edge = EDGE_GRAB_PX / width;
      if (Math.abs(fraction - boxFrom) <= edge) return "from";
      if (Math.abs(fraction - boxTo) <= edge) return "to";
      return "move";
    },
    [boxFrom, boxTo]
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
            const width = boxTo - boxFrom;
            // Grabbing inside the box moves it from where you took hold;
            // clicking outside it jumps, centring on where you clicked.
            const inside = fraction >= boxFrom && fraction <= boxTo;
            drag.current = { mode, grabOffset: inside ? fraction - boxFrom : width / 2 };
            moveTo(fraction - drag.current.grabOffset);
            return;
          }
          drag.current = { mode, grabOffset: 0 };
          resizeTo(mode, fraction);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const fraction = fractionAtClientX(event.clientX);
          if (drag.current.mode === "move") moveTo(fraction - drag.current.grabOffset);
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
          style={{
            left: `${Math.max(0, Math.min(1, boxFrom)) * 100}%`,
            width: `max(${MIN_BOX_PX}px, ${Math.max(0, Math.min(1, boxTo - boxFrom)) * 100}%)`,
          }}
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
          style={{ left: `${Math.max(0, Math.min(1, boxFrom)) * 100}%` }}
        />
        <button
          type="button"
          aria-label="Move the end of the visible stretch of time"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); nudge("to", -1); }
            if (event.key === "ArrowRight") { event.preventDefault(); nudge("to", 1); }
          }}
          className="absolute inset-y-0 w-3 -translate-x-1/2 cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: `${Math.max(0, Math.min(1, boxTo)) * 100}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Everything on this timeline. Drag the box to move through time, or pull either end to widen what you are
        looking at — pull the left grip to the far left and the whole early timeline comes into view.
      </p>
    </div>
  );
}
