"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { nearestPictured } from "@/lib/timeline/era-picture";
import { middleDate } from "@/lib/timeline/scrollbar-grip";
import { eventDateLabel, formatYear, type TimeScale, type TimeWindow } from "@/lib/timeline/time";

// WHEN AM I?
//
//   ◀————————— [▣] 1721 BCE ————————▶
//   5471 BCE                  2030 CE
//
// A dimension line, the way a drawing measures a thing: an arrowhead at each
// end of what is being measured, the two ends printed small under their own
// arrows.
//
// THE BIG ELEMENT IS THE MIDDLE DATE — the date at the centre line of the strip
// below, and the date the scrollbar's thumb is centred on. It used to be the width
// of the view ("7,500 years"); the two ends under the arrows already say how
// much time is on screen, and "when am I?" is the question a reader travelling
// through time keeps asking. It is taken from the strip's own midpoint, so on a
// log strip it is the year the centre line marks, not the mean of the ends.
//
// BESIDE IT, ONE PICTURE OF THAT TIME: the pictured record nearest the middle
// date, among those on screen (era-picture.ts). As you scroll, the middle date
// moves and the picture changes with it. Clicking it opens the record.

export function SpanRuler({
  window: view,
  scale = "linear",
  events = [],
  onOpen,
}: {
  window: TimeWindow;
  scale?: TimeScale;
  /** The records currently shown, filters applied — where the thumbnail is chosen from. */
  events?: TimelineEventWithClaims[];
  onOpen?: (event: TimelineEventWithClaims) => void;
}) {
  const centre = middleDate(view, scale);

  // A PICTURE THAT DOES NOT LOAD IS WORSE THAN NO PICTURE. Once an address has
  // failed it is passed over, and the next nearest pictured record is shown.
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const markFailed = useCallback((url: string) => {
    setFailed((known) => (known.has(url) ? known : new Set(known).add(url)));
  }, []);

  const pictured = useMemo(() => nearestPictured(events, centre, view, failed), [events, centre, view, failed]);
  const pictureDate = pictured ? eventDateLabel(pictured.event.claims) : null;

  return (
    <div className="mt-3 select-none rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Left end. The arrow points outward, away from the span, the way a
            dimension line's arrowheads do — it marks the edge rather than
            suggesting somewhere to go. */}
        <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />

        <div className="h-px flex-1 bg-border" />

        <div className="flex min-w-0 shrink items-center gap-3 px-1">
          {pictured && (
            <button
              type="button"
              onClick={() => onOpen?.(pictured.event)}
              className="group flex min-w-0 items-center gap-2 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title={pictured.picture.caption ?? pictured.event.title}
            >
              {/* RESERVED SIZE, so a picture arriving never moves the date. */}
              <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-24 sm:w-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={pictured.picture.url}
                  src={pictured.picture.url}
                  alt={pictured.picture.caption ?? ""}
                  width={144}
                  height={96}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={() => markFailed(pictured.picture.url)}
                />
                {/* An image the record itself marks UNVERIFIED says so here
                    too, rather than passing as a picture of the record. */}
                {pictured.picture.unverified && (
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-center text-[10px] font-semibold uppercase leading-4 tracking-wide text-white">
                    Unverified
                  </span>
                )}
              </span>
              <span className="hidden min-w-0 max-w-[14rem] leading-tight sm:block">
                <span className="block truncate text-xs font-semibold text-foreground group-hover:underline">
                  {pictured.event.title}
                </span>
                {pictureDate && <span className="block truncate text-[11px] text-muted-foreground tabular-nums">{pictureDate}</span>}
              </span>
            </button>
          )}

          <p
            className="shrink-0 text-center text-xl font-semibold tracking-tight text-foreground tabular-nums sm:text-2xl"
          >
            {formatYear(centre, { compact: true })}
          </p>
        </div>

        <div className="h-px flex-1 bg-border" />

        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* The two ends, under the arrows that mark them. */}
      <div className="mt-1 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <span className="font-medium">{formatYear(view.from)}</span>
        {/* On a log axis the strip no longer spaces years evenly, and it says
            so: a distorted picture is only safe while the reader knows it is. */}
        {scale === "log" && <span className="hidden sm:inline">spaced by magnitude, not evenly</span>}
        <span className="font-medium">{formatYear(view.to)}</span>
      </div>
    </div>
  );
}
