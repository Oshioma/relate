import type { SupabaseClient } from "@supabase/supabase-js";
import { planLimitMessage } from "@/lib/data/plan-limits";
import { joinPolicyOf } from "@/lib/join-policy";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// Postgres unique_violation, raised by the (user_id, community_id) unique
// constraint on community_memberships.
const UNIQUE_VIOLATION = "23505";

export type FileJoinRequestResult = { error: string | null; slug: string | null };

// File a "request to join" for the signed-in user. Writes a membership row with
// status 'requested', which grants nothing — it isn't 'active', so it consumes
// no plan seat, shows up in no member list and unlocks no content — and
// notifies the community's admins (trg_notify_staff_join_request). Staff
// approve it into 'active' or decline it, which deletes the row.
//
// Shared by the "Request to join" button and by email confirmation, which files
// the request for someone who signed up from a private community's page: they
// already said they wanted in, and making them find the button again after
// confirming is how a request goes missing.
//
// Every refusal below is also enforced by RLS (memberships_insert only accepts
// a self-authored 'requested' row on a community whose join policy is
// approval — community_join_policy()); these checks exist to give a person a
// sentence they can act on instead of a policy violation.
export async function fileJoinRequest(
  supabase: Client,
  userId: string,
  community: { id: string } | { slug: string }
): Promise<FileJoinRequestResult> {
  const lookup = supabase.from("communities").select("id, privacy, join_policy, slug");
  const { data: row, error: communityError } = await ("id" in community
    ? lookup.eq("id", community.id)
    : lookup.eq("slug", community.slug)
  ).maybeSingle();

  if (communityError) return { error: communityError.message, slug: null };
  if (!row) return { error: "Community not found.", slug: null };
  if (joinPolicyOf(row) !== "approval") {
    // An open community is a straight join and an invite-only one doesn't
    // take requests at all, so neither belongs on this path.
    return { error: "This community doesn't take join requests.", slug: row.slug };
  }

  // Mirrors joinCommunity: look before inserting, so a double-click or a second
  // tab reads as the outcome the click was asking for rather than a raw unique
  // constraint violation.
  const { data: existing, error: existingError } = await supabase
    .from("community_memberships")
    .select("id, role, status")
    .eq("community_id", row.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) return { error: existingError.message, slug: row.slug };

  if (existing?.status === "banned") {
    return { error: "You can't join this community.", slug: row.slug };
  }
  // Already a member, or already asked — nothing to do, and nothing has gone wrong.
  if (existing?.status === "active" || existing?.status === "requested") {
    return { error: null, slug: row.slug };
  }
  if (existing?.status === "invited") {
    // They don't need to ask; an admin already opened the door.
    return { error: "You've already been invited — use the invite link you were sent to join.", slug: row.slug };
  }

  const { error } = await supabase.from("community_memberships").insert({
    user_id: userId,
    community_id: row.id,
    role: "member",
    status: "requested",
  });

  // Another request created the row between our read and this insert. The row
  // the caller wanted exists, so that's a success.
  if (error && error.code !== UNIQUE_VIOLATION) {
    return { error: planLimitMessage(error) ?? error.message, slug: row.slug };
  }

  return { error: null, slug: row.slug };
}

// The community slug a post-signup destination points at, when it is a
// community page (/c/<slug> or anything under it). Null for anything else.
export function communitySlugFromNext(next: string): string | null {
  const match = next.match(/^\/c\/([^/?#]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]).toLowerCase();
  } catch {
    return match[1].toLowerCase();
  }
}
