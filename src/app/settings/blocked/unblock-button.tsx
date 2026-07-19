"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unblockMember } from "./actions";
import { Button } from "@/components/ui/button";

export function UnblockButton({ profileId }: { profileId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await unblockMember(profileId);
            if (result.error) setError(result.error);
            else router.refresh();
          });
        }}
      >
        {isPending ? "Unblocking…" : "Unblock"}
      </Button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
