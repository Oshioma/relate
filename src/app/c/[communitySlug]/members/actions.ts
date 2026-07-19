"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MembershipRole } from "@/types/database";

export type MemberActionState = { error: string } | undefined;

const ASSIGNABLE_ROLES: Extract<MembershipRole, "admin" | "moderator" | "member">[] = ["admin", "moderator", "member"];

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
    .select("role, user_id")
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

  const { error } = await supabase
    .from("community_memberships")
    .update({ role: newRole as (typeof ASSIGNABLE_ROLES)[number] })
    .eq("id", membershipId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  return undefined;
}
