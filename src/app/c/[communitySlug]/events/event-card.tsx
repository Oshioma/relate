"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Link as LinkIcon, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Linkify } from "@/components/ui/linkify";
import { formatDateTime } from "@/lib/utils";
import { EventRsvpButton } from "./event-rsvp-button";
import { DeleteEventButton } from "./delete-event-button";
import { EditEventForm } from "./edit-event-form";
import type { Event } from "@/types/database";
import type { EventRsvpWithAttendee } from "@/lib/data/events";

export function EventCard({
  event,
  rsvps,
  currentUserId,
  communitySlug,
  communityLogoUrl,
  canRsvp,
  canManage,
}: {
  event: Event;
  rsvps: EventRsvpWithAttendee[];
  currentUserId: string;
  communitySlug: string;
  communityLogoUrl: string | null;
  canRsvp: boolean;
  canManage: boolean;
}) {
  const isGoing = rsvps.some((r) => r.user_id === currentUserId);
  const visibleAttendees = rsvps.slice(0, 5);
  const [imageBroken, setImageBroken] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  // Scraped image URLs sometimes 404 or reject hotlinking once loaded in a
  // browser even though the server-side scrape found them — fall back to
  // the placeholder instead of showing a broken-image icon.
  const showImage = Boolean(event.image_url) && !imageBroken;

  if (isEditing) {
    return (
      <EditEventForm
        event={event}
        communitySlug={communitySlug}
        onDone={() => {
          setIsEditing(false);
          router.refresh();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full bg-muted">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url!}
            alt={event.title}
            className="h-full w-full object-cover"
            onError={() => setImageBroken(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center gap-5 bg-gradient-to-br from-accent-soft to-muted text-foreground">
            {communityLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={communityLogoUrl} alt="" className="h-24 w-24 rounded-full object-cover shadow-sm" />
            ) : (
              <CalendarDays className="h-14 w-14 text-accent/50" />
            )}
            <span className="text-4xl font-bold tracking-tight">Event</span>
          </div>
        )}
        {canManage && (
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <button
              type="button"
              title="Edit event"
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <DeleteEventButton
              eventId={event.id}
              eventTitle={event.title}
              communitySlug={communitySlug}
              className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            />
          </div>
        )}
      </div>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.start_time)}</p>
          </div>
          {canRsvp && (
            <div className="shrink-0">
              <EventRsvpButton eventId={event.id} communitySlug={communitySlug} initialGoing={isGoing} />
            </div>
          )}
        </div>

        {event.description && <Linkify text={event.description} className="mt-2 text-sm text-foreground" />}

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
