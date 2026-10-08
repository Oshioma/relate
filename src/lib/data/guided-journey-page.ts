import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGuidedJourneyContext } from "@/lib/data/guided-journey";

// Every guided-journey sub-page starts here: resolve the space (404 when it
// doesn't exist, the viewer can't see it, or it isn't a guided-journey space).
export async function loadGuidedJourneyPage(params: Promise<{ communitySlug: string; spaceSlug: string }>) {
  const { communitySlug, spaceSlug } = await params;
  const supabase = await createClient();
  const ctx = await getGuidedJourneyContext(supabase, communitySlug, spaceSlug);
  if (!ctx) notFound();
  return ctx;
}
