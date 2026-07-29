import { createSign } from "node:crypto";

// JaaS (Jitsi as a Service, by 8x8) config — the production video backend for
// Live Events. Unlike the free public meet.jit.si server (demo-only: 5-minute
// cap + a nag banner on embeds), JaaS authenticates each participant with a
// short-lived RS256 JWT we sign here with the app's private key. All three
// values come from the JaaS console (jaas.8x8.vc):
//   JITSI_APP_ID       the tenant / AppID, e.g. "vpaas-magic-cookie-abc123…"
//   JITSI_API_KEY_ID   the API key id used as the JWT "kid" header
//   JITSI_PRIVATE_KEY  the RSA private key (PEM) that pairs with that key id
// All server-side only. When any is missing, isJaasConfigured() is false and
// the embed falls back to the public demo server, so local dev still works.
const APP_ID_ENV = process.env.JITSI_APP_ID;
const API_KEY_ID_ENV = process.env.JITSI_API_KEY_ID;
const RAW_PRIVATE_KEY = process.env.JITSI_PRIVATE_KEY;

// JaaS validates that the JWT header's `kid` is "<AppID>/<keyId>" AND that the
// payload's `sub` equals that AppID — a mismatch is the "Key ID (kid) does not
// match sub" auth error. The two console values can be pasted a few ways (the
// full "<AppID>/<keyId>" in one var, or split across the two), so we normalise
// here and derive `sub` from the same source as `kid`, guaranteeing they agree.

// The full key id used as the JWT `kid`: "<AppID>/<keyId>". If JITSI_API_KEY_ID
// already contains a "/", trust it as-is; otherwise join it to the AppID.
function fullKeyId(): string | null {
  if (!API_KEY_ID_ENV) return null;
  if (API_KEY_ID_ENV.includes("/")) return API_KEY_ID_ENV;
  return APP_ID_ENV ? `${APP_ID_ENV}/${API_KEY_ID_ENV}` : null;
}

// The AppID (JWT `sub` and the room-name prefix): always the part of the key id
// before the "/", so it can't disagree with `kid`. Falls back to JITSI_APP_ID.
function appId(): string | null {
  const kid = fullKeyId();
  if (kid?.includes("/")) return kid.slice(0, kid.indexOf("/"));
  return APP_ID_ENV ?? null;
}

export function isJaasConfigured(): boolean {
  return Boolean(appId() && fullKeyId() && RAW_PRIVATE_KEY);
}

export function getJaasAppId(): string | null {
  return appId();
}

// Env stores multi-line PEMs with the newlines escaped as "\n"; restore them.
function privateKeyPem(): string {
  return (RAW_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
}

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

export interface JaasTokenInput {
  // The room name (without the AppID prefix — the client prepends it).
  room: string;
  userId: string;
  name: string;
  // Staff join as moderators (can mute others, manage the room); members don't.
  moderator: boolean;
  email?: string | null;
  avatar?: string | null;
}

// Mints a JaaS-compatible JWT (RS256) for one participant. Signed with
// node:crypto so no JWT dependency is needed. Throws if JaaS isn't configured —
// callers should gate on isJaasConfigured() first.
export function mintJaasToken(input: JaasTokenInput): string {
  if (!isJaasConfigured()) {
    throw new Error("JaaS is not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", kid: fullKeyId(), typ: "JWT" };
  const payload = {
    aud: "jitsi",
    iss: "chat",
    sub: appId(),
    room: input.room,
    // Short-lived: long enough for a live event, short enough to limit reuse.
    exp: now + 60 * 60 * 3,
    // Deliberately no `nbf`. It's optional for JaaS and only blocks *early* use
    // (pointless here — people join immediately). Omitting it makes the "nbf
    // value is in the future" rejection impossible, even if this server's clock
    // runs ahead of 8x8's validators.
    context: {
      features: {
        livestreaming: false,
        recording: false,
        transcription: false,
        "outbound-call": false,
      },
      user: {
        "hidden-from-recorder": false,
        moderator: input.moderator,
        id: input.userId,
        name: input.name,
        email: input.email ?? "",
        avatar: input.avatar ?? "",
      },
    },
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKeyPem()).toString("base64url");
  return `${signingInput}.${signature}`;
}
