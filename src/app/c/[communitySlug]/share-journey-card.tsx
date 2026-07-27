import { Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { GrowingJourneyHighlight } from "@/lib/data/spaces";

// Sidebar call-to-action shown only when the community runs a "Growing
// Journey" space. It lives in the right column so it never pushes the feed
// down, previews the photo from the most recently added journey post, and
// links straight to the space's composer (#new-post) so a member can share
// their own update in one tap. Signed-out visitors go through /login first
// with the composer as the post-login destination, so the flow stays smooth.
export function ShareJourneyCard({
  communitySlug,
  highlight,
  isLoggedIn,
}: {
  communitySlug: string;
  highlight: GrowingJourneyHighlight;
  isLoggedIn: boolean;
}) {
  const composerHref = `/c/${communitySlug}/spaces/${highlight.spaceSlug}#new-post`;
  const href = isLoggedIn ? composerHref : `/login?next=${encodeURIComponent(composerHref)}`;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {highlight.spaceName}
      </h2>
      <Card className="overflow-hidden">
        {highlight.latestImageUrl && (
          <div className="aspect-[16/9] w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={highlight.latestImageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <Sprout className="h-9 w-9 shrink-0 text-accent" />
            <p className="text-sm text-muted-foreground">
              Share how your season is going with the community.
            </p>
          </div>
          <LinkButton href={href} className="mt-4 w-full">
            Share Your Journey
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
