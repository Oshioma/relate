import { Lock } from "lucide-react";
import { toPlainText } from "@/components/ui/rich-text";
import { spaceImage } from "@/lib/space-images";
import type { SpaceTeaser } from "@/lib/data/spaces";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import type { CommunityPrivacy, JoinPolicy, MembershipStatus, SpaceType } from "@/types/database";
import { CommunityJoinCta } from "./community-join-cta";
import { joinPolicyOf } from "@/lib/join-policy";

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
  teaser = null,
}: {
  community: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    logo_initials: string | null;
    privacy: CommunityPrivacy;
    join_policy: JoinPolicy | null;
  };
  isLoggedIn: boolean;
  // The viewer's membership status, or null when they have no row at all.
  membershipStatus: MembershipStatus | null;
  // The page they were trying to reach, so signing up or in brings them back.
  returnTo: string;
  // When the space is a teaser (spaces.when_locked), what the community lets
  // visitors see of it: its name, short description and cover. Nothing else.
  teaser?: SpaceTeaser | null;
}) {
  const isMember = membershipStatus === "active";
  const next = encodeURIComponent(returnTo);
  const teaserBlurb = teaser?.description ? toPlainText(teaser.description) : null;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center sm:py-24">
      {teaser ? (
        <>
          <div className="mb-5 aspect-[5/2] w-full overflow-hidden rounded-2xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={spaceImage({ image_url: teaser.image_url, space_type: teaser.space_type as SpaceType })} alt="" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{teaser.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">in {community.name}</p>
          {teaserBlurb && <p className="mt-3 line-clamp-4 max-w-sm text-base leading-relaxed text-muted-foreground">{teaserBlurb}</p>}
        </>
      ) : (
        <>
          <Avatar src={community.logo_url} name={community.name} initials={community.logo_initials} size={88} className="mb-5" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{community.name}</h1>
          {community.description && (
            <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">{community.description}</p>
          )}
        </>
      )}

      <div className="mt-8 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
        <Lock className="h-4 w-4" />
        {isMember ? "Not available" : teaser?.gated ? "For paid members" : "For members"}
      </div>
      {teaser?.gated && !isMember && (
        <p className="mt-3 max-w-sm text-xs text-muted-foreground">Join first, then you&apos;ll see the memberships that open it.</p>
      )}

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
              joinPolicy={joinPolicyOf(community)}
              membershipStatus={membershipStatus}
              size="lg"
            />
          </div>
        </>
      )}
    </div>
  );
}
