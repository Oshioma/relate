import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isResendConfigured, sendNotificationEmail } from "@/lib/email";

// Webhook target for the notifications-table trigger (see
// 20260728095459_email_on_notification_insert.sql). The DB posts the id of a
// freshly-inserted notification here; we look up the recipient's address and
// the row's content and send the email counterpart of the bell notification.
//
// Authenticated by a shared secret (NOTIFICATION_EMAIL_WEBHOOK_SECRET) rather
// than a user session — the caller is Postgres, not a signed-in browser, and
// the middleware exempts /api from its auth redirect. We reload the row from
// the database by id instead of trusting the posted body.

// Per-type call-to-action; falls back for any future type.
const CTA_LABEL: Record<string, string> = {
  comment: "View the discussion",
  post: "Read the post",
  membership: "Go to the community",
  claim: "Review the claim",
};

export async function POST(request: NextRequest) {
  const secret = process.env.NOTIFICATION_EMAIL_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-notification-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // No mailer configured — acknowledge so pg_net doesn't record a failure.
  if (!isResendConfigured()) {
    return NextResponse.json({ ok: true, skipped: "resend-not-configured" });
  }

  let id: string | undefined;
  try {
    id = ((await request.json()) as { id?: string }).id;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const admin = createAdminClient();

  const { data: notification, error } = await admin
    .from("notifications")
    .select("user_id, community_id, type, title, body, link")
    .eq("id", id)
    .maybeSingle();
  if (error || !notification) {
    return NextResponse.json({ error: "notification not found" }, { status: 404 });
  }

  // The recipient's email lives in auth.users (profiles has no email column).
  const { data: userData } = await admin.auth.admin.getUserById(notification.user_id);
  const to = userData.user?.email;
  if (!to) return NextResponse.json({ ok: true, skipped: "no-email" });

  let communityName: string | null = null;
  if (notification.community_id) {
    const { data: community } = await admin
      .from("communities")
      .select("name")
      .eq("id", notification.community_id)
      .maybeSingle();
    communityName = community?.name ?? null;
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const link = notification.link ?? "/notifications";
  const ctaUrl = link.startsWith("http") ? link : `${base}${link}`;

  const sent = await sendNotificationEmail({
    to,
    subject: notification.title,
    heading: notification.title,
    body: notification.body,
    ctaLabel: CTA_LABEL[notification.type] ?? "Open in Relate",
    ctaUrl,
    communityName,
  });

  if (!sent.ok) {
    console.warn("[notifications/email] send failed:", sent.reason);
    return NextResponse.json({ ok: false, reason: sent.reason }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
