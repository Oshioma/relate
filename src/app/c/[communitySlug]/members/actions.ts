"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MembershipRole } from "@/types/database";
import { planLimitMessage } from "@/lib/data/plan-limits";

export type MemberActionState = { error: string } | undefined;

const ASSIGNABLE_ROLES: Extract<MembershipRole, "admin" | "moderator" | "member">[] = ["admin", "moderator", "member"];

// Whether this user may manage other staff in the community: always true for
// the owner, and for admins only when the community has opted in via
// admins_can_manage_staff. The database RLS policy enforces the same rule; this
// is the friendly-error mirror of it.
async function canManageStaff(
  supabase: Awaited<ReturnType<typeof createClient>>,
  communityId: string,
  userId: string
): Promise<boolean> {
  const { data: community } = await supabase
    .from("communities")
    .select("owner_id, admins_can_manage_staff")
    .eq("id", communityId)
    .maybeSingle();
  if (!community) return false;
  return community.owner_id === userId || community.admins_can_manage_staff;
}

export async function updateMemberRole(membershipId: string, newRole: string, communitySlug: string): Promise<MemberActionState> {
  if (!ASSIGNABLE_ROLES.includes(newRole as (typeof ASSIGNABLE_ROLES)[number])) {
    return { error: "Not a valid role." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: target, error: fetchError } = await supabase
    .from("community_memberships")
    .select("role, user_id, community_id")
    .eq("id", membershipId)
    .maybeSingle();

  if (fetchError || !target) {
    return { error: "That member couldn't be found." };
  }

  if (target.role === "owner") {
    return { error: "The community owner's role can't be changed here." };
  }

  if (target.user_id === user.id) {
    return { error: "You can't change your own role." };
  }

  // Touching staff — demoting/removing an admin or moderator, or promoting
  // someone into those roles — is owner-only unless the community has opted in
  // via admins_can_manage_staff. Mirrors the membership RLS policy so the
  // friendly message here matches what the database would enforce anyway.
  const touchesStaff =
    target.role === "admin" || target.role === "moderator" || newRole === "admin" || newRole === "moderator";
  if (touchesStaff && !(await canManageStaff(supabase, target.community_id, user.id))) {
    return { error: "Only the owner can manage admins and moderators here." };
  }

  const { error } = await supabase
    .from("community_memberships")
    .update({ role: newRole as (typeof ASSIGNABLE_ROLES)[number] })
    .eq("id", membershipId);

  if (error) {
    // Promoting past the plan's admin seats is refused by the plan-limits
    // trigger, which phrases it for a person (and suggests Moderator).
    return { error: planLimitMessage(error) ?? error.message };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  return undefined;
}

export async function blockMember(profileId: string, communitySlug: string): Promise<MemberActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  if (profileId === user.id) {
    return { error: "You can't block yourself." };
  }

  const { error } = await supabase.from("member_blocks").insert({ blocker_id: user.id, blocked_id: profileId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  revalidatePath("/settings/blocked");
  return undefined;
}

export async function removeMember(membershipId: string, communitySlug: string): Promise<MemberActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: target, error: fetchError } = await supabase
    .from("community_memberships")
    .select("role, user_id, community_id")
    .eq("id", membershipId)
    .maybeSingle();

  if (fetchError || !target) {
    return { error: "That member couldn't be found." };
  }

  if (target.role === "owner") {
    return { error: "The community owner can't be removed." };
  }

  if (target.user_id === user.id) {
    return { error: "You can't remove yourself here." };
  }

  // Removing a fellow admin or moderator is owner-only unless the community has
  // opted in via admins_can_manage_staff (mirrors the membership RLS policy).
  const targetIsStaff = target.role === "admin" || target.role === "moderator";
  if (targetIsStaff && !(await canManageStaff(supabase, target.community_id, user.id))) {
    return { error: "Only the owner can remove admins and moderators." };
  }

  const { error } = await supabase.from("community_memberships").delete().eq("id", membershipId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  return undefined;
}
