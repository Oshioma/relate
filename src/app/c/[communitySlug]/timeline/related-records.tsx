"use client";

import { useState } from "react";
import { ArrowRight, HelpCircle, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEventLink, TimelineSource } from "@/types/database";
import type { TimelineLinkedRecord } from "@/lib/data/timeline";
import { chronologyLabel, relationHint, relationLabel, viewpointOrder } from "@/lib/timeline/taxonomy";

// WHAT ELSE THIS RECORD IS TIED TO — AND WHO SAYS SO.
//
// The dates on an event already come with their sources, because a date is
// something somebody asserts. A RELATIONSHIP IS EXACTLY THE SAME KIND OF THING
// and this panel exists to stop it being drawn as though it weren't. "Mu is
// Lemuria" is not a fact the database discovered; it is a move particular
// writers made, and every row here carries who made it, in whose framework,
// and why — the same three questions a date claim answers.
//
// Three rules it follows:
//
//   1. NOTHING IS MERGED. Two records asserted to be the same thing stay two
//      records with an edge between them. The assertion is the interesting
//      part; merging would delete it.
//
//   2. THE WORDING INVERTS. An edge is stored once, from → to. Read from the
//      other end "comes before" has to read "comes after", or the reader is
//      told the opposite of what the row says. relationLabel does that; this
//      component's only job is to pass it the right direction.
//
//   3. A LINK IS NOT AN ENDORSEMENT. "Relevant to, without being evidence for"
//      exists so that Mauritia can sit beside Sclater's Lemuria — which is
//      genuinely where it belongs — without a reader taking the line between
//      them for support. The hint that says so is one click away on every row,
//      not buried in the form that created it.

type Row = {
  link: TimelineEventLink;
  /** "from" = this record is the edge's start; "to" = it is the far end. */
  direction: "from" | "to";
  other: TimelineLinkedRecord;
};

/** A source, as short as a citation can be and still be checkable. */
function citationLine(source: TimelineSource): string {
  const bits = [source.author, source.title].filter(Boolean) as string[];
  const said = bits.join(" — ") || source.title;
  return source.published_display ? `${said} (${source.published_display})` : said;
}

export function RelatedRecords({
  eventId,
  links,
  records,
  sources,
  communitySlug,
}: {
  eventId: string;
  /** Every edge in the community; the ones touching this record are picked out here. */
  links: TimelineEventLink[];
  /** The events at the far ends, by id — very often outside the visible window. */
  records: TimelineLinkedRecord[];
  sources: TimelineSource[];
  communitySlug: string;
}) {
  const [explaining, setExplaining] = useState<string | null>(null);

  const recordsById = new Map(records.map((record) => [record.id, record]));
  const sourcesById = new Map(sources.map((source) => [source.id, source]));

  const rows: Row[] = links
    .filter((link) => link.from_event_id === eventId || link.to_event_id === eventId)
    .flatMap((link) => {
      const direction: "from" | "to" = link.from_event_id === eventId ? "from" : "to";
      const otherId = direction === "from" ? link.to_event_id : link.from_event_id;
      const other = recordsById.get(otherId);
      // A row whose far end can't be named would be a link to nowhere — which
      // is what an unreadable or deleted record leaves behind. Dropped rather
      // than drawn as a dead title.
      return other ? [{ link, direction, other }] : [];
    })
    .sort(
      (a, b) =>
        a.link.sort_order - b.link.sort_order ||
        viewpointOrder(a.link.viewpoint) - viewpointOrder(b.link.viewpoint) ||
        a.other.title.localeCompare(b.other.title)
    );

  if (rows.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Related records ({rows.length})
      </h2>
      {/* Said once, at the top, in plain words: these connections were made by
          people, and the panel names them. Without this line a list of arrows
          reads like the database's own verdict on what goes with what. */}
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        Connections somebody asserted — not conclusions this timeline has reached. Each one says who made it and in
        whose account, the same way a date does.
      </p>

      <ul className="space-y-2">
        {rows.map((row) => {
          const { link, direction, other } = row;
          const source = link.source_id ? sourcesById.get(link.source_id) ?? null : null;
          const hint = relationHint(link.relation);
          const open = explaining === link.id;

          return (
            <li key={link.id} className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  <Link2 className="h-3.5 w-3.5" />
                  {relationLabel(link.relation, direction)}
                </span>
                {/* WHOSE ORDERING. Theosophy putting Lemuria before Atlantis
                    and Steiner doing the same are two claims, not one, and they
                    are two rows here for that reason — the chip is what makes
                    the pair legible rather than redundant. */}
                {link.viewpoint && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {chronologyLabel(link.viewpoint)}
                  </span>
                )}
                {hint && (
                  <button
                    type="button"
                    onClick={() => setExplaining(open ? null : link.id)}
                    aria-expanded={open}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    {open ? "Hide" : "What does this mean?"}
                  </button>
                )}
              </div>

              {open && hint && <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>}

              <a
                href={`/c/${communitySlug}/timeline/${other.slug}`}
                className="mt-1.5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-foreground hover:text-accent hover:underline"
              >
                {other.title}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>

              {link.note && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{link.note}</p>}

              {source && (
                <p className={cn("mt-1.5 text-xs text-muted-foreground")}>
                  Asserted in: <span className="font-medium text-foreground">{citationLine(source)}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
