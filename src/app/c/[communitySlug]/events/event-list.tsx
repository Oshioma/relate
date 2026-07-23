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
  communityLocationName = null,
  canRsvp,
  isStaff,
  featureFirst = false,
}: {
  items: { event: Event; rsvps: EventRsvpWithAttendee[] }[];
  currentUserId: string;
  communitySlug: string;
  communityLogoUrl: string | null;
  communityLocationName?: string | null;
  canRsvp: boolean;
  isStaff: boolean;
  featureFirst?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visible.length;
  const [heroItem, ...restItems] = visible;

  const renderCard = ({ event, rsvps }: (typeof visible)[number], featured = false) => (
    <EventCard
      key={event.id}
      event={event}
      rsvps={rsvps}
      currentUserId={currentUserId}
      communitySlug={communitySlug}
      communityLogoUrl={communityLogoUrl}
      communityLocationName={communityLocationName}
      canRsvp={canRsvp}
      canManage={isStaff || event.created_by === currentUserId}
      featured={featured}
    />
  );

  return (
    <div className="space-y-3">
      {featureFirst ? (
        <>
          {heroItem && renderCard(heroItem, true)}
          {restItems.length > 0 && <div className="grid gap-3 sm:grid-cols-2">{restItems.map((item) => renderCard(item))}</div>}
        </>
      ) : (
        visible.map((item) => renderCard(item))
      )}

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
