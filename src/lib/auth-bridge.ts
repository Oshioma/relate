// Cross-host auth bridge: lets a member who is already signed in on the
// platform continue onto a community's custom domain without typing their
// password again. Auth cookies are host-scoped, so a custom domain can never
// simply share the platform session; instead the proxy sends its logged-out
// visitors through /auth/bridge on the platform host, which (after an explicit
// click — see src/app/auth/bridge/page.tsx for why it must not be silent)
// mints a one-time magic-link token and forwards it to the community host's
// /auth/bridge/finish route, where verifying it sets the session cookie on
// that host. Platform subdomains never need any of this — their cookie
// already spans the apex (see sharedCookieDomain).

// Set on the community host once a bridge attempt has come back without a
// session, so the proxy stops bouncing every protected-path hit through the
// platform and lets the visitor just sign in locally. Short-lived: a member
// who signs in on the platform soon after should get bridged on their next
// visit.
export const BRIDGE_CHECKED_COOKIE = "relate-bridge-checked";
export const BRIDGE_CHECKED_MAX_AGE_SECONDS = 15 * 60;

// The platform-host URL that starts a bridge attempt for a request that
// arrived logged-out on `host`. Null when the platform origin isn't
// configured, in which case the caller falls back to the host's own /login.
export function platformBridgeUrl(host: string, nextPath: string): URL | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;
  try {
    const url = new URL("/auth/bridge", siteUrl);
    url.searchParams.set("host", host);
    url.searchParams.set("next", nextPath);
    return url;
  } catch {
    return null;
  }
}
