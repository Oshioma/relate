import { createHmac, timingSafeEqual } from "node:crypto";

// Signed "unsubscribe" links for the emails the site sends.
//
// Gmail and Yahoo expect mail people didn't directly ask for (onboarding,
// invites, welcome, notifications) to carry a one-click List-Unsubscribe
// header (RFC 8058). Without it, Gmail is far more likely to file the mail as
// spam. The link carries what to unsubscribe from, signed so nobody can
// unsubscribe someone else by editing it:
//   - community:     this email address from one community's emails
//   - notification:  this member from one kind of notification email (the
//                    same switch as Settings → Email notifications)
//
// The link never expires: an old email's unsubscribe link must keep working.

export type UnsubscribeTarget =
  | { kind: "community"; communityId: string; email: string }
  | { kind: "notification"; userId: string; type: string };

// One-click unsubscribe requests come as a POST with exactly this body.
export const ONE_CLICK_BODY = "List-Unsubscribe=One-Click";

function keyFrom(secret: string) {
  // A key of its own, derived from the server secret, so a signature here is
  // never valid anywhere else.
  return createHmac("sha256", secret).update("relate-email-unsubscribe-v1").digest();
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", keyFrom(secret)).update(payload).digest("base64url");
}

function encodeTarget(target: UnsubscribeTarget): string {
  return target.kind === "community"
    ? ["c", target.communityId, target.email.trim().toLowerCase()].join("|")
    : ["n", target.userId, target.type].join("|");
}

function decodeTarget(payload: string): UnsubscribeTarget | null {
  const [kind, id, rest, ...extra] = payload.split("|");
  if (extra.length > 0 || !id || !rest) return null;
  if (kind === "c") return { kind: "community", communityId: id, email: rest };
  if (kind === "n") return { kind: "notification", userId: id, type: rest };
  return null;
}

export function makeUnsubscribeToken(target: UnsubscribeTarget, secret: string): string {
  const payload = encodeTarget(target);
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${sign(payload, secret)}`;
}

export function readUnsubscribeToken(token: string | null | undefined, secret: string): UnsubscribeTarget | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  let payload: string;
  try {
    payload = Buffer.from(token.slice(0, dot), "base64url").toString("utf8");
  } catch {
    return null;
  }
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(payload, secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return decodeTarget(payload);
}

// The signing secret: its own env var if set, otherwise the service-role key
// the server already has (never sent to browsers), so nothing new needs
// setting up for links to work.
export function unsubscribeSecret(): string | null {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function unsubscribeUrl(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
}
