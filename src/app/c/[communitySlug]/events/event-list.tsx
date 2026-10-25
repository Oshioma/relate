"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EventCard } from "./event-card";
import type { Event } from "@/types/database";
import type { EventRsvpWithAttendee } from "@/lib/data/events";
import { visibleCountForHash } from "@/lib/events/hash-target";

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
  const scrollTarget = useRef<string | null>(null);
  const eventIdsKey = items.map(({ event }) => event.id).join(",");

  // A link to `#event-<id>` for an event past the first page: show enough
  // pages to render it, then scroll to it once it's in the DOM.
  useEffect(() => {
    const ids = eventIdsKey.split(",");
    const reveal = () => {
      const hash = window.location.hash;
      const needed = visibleCountForHash(ids, hash, PAGE_SIZE, PAGE_SIZE);
      if (needed === PAGE_SIZE) return;
      setVisibleCount((current) => Math.max(current, needed));
      scrollTarget.current = hash.slice(1);
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [eventIdsKey]);

  useEffect(() => {
    if (!scrollTarget.current) return;
    const el = document.getElementById(scrollTarget.current);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    scrollTarget.current = null;
  }, [visibleCount]);

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
