import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPushConfigured, sendWebPush } from "@/lib/push";

// Webhook target for the notifications-table push trigger (see
// 20260730120826_push_notifications.sql). The DB posts the id of a freshly
// inserted notification here; we look up the row and the recipient's push
// subscriptions and deliver a Web Push copy of the bell notification.
//
// Authenticated by the same shared secret as the email webhook
// (NOTIFICATION_EMAIL_WEBHOOK_SECRET) — the caller is Postgres, not a browser.
// We reload the row by id instead of trusting the posted body. web-push needs
// Node APIs, so this runs on the Node runtime (the App Router default).

export async function POST(request: NextRequest) {
  const secret = process.env.NOTIFICATION_EMAIL_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-notification-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // No VAPID keys — acknowledge so pg_net doesn't record a failure.
  if (!isPushConfigured()) {
    return NextResponse.json({ ok: true, skipped: "push-not-configured" });
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
    .select("user_id, title, body, link")
    .eq("id", id)
    .maybeSingle();
  if (error || !notification) {
    return NextResponse.json({ error: "notification not found" }, { status: 404 });
  }

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", notification.user_id);
  if (!subs || subs.length === 0) {
    return NextResponse.json({ ok: true, skipped: "no-subscriptions" });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const link = notification.link ?? "/notifications";
  const url = link.startsWith("http") ? link : `${base}${link}`;
  const payload = { title: notification.title, body: notification.body ?? "", url };

  // Deliver to every device; prune subscriptions the push service reports gone.
  const expiredEndpoints: string[] = [];
  await Promise.all(
    subs.map(async (sub) => {
      const result = await sendWebPush(sub, payload);
      if (!result.ok && result.expired) expiredEndpoints.push(sub.endpoint);
    })
  );

  if (expiredEndpoints.length > 0) {
    await admin.from("push_subscriptions").delete().in("endpoint", expiredEndpoints);
  }

  return NextResponse.json({ ok: true, delivered: subs.length - expiredEndpoints.length });
}
