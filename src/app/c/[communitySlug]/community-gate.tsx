import { Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import type { CommunityGateCard } from "@/lib/data/community";

// The members-only landing for a private community, shown to a non-member —
// signed-out or signed-in. A private community is "visible in search" but its
// content is members-only, so instead of a bare 404 we show its public card
// (logo, name, description) and a way in: log in / sign up for a guest, and a
// plain "you need an invite" note for a signed-in visitor who simply isn't a
// member (private communities aren't self-joinable — you're invited or added).
export function CommunityGate({
  card,
  isLoggedIn,
}: {
  card: CommunityGateCard;
  isLoggedIn: boolean;
}) {
  const base = `/c/${card.slug}`;

  return (
    <div className="min-h-screen bg-background">
      {card.cover_image_url && (
        <div className="aspect-[3/1] w-full overflow-hidden bg-muted sm:aspect-[4/1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.cover_image_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center sm:py-24">
        <Avatar src={card.logo_url} name={card.name} size={88} className="mb-5" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{card.name}</h1>
        {card.description && (
          <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">{card.description}</p>
        )}

        <div className="mt-8 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
          <Lock className="h-4 w-4" />
          Members-only community
        </div>

        {isLoggedIn ? (
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            This community is private. You&apos;ll need an invitation from an admin to join and see its
            content.
          </p>
        ) : (
          <>
            <p className="mt-6 max-w-sm text-sm text-muted-foreground">
              Log in to see this community, or create an account to get started.
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
    </div>
  );
}
