import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  isPlatformHost,
  platformSubdomainSlug,
  communitySubdomainUrl,
  RESERVED_SUBDOMAIN_LABELS,
  wwwCounterpart,
} from "@/lib/custom-domain";
import { resolveCommunitySlugForHost, resolveCustomDomainForSlug } from "@/lib/tenant-domains";
import { isCommunityIconPath } from "@/lib/community-icon-path";

// Routes that keep their platform meaning even when served on a community's
// host: auth has to work wherever the visitor is (auth cookies span the apex
// and its subdomains via sharedCookieDomain; custom domains sign in on their
// own host), and the rest are account-level pages that exist outside any one
// community.
const PLATFORM_PATH_PREFIXES = [
  "/login",
  "/signup",
  // The password-reset entry page. Like /login and /signup it exists only at
  // the platform root, so it must keep its platform meaning on a community's
  // host — otherwise an invited member clicking "Forgot your password?" gets
  // it rewritten onto /c/<slug>/forgot-password, which 404s.
  "/forgot-password",
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
  // Platform-wide legal documents (the super admin's Terms & Privacy). They
  // exist only at the platform root, so on a community's host they must keep
  // their platform meaning rather than rewriting onto /c/<slug>/terms (404).
  // Note: /contact is deliberately NOT here — on a community's host it means
  // that community's own contact page (/c/<slug>/contact).
  "/terms",
  "/privacy",
  // The platform's price list, linked from the app-wide footer — so it is
  // reached from inside a community's host too, where it must stay the
  // platform page rather than rewriting onto /c/<slug>/pricing (404).
  "/pricing",
  // Help pages (e.g. /help/video-cookies, linked from the lesson composer's
  // video errors) exist only at the platform root.
  "/help",
  // The platform super-admin page. It lives at /platform-admin (not /admin)
  // precisely so it doesn't collide with a community's own /c/<slug>/admin
  // page, which canonicalizes to a bare /admin on the community's host.
  "/platform-admin",
  // Crawler files (src/app/robots.ts, sitemap.ts). They read the host
  // themselves and answer for whichever community it belongs to, so they
  // must reach the root routes rather than rewrite onto /c/<slug>/… (404).
  "/robots.txt",
  "/sitemap.xml",
];

// Supabase's session cookie (sb-<project-ref>-auth-token, split into .0/.1…
// chunks when large). Only its presence matters here: it decides whether "/"
// on a community's host shows the signed-out welcome page or the feed. A
// stale cookie just means the feed, which is the pre-welcome behaviour.
function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => /^sb-.+-auth-token(\.\d+)?$/.test(cookie.name));
}

// Where a signed-out visitor to this community's pages should be instead: its
// verified custom domain, when it has one. Only for plain page loads (GET or
// HEAD) without a session cookie. Members stay on the platform subdomain,
// where their session lives (auth cookies span the platform apex only), and
// form posts are never redirected. The redirect is temporary (307), never
// permanent: a browser caches a 308 for good, and the same visitor may sign
// in later and need the subdomain again.
async function customDomainRedirect(request: NextRequest, slug: string, pathname: string): Promise<NextResponse | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (hasSessionCookie(request)) return null;
  const domain = await resolveCustomDomainForSlug(slug);
  // Already there (or on its www/bare counterpart, which the domain's host
  // redirects between itself): never bounce between the two.
  const host = (request.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  if (!domain || domain === host || wwwCounterpart(host) === domain) return null;
  const url = new URL(`https://${domain}`);
  url.pathname = pathname;
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 307);
}

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

    // www.foo.com when the owner verified foo.com (or the reverse): serve
    // the community here too rather than the platform's landing page. This
    // must not redirect to the verified host: the domain's host (Vercel)
    // may already redirect that host to this one (its default is apex ->
    // www), and the two redirects would loop forever.
    if (!slug) {
      const counterpart = wwwCounterpart(host);
      if (counterpart) slug = await resolveCommunitySlugForHost(counterpart);
    }
  }

  if (slug) {
    const { pathname } = request.nextUrl;
    const base = `/c/${slug}`;

    // This community's tab icon, as the page head links it. Served in place:
    // left to the rules below, the welcome page's icon was rewritten onto
    // /c/<slug>/welcome/… (404) and every other page's icon on the custom
    // domain was redirected to the subdomain's bare /icon, the platform
    // default, so the tab lost the community's icon.
    if (isCommunityIconPath(pathname, slug)) return NextResponse.next();

    // On the automatic subdomain, a signed-out visitor to a community page
    // moves to the community's own domain, so the links people copy and pass
    // on carry the community's brand rather than the platform's.
    if (platformSubdomainSlug(host) && !isPlatformPath(pathname)) {
      const rest = pathname === base || pathname.startsWith(`${base}/`) ? pathname.slice(base.length) || "/" : pathname;
      if (!/^\/(icon|apple-icon)(\/|$)/.test(rest)) {
        const toDomain = await customDomainRedirect(request, slug, rest);
        if (toDomain) return toDomain;
      }
    }

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
      if (pathname === "/" && !hasSessionCookie(request) && request.nextUrl.searchParams.get("view") !== "feed") {
        // Signed-out visitors meet the community's welcome page at "/";
        // its "Take a look around" link (?view=feed) reaches the guest feed.
        rewriteTo.pathname = `/welcome/${slug}`;
      } else {
        rewriteTo.pathname = pathname === "/" ? base : `${base}${pathname}`;
      }
      // The clean path rides along so the page can write its canonical link
      // (see SEO_PATH_HEADER in src/lib/seo.ts).
      return updateSession(request, rewriteTo, pathname);
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
    // A signed-out visitor goes straight to the community's own domain when
    // it has one; everyone else to its subdomain, as before.
    if (!/^\/(icon|apple-icon)(\/|$)/.test(canonical[2] ?? "")) {
      const toDomain = await customDomainRedirect(request, canonical[1], canonical[2] ?? "/");
      if (toDomain) return toDomain;
    }
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
