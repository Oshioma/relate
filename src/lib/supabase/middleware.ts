import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/confirm"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Invite links show a "you're invited" preview before asking someone to
  // sign in or sign up, so logged-out visitors need to reach the page.
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

  if (!user && !isPublicPath(pathname)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
