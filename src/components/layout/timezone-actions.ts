"use server";

import { createClient } from "@/lib/supabase/server";

// Persists the signed-in member's IANA timezone (captured from the browser by
// TimezoneSync) so server-generated notification text can be shown in their
// local time. Validates the string is a real timezone before storing it —
// Intl.DateTimeFormat throws for an unknown zone — so a bad value can never end
// up breaking the SQL `at time zone` formatting.
export async function saveTimezone(timezone: string): Promise<void> {
  if (typeof timezone !== "string" || timezone.length > 64) return;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    return; // not a valid IANA timezone
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("profiles").update({ timezone }).eq("id", user.id);
}
