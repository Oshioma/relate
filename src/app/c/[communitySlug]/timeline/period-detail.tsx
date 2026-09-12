"use client";

import { X, Layers, Ruler, Compass, HelpCircle, Search, Microscope, Lightbulb, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/ui/rich-text";
import { Button } from "@/components/ui/button";
import type { TimelineClaimSource, TimelineDateClaim, TimelineSource } from "@/types/database";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { formatClaimDate, formatDuration, formatYear, presentPosition } from "@/lib/timeline/time";
import {
  chronologyLabel,
  datingMethodHint,
  datingMethodLabel,
  periodTypeHint,
  periodTypeLabel,
  viewpointHint,
} from "@/lib/timeline/taxonomy";
import { periodExtent, periodsForClaim, type PeriodWithClaims } from "@/lib/timeline/periods";
import { SourceLine } from "./date-claim-card";
import { ClaimCitations } from "./claim-citations";

// WHAT A PERIOD CARD HAS TO DO THAT AN EVENT CARD DOESN'T.
//
// An event card answers "when did this happen, and who says so". A period card
// has to answer a question underneath that one: what KIND of thing is this
// name? Because "Mesozoic" and "Bronze Age" look identical on a strip and are
// not the same kind of knowledge at all — one has a base defined by a marker in
// a named rock section and ratified by a standards body, the other is a
// convention that starts at different times in different places and that nobody
// ratifies or could.
//
// So the type comes first, with the sentence explaining what that type means,
// before any of the content. A reader who takes away only that has taken away
// the most useful thing on the card.
//
// Then, kept visibly apart rather than run together into a paragraph:
//   WHAT DEFINES IT — what makes this period this period at all
//   THE EVIDENCE    — what has actually been dug up or measured
//   THE READING     — what that evidence is taken to mean, and by whom
//
// And then the boundaries, one card each, because a period does not have dates.

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm leading-relaxed text-foreground">{children}</div>
      </div>
    </div>
  );
}

/** The band's span, written out — from the boundary claims, never from a column. */
export function periodRangeLabel(period: PeriodWithClaims, present: number): string | null {
  const extent = periodExtent(period, present);
  if (!extent) return null;
  const from = formatYear(Math.floor(extent.from), { compact: true });
  if (extent.ongoing) return `${from} – present`;
  return `${from} – ${formatYear(Math.floor(extent.to), { compact: true })}`;
}

function BoundaryCard({
  claim,
  sourcesById,
  citations,
}: {
  claim: TimelineDateClaim;
  sourcesById: Map<string, TimelineSource>;
  citations: TimelineClaimSource[];
}) {
  const source = claim.source_id ? sourcesById.get(claim.source_id) ?? null : null;

  return (
    <li className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {/* THE REGION, FIRST AND IN COLOUR. On the Iron Age this is the whole
            point of the card: six claims, six regions, more than a thousand
            years between the first and the last. A reader who sees the dates
            without the regions learns that the sources disagree; a reader who
            sees both learns that they are answering different questions. */}
        {claim.region && (
          // `text-accent-foreground` on `bg-accent-soft` is white on pale
          // green in the light theme — the region, which is the most important
          // word on this card, was effectively invisible.
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-foreground ring-1 ring-border">
            {claim.region}
          </span>
        )}
        <span className="text-base font-semibold tabular-nums text-foreground">
          {claim.is_ongoing ? `${formatClaimDate(claim)} – present` : formatClaimDate(claim)}
        </span>
        {claim.original_date_text && (
          <span className="text-sm text-muted-foreground">
            as the source puts it: “{claim.original_date_text}”
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Section icon={<Compass className="h-4 w-4" />} label="Viewpoint">
          <span title={viewpointHint(claim.chronology)}>{chronologyLabel(claim.chronology)}</span>
        </Section>
        <Section icon={<Ruler className="h-4 w-4" />} label="How this date was reached">
          <span title={datingMethodHint(claim.dating_method)}>{datingMethodLabel(claim.dating_method)}</span>
        </Section>
      </div>

      <div className="mt-3">
        <Section icon={<HelpCircle className="h-4 w-4" />} label="Why this boundary is placed here">
          <p>{claim.evidence}</p>
          {claim.notes && <p className="mt-2 text-muted-foreground">{claim.notes}</p>}
        </Section>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <SourceLine source={source} />
      </div>

      <ClaimCitations citations={citations} sourcesById={sourcesById} />
    </li>
  );
}

export function PeriodDetail({
  period,
  periods,
  related,
  events,
  sources,
  citations,
  onClose,
  onShowContext,
  onSelectPeriod,
  onSelectEvent,
}: {
  period: PeriodWithClaims;
  /** Every period, so "related" can be resolved and event membership derived. */
  periods: PeriodWithClaims[];
  /** The periods linked to this one, already resolved, with how they are linked. */
  related: { period: PeriodWithClaims; relation: "contains" | "related"; direction: "parent" | "child" }[];
  /** What is currently loaded on the strip — the events this period can claim. */
  events: TimelineEventWithClaims[];
  sources: TimelineSource[];
  citations: TimelineClaimSource[];
  onClose: () => void;
  onShowContext: (from: number, to: number) => void;
  onSelectPeriod: (period: PeriodWithClaims) => void;
  onSelectEvent: (event: TimelineEventWithClaims) => void;
}) {
  const present = presentPosition();
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const citationsByClaim = new Map<string, TimelineClaimSource[]>();
  for (const citation of citations) {
    const list = citationsByClaim.get(citation.claim_id);
    if (list) list.push(citation);
    else citationsByClaim.set(citation.claim_id, [citation]);
  }

  const extent = periodExtent(period, present);
  const range = periodRangeLabel(period, present);
  const length = extent ? formatDuration(extent.to - extent.from) : null;

  // Boundary claims, oldest first, so the card reads left to right through time.
  // A boundary that places nothing is not a boundary. Periods have never had
  // one and the seeders cannot make one, but the sort would otherwise compare
  // against null and scramble the order rather than fail.
  const boundaries = period.claims
    .filter((claim) => claim.start_position != null)
    .sort((a, b) => (a.start_position ?? 0) - (b.start_position ?? 0));

  // EVENTS IN THIS PERIOD — DERIVED, EVERY TIME.
  //
  // Nothing assigns an event to a period. An event is in this one if one of its
  // own date claims falls inside this one's extent, which means an event whose
  // sources disagree can appear under two different periods — and that is the
  // fact worth showing, not a problem to resolve. The claim that put it here is
  // named for the same reason.
  const inside = events
    .map((event) => {
      const matching = event.claims.filter((claim) =>
        periodsForClaim(periods, claim, present).some((membership) => membership.period.id === period.id)
      );
      return { event, matching };
    })
    .filter((entry) => entry.matching.length > 0)
    .sort((a, b) => (a.matching[0].start_position ?? 0) - (b.matching[0].start_position ?? 0));

  const partial = inside.filter((entry) => entry.matching.length < entry.event.claims.length);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Time period
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{period.name}</h2>
          {period.aliases.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              Also called {period.aliases.join(", ")} — one period under several names, not several periods.
            </p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {range && <span className="font-semibold tabular-nums text-foreground">{range}</span>}
            {length && <span className="text-muted-foreground">about {length} long</span>}
            {period.region && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {period.region}
              </span>
            )}
          </p>
          {range && (
            <p className="mt-1 text-xs text-muted-foreground">
              That span is the envelope of the {boundaries.length}{" "}
              {boundaries.length === 1 ? "boundary claim" : "boundary claims"} below, not a date this period owns.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* WHAT KIND OF PERIODISATION THIS IS. Before anything else, because it
          changes how every sentence after it should be read. */}
      <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{periodTypeLabel(period.period_type)}</span>
          {period.framework && (
            <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
              {period.framework}
            </span>
          )}
        </div>
        {periodTypeHint(period.period_type) && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{periodTypeHint(period.period_type)}</p>
        )}
      </div>

      {period.summary && <p className="mt-4 text-base text-foreground">{period.summary}</p>}
      {period.description && (
        <div className="mt-3 max-w-3xl">
          <RichText content={period.description} />
        </div>
      )}

      {(period.defining_criteria || period.evidence || period.interpretation) && (
        <div className="mt-5 grid gap-4 border-t border-border pt-5">
          {period.defining_criteria && (
            <Section icon={<Search className="h-4 w-4" />} label="What defines this period">
              <p>{period.defining_criteria}</p>
            </Section>
          )}
          {/* THE EVIDENCE AND THE READING OF IT, IN TWO BOXES. Run together in
              one paragraph, a reconstruction reads as a report. Separated, a
              reader can see where the objects stop and the argument starts —
              which is the whole of what this feature is for. */}
          {period.evidence && (
            <Section icon={<Microscope className="h-4 w-4" />} label="What the evidence is">
              <p>{period.evidence}</p>
            </Section>
          )}
          {period.interpretation && (
            <Section icon={<Lightbulb className="h-4 w-4" />} label="What it is taken to mean, and by whom">
              <p>{period.interpretation}</p>
            </Section>
          )}
        </div>
      )}

      {/* ---- The boundaries ------------------------------------------------ */}
      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-foreground">
          Where its boundaries are put ({boundaries.length})
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          A period does not have dates; it has claims about where it begins and ends, made by people, from
          evidence, sometimes for one region only. Where two of these disagree, both are here.
        </p>
        <ul className="mt-3 space-y-3">
          {boundaries.map((claim) => (
            <BoundaryCard
              key={claim.id}
              claim={claim}
              sourcesById={sourcesById}
              citations={citationsByClaim.get(claim.id) ?? []}
            />
          ))}
        </ul>
      </div>

      {/* ---- Related periods ----------------------------------------------- */}
      {related.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground">Related periods</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((entry) => (
              <button
                key={`${entry.period.id}-${entry.relation}-${entry.direction}`}
                type="button"
                onClick={() => onSelectPeriod(entry.period)}
                className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent-soft"
              >
                {entry.period.name}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  {entry.relation === "contains"
                    ? entry.direction === "child"
                      ? "inside this"
                      : "contains this"
                    : "alongside"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- Events inside it ---------------------------------------------- */}
      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-foreground">
          Events on this timeline inside it ({inside.length})
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Worked out from each event&apos;s own date claims rather than stored, so an event whose sources
          disagree can belong to two periods at once.
          {inside.length > 20 && ` Showing the first 20 of ${inside.length}.`}
          {partial.length > 0 &&
            ` ${partial.length === 1 ? "One event here has" : `${partial.length} events here have`} other proposed dates that fall outside this period.`}
        </p>
        {inside.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing loaded on the strip falls inside it. Move to this stretch of time to see what does.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {inside.slice(0, 20).map((entry) => (
              <li key={entry.event.id}>
                <button
                  type="button"
                  onClick={() => onSelectEvent(entry.event)}
                  className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2 text-left hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">{entry.event.title}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {formatClaimDate(entry.matching[0])}
                  </span>
                  {entry.matching.length < entry.event.claims.length && (
                    <span className="rounded-full bg-danger/12 px-1.5 text-[10px] font-semibold text-danger">
                      {entry.event.claims.length - entry.matching.length} other proposed{" "}
                      {entry.event.claims.length - entry.matching.length === 1 ? "date" : "dates"} outside this period
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {extent && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
          <Button type="button" variant="secondary" onClick={() => onShowContext(extent.from, extent.to)}>
            Show this stretch of time
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

/** The chip a band shows, and the same words the search results use. */
export function periodTypeChipClass(periodType: string): string {
  // Colour is never the only signal — the type is written out beside it — but a
  // formal unit and a teaching label reading identically at a glance was the
  // thing this whole card exists to prevent.
  return cn(
    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
    periodType === "formal_scientific"
      ? "bg-sky-500/12 text-sky-700 dark:text-sky-300"
      : periodType === "archaeological"
        ? "bg-stone-500/12 text-stone-700 dark:text-stone-300"
        : periodType === "historical"
          ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
          : "bg-muted text-muted-foreground"
  );
}
