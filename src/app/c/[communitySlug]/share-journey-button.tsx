"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { joinCommunity } from "@/app/dashboard/actions";

type Mode = "post" | "login" | "join";

// The call-to-action button for the "Share your journey" sidebar card. It has
// three shapes depending on the viewer:
//  - "post": an active member — link straight to the composer.
//  - "login": a signed-out visitor — link to /login, returning to the composer.
//  - "join": signed in but not a member — one tap joins the community and then
//    routes to the composer, so posting never dead-ends on a members-only view.
export function ShareJourneyButton({
  mode,
  communityId,
  composerHref,
  loginHref,
}: {
  mode: Mode;
  communityId: string;
  composerHref: string;
  loginHref: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (mode !== "join") {
    return (
      <LinkButton href={mode === "login" ? loginHref : composerHref} className="w-full">
        Share Your Journey
      </LinkButton>
    );
  }

  return (
    <div>
      <Button
        className="w-full"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await joinCommunity(communityId);
            if (result.error) {
              setError(result.error);
            } else {
              router.push(composerHref);
            }
          });
        }}
      >
        {isPending ? "Joining…" : "Share Your Journey"}
      </Button>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
