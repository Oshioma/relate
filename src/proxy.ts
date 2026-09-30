import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  isPlatformHost,
  platformSubdomainSlug,
  communitySubdomainUrl,
  RESERVED_SUBDOMAIN_LABELS,
  wwwCounterpart,
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
  // The platform super-admin page. It lives at /platform-admin (not /admin)
  // precisely so it doesn't collide with a community's own /c/<slug>/admin
  // page, which canonicalizes to a bare /admin on the community's host.
  "/platform-admin",
];

// Supabase's session cookie (sb-<project-ref>-auth-token, split into .0/.1…
// chunks when large). Only its presence matters here: it decides whether "/"
// on a community's host shows the signed-out welcome page or the feed. A
// stale cookie just means the feed, which is the pre-welcome behaviour.
function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => /^sb-.+-auth-token(\.\d+)?$/.test(cookie.name));
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

    // www.foo.com when the owner verified foo.com (or the reverse): send the
    // visitor to the verified host rather than the platform's landing page.
    if (!slug) {
      const counterpart = wwwCounterpart(host);
      if (counterpart && (await resolveCommunitySlugForHost(counterpart))) {
        const url = request.nextUrl.clone();
        url.hostname = counterpart;
        return NextResponse.redirect(url, 308);
      }
    }
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
      if (pathname === "/" && !hasSessionCookie(request) && request.nextUrl.searchParams.get("view") !== "feed") {
        // Signed-out visitors meet the community's welcome page at "/";
        // its "Take a look around" link (?view=feed) reaches the guest feed.
        rewriteTo.pathname = `/welcome/${slug}`;
      } else {
        rewriteTo.pathname = pathname === "/" ? base : `${base}${pathname}`;
      }
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
