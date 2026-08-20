"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";

// Flag one of a community's contact-form submissions handled / unhandled from
// the staff inbox.
//
// contact_messages deliberately has no client write policy (the table is
// written only by the trusted contact server action), so the update goes
// through the service-role client — which means the staff check has to happen
// here rather than in RLS. The .eq("community_id") on the update is the second
// half of that gate: even with a forged id, a staff member can only ever flip a
// message addressed to their own community. Returning the updated rows lets us
// tell "wrote nothing" apart from "wrote" instead of reporting a silent no-op
// as success.
export async function setCommunityContactMessageHandled(
  communitySlug: string,
  messageId: string,
  handled: boolean
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "Community not found." };

  const membership = await getMembership(supabase, community.id, user.id);
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  if (!isStaff) return { error: "Only this community's owner and admins can manage its messages." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contact_messages")
    .update({ handled })
    .eq("id", messageId)
    .eq("community_id", community.id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: "That message is no longer in this inbox. Reload and try again." };

  revalidatePath(`/c/${community.slug}/inbox`);
  return undefined;
}
