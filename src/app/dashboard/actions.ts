"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Postgres unique_violation, raised by the (user_id, community_id) unique
// constraint on community_memberships.
const UNIQUE_VIOLATION = "23505";

export async function joinCommunity(communityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to join a community." };
  }

  // Look for an existing row first. This used to be a bare insert, so anything
  // that reached it with a membership already in place — a double-clicked
  // button, a second tab, an invite the user hadn't accepted — hit the unique
  // constraint and rendered the raw Postgres message ("duplicate key value
  // violates unique constraint …") straight into the UI.
  const { data: existing, error: existingError } = await supabase
    .from("community_memberships")
    .select("id, role, status")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  if (existing?.status === "banned") {
    return { error: "You can't join this community." };
  }

  // Already in — treat as success rather than an error. Refreshing the
  // dashboard moves the community into "Your communities", which is the
  // outcome the click was asking for anyway.
  if (existing?.status === "active") {
    revalidatePath("/dashboard");
    return { error: null };
  }

  if (existing) {
    // An outstanding invite: promote it in place, touching only the status so
    // the role the inviting admin chose survives. RLS (see
    // memberships_update_admin_or_self) only lets a user write their own row
    // while its role is 'member', so an invite carrying a staff role can't be
    // self-accepted here — that path is what the invite link's redeem_invite
    // RPC exists for, with the security-definer rights to grant it.
    if (existing.role !== "member") {
      return { error: "Use the invite link you were sent to accept this invitation." };
    }

    const { error } = await supabase
      .from("community_memberships")
      .update({ status: "active" })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { error: null };
  }

  const { error } = await supabase.from("community_memberships").insert({
    user_id: user.id,
    community_id: communityId,
    role: "member",
    status: "active",
  });

  // A unique violation here means another request created the membership
  // between our read and this insert. The row the caller wanted exists, so
  // that's a success, not something to report.
  if (error && error.code !== UNIQUE_VIOLATION) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
