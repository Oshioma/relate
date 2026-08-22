"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveWindowKey, ActivePeople } from "@/lib/data/auth-analytics";
import { loadActivePeople } from "./active-people-actions";
import { ActivePeopleList } from "./active-people-list";

export type ActiveTile = {
  key: ActiveWindowKey;
  label: string;
  hint: string;
  value: number;
};

// The four presence tiles, each of which expands the list of people behind it
// underneath the row — in place, rather than sending the operator to another
// page and back. The list is fetched the first time a tile is opened and then
// kept, so flicking between windows is instant after the first look.
export function ActiveTiles({ tiles }: { tiles: ActiveTile[] }) {
  const [open, setOpen] = useState<ActiveWindowKey | null>(null);
  const [cache, setCache] = useState<Partial<Record<ActiveWindowKey, ActivePeople>>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(key: ActiveWindowKey) {
    if (open === key) {
      setOpen(null);
      return;
    }
    setOpen(key);
    setError(null);
    if (cache[key]) return;

    startTransition(async () => {
      const result = await loadActivePeople(key);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setCache((current) => ({ ...current, [key]: result.people }));
    });
  }

  const shown = open ? cache[open] : undefined;
  const openTile = tiles.find((t) => t.key === open);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => {
          const live = tile.value > 0;
          const isOpen = open === tile.key;
          return (
            <button
              key={tile.key}
              type="button"
              onClick={() => toggle(tile.key)}
              aria-expanded={isOpen}
              aria-controls="active-people-panel"
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                // A tile with something in it picks up the platform accent —
                // already a sage green — so a glance shows where the activity
                // is. Zero stays plain rather than competing for attention.
                live ? "border-accent/40 bg-accent-soft/40" : "border-border",
                isOpen && "border-accent bg-accent-soft ring-1 ring-accent/30",
                "hover:border-accent"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    live ? "text-accent" : "text-foreground"
                  )}
                >
                  {tile.value.toLocaleString()}
                </p>
                <ChevronDown
                  className={cn(
                    "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180 text-accent"
                  )}
                />
              </div>
              <p className="text-xs font-medium text-foreground">{tile.label}</p>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{tile.hint}</p>
            </button>
          );
        })}
      </div>

      {/* The 0fr → 1fr grid row is what makes this animate smoothly without
          hard-coding a height: the content measures itself, and the row grows
          to meet it. A max-height guess would either clip a long list or ease
          out over empty space. */}
      <div
        id="active-people-panel"
        // Kept mounted so it can animate both ways, but `inert` while closed:
        // a zero-height overflow-hidden box still holds tabbable links and is
        // still read by a screen reader otherwise.
        inert={!open}
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {/* Nothing at all until a tile has been opened once — a collapsed
              panel shouldn't ship a skeleton nobody asked for. */}
          {(open || shown) && (
          <div className="rounded-lg border border-border bg-card p-4">
            {error ? (
              <p className="text-sm text-danger">{error}</p>
            ) : pending && !shown ? (
              <LoadingRows />
            ) : shown ? (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {shown.people.length} {shown.people.length === 1 ? "person" : "people"}{" "}
                    {openTile ? openTile.label.toLowerCase() : ""}
                  </p>
                  {open && (
                    <Link
                      href={`/platform-admin/analytics/active?window=${open}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Open as a page <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
                <ActivePeopleList result={shown} />
              </>
            ) : (
              <LoadingRows />
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton rows rather than a spinner: the panel is already expanding, so
// something roughly list-shaped keeps the motion from landing on nothing.
function LoadingRows() {
  return (
    <div className="space-y-3" aria-busy="true">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
