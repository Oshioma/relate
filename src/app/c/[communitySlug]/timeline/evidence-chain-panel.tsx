"use client";

import { useState } from "react";
import { BookOpen, FileText, Landmark, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineSource } from "@/types/database";
import type { TimelinePassageWithLayers } from "@/lib/data/timeline";
import {
  DEFAULT_VISIBLE_TOGGLES,
  availableToggles,
  interpretationCount,
  isCitationOnly,
  missingLayers,
  reachesTheEvidence,
  translationCount,
  visibleChainLayers,
  type EvidenceToggleKey,
} from "@/lib/timeline/evidence-chain";
import {
  evidenceLayerHint,
  evidenceLayerIsOurVoice,
  evidenceLayerIsWitness,
  evidenceLayerLabel,
  sourceTierLabel,
} from "@/lib/timeline/taxonomy";

// HOW DO WE KNOW THAT?
//
// Everything else on this page is a statement. This is the part a reader can
// walk backwards through until they reach a papyrus — the object, the writing
// on it, somebody's transcription, somebody's transliteration, one or more
// translations, and only then anybody's account of what it means.
//
// THE RULE THE WHOLE PANEL IS BUILT ON: a reader must always be able to tell
// whose voice they are reading. The witness layers and the modern ones are
// drawn differently, labelled differently, and separated by a line that says
// what it is separating. There is no view in which they run together, and
// there is no field here called "fact".
//
// Every piece of logic lives in evidence-chain.ts rather than here, because the
// test runner cannot import .tsx and because each of those decisions is a
// judgement about how evidence is presented — the kind of thing that ought to
// be pinned by a test rather than checked by eye.

function SourceLine({ source, fallback }: { source: TimelineSource | null; fallback: string }) {
  if (!source) return <span className="text-xs text-muted-foreground">{fallback}</span>;
  const tier = sourceTierLabel(source.source_type);
  return (
    <span className="text-xs text-muted-foreground">
      {source.author ? `${source.author} · ` : ""}
      {source.title}
      {source.published_display ? ` (${source.published_display})` : ""}
      {tier ? ` · ${tier}` : ""}
    </span>
  );
}

export function EvidenceChainPanel({
  passages,
  sourcesById,
}: {
  passages: TimelinePassageWithLayers[];
  sourcesById: Map<string, TimelineSource>;
}) {
  const [enabled, setEnabled] = useState<EvidenceToggleKey[]>(DEFAULT_VISIBLE_TOGGLES);

  // A record with no passages is the normal state of most of this timeline,
  // and it draws nothing at all rather than an empty promise of evidence.
  if (passages.length === 0) return null;

  const toggles = availableToggles(passages);

  function toggle(key: EvidenceToggleKey) {
    setEnabled((current) =>
      current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key],
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        How do we know that?
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
        The surviving evidence and every step between it and what this page says. Each step was taken by somebody, and
        each is named. Nothing here is collapsed into a single statement of fact — where translators disagree, both
        translations are shown.
      </p>

      {/* The controls. Only the ones this record actually has: a toggle for a
          layer no passage carries would imply a transliteration exists and has
          been hidden. */}
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Which layers of the evidence to show">
        {toggles.map((option) => {
          const on = enabled.includes(option.key);
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => toggle(option.key)}
              aria-pressed={on}
              title={option.hint}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                on
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {on ? "Showing" : "Show"} {option.label.toLowerCase()}
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        {passages.map((passage) => {
          const shown = visibleChainLayers(passage.layers, enabled);
          const translations = translationCount(passage.layers);
          const readings = interpretationCount(passage.layers);
          const grounded = reachesTheEvidence(passage.layers);
          const absent = missingLayers(passage.layers);
          const passageSource = passage.source_id ? sourcesById.get(passage.source_id) ?? null : null;

          return (
            <div key={passage.id} className="rounded-xl border border-border bg-card">
              {/* WHERE THIS IS. The reference is what makes the passage
                  checkable by somebody holding the same edition, and the object
                  is kept apart from the publication about it. */}
              <div className="border-b border-border p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{passage.label}</h3>
                    {passage.reference && (
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{passage.reference}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {passage.object_name && <span>{passage.object_name}</span>}
                      {passage.object_name && passage.holding_institution ? " · " : ""}
                      {passage.holding_institution}
                      {passage.accession_number ? ` · ${passage.accession_number}` : ""}
                    </p>
                    {passageSource && (
                      <p className="mt-1">
                        <SourceLine source={passageSource} fallback="" />
                      </p>
                    )}
                  </div>
                </div>

                {/* A passage with no object, text or transcription is somebody
                    talking about a text that is not here. That is a real state
                    for a record to be in and the panel says so, rather than
                    letting commentary stand where the evidence should be. */}
                {!grounded && (
                  <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    No original text, transcription or object is recorded for this passage. Everything below is at one
                    or more removes from the evidence.
                  </p>
                )}

                {translations > 1 && (
                  <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    {translations} translations are shown. They differ, and the difference is the point — no one of
                    them is this page&apos;s preferred version.
                  </p>
                )}
                {readings > 1 && (
                  <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    {readings} readings of what this passage means are shown, each with the scholar who argues it.
                  </p>
                )}
              </div>

              {shown.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground sm:p-5">
                  Every layer of this passage is switched off. Turn one back on above.
                </p>
              ) : (
                <ol className="divide-y divide-border">
                  {shown.map((layer) => {
                    const witness = evidenceLayerIsWitness(layer.layer);
                    const ours = evidenceLayerIsOurVoice(layer.layer);
                    const source = layer.source_id ? sourcesById.get(layer.source_id) ?? null : null;
                    const citationOnly = isCitationOnly(layer);

                    return (
                      <li key={layer.id} className={cn("p-4 sm:p-5", ours && "bg-muted/30")}>
                        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                            {witness ? <Quote className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                            {evidenceLayerLabel(layer.layer)}
                          </span>
                          {/* WHOSE VOICE. Said in words on every row, because a
                              reader who scrolls into the commentary without
                              noticing has been told the papyrus said it. An
                              unrecognised layer claims neither. */}
                          {ours && (
                            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                              Modern voice, not the text&apos;s
                            </span>
                          )}
                          {(layer.language || layer.script) && (
                            <span className="text-xs text-muted-foreground">
                              {[layer.language, layer.script].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </div>

                        {citationOnly ? (
                          <p className="flex gap-2 text-sm text-muted-foreground">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{layer.content_absent_reason}</span>
                          </p>
                        ) : (
                          <p
                            className={cn(
                              "whitespace-pre-wrap text-foreground",
                              layer.layer === "transliteration"
                                ? "font-serif italic"
                                : layer.layer === "primary_text"
                                  ? "text-lg leading-relaxed"
                                  : "text-sm leading-relaxed",
                            )}
                          >
                            {layer.content}
                          </p>
                        )}

                        <p className="mt-2">
                          <SourceLine
                            source={source}
                            fallback={
                              witness ? "No source named for this rendering" : "No source named for this reading"
                            }
                          />
                        </p>

                        {layer.evidence && (
                          <p className="mt-1.5 text-xs text-muted-foreground">{layer.evidence}</p>
                        )}
                        {layer.notes && <p className="mt-1 text-xs text-muted-foreground">{layer.notes}</p>}

                        <p className="sr-only">{evidenceLayerHint(layer.layer)}</p>
                      </li>
                    );
                  })}
                </ol>
              )}

              {/* WHAT IS NOT HERE. An absent layer is invisible, and a reader
                  cannot ask for something they do not know is possible. */}
              {absent.length > 0 && (
                <p className="border-t border-border p-4 text-xs text-muted-foreground sm:px-5">
                  Not recorded for this passage: {absent.map((key) => evidenceLayerLabel(key)?.toLowerCase()).join(", ")}
                  .
                </p>
              )}

              {passage.notes && (
                <p className="border-t border-border p-4 text-xs text-muted-foreground sm:px-5">{passage.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
