"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveJoinRequest, declineJoinRequest } from "../join-request-actions";

// Approve / decline for one pending join request. Both server actions are
// no-ops unless the row is still 'requested', so two admins racing on the same
// request can't undo each other's decision — the second click finds nothing to
// change and the refresh shows them the settled state.
export function JoinRequestDecision({
  membershipId,
  communitySlug,
}: {
  membershipId: string;
  communitySlug: string;
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

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => run(() => approveJoinRequest(membershipId, communitySlug))}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => run(() => declineJoinRequest(membershipId, communitySlug))}
        >
          Decline
        </Button>
      </div>
      {error && <p className="max-w-xs text-right text-xs text-danger">{error}</p>}
    </div>
  );
}
