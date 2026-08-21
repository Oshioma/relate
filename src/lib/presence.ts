// Presence throttling for the "active today" numbers.
//
// The proxy sees every request, but a database write per request would be
// absurd — so a cookie carries which contexts this person has already been
// counted in during the current window, and the write only happens when the
// current context isn't in it yet. That bounds the writes to a handful per
// person per window no matter how much they click around, without needing to
// read anything first.
//
// Cookie value: "<window bucket>:<key>,<key>,…" where the bucket is the wall
// clock divided by the window length, so a new window is a plain integer
// comparison — no clock arithmetic, no expiry races.

export const ACTIVITY_COOKIE = "relate_seen";

// How often one person can be counted again in the same context. Long enough
// that browsing costs nothing, short enough that "active today" is real.
export const ACTIVITY_WINDOW_MS = 15 * 60 * 1000;

// The context key for time spent outside any community (dashboard, settings,
// messages). Not a valid community slug, so it can never collide with one.
export const PLATFORM_ACTIVITY_KEY = "-";

// Ceiling on contexts remembered per window. Someone hopping between many
// communities writes at most this many times per window; the oldest key falls
// off and can be counted again, which is the right trade — it keeps the cookie
// small and the writes bounded.
const MAX_KEYS = 5;

export type ActivityCookieDecision = {
  // The cookie value to write back.
  value: string;
  // How long the cookie should live, in seconds. Two windows, so a cookie set
  // at the very end of one window still survives to be compared against.
  maxAgeSeconds: number;
};

// Decide whether this request should record activity. Returns null when the
// person has already been counted in this context during the current window —
// the overwhelmingly common case, and the one that costs nothing.
export function activityCookieDecision(
  rawCookie: string | undefined,
  key: string,
  now: number
): ActivityCookieDecision | null {
  const bucket = Math.floor(now / ACTIVITY_WINDOW_MS);
  const maxAgeSeconds = Math.floor((ACTIVITY_WINDOW_MS * 2) / 1000);
  const parsed = parseActivityCookie(rawCookie);

  // A new window (or no/garbled cookie): count them, start a fresh list.
  if (!parsed || parsed.bucket !== bucket) {
    return { value: formatActivityCookie(bucket, [key]), maxAgeSeconds };
  }

  // Same window, already counted here: nothing to do.
  if (parsed.keys.includes(key)) return null;

  const keys = [...parsed.keys, key].slice(-MAX_KEYS);
  return { value: formatActivityCookie(bucket, keys), maxAgeSeconds };
}

function formatActivityCookie(bucket: number, keys: string[]): string {
  return `${bucket}:${keys.join(",")}`;
}

function parseActivityCookie(raw: string | undefined): { bucket: number; keys: string[] } | null {
  if (!raw) return null;
  const separator = raw.indexOf(":");
  if (separator < 1) return null;
  const bucket = Number(raw.slice(0, separator));
  if (!Number.isSafeInteger(bucket)) return null;
  return {
    bucket,
    keys: raw
      .slice(separator + 1)
      .split(",")
      .filter(Boolean),
  };
}

// The community a request is "in", from the resolved path (/c/<slug>/…). On a
// community's own domain the proxy has already rewritten the path, so this sees
// the same shape either way. Null means the platform itself.
export function activityCommunitySlug(path: string): string | null {
  const match = path.match(/^\/c\/([a-z0-9-]{2,60})(?:\/|$)/);
  return match ? match[1] : null;
}

// Only real navigations count as presence. Prefetches are the browser guessing,
// not a person looking, and route handlers are machines talking to machines —
// counting either would inflate "active" with things nobody did.
export function isTrackableActivityRequest(headers: Headers, pathname: string): boolean {
  if (pathname.startsWith("/api/")) return false;
  if (headers.get("next-router-prefetch") === "1") return false;
  if (headers.get("purpose") === "prefetch" || headers.get("x-purpose") === "prefetch") return false;
  if (headers.get("x-middleware-prefetch") === "1") return false;
  return true;
}
