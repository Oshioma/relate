import Link from "@/components/ui/link";
import { CalendarDays } from "lucide-react";
import type { UpcomingLiveSession } from "@/lib/data/live-events";
import type { Event } from "@/types/database";
import { Card } from "@/components/ui/card";
import { placesLeftLabel } from "@/lib/event-places";
import { EventThumb } from "./event-thumb";

// One row of the card: a community event or a scheduled live session.
type UpcomingRow =
  | { kind: "event"; key: string; start: Date; event: Event }
  | { kind: "live"; key: string; start: Date; session: UpcomingLiveSession };

// Live sessions take a place among the soonest this many rows; a caller that
// passes more events than this (the welcome page) still gets them all.
const MAX_ROWS = 4;

// Sidebar list of the next few events and scheduled live sessions, soonest
// first, each with a calendar-page date badge and its photo (or the default
// event photo when it has none or it won't load).
export function UpcomingEventsCard({
  events,
  liveSessions = [],
  href,
  communityBase,
  going = new Map(),
}: {
  events: Event[];
  liveSessions?: UpcomingLiveSession[];
  href: string;
  // "/c/<slug>", for linking a live session to its space.
  communityBase: string;
  // event id → how many are going, for "12 places left".
  going?: Map<string, number>;
}) {
  const rows: UpcomingRow[] = [
    ...events.map((event): UpcomingRow => ({ kind: "event", key: `event-${event.id}`, start: new Date(event.start_time), event })),
    ...liveSessions
      .filter((session) => session.scheduled_start)
      .map((session): UpcomingRow => ({
        kind: "live",
        key: `live-${session.id}`,
        start: new Date(session.scheduled_start as string),
        session,
      })),
  ]
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, Math.max(events.length, MAX_ROWS));

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Upcoming events</h2>
        {rows.length > 0 && (
          <Link href={href} className="text-xs font-medium text-accent hover:underline">
            See all
          </Link>
        )}
      </div>
      {rows.length === 0 ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <CalendarDays className="h-5 w-5 shrink-0" />
          Nothing scheduled yet — check back soon.
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => {
            const { start } = row;
            if (row.kind === "live") {
              const { session } = row;
              return (
                <li key={row.key}>
                  <Link href={`${communityBase}/spaces/${session.space.slug}`} className="group flex items-center gap-3">
                    <EventThumb src={session.image_url} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                    <DateBadge start={start} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground group-hover:text-accent">
                        {session.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">Live · {session.space.name}</span>
                    </span>
                  </Link>
                </li>
              );
            }
            const { event } = row;
            const place = event.location_label || event.location || (event.online_url ? "Online" : null);
            return (
              <li key={row.key}>
                <Link href={href} className="group flex items-center gap-3">
                  <EventThumb src={event.image_url} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <DateBadge start={start} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground group-hover:text-accent">
                      {event.title}
                    </span>
                    {place && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{place}</span>}
                    {(() => {
                      const left = placesLeftLabel(event.capacity, going.get(event.id) ?? 0);
                      return left ? (
                        <span className={`block text-xs ${left === "Full" ? "text-danger" : "text-muted-foreground"}`}>{left}</span>
                      ) : null;
                    })()}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// The calendar-page badge: short month over the day of the month.
function DateBadge({ start }: { start: Date }) {
  return (
    <span className="flex w-10 shrink-0 flex-col items-center leading-none">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-danger">
        {start.toLocaleDateString("en-GB", { month: "short" })}
      </span>
      <span className="mt-1 text-xl font-bold text-accent">{start.getDate()}</span>
    </span>
  );
}
