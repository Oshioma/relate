import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isPlatformHost } from "@/lib/custom-domain";
import { resolveCommunitySlugForHost } from "@/lib/tenant-domains";

// Routes that keep their platform meaning even when served on a community's
// custom domain: auth has to work per-host (Supabase cookies are host-scoped,
// so members sign in on the domain they're visiting), and the rest are
// account-level pages that exist outside any one community.
const PLATFORM_PATH_PREFIXES = [
  "/login",
  "/signup",
  "/auth",
  "/dashboard",
  "/settings",
  "/messages",
  "/notifications",
  "/communities",
  "/invite",
];

function isPlatformPath(pathname: string) {
  return PLATFORM_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// Next.js 16 renamed `middleware` to `proxy`. This runs on every request to
// (1) serve communities on their verified custom domains by rewriting
// host-based requests onto the /c/[communitySlug] tree, and (2) refresh the
// Supabase auth cookie and perform optimistic redirects for logged-out users
// hitting protected routes. Real authorization for community-scoped data
// always happens again via Postgres RLS.
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host && !isPlatformHost(host)) {
    const slug = await resolveCommunitySlugForHost(host);
    if (slug) {
      const { pathname } = request.nextUrl;
      const base = `/c/${slug}`;

      // Internal links are still written as /c/<slug>/… — canonicalize them
      // to the bare path so the custom domain has one URL per page.
      if (pathname === base || pathname.startsWith(`${base}/`)) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(base.length) || "/";
        return NextResponse.redirect(url, 308);
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
