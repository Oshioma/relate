"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { searchCommunity, logConciergeQuery, type ConciergeResults } from "@/lib/data/concierge";
import { synthesizeConciergeAnswer } from "@/lib/ai/concierge-answer";

export async function searchConcierge(communityId: string, communitySlug: string, query: string): Promise<ConciergeResults> {
  const supabase = await createClient();
  const [user, results] = await Promise.all([getCurrentUser(supabase), searchCommunity(supabase, communityId, communitySlug, query)]);
  const answer = await synthesizeConciergeAnswer(results);

  if (results.query) {
    void logConciergeQuery(supabase, communityId, user?.id ?? null, results.query, results.totalCount, answer !== null);
  }

  return { ...results, answer };
}
