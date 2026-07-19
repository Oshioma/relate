import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renamed `middleware` to `proxy`. This runs on every request to
// refresh the Supabase auth cookie and perform optimistic redirects for
// logged-out users hitting protected routes. Real authorization for
// community-scoped data always happens again via Postgres RLS.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
