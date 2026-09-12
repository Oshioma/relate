"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ExternalLink, ImageDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PictureCandidate } from "@/lib/timeline/suggest-pictures";

// ---------------------------------------------------------------------------
// CHOOSING A PICTURE FROM A SEARCH, WITHOUT BEING TOLD WHICH ONE IS RIGHT.
//
// A search result looks authoritative. It arrives ranked, it arrives with a
// thumbnail, and the thumbnail of a ziggurat at Ur looks exactly as convincing
// whether or not it was built a thousand years after the thing on the record.
//
// So this panel is built to slow the choice down at the one point where it
// matters:
//
//   • Every candidate prints WHY IT WAS SUGGESTED, in words. "Found by the
//     place name" and "found by words from the title" are different, and the
//     second is much weaker.
//   • Every candidate links to its Commons page, because the description there
//     is the only place that says what the picture actually is.
//   • Choosing one fills in the ADDRESS AND THE CREDIT and nothing else. The
//     caption and "what does this show" stay empty, in the fields that were
//     already there, because those are the two that mislead a reader when they
//     are wrong.
//   • Nothing is ordered by a score, because there is no score. The order is
//     the order Commons returned, grouped by what matched.
// ---------------------------------------------------------------------------

type Props = {
  /** Null while the record is still unsaved — there is nothing to search from yet. */
  eventId: string | null;
  onSearch: (eventId: string) => Promise<
    { error: string } | { candidates: PictureCandidate[]; searched: string[]; failed: string[] }
  >;
  /** Adds a picture slot carrying this address and credit, and nothing else. */
  onChoose: (candidate: PictureCandidate) => void;
};

const WHY: Record<PictureCandidate["matchedOn"]["kind"], string> = {
  place: "Found by the place on this record",
  person: "Found by a person named on this record",
  civilisation: "Found by a civilisation named on this record",
  title: "Found by words from the title — the weakest kind of match",
};

export function SuggestPicturesPanel({ eventId, onSearch, onChoose }: Props) {
  const [candidates, setCandidates] = useState<PictureCandidate[] | null>(null);
  const [searched, setSearched] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [pending, startSearch] = useTransition();

  if (!eventId) {
    return (
      <p className="text-xs text-muted-foreground">
        Save the record first and the search will have a title and a place to work from.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() =>
            startSearch(async () => {
              setError(null);
              const result = await onSearch(eventId);
              if ("error" in result) {
                setError(result.error);
                setCandidates(null);
                return;
              }
              setCandidates(result.candidates);
              setSearched(result.searched);
              setFailed(result.failed);
            })
          }
        >
          <Search className="mr-1.5 h-4 w-4" />
          {pending ? "Searching Wikimedia Commons…" : "Suggest pictures"}
        </Button>
        {searched.length > 0 && (
          // What was searched for, so a person can see that a bad set of
          // suggestions is a bad query rather than an empty Commons.
          <span className="text-xs text-muted-foreground">
            Searched for {searched.map((term) => `“${term}”`).join(", ")}
            {failed.length > 0 && ` · ${failed.length} search${failed.length === 1 ? "" : "es"} did not answer`}
          </span>
        )}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {candidates?.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Nothing came back. Adding a place name or a person to the record gives the search something specific to
          work with — a title on its own is usually too general to find anything.
        </p>
      )}

      {candidates && candidates.length > 0 && (
        <>
          <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">These are search results, not answers.</strong> A picture of the
            right place can still be of the wrong century — open the Commons page and read what it is before you
            choose it. Choosing fills in the address and the credit only; you write what it shows and what it is a
            picture of, because those are the parts that mislead a reader when they are wrong.
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {candidates.map((candidate) => {
              const taken = chosen.has(candidate.fileName);
              return (
                <li key={candidate.fileName} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
                      {/* unoptimized: this is a preview of a file on somebody
                          else's server that may never be chosen, and running it
                          through the image pipeline would cache a picture the
                          community has not taken. */}
                      <Image
                        src={candidate.thumbnailUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-medium">{candidate.fileName}</p>
                      <p className={cn("mt-0.5 text-[11px]", candidate.matchedOn.kind === "title" ? "text-danger" : "text-muted-foreground")}>
                        {WHY[candidate.matchedOn.kind]} (“{candidate.matchedOn.value}”)
                      </p>
                      {candidate.description && (
                        <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{candidate.description}</p>
                      )}
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {candidate.credit ?? "Commons does not state an author or licence for this file."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <a
                      href={candidate.filePageUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2"
                    >
                      Read what it is on Commons
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button
                      type="button"
                      size="sm"
                      variant={taken ? "ghost" : "secondary"}
                      disabled={taken}
                      onClick={() => {
                        onChoose(candidate);
                        setChosen((current) => new Set(current).add(candidate.fileName));
                      }}
                    >
                      <ImageDown className="mr-1.5 h-4 w-4" />
                      {taken ? "Added below" : "Use this one"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
