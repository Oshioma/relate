"use client";

import { useState } from "react";
import { HelpCircle, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineDateClaim, TimelineSource } from "@/types/database";
import {
  claimHeadline,
  compareClaims,
  describeComparison,
  formatDuration,
} from "@/lib/timeline/time";
import {
  chronologyLabel,
  datingMethodLabel,
  sourceTierLabel,
  sourceTypeLabel,
  viewpointBlurb,
  viewpointOrder,
} from "@/lib/timeline/taxonomy";

// MAINSTREAM AND ALTERNATIVE, SIDE BY SIDE.
//
// The claims on an event are already listed below this panel, one card each.
// What that list cannot show is the SHAPE of the disagreement: that four of the
// dates come out of academic archaeology and one comes out of a biblical
// chronology, and that the two bodies of thought differ by four hundred years
// for a reason a learner can be told.
//
// Grouping by viewpoint is what makes that visible. Two rules govern it:
//
//   1. IT IS NOT A RANKING. "Mainstream / established view" sits first because
//      it is the account most readers arrive holding, not because it wins. The
//      panel says so in as many words, every time, and there are no scores,
//      percentages, stars, traffic lights or badges anywhere in it — nor will
//      there be.
//
//   2. THE NUMBERS COME FROM compareClaims. Every distance printed here is the
//      same calculation the disagreement banner and the "Why this date?" panel
//      use, so the three can never contradict each other, and none of them ever
//      states a gap more precisely than the coarsest claim allows.

type Group = {
  key: string;
  label: string;
  hint: string;
  claims: TimelineDateClaim[];
};

/** The claims, split by whose account they come out of. */
function groupByViewpoint(claims: TimelineDateClaim[]): Group[] {
  const groups = new Map<string, TimelineDateClaim[]>();
  for (const claim of claims) {
    const key = claim.chronology?.trim() || "";
    const list = groups.get(key);
    if (list) list.push(claim);
    else groups.set(key, [claim]);
  }

  return [...groups.entries()]
    .map(([key, grouped]) => ({
      key,
      label: key ? chronologyLabel(key) : "Viewpoint not stated",
      hint: key ? viewpointBlurb(key) : "Nobody has said which account this date comes out of.",
      claims: grouped,
    }))
    // Unstated last; otherwise the dropdown's own order, so this panel and the
    // form agree about what comes first.
    .sort((a, b) => (a.key === "" ? 1 : b.key === "" ? -1 : viewpointOrder(a.key) - viewpointOrder(b.key)));
}

export function ViewpointComparison({
  claims,
  sourcesById,
}: {
  claims: TimelineDateClaim[];
  sourcesById: Map<string, TimelineSource>;
}) {
  const [openWhy, setOpenWhy] = useState(false);
  const groups = groupByViewpoint(claims);

  // One viewpoint is not a comparison. The cards below already say everything
  // there is to say, and a panel headed "side by side" with one column in it
  // would be an invitation to look for a disagreement that isn't there.
  if (groups.length < 2) return null;

  const [first, ...rest] = groups;
  const overall = compareClaims(claims);

  return (
    <div className="mb-4 rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Scale className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              {groups.length} different accounts, side by side
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Grouped by whose account each date comes out of. The order is the order they usually come up in — it is
              not a ranking, and nothing here says which one is right. That is the reader&apos;s job, and the evidence
              for each is under its own card below.
            </p>
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.key || "unstated"} className="p-4">
            <p className="text-sm font-semibold text-foreground">{group.label}</p>
            {group.hint && <p className="mt-0.5 text-xs text-muted-foreground">{group.hint}</p>}
            <ul className="mt-2.5 space-y-2.5">
              {group.claims.map((claim) => {
                const source = claim.source_id ? sourcesById.get(claim.source_id) ?? null : null;
                const { headline } = claimHeadline(claim);
                return (
                  <li key={claim.id}>
                    <p className="text-base font-semibold tracking-tight text-foreground">{headline}</p>
                    <p className="text-xs text-muted-foreground">
                      {source ? source.title : "No source given"}
                      {source && sourceTierLabel(source.source_type)
                        ? ` · ${sourceTierLabel(source.source_type)}`
                        : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setOpenWhy((open) => !open)}
          aria-expanded={openWhy}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
            openWhy ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent hover:opacity-90"
          )}
        >
          <HelpCircle className="h-4 w-4" />
          Why are these dates different?
        </button>

        {openWhy && (
          <div className="mt-4 space-y-4 text-sm">
            <p className="text-muted-foreground">
              Dates are worked out, not simply known — and two accounts can reach different answers because they start
              from different evidence, count in different ways, or are answering slightly different questions. Here is
              what each of these is built on.
            </p>

            {groups.map((group) => (
              <div key={group.key || "unstated"} className="rounded-lg bg-muted/40 p-3.5">
                <p className="font-medium text-foreground">{group.label}</p>
                <dl className="mt-1.5 space-y-1.5 text-sm">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground">Worked out by:</dt>
                    <dd className="text-foreground">{listMethods(group.claims)}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground">From this kind of source:</dt>
                    <dd className="text-foreground">{listSourceKinds(group.claims, sourcesById)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">What it rests on:</dt>
                    <dd className="text-foreground">
                      {group.claims
                        .map((claim) => claim.evidence?.trim())
                        .filter(Boolean)
                        .join(" ") || "Nobody has written up the reasoning behind this one yet."}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}

            {/* The distance between each other account and the first —
                computed by the same function as everything else, so this panel
                and the banner above it can never quote different numbers. The
                caveat about approximate dates is printed ONCE underneath
                rather than repeated on every row, where it stopped being read
                after the first one. */}
            {rest.length > 0 && (
              <div>
                <p className="font-medium text-foreground">How far apart they are</p>
                <ul className="mt-1.5 space-y-1.5 text-muted-foreground">
                  {rest.map((group) => {
                    const pair = compareClaims([...first.claims, ...group.claims]);
                    if (!pair) return null;
                    return (
                      <li key={group.key || "unstated"}>
                        <span className="font-medium text-foreground">
                          {first.label} vs {group.label}:
                        </span>{" "}
                        {pair.kind === "identical"
                          ? "the same point in time."
                          : pair.kind === "overlap"
                            ? "their windows overlap, so there is a stretch of time both allow."
                            : `about ${formatDuration(pair.spreadYears, pair.granularityYears)} apart.`}
                      </li>
                    );
                  })}
                </ul>
                {overall?.anyApproximate && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Some of these dates are themselves approximate or given as ranges, so read those distances as
                    roughly how far apart the accounts sit — not as a measurement.
                  </p>
                )}
              </div>
            )}

            {overall && overall.kind !== "single" && (
              <p className="text-muted-foreground">{describeComparison(overall).headline}</p>
            )}

            <p className="rounded-lg bg-accent-soft/50 p-3.5 text-foreground">
              None of this settles which is right. What it does is make the disagreement readable: who says what, on
              what evidence, worked out how. Follow each source, look at what it rests on, and decide for yourself —
              that is the skill this timeline exists to practise.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function listMethods(claims: TimelineDateClaim[]): string {
  const methods = [...new Set(claims.map((claim) => datingMethodLabel(claim.dating_method)))];
  return methods.join(", ");
}

function listSourceKinds(claims: TimelineDateClaim[], sourcesById: Map<string, TimelineSource>): string {
  const kinds = [
    ...new Set(
      claims.map((claim) => {
        const source = claim.source_id ? sourcesById.get(claim.source_id) : null;
        return source ? sourceTypeLabel(source.source_type) : "No source given";
      })
    ),
  ];
  return kinds.join(", ");
}
