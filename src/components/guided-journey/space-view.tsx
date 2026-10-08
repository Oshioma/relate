import { createClient } from "@/lib/supabase/server";
import {
  getGuidedJourneyContext,
  getJourneyTemplates,
  getMyJourneyProfiles,
  getMyJourneys,
  getPublishedStories,
  getRequestsForUser,
} from "@/lib/data/guided-journey";
import { GuidedJourneyLanding } from "./landing";

// Loads everything the landing page needs. Rendered by the space page's type
// dispatch (src/app/c/[communitySlug]/spaces/[spaceSlug]/page.tsx).
export async function GuidedJourneySpaceView({ communitySlug, spaceSlug, justEnded }: { communitySlug: string; spaceSlug: string; justEnded: boolean }) {
  const supabase = await createClient();
  const ctx = await getGuidedJourneyContext(supabase, communitySlug, spaceSlug);
  if (!ctx) return null;
  const signedInMember = ctx.userId && ctx.isMember ? ctx.userId : null;

  const [profiles, journeys, requests, stories, templates] = await Promise.all([
    getMyJourneyProfiles(supabase, ctx.space.id, signedInMember),
    signedInMember ? getMyJourneys(supabase, ctx.space.id, signedInMember) : Promise.resolve([]),
    signedInMember ? getRequestsForUser(supabase, ctx.space.id, signedInMember) : Promise.resolve({ incoming: [], outgoing: [] }),
    getPublishedStories(supabase, ctx.space.id, 3),
    getJourneyTemplates(supabase, ctx.space.id),
  ]);

  return (
    <GuidedJourneyLanding
      ctx={ctx}
      beginner={profiles.beginner}
      mentor={profiles.mentor}
      journeys={journeys}
      pendingIncoming={requests.incoming.filter((r) => r.status === "pending").length}
      pendingOutgoing={requests.outgoing.filter((r) => r.status === "pending").length}
      stories={stories}
      templates={templates}
      justEnded={justEnded}
    />
  );
}
