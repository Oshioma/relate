import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// One opted-in member whose farm can be browsed: their display info plus the
// email used to query the farm bridge. `email` is server-only — it comes from
// the service-role read below and must never be sent to the browser.
export type PublicFarmer = {
  profileId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  email: string;
};

// Whether the signed-in member has opted their farm public. Reads the member's
// own farm_shares row (the only row RLS lets them see).
export async function getMyFarmPublic(supabase: Client, userId: string): Promise<boolean> {
  const { data, error } = await supabase.from("farm_shares").select("is_public").eq("profile_id", userId).maybeSingle();
  if (error) throw error;
  return data?.is_public ?? false;
}

// The members of `communityId` (excluding `excludeUserId`) who have opted their
// farm public, with the email needed to fetch their crops from the farm bridge.
//
// Reads farm_shares — which holds the PII email column — through the
// service-role client, so it is deliberately kept out of any viewer-facing
// query. Returns [] when the service-role key isn't configured, mirroring how
// the farm bridge itself degrades to empty when unconfigured.
export async function getPublicFarmers(communityId: string, excludeUserId: string): Promise<PublicFarmer[]> {
  let admin: Client;
  try {
    admin = createAdminClient();
  } catch {
    // No service-role key — the community browse simply stays empty.
    return [];
  }

  const { data: shares, error: sharesErr } = await admin
    .from("farm_shares")
    .select("profile_id, farm_email")
    .eq("is_public", true);
  if (sharesErr) throw sharesErr;

  const candidates = (shares ?? []).filter((s) => s.profile_id !== excludeUserId && s.farm_email);
  if (candidates.length === 0) return [];

  const ids = candidates.map((s) => s.profile_id);

  // Only surface members of THIS community, so opting in shares a farm with the
  // communities the member belongs to rather than the whole platform.
  const { data: members, error: membersErr } = await admin
    .from("community_memberships")
    .select("user_id")
    .eq("community_id", communityId)
    .eq("status", "active")
    .in("user_id", ids);
  if (membersErr) throw membersErr;
  const memberIds = new Set((members ?? []).map((m) => m.user_id));

  const visibleIds = ids.filter((id) => memberIds.has(id));
  if (visibleIds.length === 0) return [];

  const { data: profiles, error: profilesErr } = await admin
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .in("id", visibleIds);
  if (profilesErr) throw profilesErr;

  const emailById = new Map(candidates.map((s) => [s.profile_id, s.farm_email as string]));

  return (profiles ?? [])
    .map((p) => ({
      profileId: p.id,
      username: p.username,
      fullName: p.full_name,
      avatarUrl: p.avatar_url,
      email: emailById.get(p.id) as string,
    }))
    .filter((f) => Boolean(f.email))
    .sort((a, b) => (a.fullName || a.username).localeCompare(b.fullName || b.username));
}
