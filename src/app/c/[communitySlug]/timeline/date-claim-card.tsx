"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, HelpCircle, Ruler, Compass, ScrollText, Quote, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineDateClaim, TimelineSource } from "@/types/database";
import {
  claimHeadline,
  claimInterval,
  compareClaims,
  describeComparison,
  dateUnitLabel,
  formatClaimDate,
  formatDateParts,
  formatDuration,
} from "@/lib/timeline/time";
import { chronologyLabel, datingMethodHint, datingMethodLabel, sourceTypeLabel } from "@/lib/timeline/taxonomy";

// One proposed date, with everything a reader needs to weigh it FOR THEMSELVES.
//
// There is no credibility badge here, deliberately. The question this card
// answers is "how did somebody arrive at this date?", not "how sure is Relate
// that it's right?" — and those two questions pull in opposite directions. A
// rating invites a learner to accept or dismiss a claim without reading it; the
// source, the method and the evidence invite them to read it.
//
// The order says so: the source's OWN WORDING first where there is one, then
// who says it, then how they worked it out, then what it rests on.

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

/** When the source itself was made — never the same fact as the date it is cited for. */
export function sourceMadeText(source: TimelineSource): string | null {
  if (source.published_display?.trim()) return source.published_display.trim();
  if (source.published_year == null) return null;
  return `${source.published_is_approximate ? "c. " : ""}${formatDateParts(source.published_year, source.published_month, source.published_day)}`;
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
  const made = sourceMadeText(source);

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
  onEdit,
  onRemove,
}: {
  claim: TimelineDateClaim;
  source: TimelineSource | null;
  /** Every claim on this event, including this one — what "competing dates" means. */
  siblings: TimelineDateClaim[];
  sourcesById: Map<string, TimelineSource>;
  index: number;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  const [openWhy, setOpenWhy] = useState(false);
  const competing = siblings.filter((other) => other.id !== claim.id);
  const comparison = compareClaims(siblings);
  const { headline, normalised, quoted } = claimHeadline(claim);
  const interval = claimInterval(claim);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xl font-semibold tracking-tight text-foreground">{headline}</p>
            {/* Where that wording puts the event on the axis. Shown whenever the
                headline is the source's own words, so the reader can always see
                the normalisation rather than having it done silently. */}
            {quoted && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                On the timeline: <span className="font-medium text-foreground">{normalised}</span>
              </p>
            )}
          </div>
          {(onEdit || onRemove) && (
            <div className="flex shrink-0 gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Edit this proposed date"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-danger"
                  aria-label="Remove this proposed date"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {claim.is_approximate && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Approximate
            </span>
          )}
          {interval.kind === "range" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              A range, not a single date
            </span>
          )}
          {interval.kind === "tolerance" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Measured, with a stated ±
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
          <Field icon={<Compass className="h-4 w-4" />} label="Chronology / viewpoint">
            {chronologyLabel(claim.chronology)}
            <p className="text-xs text-muted-foreground">The framework this date is calculated in.</p>
          </Field>
          <Field icon={<ScrollText className="h-4 w-4" />} label="Precision given">
            {dateUnitLabel(claim.date_precision)}
            {claim.precision_decimals > 0 && (
              <span className="text-muted-foreground"> · to {claim.precision_decimals} decimal places</span>
            )}
          </Field>
        </div>

        {claim.evidence && (
          <div className="mt-4 rounded-lg bg-muted/40 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              What this date rests on
            </p>
            <p className="mt-1 text-sm text-foreground">{claim.evidence}</p>
          </div>
        )}

        {claim.notes && (
          <div className="mt-3 flex gap-2.5">
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
          from something — this is where the something goes, and where the
          reader is handed everything needed to judge it themselves. */}
      {openWhy && (
        <div className="border-t border-border bg-muted/40 p-4 text-sm sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Why this date?</p>

          <dl className="mt-3 space-y-3">
            <div>
              <dt className="font-medium text-foreground">Proposed date</dt>
              <dd className="text-muted-foreground">{normalised}</dd>
            </div>

            {quoted && (
              <div>
                <dt className="flex items-center gap-1.5 font-medium text-foreground">
                  <Quote className="h-3.5 w-3.5" /> The source gives the date as
                </dt>
                <dd className="text-foreground">
                  <span className="rounded bg-card px-1.5 py-0.5 font-medium">{headline}</span>
                  <span className="ml-2 text-muted-foreground">— word for word, in the source&apos;s own notation.</span>
                </dd>
              </div>
            )}

            <div>
              <dt className="font-medium text-foreground">Who proposes it</dt>
              <dd className="text-muted-foreground">
                {source ? (
                  <>
                    {source.title}
                    {source.author ? `, by ${source.author}` : ""} — {sourceTypeLabel(source.source_type).toLowerCase()}.
                    {sourceMadeText(source) ? ` The source itself was made ${sourceMadeText(source)}.` : ""}
                  </>
                ) : (
                  "Nobody has attached a source to this date yet, so there is nothing to check it against."
                )}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Source type</dt>
              <dd className="text-muted-foreground">
                {source ? sourceTypeLabel(source.source_type) : "Not stated."}
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
              <dt className="font-medium text-foreground">Evidence and reasoning</dt>
              <dd className="text-muted-foreground">
                {claim.evidence?.trim() || "Nobody has written up the reasoning behind this date yet."}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Chronology / viewpoint</dt>
              <dd className="text-muted-foreground">
                {chronologyLabel(claim.chronology)} — the framework this date is calculated within. Naming it is not the
                same as agreeing with it; it is what lets you compare it with the others below.
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Exact, or an estimate?</dt>
              <dd className="text-muted-foreground">{precisionSentence(claim, interval.kind)}</dd>
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
                          <span className="font-medium text-foreground">{formatClaimDate(other)}</span>
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

            {comparison && comparison.kind !== "single" && (
              <div>
                <dt className="font-medium text-foreground">Difference between the claims</dt>
                <dd className="text-muted-foreground">
                  {describeComparison(comparison).headline}{" "}
                  {describeComparison(comparison).detail}
                </dd>
              </div>
            )}

            {source?.url && (
              <div>
                <dt className="font-medium text-foreground">Go and look</dt>
                <dd>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                  >
                    View source <ExternalLink className="h-3 w-3" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}

/** What the claim's own precision means, said plainly and without inventing any. */
function precisionSentence(claim: TimelineDateClaim, kind: ReturnType<typeof claimInterval>["kind"]): string {
  const unit = dateUnitLabel(claim.date_precision).toLowerCase();

  if (kind === "tolerance") {
    const plus = claim.uncertainty_plus ?? claim.uncertainty_minus ?? 0;
    return `A measured value, given to within ${formatDuration(plus)} either way. The ± is the source's own figure, not ours.`;
  }
  if (kind === "range") {
    return "A range: the source places it somewhere between these two points rather than at one of them.";
  }
  if (claim.is_approximate) {
    return `An estimate, given to the nearest ${unit}. The "c." means circa — around this time.`;
  }
  return `Given as a ${unit}${claim.precision_decimals > 0 ? `, to ${claim.precision_decimals} decimal places` : ""}, with no further precision claimed.`;
}
