import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityEvents, splitUpcomingPast } from "@/lib/data/events";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import { NewEventForm } from "./new-event-form";
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

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
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
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Past</h2>
          <div className="space-y-3 opacity-70">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.start_time)}</p>
        {event.description && <p className="mt-2 text-sm text-foreground">{event.description}</p>}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
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
      </CardContent>
    </Card>
  );
}
