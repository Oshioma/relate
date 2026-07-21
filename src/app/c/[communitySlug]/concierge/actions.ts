"use server";

import { createClient } from "@/lib/supabase/server";
import { searchCommunity, type ConciergeResults } from "@/lib/data/concierge";
import { synthesizeConciergeAnswer } from "@/lib/ai/concierge-answer";

export async function searchConcierge(communityId: string, communitySlug: string, query: string): Promise<ConciergeResults> {
  const supabase = await createClient();
  const results = await searchCommunity(supabase, communityId, communitySlug, query);
  const answer = await synthesizeConciergeAnswer(results);
  return { ...results, answer };
}
