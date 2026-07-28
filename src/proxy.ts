import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  isPlatformHost,
  platformSubdomainSlug,
  communitySubdomainUrl,
  RESERVED_SUBDOMAIN_LABELS,
} from "@/lib/custom-domain";
import { resolveCommunitySlugForHost } from "@/lib/tenant-domains";

// Routes that keep their platform meaning even when served on a community's
// host: auth has to work wherever the visitor is (auth cookies span the apex
// and its subdomains via sharedCookieDomain; custom domains sign in on their
// own host), and the rest are account-level pages that exist outside any one
// community.
const PLATFORM_PATH_PREFIXES = [
  "/login",
  "/signup",
  "/auth",
  // Route handlers are platform-level and self-authenticating; never rewrite
  // them onto a community's /c/<slug> tree.
  "/api",
  "/dashboard",
  "/settings",
  "/messages",
  "/notifications",
  "/communities",
  "/invite",
  // The platform super-admin page. It lives at /platform-admin (not /admin)
  // precisely so it doesn't collide with a community's own /c/<slug>/admin
  // page, which canonicalizes to a bare /admin on the community's host.
  "/platform-admin",
];

function isPlatformPath(pathname: string) {
  return PLATFORM_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// Next.js 16 renamed `middleware` to `proxy`. This runs on every request to
// (1) serve communities on their hosts — <slug>.<platform-apex> subdomains
// (free, automatic, slug read straight from the hostname) and verified
// custom domains (resolved via the database) — by rewriting host-based
// requests onto the /c/[communitySlug] tree, and (2) refresh the Supabase
// auth cookie and perform optimistic redirects for logged-out users hitting
// protected routes. Real authorization for community-scoped data always
// happens again via Postgres RLS.
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Subdomains are checked before isPlatformHost: <slug>.localhost counts as
  // a platform host (for auth purposes) but still routes as a tenant in dev.
  let slug = platformSubdomainSlug(host);
  if (!slug && host && !isPlatformHost(host)) {
    slug = await resolveCommunitySlugForHost(host);
  }

  if (slug) {
    const { pathname } = request.nextUrl;
    const base = `/c/${slug}`;

    // Internal links are still written as /c/<slug>/… — canonicalize them
    // to the bare path so the community host has one URL per page.
    if (pathname === base || pathname.startsWith(`${base}/`)) {
      const rest = pathname.slice(base.length);
      // The community's own metadata image routes (app/c/[communitySlug]/
      // icon, apple-icon) are sub-resources, not navigable pages. Next emits
      // them in the page head as /c/<slug>/icon; 308-redirecting that to the
      // clean /icon would strip the slug and fall back to the platform's
      // default icon, so the community's uploaded logo would never load as the
      // tab icon on its subdomain/custom domain. Serve them in place instead.
      if (!/^\/(icon|apple-icon)(\/|$)/.test(rest)) {
        const url = request.nextUrl.clone();
        url.pathname = rest || "/";
        return NextResponse.redirect(url, 308);
      }
    }

    // Everything that isn't a platform page (or another community's /c/
    // path) is this community's content: / becomes /c/<slug>, /events
    // becomes /c/<slug>/events, and so on. The browser URL stays clean.
    if (!isPlatformPath(pathname) && !pathname.startsWith("/c/")) {
      const rewriteTo = request.nextUrl.clone();
      rewriteTo.pathname = pathname === "/" ? base : `${base}${pathname}`;
      return updateSession(request, rewriteTo);
    }
  }

  // Any /c/<slug> path that survives to here — on the platform apex, or a
  // different community's path while on some community's host — redirects
  // to that community's own subdomain, so every community is always seen at
  // its canonical address. The session survives the hop because auth
  // cookies are scoped to `.${apex}` (see sharedCookieDomain). Skipped in
  // dev / on *.vercel.app, where wildcard subdomains don't resolve —
  // communitySubdomainUrl returns null there.
  const canonical = request.nextUrl.pathname.match(/^\/c\/([a-z0-9-]{2,60})(\/.*)?$/);
  if (canonical && !RESERVED_SUBDOMAIN_LABELS.has(canonical[1])) {
    const subdomainUrl = communitySubdomainUrl(canonical[1]);
    if (subdomainUrl) {
      const url = new URL(subdomainUrl);
      url.pathname = canonical[2] ?? "/";
      url.search = request.nextUrl.search;
      if (url.host !== host) {
        return NextResponse.redirect(url, 308);
      }
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    // icon$ excludes the app/icon.tsx route (served at /icon, with no file
    // extension, so it isn't caught by the image-extension pattern below).
    "/((?!_next/static|_next/image|favicon.ico|icon$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
