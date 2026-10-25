import type { SupabaseClient } from "@supabase/supabase-js";
import type { Community, Database, EditorialGuide, Space } from "@/types/database";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getEditorialGuideUpdates } from "@/lib/data/editorial-guides";
import { isPlatformHost, platformSubdomainSlug } from "@/lib/custom-domain";
import { servingOrigin } from "@/lib/seo";
import { parseOverrides, resolveGuideContent, WHERE_TO_STAY_SLUG } from "./content";
import type { CommunityLinks } from "@/components/editorial-guide/destination-section";

type Client = SupabaseClient<Database>;

// The guide's own path. On the community's host (custom domain or
// <slug> subdomain) pages live at the clean path; on the platform host they
// live under /c/<slug>. Canonical URLs and share links use whichever host the
// visitor is actually on — Vercel has already sent apex visitors to www, so
// that host is the canonical one.
// The absolute URL (canonical, Open Graph, share links) prefers the
// community's verified custom domain, so every shared link carries its brand
// whichever host the page was rendered on.
export function guideUrl(
  host: string | null,
  communitySlug: string,
  guideSlug = WHERE_TO_STAY_SLUG,
  shareOrigin: string | null = null
): { path: string; absolute: string | null } {
  const onCommunityHost = Boolean(host) && (Boolean(platformSubdomainSlug(host!)) || !isPlatformHost(host!));
  const path = onCommunityHost ? `/guides/${guideSlug}` : `/c/${communitySlug}/guides/${guideSlug}`;
  // On the domain's other www / bare form (the one its host redirects to),
  // that form: a canonical pointing at a redirect is a weak signal.
  if (shareOrigin) return { path, absolute: `${servingOrigin(host, shareOrigin)}/guides/${guideSlug}` };
  const isLocal = !host || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) || host.endsWith(".localhost");
  return { path, absolute: host && !isLocal ? `https://${host}${path}` : null };
}

function spaceHref(communitySlug: string, space: Pick<Space, "slug">): string {
  return `/c/${communitySlug}/spaces/${space.slug}`;
}

// Where "Know this part of Zanzibar?" sends people: the community's existing
// spaces, so every contribution goes through the moderation those spaces
// already have. Signed-out visitors are routed through log in first.
export async function communityLinksFor(supabase: Client, community: Community, signedIn: boolean): Promise<{ links: CommunityLinks; tidesHref: string | null; accommodationHref: string | null; directoryHref: string | null }> {
  const spaces = await getCommunitySpaces(supabase, community.id);
  const base = `/c/${community.slug}`;
  const find = (type: string) => spaces.find((s) => s.space_type === type) ?? null;

  const chat = spaces.find((s) => s.space_type === "discussion") ?? null;
  const recommendations = find("recommendations");
  const accommodation = find("accommodation");
  const directory = find("business_directory");
  const tides = spaces.find((s) => /tide/i.test(s.slug) || /tide/i.test(s.name)) ?? null;

  const gate = (href: string) => (signedIn ? href : `/login?next=${encodeURIComponent(href)}`);

  return {
    links: {
      tip: gate(chat ? spaceHref(community.slug, chat) : base),
      restaurant: gate(recommendations ? spaceHref(community.slug, recommendations) : directory ? spaceHref(community.slug, directory) : base),
      stay: gate(accommodation ? spaceHref(community.slug, accommodation) : base),
      ask: gate(chat ? spaceHref(community.slug, chat) : base),
      listBusiness: directory ? gate(spaceHref(community.slug, directory)) : null,
      listStay: accommodation ? gate(spaceHref(community.slug, accommodation)) : null,
    },
    tidesHref: tides ? spaceHref(community.slug, tides) : null,
    accommodationHref: accommodation ? spaceHref(community.slug, accommodation) : null,
    directoryHref: directory ? spaceHref(community.slug, directory) : null,
  };
}

export async function loadGuide(supabase: Client, guide: EditorialGuide) {
  const content = resolveGuideContent(parseOverrides(guide.content));
  const today = new Date().toISOString().slice(0, 10);
  const updates = (await getEditorialGuideUpdates(supabase, guide.id)).filter((u) => !u.expires_on || u.expires_on >= today);
  return { content, updates };
}
