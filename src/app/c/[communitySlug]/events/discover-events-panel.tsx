"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { discoverAndAddEvents, backfillEventImages, type AddedEvent } from "./discover-actions";

export function DiscoverEventsPanel({ communitySlug, locationName }: { communitySlug: string; locationName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [added, setAdded] = useState<AddedEvent[] | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isBackfilling, startBackfill] = useTransition();
  const router = useRouter();

  function handleDiscover() {
    setError(null);
    setNotice(null);
    setAdded(null);
    startSearch(async () => {
      try {
        const result = await discoverAndAddEvents(communitySlug);
        if ("error" in result) {
          setError(result.error);
          return;
        }
        if (result.imported === 0) {
          setNotice(`No new events found for ${locationName} right now.`);
        } else {
          setNotice(`Added ${result.imported} event${result.imported === 1 ? "" : "s"} to the calendar:`);
          setAdded(result.added);
          router.refresh();
        }
      } catch {
        // The server action never returned — usually the hosting platform
        // killed the function at its time limit mid-search.
        setError(
          "The search didn't complete — the server request failed or timed out. Check the function logs (and the function max duration) in your hosting dashboard.",
        );
      }
    });
  }

  function handleBackfill() {
    setError(null);
    setNotice(null);
    setAdded(null);
    startBackfill(async () => {
      try {
        const result = await backfillEventImages(communitySlug);
        if ("error" in result) {
          setError(result.error);
          return;
        }
        if (result.updated === 0) {
          setNotice(
            result.checked === 0
              ? "Every event already has an image."
              : "Couldn't find a usable image for any event missing one.",
          );
        } else {
          setNotice(`Added images to ${result.updated} event${result.updated === 1 ? "" : "s"}.`);
          router.refresh();
        }
      } catch {
        setError("Fetching images failed — the server request didn't complete. Try again.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-accent" /> AI event discovery
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Search the web for upcoming events in {locationName} and add them straight to the calendar, featured
            with a photo where we can find one.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleBackfill} disabled={isSearching || isBackfilling}>
            {isBackfilling ? "Fetching…" : "Fetch missing images"}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDiscover} disabled={isSearching || isBackfilling}>
            {isSearching ? "Searching the web…" : "Discover events"}
          </Button>
        </div>
      </div>

      {isSearching && (
        <p className="mt-3 text-xs text-muted-foreground">This can take a minute — the AI is checking event listings.</p>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {notice && <p className="mt-3 text-sm text-foreground">{notice}</p>}
      {added && added.length > 0 && (
        <ul className="mt-2 space-y-1">
          {added.map((event, index) => (
            <li key={`${event.title}-${index}`} className="text-sm">
              {event.source_url ? (
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  {event.title} <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-foreground">{event.title}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
