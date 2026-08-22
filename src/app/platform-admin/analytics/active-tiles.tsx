"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveWindowKey, ActivePeople } from "@/lib/data/auth-analytics";
import { loadActivePeople } from "./active-people-actions";
import { ActivePeopleList } from "./active-people-list";
import { TilePanel, TilePanelSkeleton, useTilePanel } from "./tile-panel";

export type ActiveTile = {
  key: ActiveWindowKey;
  label: string;
  hint: string;
  value: number;
};

// The four presence tiles, each expanding the list of people behind it in
// place. `initial` is the list for the first tile, rendered with the page — the
// one most likely to be opened costs no round trip at all.
export function ActiveTiles({ tiles, initial }: { tiles: ActiveTile[]; initial?: ActivePeople }) {
  const panel = useTilePanel<ActiveWindowKey, ActivePeople>(
    async (key) => {
      const result = await loadActivePeople(key);
      return "error" in result ? { error: result.error } : { data: result.people };
    },
    initial ? ({ [initial.window]: initial } as Partial<Record<ActiveWindowKey, ActivePeople>>) : undefined
  );

  const openTile = tiles.find((t) => t.key === panel.shownKey);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => {
          const live = tile.value > 0;
          const isOpen = panel.open === tile.key;
          return (
            <button
              key={tile.key}
              type="button"
              onClick={() => panel.toggle(tile.key)}
              // Warm the list before the click lands — most of the wait
              // disappears into the time it takes to move the mouse.
              onMouseEnter={() => panel.prefetch(tile.key)}
              onFocus={() => panel.prefetch(tile.key)}
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
                <p className={cn("text-2xl font-semibold tracking-tight", live ? "text-accent" : "text-foreground")}>
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

      <div id="active-people-panel">
        <TilePanel open={panel.open !== null}>
          {/* Mounted only once a tile has been opened. shownKey outlives `open`
              so a closing panel still has its content to collapse over — but
              before the first open there is nothing to keep. */}
          {(panel.open !== null || panel.shownKey !== null) && (
          <div className="rounded-lg border border-border bg-card p-4">
            {panel.error ? (
              <p className="text-sm text-danger">{panel.error}</p>
            ) : panel.shown ? (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {panel.shown.people.length} {panel.shown.people.length === 1 ? "person" : "people"}{" "}
                    {openTile ? openTile.label.toLowerCase() : ""}
                  </p>
                  {panel.shownKey && (
                    <Link
                      href={`/platform-admin/analytics/active?window=${panel.shownKey}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Open as a page <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
                <ActivePeopleList result={panel.shown} />
              </>
            ) : (
              <TilePanelSkeleton />
            )}
          </div>
          )}
        </TilePanel>
      </div>
    </div>
  );
}
