// "View as member": an owner or admin previews their community the way a
// regular member sees it. The switch is a cookie holding the one community id
// being previewed; while it matches, getCommunityBySlug and getMembership (in
// src/lib/data/community.ts) report the viewer as a plain member, so every page
// and action that asks "is this person staff?" answers no — no Admin links, no
// staff controls — without each of them knowing about the preview.
//
// It can only ever take rights away, never add them, so setting it needs no
// permission check. Database row-level security still sees the real role, so
// a few staff-only rows a page reads directly may still appear.

export const VIEW_AS_MEMBER_COOKIE = "relate_view_as_member";

export async function previewingAsMember(communityId: string): Promise<boolean> {
  try {
    // Loaded lazily so plain-node unit tests can import the data helpers
    // without a Next request context; outside one this throws and reads false.
    const { cookies } = await import("next/headers");
    return (await cookies()).get(VIEW_AS_MEMBER_COOKIE)?.value === communityId;
  } catch {
    return false;
  }
}
