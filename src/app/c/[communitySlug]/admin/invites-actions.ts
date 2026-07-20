"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MembershipRole } from "@/types/database";

export type InviteFormState = { error: string } | undefined;

const INVITE_ROLES: Extract<MembershipRole, "member" | "moderator" | "admin">[] = ["member", "moderator", "admin"];

async function getSiteOrigin() {
  const headerList = await headers();
  return headerList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendEmailInvite(_prevState: InviteFormState, formData: FormData): Promise<InviteFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const roleRaw = String(formData.get("role") ?? "member");
  const role = INVITE_ROLES.includes(roleRaw as (typeof INVITE_ROLES)[number]) ? (roleRaw as (typeof INVITE_ROLES)[number]) : "member";

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const code = randomBytes(8).toString("base64url");

  // Inserting through the normal RLS-protected client is what actually
  // authorizes this action — "invites_insert_admin" only allows it when the
  // caller is this community's owner/admin. Only after that succeeds do we
  // touch the privileged admin client below.
  const { error: insertError } = await supabase.from("community_invites").insert({
    community_id: communityId,
    code,
    role,
    max_uses: 1,
    email,
    created_by: user.id,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Email invites aren't configured yet." };
  }

  const origin = await getSiteOrigin();
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(`/invite/${code}`)}`,
  });

  if (inviteError) {
    // inviteUserByEmail only works for brand-new addresses — it fails with
    // email_exists when the address already has an auth.users account (e.g.
    // a former member). In that case, add them to the community directly
    // instead of dead-ending on an unsendable invite email.
    if (inviteError.code === "email_exists") {
      const { data: existingUserId } = await admin.rpc("find_user_id_by_email", { p_email: email });
      if (existingUserId) {
        const { error: membershipError } = await admin
          .from("community_memberships")
          .upsert({ user_id: existingUserId, community_id: communityId, role, status: "active" }, { onConflict: "user_id,community_id" });

        if (!membershipError) {
          revalidatePath(`/c/${communitySlug}/admin`);
          return undefined;
        }
      }
    }

    // The invite link itself was still created and is visible/copyable from
    // the list below, so this isn't a dead end even if the email didn't go out.
    return {
      error: `Invite link created, but the email couldn't be sent: ${inviteError.message}`,
    };
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
