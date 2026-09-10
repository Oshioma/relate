"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TimelineSource } from "@/types/database";
import { findTimelineSources } from "./actions";
import { sourceTypeLabel } from "@/lib/timeline/taxonomy";
import { formatDateParts } from "@/lib/timeline/time";

// Finding the source somebody else already added.
//
// Sources are community-wide records precisely so that "what else does this
// book date?" is answerable. A community that ends up with "Herodotus —
// Histories" and "Herodotus Histories" as unrelated rows has lost that, and it
// happens by default: a blank "add a source" form is an invitation to retype
// one that already exists.
//
// So the box searches as you type, and offers what it finds BEFORE it offers to
// create anything.
//
// It suggests; it never merges. A different edition, translation, printing or
// manuscript of the same work legitimately IS a different source — the
// Anglo-Saxon Chronicle in a 1953 translation and in the Parker manuscript give
// different page references and were made at different times, and collapsing
// them by title would destroy exactly the distinction this feature teaches.
// "Used by 4 dates" is the signal that helps a person choose, rather than an
// algorithm choosing for them.

type FoundSource = TimelineSource & { useCount: number };

function sourceLine(source: TimelineSource): string {
  const parts = [source.author, source.publisher, source.work_title].filter(Boolean);
  const made =
    source.published_display?.trim() ||
    (source.published_year != null
      ? `${source.published_is_approximate ? "c. " : ""}${formatDateParts(source.published_year, source.published_month, source.published_day)}`
      : null);
  if (made) parts.push(made);
  return parts.join(" · ");
}

export function SourcePicker({
  communitySlug,
  selectedId,
  selectedSource,
  onSelect,
  onCreateNew,
}: {
  communitySlug: string;
  selectedId: string | null;
  /** The already-attached source, so an edit can show what is currently cited without a round trip. */
  selectedSource?: TimelineSource | null;
  onSelect: (source: TimelineSource | null) => void;
  onCreateNew: () => void;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<FoundSource[]>([]);
  const [loading, setLoading] = useState(false);
  // Open from the start. This panel only ever renders on the step that asks
  // "where does this date come from?", so hiding the answer — the community's
  // existing sources, and the button to add one — behind a click on the search
  // box just made the whole reuse flow invisible until you guessed.
  const [open, setOpen] = useState(true);
  const requestId = useRef(0);

  // Debounced, and last-write-wins: a slow answer for "hero" must not land on
  // top of a fast one for "herodotus".
  useEffect(() => {
    if (!open) return;
    const id = ++requestId.current;
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await findTimelineSources(communitySlug, term);
        if (id === requestId.current) setResults(found);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 220);
    return () => clearTimeout(handle);
  }, [term, communitySlug, open]);

  if (selectedId && selectedSource) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{selectedSource.title}</p>
          {sourceLine(selectedSource) && (
            <p className="truncate text-xs text-muted-foreground">{sourceLine(selectedSource)}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{sourceTypeLabel(selectedSource.source_type)}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Choose a different source"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search this community's sources — “Herodotus”, “Penguin”, “Planck”…"
          className="pl-9"
        />
      </div>

      {open && (
        <div className="mt-2 overflow-hidden rounded-lg border border-border bg-card">
          {loading && results.length === 0 && (
            <p className="px-3.5 py-3 text-sm text-muted-foreground">Looking…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-3.5 py-3 text-sm text-muted-foreground">
              {term.trim()
                ? `Nothing here matches “${term.trim()}” — add it as a new source below.`
                : "No sources in this community yet. The one you add will be here for everyone else to cite."}
            </p>
          )}

          {results.length > 0 && (
            <>
              <p className="border-b border-border bg-muted/40 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Sources this community already has
              </p>
              <ul className="max-h-64 divide-y divide-border overflow-y-auto">
                {results.map((source) => (
                  <li key={source.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(source);
                        setOpen(false);
                        setTerm("");
                      }}
                      className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{source.title}</span>
                        {sourceLine(source) && (
                          <span className="block truncate text-xs text-muted-foreground">{sourceLine(source)}</span>
                        )}
                        <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="rounded-full bg-muted px-1.5 py-0.5 font-medium">
                            {sourceTypeLabel(source.source_type)}
                          </span>
                          {source.useCount > 0 && (
                            <span>
                              already cited by {source.useCount} date{source.useCount === 1 ? "" : "s"}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              onCreateNew();
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2 border-t border-border px-3.5 py-3 text-left text-sm font-medium",
              "text-accent transition-colors hover:bg-accent-soft"
            )}
          >
            <Plus className="h-4 w-4" />
            Create a new source
          </button>

          {results.length > 0 && (
            <p className="border-t border-border bg-muted/30 px-3.5 py-2 text-[11px] text-muted-foreground">
              A different edition, translation or printing really is a different source — add a new one when that is
              what you have.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
