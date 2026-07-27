import { Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {spaceName}
      </h2>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <Sprout className="h-9 w-9 shrink-0 text-accent" />
            <p className="text-sm text-muted-foreground">
              Share how your season is going with the community.
            </p>
          </div>
          <div className="mt-4">
            <ShareJourneyButton
              mode={mode}
              communityId={communityId}
              composerHref={composerHref}
              loginHref={loginHref}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
