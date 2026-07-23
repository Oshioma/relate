import { notFound } from "next/navigation";
import { CalendarDays, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityEvents, splitUpcomingPast, getRsvpsForEvents, groupRsvpsByEvent } from "@/lib/data/events";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { NewEventForm } from "./new-event-form";
import { DiscoverEventsPanel } from "./discover-events-panel";
import { EventList } from "./event-list";

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
  const isOwner = membership?.status === "active" && membership.role === "owner";
  const canRsvp = membership?.status === "active";
  const { upcoming, past } = splitUpcomingPast(events);

  const upcomingItems = upcoming.map((event) => ({ event, rsvps: rsvpsByEvent.get(event.id) ?? [] }));
  const pastItems = past.map((event) => ({ event, rsvps: rsvpsByEvent.get(event.id) ?? [] }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Events</h1>
        {isStaff && (
          <LinkButton href="#add-event" size="sm">
            <Plus className="h-4 w-4" /> Add event
          </LinkButton>
        )}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Featured</h2>
      {upcomingItems.length === 0 ? (
        <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="Nothing scheduled" description="Upcoming events will appear here." className="mb-8" />
      ) : (
        <div className="mb-8">
          <EventList
            items={upcomingItems}
            currentUserId={user.id}
            communitySlug={community.slug}
            communityLogoUrl={community.logo_url}
            communityLocationName={community.location_name}
            canRsvp={canRsvp}
            isStaff={isStaff}
          />
        </div>
      )}

      {isStaff && (
        <div id="add-event" className="mb-8 scroll-mt-6 space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Add an event</h2>
          <NewEventForm communityId={community.id} communitySlug={community.slug} communityLocationName={community.location_name} />
          {isOwner && <DiscoverEventsPanel communitySlug={community.slug} locationName={community.location_name || community.name} />}
        </div>
      )}

      {pastItems.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Past</h2>
          <div className="opacity-70">
            <EventList
              items={pastItems}
              currentUserId={user.id}
              communitySlug={community.slug}
              communityLogoUrl={community.logo_url}
              communityLocationName={community.location_name}
              canRsvp={false}
              isStaff={isStaff}
            />
          </div>
        </>
      )}
    </div>
  );
}
