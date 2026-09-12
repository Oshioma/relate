"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { timelineCategory } from "@/lib/timeline/taxonomy";
import { claimHeadline, claimMidpoint, compareClaims, describeComparison, presentPosition } from "@/lib/timeline/time";

// The chronological list.
//
// On a phone this is the primary way in, not a fallback. Asking a child to hit
// a four-pixel dot on a strip covering thirteen billion years is asking them to
// fail; the strip stays above for the SHAPE of time, and the list underneath is
// how you actually reach an event. On desktop it's a toggle, because a list is
// genuinely better for "read everything in order".

function earliest(event: TimelineEventWithClaims): number {
  // Sorted by the earliest thing anybody PLACES. An event also carrying "no
  // finite beginning" sorts by its dated claims; one carrying nothing but
  // positionless claims has no place in a chronological order and goes to the
  // front, where the list's own heading explains it.
  const placed = event.claims.map(claimMidpoint).filter((midpoint): midpoint is number => midpoint != null);
  if (placed.length === 0) return 0;
  return Math.min(...placed);
}

/**
 * THE PICTURE, WHERE THE CATEGORY ICON WAS.
 *
 * A reader scanning this list had no way to tell which records carry a picture
 * and which do not without opening every one of them — and since the pictures
 * were added a few at a time, "does this have one yet?" is a real question
 * somebody working through the list needs answered at a glance.
 *
 * The category is not dropped for it. It moves to a badge on the corner, which
 * is small but is the same coloured chip it was before, so a row still says
 * what kind of record it is.
 *
 * A THUMBNAIL THAT FAILS TO LOAD MUST NOT LEAVE A HOLE. These addresses can be
 * remote, and a remote picture fails for reasons nothing here controls — so a
 * failed load falls back to exactly the icon that would have been there
 * anyway, rather than to a broken-image glyph. The row is never worse than it
 * was before pictures existed.
 */
function EventThumbnail({
  src,
  title,
  chipClass,
  Icon,
}: {
  src: string | null;
  title: string;
  chipClass: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", chipClass)}>
        <Icon className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="relative mt-0.5 h-10 w-10 shrink-0">
      {/* Plain <img> for the same reason every other timeline picture is one:
          these URLs are arbitrary and next/image would need every host listed.
          Empty alt — the title is right beside it, and a screen reader reading
          the caption here would say everything twice. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-10 w-10 rounded-lg border border-border object-cover"
      />
      <span
        className={cn(
          "absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-card",
          chipClass
        )}
        title={title}
      >
        <Icon className="h-2.5 w-2.5" />
      </span>
    </span>
  );
}

export function TimelineList({
  events,
  onSelect,
  selectedId,
  emptyMessage = "Nothing here yet.",
}: {
  events: TimelineEventWithClaims[];
  onSelect: (event: TimelineEventWithClaims) => void;
  selectedId: string | null;
  emptyMessage?: string;
}) {
  const ordered = useMemo(() => [...events].sort((a, b) => earliest(a) - earliest(b)), [events]);
  const now = presentPosition();

  if (ordered.length === 0) {
    return <p className="px-1 py-6 text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {ordered.map((event) => {
        const meta = timelineCategory(event.category);
        const Icon = meta.icon;
        const comparison = compareClaims(event.claims);
        const disputed = comparison != null && (comparison.kind === "apart" || comparison.kind === "contains");
        const isFuture = earliest(event) > now;

        return (
          <li key={event.id}>
            <button
              type="button"
              onClick={() => onSelect(event)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60",
                event.id === selectedId && "bg-accent-soft"
              )}
            >
              <EventThumbnail
                src={event.image_url || event.media?.[0]?.url || null}
                title={meta.label}
                chipClass={meta.chipClass}
                Icon={Icon}
              />

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-medium text-foreground">{event.title}</span>
                  {isFuture && (
                    <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                      Not yet
                    </span>
                  )}
                  {event.status === "pending" && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Pending
                    </span>
                  )}
                </span>

                <span className="mt-0.5 block text-sm tabular-nums text-muted-foreground">
                  {event.claims.length > 0 ? claimHeadline(event.claims[0]).headline : "No date proposed yet"}
                  {disputed && event.claims.length > 1 && (
                    <>
                      {" · "}
                      {event.claims.length} proposed dates
                    </>
                  )}
                </span>

                {event.summary && <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{event.summary}</span>}

                {disputed && comparison && (
                  <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-danger/8 px-2 py-0.5 text-[11px] font-medium text-danger">
                    <Scale className="h-3 w-3" />
                    {describeComparison(comparison).headline}
                  </span>
                )}
              </span>

              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
