import { Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ShareJourneyButton } from "./share-journey-button";

// Sidebar call-to-action shown only when the community runs a "Growing
// Journey" space. It lives in the right column so it never pushes the feed
// down, and its button links to the space's composer (#new-post) so a member
// can share an update in one tap. The button adapts to the viewer: signed-out
// visitors go through /login first, and signed-in non-members join on the way,
// so the flow never dead-ends before the composer.
export function ShareJourneyCard({
  communityId,
  communitySlug,
  spaceSlug,
  spaceName,
  isLoggedIn,
  isMember,
}: {
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  spaceName: string;
  isLoggedIn: boolean;
  isMember: boolean;
}) {
  const composerHref = `/c/${communitySlug}/spaces/${spaceSlug}#new-post`;
  const loginHref = `/login?next=${encodeURIComponent(composerHref)}`;
  const mode = !isLoggedIn ? "login" : isMember ? "post" : "join";

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Sprout className="h-5 w-5" />
        </span>
        <h2 className="text-sm font-semibold text-foreground">{spaceName}</h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Share how your season is going with the community.</p>
      <div className="mt-4">
        <ShareJourneyButton
          mode={mode}
          communityId={communityId}
          composerHref={composerHref}
          loginHref={loginHref}
        />
      </div>
    </Card>
  );
}
