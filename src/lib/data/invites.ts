import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityInvite } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCommunityInvites(supabase: Client, communityId: string): Promise<CommunityInvite[]> {
  const { data, error } = await supabase
    .from("community_invites")
    .select("*")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export function isInviteActive(invite: CommunityInvite): boolean {
  if (invite.revoked) return false;
  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) return false;
  if (invite.max_uses !== null && invite.uses_count >= invite.max_uses) return false;
  return true;
}
