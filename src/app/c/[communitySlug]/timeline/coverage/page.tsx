import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { communityHasTimeline, timelinePath } from "@/lib/timeline/availability";
import {
  COVERAGE_STATUS_LABELS,
  FLOOD_COVERAGE,
  coverageCounts,
  type CoverageStatus,
} from "@/lib/timeline/flood-coverage";

// WHAT THIS TIMELINE COVERS, AT ITS OWN ADDRESS.
//
// This page exists because a comparison across regions is only as good as the
// collecting behind it, and twenty-odd traditions on a timeline look like a
// survey of the world when they are a survey of what could be sourced.
//
// It is public rather than staff-only on purpose: the limits of a dataset are
// not an internal maintenance detail, they are part of what the dataset means.
// A reader who can see that sub-Saharan Africa is empty BECAUSE OF THE
// LITERATURE, and that Egypt is empty because nobody has looked, is reading
// something quite different from a reader who just sees two blanks.

export const metadata: Metadata = {
  title: "What this timeline covers",
};

const STATUS_STYLES: Record<CoverageStatus, string> = {
  covered: "bg-muted text-muted-foreground",
  // The two kinds of gap that are ABOUT SOMETHING get the accent; "nobody has
  // looked yet" is the honest majority and should not shout.
  no_verifiable_source: "bg-accent-soft text-foreground ring-1 ring-border",
  under_collected: "bg-danger/10 text-danger",
  not_attempted: "bg-muted/60 text-muted-foreground",
};

export default async function CoveragePage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();

  const counts = coverageCounts();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={timelinePath(community.slug)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to the timeline
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        What this timeline covers, and what it does not
      </h1>

      <div className="mt-4 space-y-3 text-base text-foreground">
        <p>
          A comparison across regions is only ever as good as the collecting behind it. The flood traditions on this
          timeline look like a survey of the world. They are a survey of{" "}
          <strong>what could be sourced</strong> — published, digitised, in a language that could be read, and
          checkable against something.
        </p>
        <p>
          So every gap below says why it is a gap, and the reasons are not interchangeable. An unverifiable citation, a
          literature that never collected the material, and nobody having looked yet are three completely different
          facts, and an empty row without a reason reads as a statement about the people.
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(COVERAGE_STATUS_LABELS) as CoverageStatus[]).map((status) => (
          <div key={status} className="rounded-xl border border-border bg-card p-3">
            <dt className="text-xs text-muted-foreground">{COVERAGE_STATUS_LABELS[status]}</dt>
            <dd className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">{counts[status]}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {FLOOD_COVERAGE.map((row, index) => (
          <li key={`${row.region}-${row.tradition ?? index}`} className="p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-semibold text-foreground">{row.region}</span>
              {row.tradition && <span className="text-sm text-muted-foreground">— {row.tradition}</span>}
              <span
                className={cn(
                  "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  STATUS_STYLES[row.status]
                )}
              >
                {COVERAGE_STATUS_LABELS[row.status]}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{row.note}</p>
            {row.slugs && row.slugs.length > 0 && (
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {row.slugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`${timelinePath(community.slug)}/${slug}`}
                    className="text-accent hover:underline"
                  >
                    {slug}
                  </Link>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        The records named here are resolved against the seeded data by a test, so this page cannot claim coverage it
        does not have. If a record is removed, its region stops naming it rather than keeping a line that is no longer
        true.
      </p>
    </div>
  );
}
