"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { discoverAndAddEvents } from "./discover-actions";

export function DiscoverEventsPanel({ communitySlug, locationName }: { communitySlug: string; locationName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const router = useRouter();

  function handleDiscover() {
    setError(null);
    setNotice(null);
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
          setNotice(
            `Added ${result.imported} event${result.imported === 1 ? "" : "s"} to the calendar: ${result.titles.join(", ")}`,
          );
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
        <Button size="sm" variant="secondary" onClick={handleDiscover} disabled={isSearching}>
          {isSearching ? "Searching the web…" : "Discover events"}
        </Button>
      </div>

      {isSearching && (
        <p className="mt-3 text-xs text-muted-foreground">This can take a minute — the AI is checking event listings.</p>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {notice && <p className="mt-3 text-sm text-foreground">{notice}</p>}
    </div>
  );
}
