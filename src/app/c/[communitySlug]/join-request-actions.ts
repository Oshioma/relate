"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { planLimitMessage } from "@/lib/data/plan-limits";

// Postgres unique_violation, raised by the (user_id, community_id) unique
// constraint on community_memberships.
const UNIQUE_VIOLATION = "23505";

export type JoinRequestResult = { error: string | null };

// Ask to join a private community. Writes a membership row with status
// 'requested', which grants nothing — it isn't 'active', so it consumes no plan
// seat, shows up in no member list and unlocks no content — and notifies the
// community's admins (trg_notify_staff_join_request). Staff approve it into
// 'active' or decline it, which deletes the row.
//
// Every refusal below is also enforced by RLS (memberships_insert only accepts
// a self-authored 'requested' row on a community where privacy = 'private');
// these checks exist to give a person a sentence they can act on instead of a
// policy violation.
export async function requestToJoinCommunity(communityId: string): Promise<JoinRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to ask to join a community." };
  }

  const { data: community, error: communityError } = await supabase
    .from("communities")
    .select("id, privacy, slug")
    .eq("id", communityId)
    .maybeSingle();

  if (communityError) return { error: communityError.message };
  if (!community) return { error: "Community not found." };
  if (community.privacy !== "private") {
    // 'public' is a straight join and 'invite_only' doesn't take requests at
    // all, so neither belongs on this path.
    return { error: "This community doesn't take join requests." };
  }

  // Mirrors joinCommunity: look before inserting, so a double-click or a second
  // tab reads as the outcome the click was asking for rather than a raw unique
  // constraint violation.
  const { data: existing, error: existingError } = await supabase
    .from("community_memberships")
    .select("id, role, status")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) return { error: existingError.message };

  if (existing?.status === "banned") {
    return { error: "You can't join this community." };
  }
  if (existing?.status === "active") {
    revalidatePath(`/c/${community.slug}`);
    return { error: null };
  }
  if (existing?.status === "requested") {
    // Already asked — nothing to do, and nothing has gone wrong.
    revalidatePath(`/c/${community.slug}`);
    return { error: null };
  }
  if (existing?.status === "invited") {
    // They don't need to ask; an admin already opened the door.
    return { error: "You've already been invited — use the invite link you were sent to join." };
  }

  const { error } = await supabase.from("community_memberships").insert({
    user_id: user.id,
    community_id: communityId,
    role: "member",
    status: "requested",
  });

  // Another request created the row between our read and this insert. The row
  // the caller wanted exists, so that's a success.
  if (error && error.code !== UNIQUE_VIOLATION) {
    return { error: planLimitMessage(error) ?? error.message };
  }

  revalidatePath(`/c/${community.slug}`);
  return { error: null };
}

// Withdraw one's own pending request. A DELETE, because RLS deliberately won't
// let the requester UPDATE a 'requested' row (that would let them approve
// themselves); memberships_delete_admin_or_self allows deleting your own row.
export async function withdrawJoinRequest(communityId: string): Promise<JoinRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in." };

  const { data: community } = await supabase
    .from("communities")
    .select("slug")
    .eq("id", communityId)
    .maybeSingle();

  const { error } = await supabase
    .from("community_memberships")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .eq("status", "requested");

  if (error) return { error: error.message };

  if (community) revalidatePath(`/c/${community.slug}`);
  return { error: null };
}

// Admin: let a pending request in. The status change is what grants access, and
// it's the moment the plan's member cap applies — enforce_community_plan_limits
// counts the row as an addition here, not when it was requested — so a
// community at its cap gets the trigger's sentence rather than a silent
// failure. RLS restricts this to the community's admins.
export async function approveJoinRequest(membershipId: string, communitySlug: string): Promise<JoinRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase
    .from("community_memberships")
    .update({ status: "active" })
    .eq("id", membershipId)
    .eq("status", "requested");

  if (error) return { error: planLimitMessage(error) ?? error.message };

  revalidatePath(`/c/${communitySlug}/admin`);
  revalidatePath(`/c/${communitySlug}/members`);
  return { error: null };
}

// Admin: turn a request down. Deletes the row rather than parking it in a
// 'declined' state — nothing in the app would read that state, and leaving the
// row behind would block the person from ever asking again (the unique
// constraint is on user + community). No notification is sent: there is nothing
// useful to say, and saying it invites an argument with the admin who declined.
export async function declineJoinRequest(membershipId: string, communitySlug: string): Promise<JoinRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase
    .from("community_memberships")
    .delete()
    .eq("id", membershipId)
    .eq("status", "requested");

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}
