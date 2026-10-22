"use client";

import type { DragEventHandler } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { setNavItemVisibility } from "./actions";
import { AutoSaveCheckbox } from "@/components/ui/auto-save-checkbox";
import type { FeatureKey } from "@/types/database";
import { AccessBox, DragHandle, ROW_GRID, TypeChip } from "./space-row-parts";

export type NextEventSummary = { title: string; when: string; month: string; day: string };

// A draggable row for a built-in sidebar link (Events, Search) shown in the
// Spaces manager so admins can order it among the spaces and choose whether it
// appears in the nav — mirroring a space's "Show in navigation" toggle. The
// feature itself (whether the link exists at all) is turned on/off in the
// Features section; here we only control its position and visibility.
export function BuiltinNavRow({
  itemKey,
  label,
  showInNav,
  communityId,
  communitySlug,
  dragHandlers,
  isDragging,
  eventsPublic,
  eventsCoverUrl,
  nextEvent,
}: {
  itemKey: FeatureKey;
  label: string;
  showInNav: boolean;
  communityId: string;
  communitySlug: string;
  dragHandlers: {
    draggable: boolean;
    onDragStart: DragEventHandler;
    onDragOver: DragEventHandler;
    onDrop: DragEventHandler;
    onDragEnd: DragEventHandler;
  };
  isDragging: boolean;
  // Events only: whether signed-out visitors see them, the Events page cover,
  // and the next one coming up.
  eventsPublic: boolean;
  eventsCoverUrl: string | null;
  // Dates formatted on the server, so the page renders the same text in the
  // browser whatever its time zone.
  nextEvent: NextEventSummary | null;
}) {
  const router = useRouter();
  const isEvents = itemKey === "events";
  const next = nextEvent;

  return (
    <div className={`rounded-2xl border ${isDragging ? "border-accent" : "border-border"} bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]`} {...dragHandlers}>
      <div className={ROW_GRID}>
        <DragHandle disabled={!dragHandlers.draggable} />
        {isEvents ? (
          <div className="relative h-16 w-16 lg:h-20 lg:w-20">
            {eventsCoverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={eventsCoverUrl} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <div className="h-full w-full rounded-xl bg-muted" />
            )}
            {next && (
              <div className="absolute -left-1 top-1 rounded-md bg-card px-1.5 py-0.5 text-center shadow">
                <p className="text-[10px] font-semibold uppercase text-danger">{next.month}</p>
                <p className="text-base font-semibold leading-none text-foreground">{next.day}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-muted-foreground lg:h-20 lg:w-20">
            <Search className="h-6 w-6" aria-hidden />
          </div>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="text-base font-semibold leading-snug text-foreground">{label}</p>
            <TypeChip tone="builtin">Built-in</TypeChip>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isEvents ? "Community events, meetups and live sessions." : "Search across the whole community."}
          </p>
          {isEvents && (
            <p className="mt-0.5 text-sm text-muted-foreground">{next ? `Next: ${next.title} · ${next.when}` : "Nothing coming up yet."}</p>
          )}
        </div>

        <AccessBox
          choice={!isEvents || eventsPublic ? "everyone" : "members"}
          title={!isEvents || eventsPublic ? "Everyone" : "Signed-in people"}
          detail={!isEvents || eventsPublic ? "Open to visitors" : "Visitors sign in to see them"}
          action={
            isEvents ? (
              <a href="#discoverability" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-2 hover:text-accent">
                Manage access
                <ArrowRight className="h-3 w-3" aria-hidden />
              </a>
            ) : undefined
          }
        />

        <div className="col-span-3 flex flex-col gap-2 lg:col-span-1">
          <AutoSaveCheckbox
            label="Show in navigation"
            variant="switch"
            defaultChecked={showInNav}
            onSave={async (nextValue) => {
              const result = await setNavItemVisibility(itemKey, nextValue, communityId, communitySlug);
              if (result?.error) return result.error;
              router.refresh();
            }}
          />
        </div>
        <div className="hidden lg:block" />
      </div>
    </div>
  );
}
