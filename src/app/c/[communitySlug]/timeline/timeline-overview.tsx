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

const MIN_BOX_PX = 6;

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
  const drag = useRef<{ grabOffset: number } | null>(null);

  // The bar always shows everything, whatever the strip is showing — that is
  // the whole of its job, so its own frame never changes.
  const full = useMemo(() => timelineExtentWindow(), []);

  const toFraction = useCallback((position: number) => fractionOf(full, position, scale), [full, scale]);

  const boxFrom = toFraction(view.from);
  const boxTo = toFraction(view.to);

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

  const fractionAtClientX = useCallback((clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  if (markers.length === 0) return null;

  return (
    <div className={cn("select-none", className)}>
      <div
        ref={railRef}
        role="presentation"
        className="relative h-9 w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/40"
        onPointerDown={(event) => {
          const fraction = fractionAtClientX(event.clientX);
          const width = boxTo - boxFrom;
          // Grabbing inside the box moves it from where you took hold; clicking
          // outside it jumps, centring on where you clicked. Both are what the
          // gesture looks like it should do.
          const inside = fraction >= boxFrom && fraction <= boxTo;
          drag.current = { grabOffset: inside ? fraction - boxFrom : width / 2 };
          event.currentTarget.setPointerCapture(event.pointerId);
          moveTo(fraction - drag.current.grabOffset);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          moveTo(fractionAtClientX(event.clientX) - drag.current.grabOffset);
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

        {/* The stretch on screen. Never thinner than a few pixels: at a century
            out of thirteen billion years the true width is a millionth of a
            pixel, and a handle you cannot see is a handle you cannot grab. */}
        <span
          className="pointer-events-none absolute inset-y-0 rounded-md border-2 border-accent bg-accent/15"
          style={{
            left: `${Math.max(0, Math.min(1, boxFrom)) * 100}%`,
            width: `max(${MIN_BOX_PX}px, ${Math.max(0, Math.min(1, boxTo - boxFrom)) * 100}%)`,
          }}
        />
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Everything on this timeline. Drag the box, or click anywhere, to move to that stretch of time.
      </p>
    </div>
  );
}
