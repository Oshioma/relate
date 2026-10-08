import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { Event } from "@/types/database";
import { Card } from "@/components/ui/card";

// Sidebar list of the next few events, each with a calendar-page date badge
// and its photo when it has one.
export function UpcomingEventsCard({ events, href }: { events: Event[]; href: string }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Upcoming events</h2>
        {events.length > 0 && (
          <Link href={href} className="text-xs font-medium text-accent hover:underline">
            See all
          </Link>
        )}
      </div>
      {events.length === 0 ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <CalendarDays className="h-5 w-5 shrink-0" />
          Nothing scheduled yet — check back soon.
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => {
            const start = new Date(event.start_time);
            const place = event.location_label || event.location || (event.online_url ? "Online" : null);
            return (
              <li key={event.id}>
                <Link href={href} className="group flex items-center gap-3">
                  {event.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.image_url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  )}
                  <span className="flex w-10 shrink-0 flex-col items-center leading-none">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-danger">
                      {start.toLocaleDateString("en-GB", { month: "short" })}
                    </span>
                    <span className="mt-1 text-xl font-bold text-accent">{start.getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground group-hover:text-accent">
                      {event.title}
                    </span>
                    {place && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{place}</span>}
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
