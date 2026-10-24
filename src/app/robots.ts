import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { communityCanonicalOrigin, COMMUNITY_DISALLOW, PLATFORM_DISALLOW } from "@/lib/seo";
import { seoCommunityForHost } from "@/lib/seo-site";

// /robots.txt on every host. The proxy lets it through unrewritten, so this
// one route answers for the platform and for each community's subdomain and
// custom domain, pointing crawlers at that host's own sitemap.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const site = await seoCommunityForHost(host);

  if (site) {
    // An invite-only community has nothing for a crawler to see.
    if (site.hidden || !site.community) return { rules: { userAgent: "*", disallow: "/" } };
    const origin = communityCanonicalOrigin(host, site.community);
    return {
      rules: { userAgent: "*", allow: "/", disallow: COMMUNITY_DISALLOW },
      ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: PLATFORM_DISALLOW },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
