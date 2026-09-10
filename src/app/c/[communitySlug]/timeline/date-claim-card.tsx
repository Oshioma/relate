"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, HelpCircle, Ruler, Compass, ScrollText, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineDateClaim, TimelineSource } from "@/types/database";
import {
  formatClaim,
  formatDateParts,
  formatDuration,
  measureDisagreement,
  precisionLabel,
} from "@/lib/timeline/time";
import {
  chronologyLabel,
  confidenceLabel,
  datingMethodHint,
  datingMethodLabel,
  sourceTypeLabel,
} from "@/lib/timeline/taxonomy";

// One proposed date, with everything a reader needs to weigh it.
//
// The order is deliberate: the DATE is largest, but the SOURCE sits directly
// under it and is never optional furniture. A date with nothing behind it reads
// as what it is — a claim nobody has backed — rather than as a fact.

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function SourceLine({ source, compact = false }: { source: TimelineSource | null; compact?: boolean }) {
  if (!source) {
    return (
      <p className="text-sm text-muted-foreground">
        No source given yet — this date is somebody&apos;s word for it.
      </p>
    );
  }

  const parts = [source.author, source.publisher].filter(Boolean).join(" · ");
  // The source's OWN date, which is not the date it is being cited for. Keeping
  // the two apart on screen is what lets a reader ask "how long after the event
  // was this written?" — see §8 of the brief.
  const made = source.published_display?.trim()
    ? source.published_display.trim()
    : source.published_year != null
      ? `${source.published_is_approximate ? "c. " : ""}${formatDateParts(source.published_year, source.published_month, source.published_day)}`
      : null;

  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-foreground">{source.title}</p>
      {!compact && parts && <p className="truncate text-sm text-muted-foreground">{parts}</p>}
      {!compact && source.work_title && <p className="truncate text-sm text-muted-foreground">In: {source.work_title}</p>}
      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">{sourceTypeLabel(source.source_type)}</span>
        {source.reference && <span>{source.reference}</span>}
        {made && <span>Source made: {made}</span>}
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            View source <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {source.file_url && (
          <a
            href={source.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            Open file <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </p>
    </div>
  );
}

export function DateClaimCard({
  claim,
  source,
  siblings,
  sourcesById,
  index,
}: {
  claim: TimelineDateClaim;
  source: TimelineSource | null;
  /** Every claim on this event, including this one — what "competing dates" means. */
  siblings: TimelineDateClaim[];
  sourcesById: Map<string, TimelineSource>;
  index: number;
}) {
  const [openWhy, setOpenWhy] = useState(false);
  const competing = siblings.filter((other) => other.id !== claim.id);
  const disagreement = measureDisagreement(siblings);
  const confidence = confidenceLabel(claim.confidence);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-xl font-semibold tracking-tight text-foreground">{formatClaim(claim)}</p>
          {claim.is_approximate && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Approximate
            </span>
          )}
          {claim.end_year != null && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              A range, not a single year
            </span>
          )}
          <span className="text-xs text-muted-foreground">Proposed date {index + 1}</span>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          <Field icon={<BookOpen className="h-4 w-4" />} label="Source">
            <SourceLine source={source} />
          </Field>
          <Field icon={<Ruler className="h-4 w-4" />} label="Dating method">
            {datingMethodLabel(claim.dating_method)}
          </Field>
          <Field icon={<Compass className="h-4 w-4" />} label="Viewpoint">
            {chronologyLabel(claim.chronology)}
          </Field>
          <Field icon={<CalendarClock className="h-4 w-4" />} label="How precise">
            {precisionLabel(claim.date_precision)}
            {confidence && <span className="text-muted-foreground"> · {confidence}</span>}
          </Field>
        </div>

        {claim.notes && (
          <div className="mt-4 flex gap-2.5">
            <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{claim.notes}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpenWhy((open) => !open)}
          aria-expanded={openWhy}
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
            openWhy ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent hover:opacity-90"
          )}
        >
          <HelpCircle className="h-4 w-4" />
          Why this date?
        </button>
      </div>

      {/* The educational heart of the feature. A date is nearly always inferred
          from something — this is where the something goes. */}
      {openWhy && (
        <div className="border-t border-border bg-muted/40 p-4 text-sm sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Why this date?</p>

          <dl className="mt-3 space-y-3">
            <div>
              <dt className="font-medium text-foreground">Who proposes it</dt>
              <dd className="text-muted-foreground">
                {source ? (
                  <>
                    {source.title}
                    {source.author ? `, by ${source.author}` : ""} — {sourceTypeLabel(source.source_type).toLowerCase()}.
                  </>
                ) : (
                  "Nobody has attached a source to this date yet, so there is nothing to check it against."
                )}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">What the date rests on</dt>
              <dd className="text-muted-foreground">
                {claim.evidence?.trim() || "No evidence has been written up for this date yet."}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">How it was worked out</dt>
              <dd className="text-muted-foreground">
                {datingMethodLabel(claim.dating_method)}
                {datingMethodHint(claim.dating_method) ? ` — ${datingMethodHint(claim.dating_method)}` : ""}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Exact, or an estimate?</dt>
              <dd className="text-muted-foreground">
                {claim.is_approximate || claim.date_precision !== "exact_date"
                  ? `An estimate, given to the nearest ${precisionLabel(claim.date_precision).toLowerCase()}. The "c." means circa — around this time.`
                  : "Given as an exact date."}
              </dd>
            </div>

            {claim.notes && (
              <div>
                <dt className="font-medium text-foreground">Notes</dt>
                <dd className="text-muted-foreground">{claim.notes}</dd>
              </div>
            )}

            <div>
              <dt className="font-medium text-foreground">Other dates proposed for this event</dt>
              <dd className="text-muted-foreground">
                {competing.length === 0 ? (
                  "None yet — this is the only date anyone has put forward here."
                ) : (
                  <ul className="mt-1.5 space-y-1.5">
                    {competing.map((other) => {
                      const otherSource = other.source_id ? sourcesById.get(other.source_id) ?? null : null;
                      return (
                        <li key={other.id} className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-medium text-foreground">{formatClaim(other)}</span>
                          <span>
                            {otherSource ? otherSource.title : "no source given"}
                            {other.chronology ? ` · ${chronologyLabel(other.chronology)}` : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </dd>
            </div>

            {disagreement && disagreement.years > 0 && (
              <div>
                <dt className="font-medium text-foreground">How far apart they are</dt>
                <dd className="text-muted-foreground">
                  The earliest and latest dates proposed here are about {formatDuration(disagreement.years)} apart.
                  {disagreement.isApproximate &&
                    " Some of these dates are themselves approximate, so treat that gap as a rough sense of the disagreement rather than a measurement."}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
