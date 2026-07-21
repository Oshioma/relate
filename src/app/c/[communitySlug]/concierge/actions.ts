"use server";

import { createClient } from "@/lib/supabase/server";
import { searchCommunity, type ConciergeResults } from "@/lib/data/concierge";

export async function searchConcierge(communityId: string, communitySlug: string, query: string): Promise<ConciergeResults> {
  const supabase = await createClient();
  return searchCommunity(supabase, communityId, communitySlug, query);
}
