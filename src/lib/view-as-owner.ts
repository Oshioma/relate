// "View as owner": a platform super admin doing customer support sees a
// community's admin page the way its owner does — the owner-only sections
// (Plan, Marketplace, Payments, Tiers, Custom domain) included — even when
// they are only an admin there, or not staff at all.
//
// Like "View as member" (src/lib/view-as-member.ts) the switch is a cookie
// holding the one community id being viewed. Unlike it, this one adds sight,
// so the cookie on its own means nothing: every reader must also confirm the
// viewer is a super admin (viewingAsOwner below does). It never adds rights:
// each server action behind those sections still checks the viewer's real
// role, so a super admin who isn't staff stays read-only, and owner-only
// actions such as deleting the community still refuse anyone but the owner.

export const VIEW_AS_OWNER_COOKIE = "relate_view_as_owner";

export async function ownerViewCookieMatches(communityId: string): Promise<boolean> {
  try {
    // Loaded lazily so plain-node unit tests can import this without a Next
    // request context; outside one this throws and reads false.
    const { cookies } = await import("next/headers");
    return (await cookies()).get(VIEW_AS_OWNER_COOKIE)?.value === communityId;
  } catch {
    return false;
  }
}

// Whether to show this viewer the owner's view. Pure, so the rule is testable:
// only a super admin, only with the switch on for this community, and never
// for the real owner (who already sees everything and has nothing to switch).
export function viewingAsOwner({
  cookieMatches,
  isSuperAdmin,
  isRealOwner,
}: {
  cookieMatches: boolean;
  isSuperAdmin: boolean;
  isRealOwner: boolean;
}): boolean {
  return cookieMatches && isSuperAdmin && !isRealOwner;
}
