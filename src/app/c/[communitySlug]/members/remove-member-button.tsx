"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { removeMember } from "./actions";

export function RemoveMemberButton({ membershipId, communitySlug }: { membershipId: string; communitySlug: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        title="Remove from community"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm("Remove this member from the community?")) return;
          setError(null);
          startTransition(async () => {
            const result = await removeMember(membershipId, communitySlug);
            if (result?.error) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
        className="text-muted-foreground hover:text-danger disabled:opacity-60"
      >
        <X className="h-4 w-4" />
      </button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
