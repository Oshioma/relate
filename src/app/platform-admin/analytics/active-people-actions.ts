"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getActivePeople, parseActiveWindow, type ActivePeople } from "@/lib/data/auth-analytics";

export type ActivePeopleResult = { error: string } | { people: ActivePeople };

// Loads the list behind an "active" tile on demand, so opening one doesn't cost
// a page navigation and the page doesn't pre-render four lists nobody asked for.
//
// Re-verifies super admin exactly like the pages do. A server action is a public
// HTTP endpoint — the fact that only a super-admin page renders the button that
// calls it is not a permission check, and this returns email addresses for
// everyone active on the platform.
export async function loadActivePeople(window: string, communityId?: string): Promise<ActivePeopleResult> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Not authorized." };

  try {
    const admin = createAdminClient();
    return { people: await getActivePeople(admin, parseActiveWindow(window), communityId) };
  } catch (err) {
    console.error("[analytics] loadActivePeople failed:", err);
    return { error: (err as Error).message || "Couldn't load who was active." };
  }
}
