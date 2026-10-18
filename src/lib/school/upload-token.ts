// The token that lets a browser send a big file straight to the video worker.
//
// Files over the Storage limit can't go through Supabase, so the browser PUTs
// them to the worker itself. The worker's bearer secret must never reach a
// browser, so instead the app signs a token for ONE job that runs out after a
// couple of hours:
//
//     <expiry unix seconds>.<hex HMAC-SHA256(secret, "<job id>.<expiry>")>
//
// The worker recomputes it with the same shared secret (verify_upload_token
// in workers/video-transcriber/app.py). A leaked token can only fill in the
// one job it names, and only until it expires.
//
// Server-only in practice (it needs the secret), but kept free of the
// "server-only" import so the test runner can exercise it.

import { createHmac, timingSafeEqual } from "node:crypto";

// Long enough for a few GB over a slow home connection.
export const UPLOAD_TOKEN_TTL_SECONDS = 2 * 60 * 60;

function signature(secret: string, jobId: string, expiresAt: number): string {
  return createHmac("sha256", secret).update(`${jobId}.${expiresAt}`).digest("hex");
}

export function signUploadToken(
  secret: string,
  jobId: string,
  now: number = Math.floor(Date.now() / 1000)
): string {
  const expiresAt = now + UPLOAD_TOKEN_TTL_SECONDS;
  return `${expiresAt}.${signature(secret, jobId, expiresAt)}`;
}

// The app never checks its own tokens — the worker does. This mirrors the
// worker's check so the two can be tested against the same format.
export function verifyUploadToken(
  secret: string,
  jobId: string,
  token: string,
  now: number = Math.floor(Date.now() / 1000)
): boolean {
  const [expiry, sig, extra] = token.split(".");
  if (extra !== undefined || !/^\d+$/.test(expiry ?? "") || !sig) return false;
  const expiresAt = Number(expiry);
  if (expiresAt < now) return false;
  const expected = Buffer.from(signature(secret, jobId, expiresAt));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
