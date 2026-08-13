import "server-only";

// Cloudflare Turnstile — a privacy-friendly CAPTCHA that gates signup so
// automated bots can't mass-create accounts. It stays completely optional: when
// the two env vars aren't set, isTurnstileConfigured() is false and the signup
// flow behaves exactly as before (the honeypot is the only bot defense). Set
// both to turn it on:
//   NEXT_PUBLIC_TURNSTILE_SITE_KEY  — the public site key (safe in the browser)
//   TURNSTILE_SECRET_KEY            — the secret key (server only, never public)
// Get a free key pair at https://dash.cloudflare.com/?to=/:account/turnstile.
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

// Server-side verification of the token the widget put in the form. Returns
// true only when Cloudflare confirms the challenge was solved. Any network or
// parsing failure returns false — a signup is never let through on a broken or
// missing verification. remoteIp is optional; passing it tightens the check.
export async function verifyTurnstileToken(token: string, remoteIp?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
