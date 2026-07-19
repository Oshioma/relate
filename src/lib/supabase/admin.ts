import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Bypasses Row Level Security entirely and can manage auth users — only
// ever call this from trusted server-side code (Server Actions, Route
// Handlers) that has already independently verified the caller is
// authorized, since this client has no concept of "the current user" and
// no RLS to fall back on. Requires SUPABASE_SERVICE_ROLE_KEY, which must
// never be prefixed with NEXT_PUBLIC_ or otherwise reach the browser.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it in your Supabase project's API settings and set it as an env var (never NEXT_PUBLIC_)."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
