import { Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import { RequestToJoinButton } from "./request-to-join-button";

// The members-only feed for a private community, shown in the content area to a
// non-member — signed-out or signed-in. The community shell around it (the left
// nav) still lists whatever spaces an admin has made public, so a visitor can
// step into those; this just gates the feed itself. A private community is
// "visible in search" but its feed is members-only, so we show its name and a
// way in.
//
// That way in used to be a dead end for a signed-in visitor: a sentence telling
// them to ask an admin for an invite, with no admin to ask and no button to
// press. Now they can request to join — the row that creates grants nothing
// until staff approve it, so "private" still means private. A signed-out
// visitor gets the same button pointed at the login page, and lands back here
// able to press the real one.
export function CommunityGate({
  community,
  isLoggedIn,
  requestPending,
}: {
  community: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    logo_initials: string | null;
  };
  isLoggedIn: boolean;
  // The viewer already has a request waiting on this community.
  requestPending: boolean;
}) {
  const base = `/c/${community.slug}`;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center sm:py-24">
      <Avatar src={community.logo_url} name={community.name} initials={community.logo_initials} size={88} className="mb-5" />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{community.name}</h1>
      {community.description && (
        <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">{community.description}</p>
      )}

      <div className="mt-8 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
        <Lock className="h-4 w-4" />
        Members-only community
      </div>

      {isLoggedIn ? (
        <>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            {requestPending
              ? "Your request is with the community's admins. You'll be notified as soon as one of them answers — meanwhile you can still browse its public spaces from the menu."
              : "This community is private. Ask to join and an admin will review your request. You can still browse its public spaces from the menu."}
          </p>
          <div className="mt-6">
            <RequestToJoinButton communityId={community.id} pending={requestPending} size="lg" />
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            This community is private. Log in to ask to join and see member content, or browse its public spaces
            from the menu.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <LinkButton href={`/login?next=${encodeURIComponent(base)}`} size="lg">
              Log in to request
            </LinkButton>
            <LinkButton href={`/signup?next=${encodeURIComponent(base)}`} size="lg" variant="secondary">
              Sign up
            </LinkButton>
          </div>
        </>
      )}
    </div>
  );
}
