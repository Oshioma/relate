"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { planLimitMessage } from "@/lib/data/plan-limits";
import { fileJoinRequest } from "@/lib/join-requests";

export type JoinRequestResult = { error: string | null };

// Ask to join a private community. The rules live in fileJoinRequest
// (src/lib/join-requests.ts), which email confirmation also uses.
export async function requestToJoinCommunity(communityId: string): Promise<JoinRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to ask to join a community." };
  }

  const { error, slug } = await fileJoinRequest(supabase, user.id, { id: communityId });
  if (slug && !error) revalidatePath(`/c/${slug}`);
  return { error };
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
