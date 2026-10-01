"use client";

import { useState } from "react";
import { Plus, Telescope } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaveUnsavedLesson } from "./save-unsaved-lesson";
import {
  AGE_BANDS,
  ageBandLabel,
  ageBandRank,
  canGoBeyondSource,
} from "@/lib/school/lesson-types";

// Adds another age level to the lesson on this page.
//
// Shown once, under the last level, and only offering the ages the page does
// not already have — one level per age is what keeps this from turning back
// into a pile of near-duplicates.
//
// A level OLDER than what is here is written to carry on from the levels above
// it rather than repeat them, and the panel says so, because that is the
// difference between this and pressing "write a lesson" again. A YOUNGER level
// is simply written for its age: it comes first on the page, so there is
// nothing above it to build on.
export function LessonAddLevel({
  lessonId,
  existingBands,
  communitySlug,
  spaceSlug,
}: {
  // Any level of the family: they all carry the same source.
  lessonId: string;
  existingBands: string[];
  communitySlug: string;
  spaceSlug: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Set when a level was written but couldn't be saved: the server kept it.
  const [unsavedId, setUnsavedId] = useState<string | null>(null);

  const missing = AGE_BANDS.filter((band) => !existingBands.includes(band.key));
  if (missing.length === 0) return null;

  const oldest = Math.max(...existingBands.map(ageBandRank));

  // A full load rather than a client refresh: it lands on the new level's
  // anchor reliably, with every level re-read.
  function openLevel(id: string) {
    const page = `/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lessonId}`;
    window.location.assign(`${page}#level-${id}`);
  }

  async function addLevel(ageBand: string) {
    setBusy(ageBand);
    setError(null);
    setUnsavedId(null);
    let newId: string | null = null;
    try {
      const response = await fetch(`/api/lessons/${lessonId}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageBand }),
      });

      if (!response.ok || !response.body) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Could not write the new level.");
        return;
      }

      // Same NDJSON stream as the composer. All that matters here is whether it
      // errored, and the id of the level it saved so the page can open on it.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let failed: string | null = null;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as {
              type: string;
              error?: string;
              row?: { id?: string };
              unsavedId?: string;
            };
            if (event.unsavedId) setUnsavedId(event.unsavedId);
            // A "done" without a row is a lesson that was written but could
            // not be saved — the server says why in its error.
            if (event.error && (event.type === "error" || event.type === "done")) {
              failed = event.error;
            }
            if ((event.type === "done" || event.type === "illustrated") && event.row?.id) {
              newId = event.row.id;
            }
          } catch {
            // A malformed line is not worth failing the run over.
          }
        }
      }

      // No saved level means nothing to show. Say so rather than reloading
      // the page and leaving it looking as if nothing happened — a stream that
      // ends with neither a row nor an error is a request the server cut off.
      if (!newId) {
        setError(
          failed ??
            "The new level didn't finish — the server stopped before it was saved. Try again."
        );
        return;
      }

      openLevel(newId);
    } catch {
      setError("The connection dropped while writing the new level.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-border p-5 sm:p-6">
      <p className="text-sm font-medium text-foreground">Add a level</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Write this same material for another age, on this page. An older level picks up where the
        ones above it stop, so it doesn&apos;t repeat them.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {missing.map((band) => {
          const beyond = canGoBeyondSource(band.key);
          return (
            <button
              key={band.key}
              type="button"
              disabled={busy !== null}
              onClick={() => addLevel(band.key)}
              title={
                ageBandRank(band.key) > oldest
                  ? "Builds on the levels above it"
                  : "Written for its own age"
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                beyond
                  ? "border-accent/40 bg-accent-soft text-accent hover:border-accent"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
              )}
            >
              {beyond ? <Telescope className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {band.label}
            </button>
          );
        })}
      </div>
      {missing.some((band) => canGoBeyondSource(band.key)) && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          The Adult level goes past the source (the history, the arguments and the stranger
          theories it leaves out), so it can&apos;t be checked against it.
        </p>
      )}
      {busy && (
        <p className="mt-2 text-xs text-muted-foreground">
          Writing the {ageBandLabel(busy)} level. This takes a minute or two…
        </p>
      )}
      {error && (
        <div className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
          {unsavedId && <SaveUnsavedLesson unsavedId={unsavedId} onSaved={openLevel} />}
        </div>
      )}
    </div>
  );
}
