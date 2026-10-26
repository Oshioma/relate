"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VIEW_AS_MEMBER_COOKIE } from "@/lib/view-as-member";
import { VIEW_AS_OWNER_COOKIE } from "@/lib/view-as-owner";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";

const PREVIEW_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  // A preview left on by accident ends by itself.
  maxAge: 60 * 60 * 12,
};

// Start previewing a community as a regular member, then land on its feed.
export async function startViewAsMember(formData: FormData): Promise<void> {
  const communityId = String(formData.get("community_id") ?? "");
  const slug = String(formData.get("community_slug") ?? "");
  if (!communityId || !slug) return;
  const jar = await cookies();
  // One view at a time: switching to member ends the owner view.
  jar.delete(VIEW_AS_OWNER_COOKIE);
  jar.set(VIEW_AS_MEMBER_COOKIE, communityId, PREVIEW_COOKIE_OPTIONS);
  redirect(`/c/${encodeURIComponent(slug)}`);
}

// Stop previewing and go back to the admin page.
export async function exitViewAsMember(formData: FormData): Promise<void> {
  const slug = String(formData.get("community_slug") ?? "");
  (await cookies()).delete(VIEW_AS_MEMBER_COOKIE);
  redirect(slug ? `/c/${encodeURIComponent(slug)}/admin` : "/dashboard");
}

// Super admins only (src/lib/view-as-owner.ts): see the admin page as the
// community's owner does, then land on it. The pages re-check super admin on
// every read, so this check only keeps the cookie from being set for nothing.
export async function startViewAsOwner(formData: FormData): Promise<void> {
  const communityId = String(formData.get("community_id") ?? "");
  const slug = String(formData.get("community_slug") ?? "");
  if (!communityId || !slug) return;
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  const profile = user ? await getProfile(supabase, user.id) : null;
  if (!profile?.is_super_admin) return;
  const jar = await cookies();
  jar.delete(VIEW_AS_MEMBER_COOKIE);
  jar.set(VIEW_AS_OWNER_COOKIE, communityId, PREVIEW_COOKIE_OPTIONS);
  redirect(`/c/${encodeURIComponent(slug)}/admin`);
}

// Stop viewing as the owner and stay on the admin page, back to one's own view.
export async function exitViewAsOwner(formData: FormData): Promise<void> {
  const slug = String(formData.get("community_slug") ?? "");
  (await cookies()).delete(VIEW_AS_OWNER_COOKIE);
  redirect(slug ? `/c/${encodeURIComponent(slug)}/admin` : "/dashboard");
}
