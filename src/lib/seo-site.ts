import "server-only";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isPlatformHost, platformSubdomainSlug, wwwCounterpart } from "@/lib/custom-domain";
import { resolveCommunitySlugForHost } from "@/lib/tenant-domains";
import { editorialGuideEntry } from "@/lib/guides/registry";
import { canonicalUrl, communityCanonicalOrigin, communitySitemap, SEO_PATH_HEADER, type SitemapEntry } from "@/lib/seo";
import type { Community, Database } from "@/types/database";

// Data for robots.txt and sitemap.xml (src/app/robots.ts, src/app/sitemap.ts).
// Both are served at the root of whichever host asked, so they work out which
// community that host belongs to the same way the proxy does.
//
// Every read goes through a cookie-free anon client: the sitemap must list
// what a signed-out visitor (and so a crawler) can see, never what the admin
// who happens to open it can.
function anonClient() {
  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// The community whose host this is: a <slug> subdomain, a verified custom
// domain, or that domain's www / bare counterpart. Null for the platform's
// own host. `hidden` is a community host whose community a guest can't read
// (invite-only), which should not be crawled at all.
export async function seoCommunityForHost(host: string): Promise<{ community: Community | null; hidden: boolean } | null> {
  let slug = platformSubdomainSlug(host);
  if (!slug && host && !isPlatformHost(host)) {
    slug = await resolveCommunitySlugForHost(host);
    if (!slug) {
      const counterpart = wwwCounterpart(host);
      if (counterpart) slug = await resolveCommunitySlugForHost(counterpart);
    }
  }
  if (!slug) return null;
  const { data } = await anonClient().from("communities").select("*").eq("slug", slug).maybeSingle();
  if (!data) return { community: null, hidden: true };
  return { community: data, hidden: data.privacy === "invite_only" };
}

export async function communitySitemapEntries(host: string, community: Community): Promise<SitemapEntry[]> {
  const origin = communityCanonicalOrigin(host, community);
  if (!origin) return [];
  const supabase = anonClient();
  const [guides, spaces, businesses, stays] = await Promise.all([
    supabase.from("editorial_guides").select("slug, status, updated_at").eq("community_id", community.id),
    supabase.from("spaces").select("id, slug, space_type, visibility").eq("community_id", community.id),
    supabase.from("businesses").select("slug, space_id, updated_at").eq("community_id", community.id),
    supabase.from("accommodation_listings").select("slug, space_id, updated_at, status").eq("community_id", community.id),
  ]);
  const spaceRows = spaces.data ?? [];
  const spaceSlug = new Map(spaceRows.map((s) => [s.id, s.slug]));
  return communitySitemap({
    origin,
    eventsPublic: Boolean(community.events_public),
    // Only published guides the app can actually render.
    guides: (guides.data ?? []).filter((g) => g.status === "published" && editorialGuideEntry(g.slug)),
    spaces: spaceRows,
    businesses: (businesses.data ?? []).map((b) => ({ slug: b.slug, space_slug: spaceSlug.get(b.space_id) ?? "", updated_at: b.updated_at })),
    stays: (stays.data ?? [])
      .filter((s) => s.status === "available")
      .map((s) => ({ slug: s.slug, space_slug: spaceSlug.get(s.space_id) ?? "", updated_at: s.updated_at })),
  });
}

// The page being rendered, on the community's canonical origin: `origin` for
// building sibling URLs (breadcrumbs), `url` for this page (null off a
// community host, where the proxy passes no clean path).
export async function pageCanonical(community: Community): Promise<{ origin: string | null; url: string | null }> {
  const headerList = await headers();
  const origin = communityCanonicalOrigin(headerList.get("host"), community);
  const path = headerList.get(SEO_PATH_HEADER);
  return { origin, url: origin && path ? canonicalUrl(origin, path) : null };
}
