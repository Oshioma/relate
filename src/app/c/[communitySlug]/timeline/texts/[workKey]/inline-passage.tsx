"use client";

import { useState } from "react";
import Link from "@/components/ui/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { readPassageInline, type InlinePassage, type InlinePassageLayer } from "../actions";
import { ImageFigure } from "../archive-ui";

// A PASSAGE OPENS WHERE IT IS LISTED.
//
// Most passages bring nothing to their own page but the words: the pictures
// there are the whole text's, the same ones beside the contents. So the
// contents list opens a passage underneath itself, and the reader stays on one
// page. A passage with pictures of its own shows them here too, beside its
// words, as its own page does. The full page is still a link away, and is
// pointed at when the passage has dates or connections of its own.

export function InlinePassageRow({
  communitySlug,
  passageKey,
  href,
  label,
  summary,
  unverifiedLabel,
}: {
  communitySlug: string;
  passageKey: string;
  href: string;
  label: string;
  summary: string | null;
  unverifiedLabel: string | null;
}) {
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; passage: InlinePassage }
  >({ kind: "idle" });

  const load = async () => {
    setState({ kind: "loading" });
    const result = await readPassageInline(communitySlug, passageKey);
    setState("error" in result ? { kind: "error", message: result.error } : { kind: "ready", passage: result.passage });
  };

  return (
    <details
      className="group"
      onToggle={(event) => {
        if (event.currentTarget.open && (state.kind === "idle" || state.kind === "error")) void load();
      }}
    >
      <summary className="flex cursor-pointer list-none items-start gap-1.5 rounded-md px-2 py-1 text-sm hover:bg-muted">
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
        <span className="min-w-0">
          <span className="text-foreground">{label}</span>
          {summary && <span className="block text-xs text-muted-foreground">{summary}</span>}
          {unverifiedLabel && <span className="text-[11px] text-muted-foreground"> · {unverifiedLabel}</span>}
        </span>
      </summary>

      <div className="mb-3 ml-7 mt-1 space-y-3">
        {state.kind === "loading" && (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening the passage…
          </p>
        )}
        {state.kind === "error" && (
          <p className="text-sm text-danger">
            {state.message}{" "}
            <button type="button" onClick={() => void load()} className="font-medium underline">
              Try again
            </button>
          </p>
        )}
        {state.kind === "ready" && <Opened passage={state.passage} href={href} />}
      </div>
    </details>
  );
}

function Opened({ passage, href }: { passage: InlinePassage; href: string }) {
  const firstTranslation = passage.layers.find((layer) => !layer.original && layer.content);
  const words = (
    <div className="min-w-0 space-y-3">
      {passage.layers.length === 0 && (
        <p className="text-sm italic text-muted-foreground">No words are recorded for this passage yet.</p>
      )}
      {passage.layers.map((layer) => (
        <LayerCard key={layer.id} layer={layer} />
      ))}
      <Link href={href} className="inline-block text-sm text-accent hover:underline">
        {passage.moreOnFullPage ? "Open the full page for its dates and connections" : "Open on its own page"}
      </Link>
    </div>
  );
  if (passage.images.length === 0) return words;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4">
        {passage.images.map((image) => (
          <ImageFigure
            key={image.id}
            image={image}
            aside={
              firstTranslation ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {firstTranslation.heading}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-foreground">{firstTranslation.content}</p>
                </div>
              ) : undefined
            }
          />
        ))}
      </div>
      {words}
    </div>
  );
}

function LayerCard({ layer }: { layer: InlinePassageLayer }) {
  return (
    <article className={cn("rounded-xl border bg-card p-4", layer.original ? "border-accent/40" : "border-border")}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{layer.heading}</h3>
      {layer.content ? (
        <p
          lang={
            layer.language === "Ancient Greek"
              ? "grc"
              : layer.language === "Arabic"
                ? "ar"
                : layer.language === "Latin"
                  ? "la"
                  : undefined
          }
          dir={layer.language === "Arabic" ? "rtl" : undefined}
          className={cn("mt-2 whitespace-pre-line leading-relaxed text-foreground", layer.original ? "text-lg" : "text-base")}
        >
          {layer.content}
        </p>
      ) : (
        <p className="mt-2 text-sm italic text-muted-foreground">{layer.absentReason}</p>
      )}
      {layer.source && (
        <p className="mt-2 text-xs text-muted-foreground">
          {layer.source.author ? `${layer.source.author}, ` : ""}
          {layer.source.url ? (
            <a href={layer.source.url} target="_blank" rel="noreferrer" className="hover:underline">
              {layer.source.title}
            </a>
          ) : (
            layer.source.title
          )}
          {layer.source.year ? ` (${layer.source.year})` : ""}
        </p>
      )}
    </article>
  );
}
