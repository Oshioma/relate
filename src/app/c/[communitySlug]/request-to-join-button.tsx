"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestToJoinCommunity, withdrawJoinRequest } from "./join-request-actions";

// The way in to a private community for a signed-in non-member. Private means
// "visible in search, content is members-only" — so the visitor can see the
// community exists but, until now, had nothing to press: the copy told them to
// go and find an admin off-platform. This asks on their behalf and notifies the
// community's admins.
//
// Three states, all driven by the membership row: no row (ask), a 'requested'
// row (waiting, with a way to take it back), and — once staff approve — an
// active membership, at which point this button isn't rendered at all.
export function RequestToJoinButton({
  communityId,
  pending,
  size = "md",
}: {
  communityId: string;
  // Whether the viewer already has a request in. Read from their membership
  // row by the server component that renders this.
  pending: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const run = (action: () => Promise<{ error: string | null }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  if (pending) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Check className="h-4 w-4" />
            Request sent — waiting for an admin
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => withdrawJoinRequest(communityId))}
          >
            {isPending ? "Withdrawing…" : "Withdraw"}
          </Button>
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <Button size={size} disabled={isPending} onClick={() => run(() => requestToJoinCommunity(communityId))}>
        {isPending ? "Sending…" : "Request to join"}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
