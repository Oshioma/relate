// Custom-domain resolution for the proxy: maps a request's Host header to a
// community slug. Runs on every request that arrives on a non-platform
// domain, so results are cached in-memory. The proxy may run in multiple
// isolated instances that each keep their own cache (per the proxy docs,
// globals are best-effort there) — that's fine, a miss just costs one RPC.

const FOUND_TTL_MS = 5 * 60 * 1000;
// Misses stay short so a just-verified domain starts routing quickly.
const MISS_TTL_MS = 15 * 1000;
const MAX_CACHE_ENTRIES = 1000;

const cache = new Map<string, { slug: string | null; expiresAt: number }>();

// Calls the security-definer function from supabase/custom-domains.sql via
// PostgREST directly rather than instantiating a Supabase client — the
// lookup is anonymous and cookie-free, so a bare fetch keeps the proxy's
// hot path light. Returns null for unknown/unverified domains and on any
// transport error (an outage should degrade to "show the platform site",
// never to a crashed proxy).
async function fetchSlugForDomain(hostname: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const res = await fetch(`${url}/rest/v1/rpc/community_slug_for_domain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ p_domain: hostname }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const slug = (await res.json()) as unknown;
    return typeof slug === "string" && slug.length > 0 ? slug : null;
  } catch {
    return null;
  }
}

export async function resolveCommunitySlugForHost(host: string): Promise<string | null> {
  const hostname = host.toLowerCase().replace(/:\d+$/, "");

  const cached = cache.get(hostname);
  if (cached && cached.expiresAt > Date.now()) return cached.slug;

  const slug = await fetchSlugForDomain(hostname);

  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Simplest bound that can't grow without limit; Map iteration order is
    // insertion order, so this drops the oldest entry.
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(hostname, { slug, expiresAt: Date.now() + (slug ? FOUND_TTL_MS : MISS_TTL_MS) });

  return slug;
}
