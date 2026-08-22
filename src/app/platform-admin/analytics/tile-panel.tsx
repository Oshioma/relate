"use client";

import { useCallback, useRef, useState, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared machinery for "click a stat tile, the detail expands underneath it".
// Used by both the presence tiles and the event tiles so the two behave
// identically and the animation only has to be right once.

export type TilePanelState<K extends string, T> = {
  open: K | null;
  // The content to render, which is NOT cleared the moment a panel closes —
  // see below.
  shown: T | undefined;
  shownKey: K | null;
  pending: boolean;
  error: string | null;
  toggle: (key: K) => void;
  prefetch: (key: K) => void;
};

export function useTilePanel<K extends string, T>(
  load: (key: K) => Promise<{ error: string } | { data: T }>,
  // Content already rendered with the page, seeded so the tile it belongs to
  // opens with no round trip and no transition at all.
  initialCache?: Partial<Record<K, T>>
): TilePanelState<K, T> {
  const [open, setOpen] = useState<K | null>(null);
  // Which key's content is on screen. It lags `open` by design: when a panel
  // closes we keep rendering what it held, so the box collapses over its own
  // content instead of snapping shut around nothing. That snap was the whole
  // reason the retract looked wrong.
  const [shownKey, setShownKey] = useState<K | null>(null);
  const [cache, setCache] = useState<Partial<Record<K, T>>>(initialCache ?? {});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Requests already in flight, so hovering and then clicking doesn't fetch
  // the same list twice.
  const inFlight = useRef<Set<K>>(new Set());

  const fetchInto = useCallback(
    (key: K, background: boolean) => {
      if (cache[key] || inFlight.current.has(key)) return;
      inFlight.current.add(key);

      const run = async () => {
        const result = await load(key);
        inFlight.current.delete(key);
        if ("error" in result) {
          // A failed prefetch is invisible on purpose — the click will retry
          // and can report it then.
          if (!background) setError(result.error);
          return;
        }
        setCache((current) => ({ ...current, [key]: result.data }));
      };

      // Only a real open blocks on a transition; a prefetch must never make
      // the UI look busy.
      if (background) void run();
      else startTransition(run);
    },
    [cache, load]
  );

  const toggle = useCallback(
    (key: K) => {
      if (open === key) {
        setOpen(null);
        return;
      }
      setOpen(key);
      setShownKey(key);
      setError(null);
      fetchInto(key, false);
    },
    [open, fetchInto]
  );

  // Warm the list on hover/focus, so the click usually opens onto data that is
  // already there.
  const prefetch = useCallback((key: K) => fetchInto(key, true), [fetchInto]);

  return {
    open,
    shown: shownKey ? cache[shownKey] : undefined,
    shownKey,
    pending,
    error,
    toggle,
    prefetch,
  };
}

// The expanding box. The 0fr → 1fr grid row is what animates smoothly without
// hard-coding a height: the content measures itself and the row grows to meet
// it, where a max-height guess would either clip a long list or ease out over
// empty space.
export function TilePanel({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      // Kept mounted so it animates both ways, but inert while closed: a
      // zero-height overflow-hidden box still holds tabbable links and is still
      // read by a screen reader otherwise.
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out",
        open ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

// Skeleton rows rather than a spinner: the panel is already expanding, so
// something roughly list-shaped keeps the motion from landing on nothing.
export function TilePanelSkeleton() {
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
