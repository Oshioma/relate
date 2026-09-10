"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDuration, formatYear, type TimeWindow } from "@/lib/timeline/time";

// HOW MUCH TIME AM I LOOKING AT?
//
//   ◀——————————— 1,200 years ———————————▶
//   1066 CE                        2266 CE
//
// A dimension line, the way a drawing measures a thing: an arrowhead at each
// end of what is being measured, and the measurement across the middle.
//
// The strip below it is a variable-scale instrument — one drag covers a decade,
// the next covers a hundred million years — and until now the only way to know
// which you were on was to read the tick labels and do the subtraction. That is
// the question a learner most needs answered and the one the strip was worst at
// stating: "these two events look next to each other" means nothing until you
// know whether the gap is fifty years or fifty million.
//
// So the number is the big element on the page, and the two ends are printed
// small underneath their own arrows, because "how wide" and "from where to
// where" are different questions and the first one is the one being asked.
//
// It measures the VIEW, not the events in it. The window is the one thing on
// this page that is always true — a filtered timeline showing three events
// still covers the stretch of time the reader chose.

export function SpanRuler({ window: view }: { window: TimeWindow }) {
  const years = Math.abs(view.to - view.from);

  return (
    <div className="mt-3 select-none rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Left end. The arrow points outward, away from the span, the way a
            dimension line's arrowheads do — it marks the edge rather than
            suggesting somewhere to go. */}
        <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />

        <div className="h-px flex-1 bg-border" />

        <p className="shrink-0 px-1 text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {formatDuration(years)}
        </p>

        <div className="h-px flex-1 bg-border" />

        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* The two ends, under the arrows that mark them. */}
      <div className="mt-1 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <span className="font-medium">{formatYear(view.from)}</span>
        <span className="hidden sm:inline">across the timeline below</span>
        <span className="font-medium">{formatYear(view.to)}</span>
      </div>
    </div>
  );
}
