"use client";

import { MapPin, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/utils";
import { EventRsvpButton } from "./event-rsvp-button";
import { DeleteEventButton } from "./delete-event-button";
import type { Event } from "@/types/database";
import type { EventRsvpWithAttendee } from "@/lib/data/events";

export function EventCard({
  event,
  rsvps,
  currentUserId,
  communitySlug,
  canRsvp,
  canDelete,
}: {
  event: Event;
  rsvps: EventRsvpWithAttendee[];
  currentUserId: string;
  communitySlug: string;
  canRsvp: boolean;
  canDelete: boolean;
}) {
  const isGoing = rsvps.some((r) => r.user_id === currentUserId);
  const visibleAttendees = rsvps.slice(0, 5);

  return (
    <Card className="overflow-hidden">
      {event.image_url && (
        <div className="relative h-40 w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
          {canDelete && (
            <DeleteEventButton
              eventId={event.id}
              eventTitle={event.title}
              communitySlug={communitySlug}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            />
          )}
        </div>
      )}
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.start_time)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {canRsvp && <EventRsvpButton eventId={event.id} communitySlug={communitySlug} initialGoing={isGoing} />}
            {canDelete && !event.image_url && (
              <DeleteEventButton eventId={event.id} eventTitle={event.title} communitySlug={communitySlug} />
            )}
          </div>
        </div>

        {event.description && <p className="mt-2 text-sm text-foreground">{event.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {event.location}
            </span>
          )}
          {event.online_url && (
            <a href={event.online_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
              <LinkIcon className="h-3.5 w-3.5" /> Join online
            </a>
          )}
        </div>

        {rsvps.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {visibleAttendees.map((rsvp) => (
                <Avatar
                  key={rsvp.id}
                  src={rsvp.attendee?.avatar_url}
                  name={rsvp.attendee?.full_name || rsvp.attendee?.username}
                  size={24}
                  className="border-2 border-card"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {rsvps.length} going{rsvps.length > visibleAttendees.length ? ` (+${rsvps.length - visibleAttendees.length} more)` : ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
