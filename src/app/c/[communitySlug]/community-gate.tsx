import { Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";

// The members-only feed for a private community, shown in the content area to a
// non-member — signed-out or signed-in. The community shell around it (the left
// nav) still lists whatever spaces an admin has made public, so a visitor can
// step into those; this just gates the feed itself. A private community is
// "visible in search" but its feed is members-only, so we show its name and a
// way in: log in / sign up for a guest, and a plain "you need an invite" note
// for a signed-in visitor who simply isn't a member (private communities aren't
// self-joinable — you're invited or added).
export function CommunityGate({
  community,
  isLoggedIn,
}: {
  community: { name: string; slug: string; description: string | null; logo_url: string | null };
  isLoggedIn: boolean;
}) {
  const base = `/c/${community.slug}`;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center sm:py-24">
      <Avatar src={community.logo_url} name={community.name} size={88} className="mb-5" />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{community.name}</h1>
      {community.description && (
        <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">{community.description}</p>
      )}

      <div className="mt-8 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
        <Lock className="h-4 w-4" />
        Members-only community
      </div>

      {isLoggedIn ? (
        <p className="mt-6 max-w-sm text-sm text-muted-foreground">
          This community is private. You&apos;ll need an invitation from an admin to join and see its
          content. You can still browse its public spaces from the menu.
        </p>
      ) : (
        <>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            This community is private. Log in to see member content, or browse its public spaces from the
            menu.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <LinkButton href={`/login?next=${encodeURIComponent(base)}`} size="lg">
              Log in
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
