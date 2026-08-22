"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import type { AuthEventRange, EventPeople } from "@/lib/data/auth-analytics";
import type { AuthEventType } from "@/types/database";
import { loadEventPeople } from "./active-people-actions";
import { CopyEmails } from "./active/copy-emails";
import { TilePanel, TilePanelSkeleton, useTilePanel } from "./tile-panel";

export type EventTile = {
  key: AuthEventType;
  label: string;
  hint: string;
  value: number;
  // Movement that isn't good news, which shouldn't wear the same colour as
  // movement that is.
  negative?: boolean;
};

// The signup / confirmed / sign-in / join / invited / left tiles, each
// expanding the people behind it in place — the same treatment as the presence
// tiles above, so the whole page behaves one way.
export function EventTiles({
  tiles,
  range,
  sourceLabels,
}: {
  tiles: EventTile[];
  range: AuthEventRange;
  // Human wording for the `source` column, owned by the page.
  sourceLabels: Record<string, string>;
}) {
  const panel = useTilePanel<AuthEventType, EventPeople>(async (key) => {
    const result = await loadEventPeople(key, range);
    return "error" in result ? { error: result.error } : { data: result.events };
  });

  const openTile = tiles.find((t) => t.key === panel.shownKey);
  const emails = panel.shown
    ? [...new Set(panel.shown.events.map((e) => e.email).filter((email): email is string => Boolean(email)))]
    : [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((tile) => {
          const live = tile.value > 0;
          const isOpen = panel.open === tile.key;
          return (
            <button
              key={tile.key}
              type="button"
              onClick={() => panel.toggle(tile.key)}
              onMouseEnter={() => panel.prefetch(tile.key)}
              onFocus={() => panel.prefetch(tile.key)}
              aria-expanded={isOpen}
              aria-controls="event-people-panel"
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                live
                  ? tile.negative
                    ? "border-danger/40 bg-danger/5"
                    : "border-accent/40 bg-accent-soft/40"
                  : "border-border",
                isOpen && "border-accent bg-accent-soft ring-1 ring-accent/30",
                "hover:border-accent"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    live ? (tile.negative ? "text-danger" : "text-accent") : "text-foreground"
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

      <div id="event-people-panel">
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
                    {panel.shown.events.length} {openTile ? openTile.label.toLowerCase() : ""}
                    {panel.shown.uniquePeople !== panel.shown.events.length && (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {panel.shown.uniquePeople} {panel.shown.uniquePeople === 1 ? "person" : "people"}
                      </span>
                    )}
                  </p>
                  <CopyEmails emails={emails} />
                </div>

                {panel.shown.emailLookup === "unavailable" && (
                  <p className="mb-2 text-xs text-danger">Email addresses couldn&apos;t be loaded.</p>
                )}
                {panel.shown.truncated && (
                  <p className="mb-2 text-xs text-danger">
                    Only the most recent are listed, so this may be incomplete.
                  </p>
                )}

                {panel.shown.events.length === 0 ? (
                  <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                    Nothing of this kind in the selected range.
                  </p>
                ) : (
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {panel.shown.events.map((event) => {
                      const name = event.user?.full_name || event.user?.username || "Deleted account";
                      return (
                        <li key={event.id} className="flex items-start gap-3 px-4 py-2.5">
                          <Avatar src={event.user?.avatar_url ?? null} name={name} size={36} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {event.user ? (
                                <Link href={`/platform-admin/users/${event.user.id}`} className="hover:underline">
                                  {name}
                                </Link>
                              ) : (
                                name
                              )}
                              {event.user && (
                                <span className="font-normal text-muted-foreground"> @{event.user.username}</span>
                              )}
                            </p>
                            {event.email ? (
                              <a
                                href={`mailto:${event.email}`}
                                className="block truncate text-sm text-foreground/80 select-all hover:underline"
                              >
                                {event.email}
                              </a>
                            ) : (
                              <p className="text-sm text-muted-foreground">No email on file</p>
                            )}
                            <p className="truncate text-xs text-muted-foreground">
                              {formatRelativeTime(event.createdAt)} · {formatDateTime(event.createdAt)}
                              {event.source ? ` · ${sourceLabels[event.source] ?? event.source}` : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            {event.communityName &&
                              (event.communitySlug ? (
                                <Link href={`/c/${event.communitySlug}`} className="text-xs hover:underline">
                                  {event.communityName}
                                </Link>
                              ) : (
                                <span className="text-xs text-muted-foreground">{event.communityName}</span>
                              ))}
                            {event.communityPrivacy && event.communityPrivacy !== "public" && (
                              <Badge tone="neutral">{event.communityPrivacy}</Badge>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
