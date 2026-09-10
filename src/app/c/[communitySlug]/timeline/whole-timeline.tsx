"use client";

import { useMemo } from "react";
import { Printer, ScrollText } from "lucide-react";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { TimelineList } from "./timeline-list";
import { claimMidpoint, formatDuration, formatYear } from "@/lib/timeline/time";

// THE WHOLE THING, ON ONE PAGE.
//
// Everywhere else the timeline is a window: you look at a stretch of time and
// the app fetches what is in it, which is what keeps thirteen billion years out
// of a browser's memory. This is the one view that refuses that bargain on
// purpose — every event the community has, in order, top to bottom.
//
// It earns the exception because "read the lot" is a real thing people want to
// do and could not: check a term's work over, find the gap between the Bronze
// Age and the next entry, hand a printed copy to somebody. A strip cannot be
// read that way and a window shows you a slice at a time.
//
// It is not the default and it is not preloaded. The button asks for it, and
// only then does anything larger than a window get fetched.

export function WholeTimeline({
  payload,
  loading,
  filtered,
  onSelect,
  selectedId,
}: {
  payload: { events: TimelineEventWithClaims[]; total: number; truncated: boolean } | null;
  loading: boolean;
  /** Whether filters are narrowing this, so "whole" can be honest about what it means. */
  filtered: boolean;
  onSelect: (event: TimelineEventWithClaims) => void;
  selectedId: string | null;
}) {
  // Depend on the payload rather than on a fresh [] every render, or the memo
  // below recomputes on each pass for a page that may be holding two thousand
  // events.
  const events = useMemo(() => payload?.events ?? [], [payload]);

  // The span the page actually covers, said in the same words the rest of the
  // timeline uses.
  const span = useMemo(() => {
    if (events.length === 0) return null;
    const positions = events.flatMap((event) => event.claims.map(claimMidpoint));
    if (positions.length === 0) return null;
    const from = Math.min(...positions);
    const to = Math.max(...positions);
    return { from, to, years: to - from };
  }, [events]);

  if (loading && events.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Fetching everything…</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {filtered
            ? "Nothing matches those filters. Clear them to see the whole timeline."
            : "Nothing on this timeline yet. The first event you add will be here."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4 print:border-0 print:bg-transparent">
        <div className="flex gap-3">
          <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {events.length.toLocaleString()} {events.length === 1 ? "event" : "events"}
              {filtered ? " matching your filters" : ""}, in order
            </p>
            {span && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatYear(span.from)} to {formatYear(span.to)}
                {span.years > 0 ? ` — ${formatDuration(span.years)} from end to end.` : "."}
              </p>
            )}
            {/* "Whole" has to be honest. A filtered page is the whole of what
                you asked for, which is not the same claim. */}
            {filtered && (
              <p className="mt-1 text-xs text-muted-foreground">
                Filters are still on. Clear them above to read everything.
              </p>
            )}
            {payload?.truncated && (
              <p className="mt-1 text-xs text-muted-foreground">
                This community has more events than one page will hold — these are the earliest of them.
              </p>
            )}
          </div>
        </div>

        {/* The reason half of "one page" is asked for at all. The browser's own
            dialog, because a print stylesheet plus the platform's print flow is
            the whole feature — anything more would be reimplementing it. */}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground print:hidden"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      {/* The same list component the strip has underneath it — one definition
          of what an event looks like in a row, so the two can never drift. */}
      <TimelineList
        events={events}
        onSelect={onSelect}
        selectedId={selectedId}
        emptyMessage="Nothing on this timeline yet."
      />

      {loading && (
        <p className="mt-3 text-center text-xs text-muted-foreground">Refreshing…</p>
      )}
    </div>
  );
}
