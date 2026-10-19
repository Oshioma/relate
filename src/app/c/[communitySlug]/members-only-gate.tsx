import { Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import type { CommunityPrivacy, MembershipStatus } from "@/types/database";
import { CommunityJoinCta } from "./community-join-cta";

// Shown in place of a members-only space or post the visitor can't see (RLS
// hides it, so the page can't tell "members only" from "gone"). Never a bare
// "page not found": a member opening an email link on a signed-out phone, or a
// friend who was sent a link, gets a way in instead.
//
//   signed out           — Join now (sign up) or Log in, both returning here.
//   signed-in non-member — the community's own way in (join, or ask to join).
//   member               — it's staff-only or was removed; back to the community.
export function MembersOnlyGate({
  community,
  isLoggedIn,
  membershipStatus,
  returnTo,
}: {
  community: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    logo_initials: string | null;
    privacy: CommunityPrivacy;
  };
  isLoggedIn: boolean;
  // The viewer's membership status, or null when they have no row at all.
  membershipStatus: MembershipStatus | null;
  // The page they were trying to reach, so signing up or in brings them back.
  returnTo: string;
}) {
  const isMember = membershipStatus === "active";
  const next = encodeURIComponent(returnTo);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center sm:py-24">
      <Avatar src={community.logo_url} name={community.name} initials={community.logo_initials} size={88} className="mb-5" />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{community.name}</h1>
      {community.description && (
        <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">{community.description}</p>
      )}

      <div className="mt-8 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
        <Lock className="h-4 w-4" />
        {isMember ? "Not available" : "For members"}
      </div>

      {!isLoggedIn ? (
        <>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            This is for members of {community.name}. Join now to see it — or log in if you&apos;re already a member.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <LinkButton href={`/signup?next=${next}`} size="lg">
              Join now
            </LinkButton>
            <LinkButton href={`/login?next=${next}`} size="lg" variant="secondary">
              Log in
            </LinkButton>
          </div>
        </>
      ) : isMember ? (
        <>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            This may be open to the team only, or it&apos;s been moved or removed.
          </p>
          <div className="mt-6">
            <LinkButton href={`/c/${community.slug}`} size="lg">
              Go to {community.name}
            </LinkButton>
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            {membershipStatus === "requested"
              ? "Your request to join is with the community's admins. You'll be notified as soon as one of them answers."
              : `This is for members of ${community.name}. Join now to see it.`}
          </p>
          <div className="mt-6">
            <CommunityJoinCta
              communityId={community.id}
              privacy={community.privacy}
              membershipStatus={membershipStatus}
              size="lg"
            />
          </div>
        </>
      )}
    </div>
  );
}
