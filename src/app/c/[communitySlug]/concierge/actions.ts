"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { searchCommunity, logConciergeQuery, type ConciergeResults } from "@/lib/data/concierge";
import { synthesizeConciergeAnswer } from "@/lib/ai/concierge-answer";
import { checkAiAllowance } from "@/lib/usage/ai-spend";
import { meteredFor } from "@/lib/usage/ai-meter";

export async function searchConcierge(communityId: string, communitySlug: string, query: string): Promise<ConciergeResults> {
  const supabase = await createClient();
  const [user, results] = await Promise.all([getCurrentUser(supabase), searchCommunity(supabase, communityId, communitySlug, query)]);
  // The written answer is the AI part; the search results never are. A
  // community past its free AI allowance still gets its results, just
  // without the summary on top.
  const allowance = await checkAiAllowance(communityId, user?.id ?? null);
  const answer = allowance.allowed
    ? await meteredFor({ communityId, userId: user?.id ?? null }, () => synthesizeConciergeAnswer(results))
    : null;

  // Only signed-in members can log a query (RLS blocks anon inserts); guests
  // can still search, we just don't record it.
  if (results.query && user) {
    void logConciergeQuery(supabase, communityId, user.id, results.query, results.totalCount, answer !== null);
  }

  return { ...results, answer };
}
