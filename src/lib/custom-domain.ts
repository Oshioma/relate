// Shared custom-domain helpers. Imported from both server code (proxy,
// admin server actions) and client components (the admin UI shows the
// verification record name), so nothing here may touch secrets or
// server-only APIs.

// Matches the custom_domain_format check constraint in
// supabase/custom-domains.sql — keep the two in sync.
const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

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
