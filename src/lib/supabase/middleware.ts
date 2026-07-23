import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/signup/check-email", "/auth/confirm", "/forgot-password"];

// Community sub-sections a signed-out visitor is allowed to reach. The page
// (and Postgres RLS) still decides what actually renders — a members-only
// space resolves to notFound for a guest — but the middleware must not bounce
// them to /login first, or a public community could never be browsed.
// Everything else under /c/<slug> (admin, members, …) stays login-gated.
const PUBLIC_COMMUNITY_SECTIONS = ["spaces", "events", "concierge"];

// Matches the community feed (/c/<slug>) and its guest-visible sections
// (/c/<slug>/spaces, /events, /concierge and anything nested under them).
const PUBLIC_COMMUNITY_PATH = new RegExp(
  `^/c/[^/]+(?:/(?:${PUBLIC_COMMUNITY_SECTIONS.join("|")})(?:/.*)?)?$`
);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Invite links show a "you're invited" preview before asking someone to
  // sign in or sign up, so logged-out visitors need to reach the page.
  // /signup/check-email is where a just-signed-up (and therefore still
  // signed-out) visitor lands — bouncing them to /login here hid the
  // "confirm your email" step entirely and read as a login loop.
  if (pathname.startsWith("/invite/")) return true;
  return false;
}

// Refreshes the Supabase auth session on every request and redirects
// unauthenticated users away from protected routes. Called from proxy.ts,
// which passes `rewriteTo` when the request arrived on a community's custom
// domain and should render a /c/[communitySlug] route instead of the literal
// path. The rewrite has to be baked into every response built here (setAll
// rebuilds the response to attach refreshed cookies), which is why it's a
// parameter rather than something proxy.ts applies afterwards.
export async function updateSession(request: NextRequest, rewriteTo?: URL) {
  const makeResponse = () =>
    rewriteTo ? NextResponse.rewrite(rewriteTo, { request }) : NextResponse.next({ request });
  let response = makeResponse();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = makeResponse();
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // On a community's own host the public path arrives rewritten (e.g. /events
  // -> /c/<slug>/events); check the rewrite target so guest access works the
  // same on custom domains as it does on /c/<slug> URLs.
  const communityPath = rewriteTo ? rewriteTo.pathname : pathname;

  if (!user && !isPublicPath(pathname) && !PUBLIC_COMMUNITY_PATH.test(communityPath)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
