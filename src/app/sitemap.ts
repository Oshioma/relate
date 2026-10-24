import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { communitySitemapEntries, seoCommunityForHost } from "@/lib/seo-site";

// /sitemap.xml on every host (see robots.ts). On a community's host it lists
// every page a guest can read — guides, public spaces, each business and stay —
// on the community's canonical origin; on the platform host, the platform's
// own public pages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host") ?? "";
  const site = await seoCommunityForHost(host);

  if (site) {
    if (site.hidden || !site.community) return [];
    return communitySitemapEntries(host, site.community);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (!siteUrl) return [];
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
