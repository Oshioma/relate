"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";
import { blockMember } from "./actions";

export function BlockMemberButton({ profileId, communitySlug }: { profileId: string; communitySlug: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        title="Block this member"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm("Block this member? They won't be able to message you and you won't see each other's activity.")) return;
          setError(null);
          startTransition(async () => {
            const result = await blockMember(profileId, communitySlug);
            if (result?.error) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
        className="text-muted-foreground hover:text-danger disabled:opacity-60"
      >
        <ShieldOff className="h-4 w-4" />
      </button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
