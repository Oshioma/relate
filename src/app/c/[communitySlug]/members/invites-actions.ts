"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isInviteActive } from "@/lib/data/invites";
import { isResendConfigured, sendCommunityInviteEmail } from "@/lib/email";
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

  revalidatePath(`/c/${communitySlug}/members`);
  return undefined;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emailed invites are point-to-point and single-use, so they should not linger
// on the invite list forever when the recipient never clicks. Give them a
// generous-but-finite window; once past it the row drops out of the "active"
// view on its own, and an expired click is redirected toward joining instead
// of dead-ending (see src/app/invite/[code]/page.tsx). Not exported: a
// "use server" module may only export async functions.
const EMAIL_INVITE_TTL_DAYS = 14;

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
  const expiresAt = new Date(Date.now() + EMAIL_INVITE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

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
    expires_at: expiresAt,
    created_by: user.id,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  const origin = await getSiteOrigin();

  // Preferred path: send our own community-branded email through Resend.
  // The invitee gets "You're invited to <community>" from the community's
  // name, and — unlike inviteUserByEmail below — no passwordless auth
  // account is pre-created, so "Create account" on the invite page just
  // works for them.
  if (isResendConfigured()) {
    const [{ data: community }, { data: inviter }] = await Promise.all([
      supabase.from("communities").select("name, logo_url").eq("id", communityId).maybeSingle(),
      supabase.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle(),
    ]);

    const sent = await sendCommunityInviteEmail({
      to: email,
      communityName: community?.name ?? "our community",
      communityLogoUrl: community?.logo_url ?? null,
      inviterName: inviter?.full_name || inviter?.username || null,
      inviteUrl: `${origin}/invite/${code}`,
    });

    if (!sent.ok) {
      // The invite link exists and is copyable from the list either way.
      return { error: `Invite link created, but the email couldn't be sent: ${sent.reason}` };
    }

    revalidatePath(`/c/${communitySlug}/members`);
    return undefined;
  }

  // Fallback without Resend: Supabase Auth's invite email ("from Relate",
  // global template — and it pre-creates a passwordless auth account).
  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Email invites aren't configured yet." };
  }
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(`/invite/${code}`)}`,
  });

  if (inviteError) {
    // inviteUserByEmail only works for brand-new addresses — it fails when
    // the address already has an auth.users account (e.g. a former member).
    // Newer GoTrue versions set code "email_exists"; this project's server
    // only sends a message, so match on that too. In that case, add them to
    // the community directly instead of dead-ending on an unsendable invite.
    const alreadyRegistered = inviteError.code === "email_exists" || /already.*(registered|exists)/i.test(inviteError.message);
    if (alreadyRegistered) {
      const { data: existingUserId } = await admin.rpc("find_user_id_by_email", { p_email: email });
      if (existingUserId) {
        const { error: membershipError } = await admin
          .from("community_memberships")
          .upsert({ user_id: existingUserId, community_id: communityId, role, status: "active" }, { onConflict: "user_id,community_id" });

        if (!membershipError) {
          revalidatePath(`/c/${communitySlug}/members`);
          return undefined;
        }
      }
    }

    // Surface the full error in the server logs — the client only ever sees a
    // string, so without this an empty/opaque GoTrue body is impossible to
    // diagnose after the fact.
    console.error("[invites] inviteUserByEmail failed:", inviteError);

    // Supabase's built-in email service only sends a few emails per hour —
    // it's meant for development. Point admins at the two real ways forward
    // instead of echoing the raw "email rate limit exceeded".
    const rateLimited = inviteError.code === "over_email_send_rate_limit" || /rate ?limit/i.test(inviteError.message);
    if (rateLimited) {
      return {
        error:
          "Invite link created, but the email was skipped: this project hit Supabase's hourly email limit. Copy the invite link from the list below and share it directly — or connect a custom SMTP provider (Supabase → Authentication → Emails) to send more.",
      };
    }

    // When email delivery fails without SMTP configured, GoTrue often replies
    // with an error status but an empty body. auth-js then falls back to
    // JSON.stringify(body), leaving message as the useless literal "{}" (or
    // ""). Echoing that verbatim produced the confusing "…couldn't be sent: {}".
    // Detect that case and give admins something actionable instead.
    const rawMessage = inviteError.message?.trim() ?? "";
    const hasUsefulMessage = rawMessage !== "" && rawMessage !== "{}" && rawMessage !== "[object Object]";
    if (!hasUsefulMessage) {
      return {
        error:
          "Invite link created, but the email couldn't be sent: the email service returned no details. This usually means transactional email isn't set up — connect a custom SMTP provider (Supabase → Authentication → Emails). In the meantime, copy the invite link from the list below and share it directly.",
      };
    }

    // The invite link itself was still created and is visible/copyable from
    // the list below, so this isn't a dead end even if the email didn't go out.
    return {
      error: `Invite link created, but the email couldn't be sent: ${rawMessage}`,
    };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  return undefined;
}

export async function revokeInvite(inviteId: string, communitySlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("community_invites").update({ revoked: true }).eq("id", inviteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  return { error: null };
}

// Delete every dead invite for a community in one go: revoked, past its
// expiry, or fully used up. Redeemed invites are safe to remove — the
// membership they granted lives in community_memberships, not here. Deletes
// run through the RLS-protected client, so "invites_delete_admin" still gates
// this to the community's own owner/admins; we compute which rows are inactive
// in JS (uses_count >= max_uses can't be expressed as a PostgREST filter) and
// delete them by id.
export async function clearInactiveInvites(communityId: string, communitySlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_invites")
    .select("*")
    .eq("community_id", communityId);

  if (error) {
    return { error: error.message };
  }

  const inactiveIds = (data ?? []).filter((invite) => !isInviteActive(invite)).map((invite) => invite.id);
  if (inactiveIds.length === 0) {
    return { error: null, cleared: 0 };
  }

  const { error: deleteError } = await supabase.from("community_invites").delete().in("id", inactiveIds);
  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath(`/c/${communitySlug}/members`);
  return { error: null, cleared: inactiveIds.length };
}
