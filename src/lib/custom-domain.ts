// Shared custom-domain helpers. Imported from both server code (proxy,
// admin server actions) and client components (the admin UI shows the
// verification record name), so nothing here may touch secrets or
// server-only APIs.

// Matches the custom_domain_format check constraint in
// supabase/custom-domains.sql — keep the two in sync.
const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

// Matches the slug_format check constraint on communities in
// supabase/schema.sql — keep the two in sync.
const SLUG_PATTERN = /^[a-z0-9-]{2,60}$/;

// Subdomain labels that must never resolve to a community, either because
// the platform may want them itself or because they'd look official enough
// to phish with. Community creation refuses these as slugs too.
export const RESERVED_SUBDOMAIN_LABELS = new Set([
  "www", "app", "api", "admin", "auth", "mail", "email", "smtp", "imap", "pop",
  "webmail", "blog", "docs", "help", "support", "status", "cdn", "assets",
  "static", "images", "media", "files", "staging", "dev", "test", "preview", "beta",
]);

// Owners prove control of a domain by publishing their community's token as
// a TXT record at _relate-verify.<domain>.
export const VERIFICATION_RECORD_PREFIX = "_relate-verify";

export function verificationRecordName(domain: string) {
  return `${VERIFICATION_RECORD_PREFIX}.${domain}`;
}

// Forgiving normalization of whatever the owner pastes — "https://www.Foo.com/"
// becomes "www.foo.com". Returns null when no valid bare hostname remains.
export function normalizeCustomDomain(raw: string): string | null {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, ""); // scheme
  value = value.replace(/[/?#].*$/, ""); // path, query, fragment
  value = value.replace(/:\d+$/, ""); // port
  value = value.replace(/\.$/, ""); // trailing dot
  if (value.length < 4 || value.length > 253) return null;
  if (!HOSTNAME_PATTERN.test(value)) return null;
  return value;
}

function platformApexHostname(): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;
  try {
    return new URL(siteUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
}

// Every community is automatically reachable at <slug>.<platform-apex>
// (e.g. mzunguzanzibar.relate.click) — no DNS verification needed, since
// the whole wildcard belongs to the platform. Returns the slug when the
// host is exactly one non-reserved, slug-shaped label under the platform
// apex, else null. The proxy checks this before anything else, so it also
// works for <slug>.localhost in dev.
export function platformSubdomainSlug(host: string): string | null {
  const hostname = host.toLowerCase().replace(/:\d+$/, "");
  const apex = platformApexHostname();
  if (!apex || hostname === apex || !hostname.endsWith(`.${apex}`)) return null;

  const label = hostname.slice(0, -(apex.length + 1));
  if (label.includes(".")) return null;
  if (RESERVED_SUBDOMAIN_LABELS.has(label)) return null;
  if (!SLUG_PATTERN.test(label)) return null;
  return label;
}

// Anything at or under the platform apex — used to refuse such hostnames as
// "custom domains": subdomains are automatic, and letting one community
// claim another community's subdomain via the custom-domain path would
// shadow it.
export function isUnderPlatformApex(host: string): boolean {
  const hostname = host.toLowerCase().replace(/:\d+$/, "");
  const apex = platformApexHostname();
  return Boolean(apex && (hostname === apex || hostname.endsWith(`.${apex}`)));
}

// The community's automatic subdomain URL, for display in the admin UI —
// null when the platform apex isn't a real public domain (local dev,
// bare *.vercel.app deployments), where wildcard subdomains don't resolve.
export function communitySubdomainUrl(slug: string): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;
  try {
    const url = new URL(siteUrl);
    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost")) return null;
    if (hostname.endsWith(".vercel.app")) return null;
    return `${url.protocol}//${slug}.${url.host}`;
  } catch {
    return null;
  }
}

// Hosts that always belong to the platform itself and can never be claimed
// as a community's custom domain. Also used by the proxy to skip the
// domain lookup entirely for platform traffic.
export function isPlatformHost(host: string): boolean {
  const hostname = host.toLowerCase().replace(/:\d+$/, "");
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1") return true;
  if (hostname.endsWith(".vercel.app")) return true;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      if (new URL(siteUrl).hostname.toLowerCase() === hostname) return true;
    } catch {
      // Malformed NEXT_PUBLIC_SITE_URL — fall through to "not platform".
    }
  }
  return false;
}
