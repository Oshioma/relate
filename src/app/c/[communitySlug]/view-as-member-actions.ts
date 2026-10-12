"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VIEW_AS_MEMBER_COOKIE } from "@/lib/view-as-member";

// Start previewing a community as a regular member, then land on its feed.
export async function startViewAsMember(formData: FormData): Promise<void> {
  const communityId = String(formData.get("community_id") ?? "");
  const slug = String(formData.get("community_slug") ?? "");
  if (!communityId || !slug) return;
  (await cookies()).set(VIEW_AS_MEMBER_COOKIE, communityId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // A preview left on by accident ends by itself.
    maxAge: 60 * 60 * 12,
  });
  redirect(`/c/${encodeURIComponent(slug)}`);
}

// Stop previewing and go back to the admin page.
export async function exitViewAsMember(formData: FormData): Promise<void> {
  const slug = String(formData.get("community_slug") ?? "");
  (await cookies()).delete(VIEW_AS_MEMBER_COOKIE);
  redirect(slug ? `/c/${encodeURIComponent(slug)}/admin` : "/dashboard");
}
