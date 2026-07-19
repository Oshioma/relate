"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MembershipRole } from "@/types/database";

export type InviteFormState = { error: string } | undefined;

const INVITE_ROLES: Extract<MembershipRole, "member" | "moderator">[] = ["member", "moderator"];

export async function createInvite(_prevState: InviteFormState, formData: FormData): Promise<InviteFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const roleRaw = String(formData.get("role") ?? "member");
  const role = INVITE_ROLES.includes(roleRaw as (typeof INVITE_ROLES)[number]) ? (roleRaw as (typeof INVITE_ROLES)[number]) : "member";
  const maxUsesRaw = String(formData.get("max_uses") ?? "").trim();
  const expiresInDaysRaw = String(formData.get("expires_in_days") ?? "").trim();

  const maxUses = maxUsesRaw ? Number.parseInt(maxUsesRaw, 10) : null;
  if (maxUsesRaw && (!Number.isFinite(maxUses) || (maxUses ?? 0) <= 0)) {
    return { error: "Max uses must be a positive number." };
  }

  const expiresInDays = expiresInDaysRaw ? Number.parseInt(expiresInDaysRaw, 10) : null;
  if (expiresInDaysRaw && (!Number.isFinite(expiresInDays) || (expiresInDays ?? 0) <= 0)) {
    return { error: "Expiry must be a positive number of days." };
  }
  const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString() : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const code = randomBytes(8).toString("base64url");

  const { error } = await supabase.from("community_invites").insert({
    community_id: communityId,
    code,
    role,
    max_uses: maxUses,
    expires_at: expiresAt,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}

export async function revokeInvite(inviteId: string, communitySlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("community_invites").update({ revoked: true }).eq("id", inviteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}
