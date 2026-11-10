"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { isResendConfigured, sendCommunityTemplateEmail } from "@/lib/email";
import { EMAIL_TEMPLATE_STARTERS, firstNameOf, isMigrationEmailKind, renderCommunityEmail } from "@/lib/email-templates";
import { ACTIVATION_TTL_DAYS } from "@/lib/activations";

export type SendEmailsState = { error: string } | { ok: true; message: string } | undefined;

// Resend allows a couple of requests a second; a short gap keeps a batch
// under that. A batch is capped so one press can't run past the page timeout.
const SEND_GAP_MS = 600;
const MAX_PER_BATCH = 60;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSiteOrigin() {
  const headerList = await headers();
  return headerList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

// Sends one of the "we've moved" emails to members who are already in the
// community (brought over from another platform with no password). Each
// person gets their own single-use activation link; for the "regular members"
// email that link also gives them the tiers ticked here free.
export async function sendMigrationEmails(_prev: SendEmailsState, formData: FormData): Promise<SendEmailsState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const kind = String(formData.get("kind") ?? "");
  if (!isMigrationEmailKind(kind)) return { error: "Choose which email to send." };

  const userIds = [...new Set(formData.getAll("user_ids").map(String).filter(Boolean))];
  if (userIds.length === 0) return { error: "Tick at least one member to send it to." };
  if (userIds.length > MAX_PER_BATCH) {
    return { error: `That's ${userIds.length} people. Send to ${MAX_PER_BATCH} or fewer at a time.` };
  }
  const tierIdsRaw = kind === "migration_active" ? [...new Set(formData.getAll("free_tier_ids").map(String).filter(Boolean))] : [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || community.id !== communityId) return { error: "Community not found." };
  const membership = await getMembership(supabase, community.id, user.id);
  if (!isCommunityAdmin(community, membership, user.id)) return { error: "Only this community's admins can send these emails." };
  if (!isResendConfigured()) return { error: "Email sending isn't set up on this site, so nothing can go out yet." };

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Email sending isn't set up yet." };
  }

  // Only real tiers of this community can be given away.
  let freeTierIds: string[] = [];
  if (tierIdsRaw.length > 0) {
    const { data: tiers } = await admin
      .from("community_tiers")
      .select("id")
      .eq("community_id", community.id)
      .in("id", tierIdsRaw);
    freeTierIds = (tiers ?? []).map((t) => t.id);
  }
  if (kind === "migration_active" && freeTierIds.length === 0) {
    return { error: "Tick the membership they get free." };
  }

  // Only people who are members here already.
  const { data: members } = await admin
    .from("community_memberships")
    .select("user_id, status")
    .eq("community_id", community.id)
    .in("user_id", userIds);
  const memberIds = new Set((members ?? []).filter((m) => m.status === "active").map((m) => m.user_id));

  const { data: saved } = await supabase
    .from("community_email_templates")
    .select("*")
    .eq("community_id", community.id)
    .eq("kind", kind)
    .maybeSingle();
  const template = saved ?? { kind, ...EMAIL_TEMPLATE_STARTERS[kind], logo_url: null, banner_url: null };

  const { data: profiles } = await admin.from("profiles").select("id, full_name, username").in("id", [...memberIds]);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const origin = await getSiteOrigin();
  const expiresAt = new Date(Date.now() + ACTIVATION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let sent = 0;
  const failed: string[] = [];
  for (const userId of userIds) {
    const profile = profileById.get(userId);
    const label = profile?.full_name || profile?.username || "someone";
    if (!memberIds.has(userId)) {
      failed.push(`${label} (not a member)`);
      continue;
    }
    const { data: authUser } = await admin.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;
    if (!email) {
      failed.push(`${label} (no email address)`);
      continue;
    }

    const token = randomBytes(18).toString("base64url");
    const { data: row, error: insertError } = await admin
      .from("community_activations")
      .insert({
        token,
        community_id: community.id,
        user_id: userId,
        kind,
        free_tier_ids: freeTierIds,
        created_by: user.id,
        expires_at: expiresAt,
      })
      .select("id")
      .single();
    if (insertError || !row) {
      failed.push(`${label} (${insertError?.message ?? "couldn't make their link"})`);
      continue;
    }

    const rendered = renderCommunityEmail({
      template,
      communityName: community.name,
      communityLogoUrl: community.logo_url,
      values: { firstName: firstNameOf(profile?.full_name) ?? profile?.username ?? null },
      buttonUrl: `${origin}/invite/activate/${token}`,
    });

    if (sent + failed.length > 0) await wait(SEND_GAP_MS);
    const result = await sendCommunityTemplateEmail({
      to: email,
      communityName: community.name,
      subject: rendered.subject,
      html: rendered.html,
    });
    if (!result.ok) {
      // No email went out, so the link it would have carried goes too.
      await admin.from("community_activations").delete().eq("id", row.id);
      failed.push(`${label} (${result.reason})`);
      continue;
    }
    sent += 1;
  }

  revalidatePath(`/c/${communitySlug}/admin/emails`);
  if (sent === 0) return { error: `Nothing was sent. ${failed.join("; ")}` };
  const people = sent === 1 ? "1 person" : `${sent} people`;
  return {
    ok: true,
    message: failed.length > 0 ? `Sent to ${people}. Not sent: ${failed.join("; ")}.` : `Sent to ${people}.`,
  };
}
