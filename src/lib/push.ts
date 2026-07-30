import "server-only";
import webpush from "web-push";

// Web Push (RFC 8291/8292) sender. VAPID keys authenticate the platform to the
// browsers' push services; generate a pair once with `npx web-push generate-vapid-keys`
// and set them as env vars. The public key is also exposed to the browser as
// NEXT_PUBLIC_VAPID_PUBLIC_KEY so it can subscribe. Server-only — the private
// key must never reach the client.

export function isPushConfigured(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

let configured = false;
function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:notifications@relate.click",
    process.env.VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  );
  configured = true;
}

export type StoredPushSubscription = { endpoint: string; p256dh: string; auth: string };
export type PushPayload = { title: string; body: string; url: string };

// { ok: true } on delivery; { ok: false, expired } when the subscription is gone
// (404/410) so the caller can prune it; { ok: false, expired: false } for
// transient failures.
export type PushSendResult = { ok: true } | { ok: false; expired: boolean; reason: string };

export async function sendWebPush(sub: StoredPushSubscription, payload: PushPayload): Promise<PushSendResult> {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    );
    return { ok: true };
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    const expired = statusCode === 404 || statusCode === 410;
    return { ok: false, expired, reason: (err as Error).message };
  }
}
