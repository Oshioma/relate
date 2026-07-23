"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventCard } from "./event-card";
import type { Event } from "@/types/database";
import type { EventRsvpWithAttendee } from "@/lib/data/events";

const PAGE_SIZE = 10;

export function EventList({
  items,
  currentUserId,
  communitySlug,
  communityLogoUrl,
  canRsvp,
  isStaff,
}: {
  items: { event: Event; rsvps: EventRsvpWithAttendee[] }[];
  currentUserId: string;
  communitySlug: string;
  communityLogoUrl: string | null;
  canRsvp: boolean;
  isStaff: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visible.length;

  return (
    <div className="space-y-3">
      {visible.map(({ event, rsvps }) => (
        <EventCard
          key={event.id}
          event={event}
          rsvps={rsvps}
          currentUserId={currentUserId}
          communitySlug={communitySlug}
          communityLogoUrl={communityLogoUrl}
          canRsvp={canRsvp}
          canManage={isStaff || event.created_by === currentUserId}
        />
      ))}

      {remaining > 0 && (
        <div className="flex justify-center pt-2">
          <Button variant="secondary" size="sm" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load {Math.min(PAGE_SIZE, remaining)} more
          </Button>
        </div>
      )}
    </div>
  );
}
