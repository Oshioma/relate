"use client";

import { createBrowserClient } from "@supabase/ssr";
import { sharedCookieDomain } from "@/lib/custom-domain";
import type { Database } from "@/types/database";

export function createClient() {
  // Same cookie-domain widening as the server clients: one sign-in spans
  // the apex and all community subdomains; custom domains stay host-scoped.
  const domain = typeof window === "undefined" ? null : sharedCookieDomain(window.location.host);

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    domain ? { cookieOptions: { domain } } : undefined
  );
}
