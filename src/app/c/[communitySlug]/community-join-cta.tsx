import type { JoinPolicy, MembershipStatus } from "@/types/database";
import { JoinCommunityButton } from "./join-community-button";
import { RequestToJoinButton } from "./request-to-join-button";

// The right way in for a signed-in non-member, chosen by the community's join
// policy (src/lib/join-policy.ts). Kept in one place because the choice is
// easy to get wrong and the wrong answer is a button that can't work: an approval community rejects a
// self-join at the RLS layer, so offering "Join community" there — which the
// feed header used to do for any community whose feed guests may read — hands
// the visitor a policy violation.
//
//   open     — join outright, no approval.
//   approval — ask, and staff decide.
//   invite   — nothing. You're here on an invite or not at all, and a button
//              would only advertise a door that doesn't open.
export function CommunityJoinCta({
  communityId,
  joinPolicy,
  membershipStatus,
  size = "md",
}: {
  communityId: string;
  joinPolicy: JoinPolicy;
  // The viewer's membership status, or null when they have no row at all.
  membershipStatus: MembershipStatus | null;
  size?: "sm" | "md" | "lg";
}) {
  if (joinPolicy === "open") {
    return <JoinCommunityButton communityId={communityId} size={size} />;
  }
  if (joinPolicy === "approval") {
    return <RequestToJoinButton communityId={communityId} pending={membershipStatus === "requested"} size={size} />;
  }
  return null;
}
