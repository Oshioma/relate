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
    // icon$ excludes the app/icon.tsx route (served at /icon, with no file
    // extension, so it isn't caught by the image-extension pattern below).
    "/((?!_next/static|_next/image|favicon.ico|icon$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
