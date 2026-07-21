"use client";

import { useState, useTransition } from "react";
import { Sparkles, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { discoverEvents, importDiscoveredEvents } from "./discover-actions";
import type { DiscoveredEvent } from "@/lib/ai/discover-events";

export function DiscoverEventsPanel({ communitySlug, locationName }: { communitySlug: string; locationName: string }) {
  const [candidates, setCandidates] = useState<DiscoveredEvent[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isImporting, startImport] = useTransition();

  function handleDiscover() {
    setError(null);
    setNotice(null);
    startSearch(async () => {
      const result = await discoverEvents(communitySlug);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setCandidates(result.events);
      setSelected(new Set(result.events.map((_, i) => i)));
    });
  }

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleImport() {
    if (!candidates) return;
    setError(null);
    startImport(async () => {
      const picked = candidates.filter((_, i) => selected.has(i));
      const result = await importDiscoveredEvents(communitySlug, picked);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setCandidates(null);
      setSelected(new Set());
      setNotice(`Added ${result.imported} event${result.imported === 1 ? "" : "s"} to the calendar.`);
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
            Search the web for upcoming events in {locationName} and add them to your calendar.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleDiscover} disabled={isSearching || isImporting}>
          {isSearching ? "Searching the web…" : candidates ? "Search again" : "Discover events"}
        </Button>
      </div>

      {isSearching && (
        <p className="mt-3 text-xs text-muted-foreground">This can take a minute — the AI is checking event listings.</p>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {notice && <p className="mt-3 text-sm text-foreground">{notice}</p>}

      {candidates && !isSearching && (
        <div className="mt-4">
          {candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new events found for {locationName} right now.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {candidates.map((event, index) => (
                  <li key={`${event.title}-${event.start_time}`}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={selected.has(index)}
                        onChange={() => toggle(index)}
                        className="mt-1 h-4 w-4 accent-current"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">{event.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{formatDateTime(event.start_time)}</span>
                        {event.description && <span className="mt-1 block text-xs text-foreground">{event.description}</span>}
                        <span className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </span>
                          )}
                          {event.source_url && (
                            <a
                              href={event.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-accent hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" /> Source
                            </a>
                          )}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" onClick={handleImport} disabled={selected.size === 0 || isImporting}>
                  {isImporting ? "Adding…" : `Add ${selected.size} selected`}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setCandidates(null)} disabled={isImporting}>
                  Dismiss
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
