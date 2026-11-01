import "server-only";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getTiersForSpace } from "@/lib/data/tiers";
import { hasActiveSpaceSubscription, hasActiveTierForSpace } from "@/lib/data/space-access";
import { getResearcherRole } from "@/lib/data/true-calendar";

// The True Calendar's sub-pages (History, Research) sit behind the same door
// as the space itself. Anyone who can't see the space, or who meets its
// paywall, is sent to the space page, which shows the right gate.

export async function loadTrueCalendarSpace(communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();
  const spacePath = `/c/${community.slug}/spaces/${spaceSlug}`;

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) redirect(spacePath);
  if (space.space_type !== "true_calendar") notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff =
    membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");

  const tiers = await getTiersForSpace(supabase, space.id);
  const isGated = space.visibility !== "public" && (space.price_cents > 0 || tiers.length > 0);
  if (isGated && !isStaff) {
    const ok =
      (user ? await hasActiveSpaceSubscription(supabase, space.id, user.id) : false) ||
      (user ? await hasActiveTierForSpace(supabase, space.id, user.id) : false);
    if (!ok) redirect(spacePath);
  }

  const researcherRole = await getResearcherRole(supabase, user?.id ?? null);
  return { supabase, user, community, space, spacePath, researcherRole };
}
