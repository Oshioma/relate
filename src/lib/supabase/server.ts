import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { sharedCookieDomain } from "@/lib/custom-domain";
import type { Database } from "@/types/database";

// Use inside Server Components, Server Actions, and Route Handlers.
export async function createClient() {
  const cookieStore = await cookies();
  const headerList = await headers();
  // Same cookie-domain widening as the proxy client (see
  // src/lib/supabase/middleware.ts): one sign-in spans the apex and all
  // community subdomains; custom domains stay host-scoped.
  const domain = sharedCookieDomain(headerList.get("host") ?? "");

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, domain ? { ...options, domain } : options);
            });
          } catch {
            // Called from a Server Component. Ignored because the proxy
            // (see src/proxy.ts) refreshes the session on every request.
          }
        },
      },
    }
  );
}
