"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import {
  AUTH_EVENT_TYPES,
  getActivePeople,
  getEventPeople,
  parseActiveWindow,
  parseAuthEventRange,
  type ActivePeople,
  type EventPeople,
} from "@/lib/data/auth-analytics";
import type { AuthEventType } from "@/types/database";

export type ActivePeopleResult = { error: string } | { people: ActivePeople };
export type EventPeopleResult = { error: string } | { events: EventPeople };

// Both actions re-verify super admin. A server action is a public HTTP
// endpoint — the fact that only a super-admin page renders the button calling
// it is not a permission check, and these return email addresses for everyone
// on the platform.
async function requireSuperAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { ok: false, error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { ok: false, error: "Not authorized." };
  return { ok: true };
}

// Loads the list behind an "active" tile on demand, so opening one doesn't cost
// a page navigation and the page doesn't pre-render four lists nobody asked for.
//
// Re-verifies super admin exactly like the pages do. A server action is a public
// HTTP endpoint — the fact that only a super-admin page renders the button that
// calls it is not a permission check, and this returns email addresses for
// everyone active on the platform.
export async function loadActivePeople(window: string, communityId?: string): Promise<ActivePeopleResult> {
  const gate = await requireSuperAdmin();
  if (!gate.ok) return { error: gate.error };

  try {
    const admin = createAdminClient();
    return { people: await getActivePeople(admin, parseActiveWindow(window), communityId) };
  } catch (err) {
    console.error("[analytics] loadActivePeople failed:", err);
    return { error: (err as Error).message || "Couldn't load who was active." };
  }
}

// The events behind a Signups / Sign-ins / Joins tile, for the same
// expand-in-place treatment.
export async function loadEventPeople(
  type: string,
  range: string,
  communityId?: string
): Promise<EventPeopleResult> {
  const gate = await requireSuperAdmin();
  if (!gate.ok) return { error: gate.error };

  if (!AUTH_EVENT_TYPES.includes(type as AuthEventType)) {
    return { error: "Unknown event type." };
  }

  try {
    const admin = createAdminClient();
    return {
      events: await getEventPeople(admin, type as AuthEventType, parseAuthEventRange(range), communityId),
    };
  } catch (err) {
    console.error("[analytics] loadEventPeople failed:", err);
    return { error: (err as Error).message || "Couldn't load those events." };
  }
}
