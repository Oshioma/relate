"use client";

import { useState, useTransition } from "react";
import { ArrowDown, BookMarked, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineSource } from "@/types/database";
import { emptySourceDraft, type SourceDraft } from "@/lib/timeline/draft";
import { sourceChain, chainVerb } from "@/lib/timeline/source-chain";
import { sourceTierLabel, sourceTypeLabel, WIKIPEDIA_SOURCE_TYPE } from "@/lib/timeline/taxonomy";
import { SourceFields } from "./source-fields";
import { addUnderlyingSource } from "./actions";

// WHERE DID THIS ACTUALLY COME FROM?
//
// An encyclopedia entry is a summary of other people's work. The work is listed
// at the bottom of the article, and following that list is the single most
// useful research habit this feature can teach — so the product asks for it by
// name, and then keeps the answer:
//
//   Wikipedia
//     ↓ cites
//   Academic book
//     ↓ references
//   Excavation report
//
// The prompt is a nudge, never a warning. Citing Wikipedia is not an error and
// nothing here says it is; the only thing worth saying is that there is
// somewhere further to go, and an offer to record it when somebody gets there.

export function SourceChainPanel({
  source,
  sources,
  communitySlug,
  canContribute,
}: {
  source: TimelineSource;
  /** Every source the community has, so the chain is a walk rather than a query. */
  sources: TimelineSource[];
  communitySlug: string;
  canContribute: boolean;
}) {
  // Anything added here is appended locally as well as saved, so the chain
  // grows under the contributor's hands instead of after a page refresh.
  const [added, setAdded] = useState<TimelineSource[]>([]);
  const [draft, setDraft] = useState<SourceDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  // Each saved source already carries the `cited_by_source_id` that puts it in
  // the walk, so appending it to the pool is the whole of "show it straight
  // away" — no second list to keep in step, and the walk stays the one
  // definition of what the chain is.
  const chain = sourceChain(source.id, [...sources, ...added]);

  const deepest = chain.length > 0 ? chain[chain.length - 1] : source;
  const asksForOriginal = source.source_type === WIKIPEDIA_SOURCE_TYPE || source.source_type === "encyclopedia";
  const nothingYet = chain.length === 0;

  function save() {
    if (!draft) return;
    setError(null);
    startSaving(async () => {
      const result = await addUnderlyingSource(communitySlug, deepest.id, draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setAdded((existing) => [...existing, result.source]);
      setDraft(null);
    });
  }

  // Nothing to say: not an encyclopedia, no chain recorded, and nobody here can
  // add one. Rendering an empty "Where this came from" would be worse than
  // rendering nothing.
  if (nothingYet && !asksForOriginal && !canContribute) return null;

  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Where this came from
      </p>

      <ol className="mt-2 space-y-1.5">
        <ChainNode source={source} first />
        {chain.map((link, index) => (
          <li key={link.id}>
            <p className="flex items-center gap-1.5 py-0.5 pl-1 text-xs text-muted-foreground">
              <ArrowDown className="h-3 w-3" />
              {chainVerb(index === 0 ? source : chain[index - 1], link)}
            </p>
            <ChainNode source={link} />
          </li>
        ))}
      </ol>

      {/* The nudge. Shown for an encyclopedia entry that hasn't been followed
          up yet — once somebody has, the chain itself says everything. */}
      {asksForOriginal && nothingYet && (
        <div className="mt-3 flex gap-2.5 rounded-lg bg-card p-3">
          <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">Can you find the original source?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {sourceTypeLabel(source.source_type)} summarises other people&apos;s work and lists it at the bottom of
              the page. See what the date actually comes from — a book, a paper, an excavation report — and add it here
              so the next person can follow the same trail.
            </p>
          </div>
        </div>
      )}

      {canContribute && !draft && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setDraft(emptySourceDraft());
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          {nothingYet ? "Add underlying source" : "Add what that one references"}
        </button>
      )}

      {draft && (
        <div className="mt-3">
          <p className="mb-2 text-xs text-muted-foreground">
            The source <span className="font-medium text-foreground">{shortTitle(deepest.title)}</span> led you to. It
            becomes a source of its own — any other date in this community can cite it too.
          </p>
          <SourceFields
            value={draft}
            onChange={setDraft}
            onCancel={() => {
              setDraft(null);
              setError(null);
            }}
            communitySlug={communitySlug}
            heading="The source underneath"
            cancelLabel="Cancel"
          />
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          <div className="mt-2 flex gap-2">
            <Button type="button" size="sm" onClick={save} disabled={saving || !draft.title.trim()}>
              {saving ? "Saving…" : "Save underlying source"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChainNode({ source, first = false }: { source: TimelineSource; first?: boolean }) {
  const tier = sourceTierLabel(source.source_type);
  return (
    <div className={first ? "" : "pl-1"}>
      <p className="text-sm font-medium text-foreground">{source.title}</p>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium">{sourceTypeLabel(source.source_type)}</span>
        {/* A fact about the kind of document, printed in the same neutral chip
            as everything else here. Never a mark out of ten. */}
        {tier && <span>{tier}</span>}
        {source.author && <span>{source.author}</span>}
        {source.reference && <span>{source.reference}</span>}
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            Open <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </p>
    </div>
  );
}

function shortTitle(title: string): string {
  return title.length > 40 ? `${title.slice(0, 39)}…` : title;
}
