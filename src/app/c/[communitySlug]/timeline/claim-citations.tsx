"use client";

import { CheckCircle2, CircleAlert, Info } from "lucide-react";
import type { TimelineClaimSource, TimelineSource } from "@/types/database";
import { sourceTierLabel, sourceTypeLabel } from "@/lib/timeline/taxonomy";
import { cn } from "@/lib/utils";

// THE OTHER SOURCES ON A CLAIM.
//
// One source asserts the date. These are everything else a reader needs to
// weigh it: the further evidence, the published criticism, the context.
//
// The critical one is "disputes". A timeline that can only list things
// agreeing with a claim teaches the wrong lesson — and a critique sitting
// silently in a row of citations reads as corroboration, which is worse than
// leaving it out. So the relationship is named, given its own colour and its
// own icon, and the disputing sources are listed FIRST, where they cannot be
// mistaken for support.
//
// None of this is a score. "Disputes" means a published work argues against
// this date. It does not mean the date is wrong, and nothing here adds up to
// a verdict.

const RELATION_META = {
  disputes: {
    label: "Argues against this date",
    icon: CircleAlert,
    className: "text-danger",
  },
  supports: {
    label: "Supports this date",
    icon: CheckCircle2,
    className: "text-accent",
  },
  context: {
    label: "Context",
    icon: Info,
    className: "text-muted-foreground",
  },
} as const;

// Criticism first. Everything else in the order it was attached.
const RELATION_ORDER: Record<string, number> = { disputes: 0, supports: 1, context: 2 };

export function ClaimCitations({
  citations,
  sourcesById,
}: {
  citations: TimelineClaimSource[];
  sourcesById: Map<string, TimelineSource>;
}) {
  if (citations.length === 0) return null;

  const ordered = [...citations].sort(
    (a, b) => (RELATION_ORDER[a.relation] ?? 9) - (RELATION_ORDER[b.relation] ?? 9) || a.sort_order - b.sort_order
  );

  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Also on this date
      </p>

      <ul className="mt-2 space-y-2.5">
        {ordered.map((citation) => {
          const source = sourcesById.get(citation.source_id);
          if (!source) return null;
          const meta = RELATION_META[citation.relation] ?? RELATION_META.context;
          const Icon = meta.icon;
          const tier = sourceTierLabel(source.source_type);

          return (
            <li key={citation.id} className="flex gap-2.5">
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.className)} />
              <div className="min-w-0">
                <p className={cn("text-xs font-semibold", meta.className)}>{meta.label}</p>
                <p className="text-sm font-medium text-foreground">{source.title}</p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  {source.author && <span>{source.author}</span>}
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                    {sourceTypeLabel(source.source_type)}
                  </span>
                  {tier && <span>{tier}</span>}
                  {source.reference && <span>{source.reference}</span>}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      Open
                    </a>
                  )}
                </p>
                {/* Why it is attached to THIS claim — the line that stops a
                    citation list being a pile of titles nobody can act on. */}
                {citation.note && <p className="mt-1 text-sm text-muted-foreground">{citation.note}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
