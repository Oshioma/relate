"use server";

import { createClient } from "@/lib/supabase/server";
import type { AccessCheckFacts } from "@/lib/access/check";

export type AccessCheckResult = { facts: AccessCheckFacts } | { error: string };

// One Access Check. The database function decides who may ask (admins of the
// space's community, about people in it) and logs the check; this only passes
// the question on. Nothing but yes/no facts comes back.
export async function runAccessCheck(spaceId: string, userId: string | null): Promise<AccessCheckResult> {
  if (!spaceId) return { error: "Pick a space to check." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("access_check", { p_space_id: spaceId, p_user_id: userId || null });
  if (error) return { error: error.message };
  return { facts: data as AccessCheckFacts };
}
