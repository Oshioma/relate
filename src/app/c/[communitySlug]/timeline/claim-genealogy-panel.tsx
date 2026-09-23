import { AlertTriangle, ArrowDown, BookMarked, Landmark, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineSource } from "@/types/database";
import type { TimelineGenealogyWithLinks } from "@/lib/data/timeline";
import { genealogyShape, orderedLinks } from "@/lib/timeline/claim-genealogy";
import {
  citationBreaksChain,
  citationStatusHint,
  citationStatusLabel,
  claimVerdictHint,
  claimVerdictLabel,
  genealogyStageHint,
  genealogyStageLabel,
} from "@/lib/timeline/taxonomy";

// WHERE DID THIS CLAIM COME FROM?
//
// The evidence panel above this one runs downwards, from a statement to the
// object under it. This runs the other way: forwards, through the people who
// repeated a claim, because some claims cannot usefully be met with true or
// false.
//
// "Horus was crucified" is the case. A reader offered only a verdict loses the
// actual history — a real Egyptian object, a real nineteenth-century writer who
// read it a particular way, a chain of books that repeated him with the hedges
// falling off one at a time, and a modern claim that no longer resembles the
// object. This panel draws that chain.
//
// THREE THINGS IT PUTS IN FRONT OF THE READER BEFORE ANY VERDICT, because they
// are the questions people actually have:
//
//   Is there anything ancient at the bottom of this at all?
//   Where does the claim, in the form I heard it, first appear?
//   Does the chain hold, or does it stop somewhere?
//
// Every one of those is computed in claim-genealogy.ts rather than written
// here, because a sentence can be typed without checking and a function
// cannot — and because the test runner cannot import .tsx.

function StatLine({ children, tone }: { children: React.ReactNode; tone?: "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "warn" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function ClaimGenealogyPanel({
  genealogies,
  sourcesById,
}: {
  genealogies: TimelineGenealogyWithLinks[];
  sourcesById: Map<string, TimelineSource>;
}) {
  // Most records carry none, and draw nothing rather than an empty promise.
  if (genealogies.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Where did this claim come from?
      </h2>
      <p className="mb-5 max-w-3xl text-sm text-muted-foreground">
        Some claims are better answered by tracing them than by judging them. Each chain below runs oldest first, and
        every link says what it actually states and what it added that the link before it did not. Where a citation
        leads nowhere, it is marked — everything after a broken link rests on that link.
      </p>

      <div className="space-y-6">
        {genealogies.map((genealogy) => {
          const links = orderedLinks(genealogy.links);
          const shape = genealogyShape(genealogy.links);

          return (
            <div key={genealogy.id} className="rounded-xl border border-border bg-card">
              <div className="border-b border-border p-4 sm:p-5">
                {/* The claim in the words people actually use for it. A reader
                    arrives having met the popular phrasing, and has to be able
                    to recognise it. */}
                <p className="text-base font-semibold leading-snug text-foreground">
                  &ldquo;{genealogy.claim}&rdquo;
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-foreground"
                    title={claimVerdictHint(genealogy.verdict)}
                  >
                    {claimVerdictLabel(genealogy.verdict) ?? genealogy.verdict}
                  </span>

                  {/* The structural answers, before the verdict is read and
                      independent of it. */}
                  <StatLine tone={shape.ancientBase ? undefined : "warn"}>
                    <Landmark className="h-3.5 w-3.5" />
                    {shape.ancientBase ? "Has an ancient source at the bottom" : "No ancient source in this chain"}
                  </StatLine>

                  {shape.entersAt && (
                    <StatLine>
                      <BookMarked className="h-3.5 w-3.5" />
                      Claim enters with {shape.entersAt.who}
                      {shape.entersAt.year ? `, ${shape.entersAt.year}` : ""}
                    </StatLine>
                  )}

                  {shape.breaksAt && (
                    <StatLine tone="warn">
                      <Unlink className="h-3.5 w-3.5" />
                      Chain breaks at {shape.breaksAt.who}
                      {shape.breaksAt.year ? `, ${shape.breaksAt.year}` : ""}
                    </StatLine>
                  )}

                  {shape.unread > 0 && (
                    <StatLine>
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {shape.unread} of {shape.linkCount} links not read
                    </StatLine>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {genealogy.verdict_evidence}
                </p>

                {/* Never optional. A verdict whose conditions for being
                    overturned nobody can state is an opinion wearing a label. */}
                <div className="mt-3 rounded-lg border-l-4 border-l-accent bg-accent-soft/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    What would change this
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {genealogy.what_would_change_this}
                  </p>
                </div>
              </div>

              <ol className="p-4 sm:p-5">
                {links.map((genealogyLink, index) => {
                  const broken = citationBreaksChain(genealogyLink.citation_status);
                  const unread = !genealogyLink.says?.trim();
                  const source = genealogyLink.source_id ? sourcesById.get(genealogyLink.source_id) ?? null : null;

                  return (
                    <li key={genealogyLink.id}>
                      {index > 0 && (
                        <div className="flex justify-center py-1" aria-hidden>
                          <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "rounded-lg border p-3.5",
                          broken ? "border-destructive/40 bg-destructive/5" : "border-border bg-background",
                        )}
                      >
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span
                            className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                            title={genealogyStageHint(genealogyLink.stage)}
                          >
                            {genealogyStageLabel(genealogyLink.stage) ?? genealogyLink.stage}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{genealogyLink.who}</span>
                          {genealogyLink.year !== null && genealogyLink.year !== undefined && (
                            <span className="font-mono text-xs text-muted-foreground">{genealogyLink.year}</span>
                          )}
                        </div>

                        {genealogyLink.reference && (
                          <p className="mt-1 font-mono text-xs text-muted-foreground">{genealogyLink.reference}</p>
                        )}
                        {source && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {source.author ? `${source.author} · ` : ""}
                            {source.title}
                          </p>
                        )}

                        {/* WHAT THIS LINK SAYS — not what the next link reports
                            it as saying. A link nobody has opened says so, and
                            is not quietly filled in from downstream. */}
                        {unread ? (
                          <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
                            Not read here. {genealogyLink.says_absent_reason}
                          </p>
                        ) : (
                          <blockquote className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground">
                            {genealogyLink.says}
                          </blockquote>
                        )}

                        {/* The field this whole structure exists for. */}
                        {genealogyLink.adds && (
                          <p className="mt-2.5 text-sm leading-relaxed text-foreground">
                            <span className="font-semibold">Adds: </span>
                            {genealogyLink.adds}
                          </p>
                        )}

                        {genealogyLink.citation_status && (
                          <p
                            className={cn(
                              "mt-2 text-xs",
                              broken ? "font-semibold text-destructive" : "text-muted-foreground",
                            )}
                            title={citationStatusHint(genealogyLink.citation_status)}
                          >
                            Citation: {citationStatusLabel(genealogyLink.citation_status) ?? genealogyLink.citation_status}
                            {broken && " — everything after this rests on it"}
                          </p>
                        )}

                        {genealogyLink.notes && (
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{genealogyLink.notes}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
