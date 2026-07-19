"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { joinCommunity } from "@/app/dashboard/actions";

export function JoinCommunityButton({ communityId }: { communityId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <Button
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await joinCommunity(communityId);
            if (result.error) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
      >
        {isPending ? "Joining…" : "Join community"}
      </Button>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
