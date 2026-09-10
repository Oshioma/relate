"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineTrack } from "@/types/database";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { layoutLane } from "@/lib/timeline/layout";
import { axisTicks, fractionOf, type TimeWindow } from "@/lib/timeline/time";
import { trackColor } from "@/lib/timeline/taxonomy";
import { useTimeNavigation } from "./use-time-navigation";

// Compare mode: the same stretch of time, read across several places at once.
//
// The point is the question a child asks and a single timeline can never
// answer — "what was happening in China while they were building the pyramids?"
// Every lane shares ONE window and one ruler, so a vertical line down the
// screen is a moment, and reading downwards is reading the same century in six
// parts of the world.
//
// Lanes are the community's own rows (timeline_tracks), so what gets compared
// is whatever this community is actually studying.

const LANE_HEIGHT = 56;
const RULER_HEIGHT = 40;

export function CompareLanes({
  tracks,
  selectedTrackIds,
  events,
  window: view,
  onWindowChange,
  onSelect,
  selectedId,
}: {
  tracks: TimelineTrack[];
  selectedTrackIds: string[];
  events: TimelineEventWithClaims[];
  window: TimeWindow;
  onWindowChange: (next: TimeWindow) => void;
  onSelect: (event: TimelineEventWithClaims) => void;
  selectedId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const nav = useTimeNavigation(containerRef, view, onWindowChange);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    observer.observe(element);
    setWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  const lanes = useMemo(() => tracks.filter((track) => selectedTrackIds.includes(track.id)), [tracks, selectedTrackIds]);

  const ticks = useMemo(
    () => (width > 0 ? axisTicks(view.from, view.to, { target: Math.max(3, Math.round(width / 140)) }) : []),
    [view, width]
  );

  const byLane = useMemo(() => {
    const map = new Map<string, TimelineEventWithClaims[]>();
    for (const lane of lanes) {
      map.set(
        lane.id,
        events.filter((event) => event.trackIds.includes(lane.id))
      );
    }
    return map;
  }, [lanes, events]);

  if (lanes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <Layers className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Pick some lanes to compare</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Choose two or three above — Ancient Egypt and China, say — and see what each was doing while the other was
          doing something else.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Compare timelines. Drag to move through time, pinch or scroll to zoom."
      tabIndex={0}
      onPointerDown={nav.onPointerDown}
      onPointerMove={nav.onPointerMove}
      onPointerUp={nav.onPointerUp}
      onPointerCancel={nav.onPointerUp}
      onKeyDown={nav.onKeyDown}
      onDoubleClick={nav.onDoubleClick}
      className="relative w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ height: RULER_HEIGHT + lanes.length * LANE_HEIGHT + 8 }}
    >
      {/* One ruler for every lane — which is what makes a vertical line a moment. */}
      <div className="pointer-events-none absolute inset-0">
        {ticks.map((tick) => {
          const x = fractionOf(view, tick.position) * width;
          if (x < -60 || x > width + 60) return null;
          return (
            <div key={tick.position} className="absolute inset-y-0" style={{ left: x }}>
              <div className={cn("h-full w-px", tick.major ? "bg-border" : "bg-border/40")} />
              <span className="absolute top-2 left-1.5 whitespace-nowrap text-[11px] tabular-nums text-muted-foreground">
                {tick.label}
              </span>
            </div>
          );
        })}
      </div>

      {lanes.map((lane, laneIndex) => {
        const laneEvents = byLane.get(lane.id) ?? [];
        const placed = layoutLane(laneEvents, view, width);
        const color = trackColor(lane.color, laneIndex);
        const top = RULER_HEIGHT + laneIndex * LANE_HEIGHT;

        return (
          <div key={lane.id} className="absolute inset-x-0 border-t border-border/60" style={{ top, height: LANE_HEIGHT }}>
            <span
              className="pointer-events-none absolute left-2 top-1.5 z-10 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: `${color}1f`, color }}
            >
              {lane.name}
            </span>

            {laneEvents.length === 0 && (
              <span className="pointer-events-none absolute left-2 top-8 text-[11px] text-muted-foreground">
                Nothing filed in this lane for this stretch of time yet.
              </span>
            )}

            {placed.map((item) => (
              <button
                key={item.event.id}
                type="button"
                onClick={() => {
                  if (nav.wasDragged()) return;
                  onSelect(item.event);
                }}
                title={item.event.title}
                className={cn(
                  "absolute top-[26px] flex h-6 max-w-[200px] items-center gap-1.5 rounded-full pr-2 text-[12px]",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  item.event.id === selectedId && "bg-accent-soft ring-1 ring-accent"
                )}
                style={{ left: Math.max(0, item.xFrom - 5) }}
              >
                <span
                  aria-hidden
                  className="h-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: color,
                    width: Math.max(10, Math.min(240, item.xTo - item.xFrom)),
                  }}
                />
                {item.showLabel ? (
                  <span className="truncate font-medium text-foreground">{item.event.title}</span>
                ) : (
                  <span className="sr-only">{item.event.title}</span>
                )}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
