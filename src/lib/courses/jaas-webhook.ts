import { createHmac, timingSafeEqual } from "node:crypto";

// Reading 8x8 JaaS webhooks: checking they really came from JaaS, and pulling
// out what a recording event says. Pure, so it's tested without a server.

// X-Jaas-Signature is "t=<timestamp>,v1=<signature>[,v1=…]": an HMAC-SHA256,
// keyed with the endpoint's secret from the JaaS console, over the timestamp,
// a ".", and the request body. 8x8's docs show the signature base64-encoded;
// hex and a base64-encoded body are accepted too, since every variant still
// needs the secret. Only the v1 scheme counts (anything else could be a
// downgrade). Events older than the tolerance are refused as replays.
export function verifyJaasSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  nowMs: number,
  toleranceSeconds = 600
): boolean {
  if (!header || !secret) return false;

  let timestamp: string | null = null;
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const at = part.indexOf("=");
    if (at <= 0) continue;
    const key = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim();
    if (key === "t") timestamp = value;
    else if (key === "v1" && value) signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;

  // JaaS sends seconds; tolerate milliseconds too.
  const t = Number(timestamp);
  if (!Number.isFinite(t)) return false;
  const tMs = t > 1e12 ? t : t * 1000;
  if (Math.abs(nowMs - tMs) > toleranceSeconds * 1000) return false;

  const expected: Buffer[] = [];
  for (const body of [rawBody, Buffer.from(rawBody).toString("base64")]) {
    const mac = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest();
    expected.push(Buffer.from(mac.toString("base64")), Buffer.from(mac.toString("hex")));
  }

  return signatures.some((sig) => {
    const given = Buffer.from(sig);
    return expected.some((want) => want.length === given.length && timingSafeEqual(want, given));
  });
}

export type JaasRecordingEvent = {
  idempotencyKey: string;
  sessionId: string | null;
  // The room name, without the "<appId>/" prefix.
  roomName: string;
  downloadUrl: string;
  durationSeconds: number | null;
  recordedAt: string | null;
};

// The parts of a RECORDING_UPLOADED event the app uses, or null for any other
// event (or one missing what's needed).
export function parseRecordingEvent(payload: unknown): JaasRecordingEvent | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (p.eventType !== "RECORDING_UPLOADED") return null;

  const data = (p.data && typeof p.data === "object" ? p.data : {}) as Record<string, unknown>;
  const downloadUrl = typeof data.preAuthenticatedLink === "string" ? data.preAuthenticatedLink : null;
  const fqn = typeof p.fqn === "string" ? p.fqn : null;
  if (!downloadUrl || !/^https:\/\//i.test(downloadUrl) || !fqn) return null;

  const roomName = fqn.includes("/") ? fqn.slice(fqn.lastIndexOf("/") + 1) : fqn;
  const sessionId = typeof p.sessionId === "string" ? p.sessionId : null;
  const idempotencyKey =
    typeof p.idempotencyKey === "string" && p.idempotencyKey ? p.idempotencyKey : `${sessionId ?? fqn}:${downloadUrl}`;

  const duration = Number(data.durationSec);
  const start = Number(data.startTimestamp ?? p.timestamp);

  return {
    idempotencyKey,
    sessionId,
    roomName: roomName.toLowerCase(),
    downloadUrl,
    durationSeconds: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : null,
    recordedAt: Number.isFinite(start) && start > 0 ? new Date(start > 1e12 ? start : start * 1000).toISOString() : null,
  };
}
