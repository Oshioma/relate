import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityEvents, splitUpcomingPast, getRsvpsForEvents, groupRsvpsByEvent, type EventRsvpWithAttendee } from "@/lib/data/events";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import { NewEventForm } from "./new-event-form";
import { EventRsvpButton } from "./event-rsvp-button";
import type { Event } from "@/types/database";

export default async function EventsPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const [membership, events] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getCommunityEvents(supabase, community.id),
  ]);

  const rsvps = await getRsvpsForEvents(supabase, events.map((e) => e.id));
  const rsvpsByEvent = groupRsvpsByEvent(rsvps);

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const canRsvp = membership?.status === "active";
  const { upcoming, past } = splitUpcomingPast(events);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Events</h1>

      {isStaff && (
        <div className="mb-8">
          <NewEventForm communityId={community.id} communitySlug={community.slug} />
        </div>
      )}

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Upcoming</h2>
      {upcoming.length === 0 ? (
        <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="Nothing scheduled" description="Upcoming events will appear here." className="mb-8" />
      ) : (
        <div className="mb-8 space-y-3">
          {upcoming.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              rsvps={rsvpsByEvent.get(event.id) ?? []}
              currentUserId={user.id}
              communitySlug={community.slug}
              canRsvp={canRsvp}
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Past</h2>
          <div className="space-y-3 opacity-70">
            {past.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                rsvps={rsvpsByEvent.get(event.id) ?? []}
                currentUserId={user.id}
                communitySlug={community.slug}
                canRsvp={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventCard({
  event,
  rsvps,
  currentUserId,
  communitySlug,
  canRsvp,
}: {
  event: Event;
  rsvps: EventRsvpWithAttendee[];
  currentUserId: string;
  communitySlug: string;
  canRsvp: boolean;
}) {
  const isGoing = rsvps.some((r) => r.user_id === currentUserId);
  const visibleAttendees = rsvps.slice(0, 5);

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.start_time)}</p>
          </div>
          {canRsvp && <EventRsvpButton eventId={event.id} communitySlug={communitySlug} initialGoing={isGoing} />}
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
