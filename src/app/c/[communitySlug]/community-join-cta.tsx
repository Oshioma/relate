import type { CommunityPrivacy, MembershipStatus } from "@/types/database";
import { JoinCommunityButton } from "./join-community-button";
import { RequestToJoinButton } from "./request-to-join-button";

// The right way in for a signed-in non-member, chosen by the community's
// privacy. Kept in one place because the choice is easy to get wrong and the
// wrong answer is a button that can't work: a 'private' community rejects a
// self-join at the RLS layer, so offering "Join community" there — which the
// feed header used to do for any community whose feed guests may read — hands
// the visitor a policy violation.
//
//   public      — join outright, no approval.
//   private     — ask, and staff decide.
//   invite_only — nothing. It's "Hidden": you're here on an invite or not at
//                 all, and a button would only advertise a door that doesn't
//                 open.
export function CommunityJoinCta({
  communityId,
  privacy,
  membershipStatus,
  size = "md",
}: {
  communityId: string;
  privacy: CommunityPrivacy;
  // The viewer's membership status, or null when they have no row at all.
  membershipStatus: MembershipStatus | null;
  size?: "sm" | "md" | "lg";
}) {
  if (privacy === "public") {
    return <JoinCommunityButton communityId={communityId} size={size} />;
  }
  if (privacy === "private") {
    return <RequestToJoinButton communityId={communityId} pending={membershipStatus === "requested"} size={size} />;
  }
  return null;
}
