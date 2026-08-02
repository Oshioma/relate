"use server";

import { createClient } from "@/lib/supabase/server";
import { findPlaceMatches, type PlaceMatch } from "@/lib/data/places";

// Backs the "this may already be listed" hint on both add-forms. Advisory
// only — it reads, never writes, and never blocks the add. The member is the
// one who knows whether their Kendwa Rocks is the same Kendwa Rocks.
export async function lookupPlaceMatches({
  communityId,
  name,
  lat,
  lng,
}: {
  communityId: string;
  name: string;
  lat?: number | null;
  lng?: number | null;
}): Promise<PlaceMatch[]> {
  if (typeof name !== "string" || name.trim().length < 3 || name.length > 200) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // RLS on places restricts this to communities the caller belongs to, so a
  // community id from the form can't be used to read someone else's listings.
  return findPlaceMatches(supabase, communityId, name, { lat: lat ?? null, lng: lng ?? null });
}
