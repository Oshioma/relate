// Where to send someone once they've signed in (or up): back to the page they
// were on. Every sign-in route carries that page as a `next` query param, and
// it is only ever followed as a path on the CURRENT host — never a full URL —
// so a crafted link can't use our sign-in to bounce someone to another site.
//
// "//evil.com" and "/\evil.com" start with "/" but browsers read both as a
// different host, which is why a plain startsWith("/") check isn't enough.
export function safeReturnPath(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  // Control characters (tabs, newlines) are stripped by browsers when parsing
  // a URL, which can turn "/\t/evil.com" into "//evil.com".
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;
  return value;
}

// The /login or /signup link for a guest looking at `pathname`, so signing in
// brings them straight back to it. Falls back to `fallback` (the community's
// home) when the current page can't be returned to: the signed-out welcome
// page only exists for guests, and auth pages would just loop.
export function returnHereHref(authPath: "/login" | "/signup", pathname: string | null, fallback: string): string {
  let next = safeReturnPath(pathname, fallback);
  if (/^\/(welcome|login|signup|auth)(\/|$)/.test(next)) next = fallback;
  return `${authPath}?next=${encodeURIComponent(next)}`;
}
