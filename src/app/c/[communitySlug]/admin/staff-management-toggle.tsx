"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAdminsCanManageStaff } from "./actions";

// Owner-only switch controlling whether non-owner admins may change the role of
// or remove other admins and moderators. Optimistically reflects the new value,
// then reverts on error so the checkbox never lies about the saved state.
export function StaffManagementToggle({
  communityId,
  communitySlug,
  enabled,
}: {
  communityId: string;
  communitySlug: string;
  enabled: boolean;
}) {
  const [checked, setChecked] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          disabled={isPending}
          onChange={(event) => {
            const next = event.target.checked;
            setChecked(next);
            setError(null);
            startTransition(async () => {
              const result = await setAdminsCanManageStaff(communityId, communitySlug, next);
              if (result?.error) {
                setChecked(!next);
                setError(result.error);
              } else {
                router.refresh();
              }
            });
          }}
          className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)] disabled:opacity-60"
        />
        <span>
          <span className="block font-medium text-foreground">Let admins manage staff</span>
          <span className="block text-muted-foreground">
            When on, admins can change the role of or remove other admins and moderators. When off, only you (the owner)
            can — admins manage regular members only.
          </span>
        </span>
      </label>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
