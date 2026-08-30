import { normalizeCustomDomain, platformSubdomainSlug } from "@/lib/custom-domain";
import { createClient } from "@/lib/supabase/server";

// Resolves a host (optionally with a port) to a host this app is allowed to
// hand auth credentials to: a community's verified custom domain, or a
// <slug>.<platform-apex> subdomain. Auth flows that forward a one-time token
// across hosts — the email-confirm `return_host` hop and the cross-domain
// auth bridge — must only ever target another face of this very app, never an
// arbitrary site, so the host is checked against our own database with the
// same security-definer lookup the proxy uses. Returns null for anything
// else, which callers treat as "stay on the current host".
export async function verifiedCommunityHost(rawHost: string | null): Promise<string | null> {
  if (!rawHost) return null;

  const [hostPart, portPart] = rawHost.split(":");
  const hostname = normalizeCustomDomain(hostPart ?? "");
  if (!hostname) return null;
  const port = portPart && /^\d{1,5}$/.test(portPart) ? `:${portPart}` : "";

  // <slug>.<platform-apex> subdomains are trusted without a database check:
  // the wildcard resolves to this app no matter what the label is, so the
  // worst case for a non-existent slug is a 404 on our own domain.
  if (platformSubdomainSlug(hostname)) return `${hostname}${port}`;

  const supabase = await createClient();
  const { data: slug } = await supabase.rpc("community_slug_for_domain", { p_domain: hostname });
  return slug ? `${hostname}${port}` : null;
}
