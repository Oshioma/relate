"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { joinCommunity } from "./actions";

export function JoinButton({ communityId, slug }: { communityId: string; slug: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await joinCommunity(communityId);
            if (result.error) {
              setError(result.error);
            } else {
              router.push(`/c/${slug}`);
            }
          });
        }}
      >
        {isPending ? "Joining…" : "Join"}
      </Button>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
