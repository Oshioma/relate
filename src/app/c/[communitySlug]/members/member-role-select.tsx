"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMemberRole } from "./actions";
import type { MembershipRole } from "@/types/database";

const ROLE_OPTIONS: Extract<MembershipRole, "admin" | "moderator" | "member">[] = ["admin", "moderator", "member"];

export function MemberRoleSelect({
  membershipId,
  role,
  communitySlug,
}: {
  membershipId: string;
  role: MembershipRole;
  communitySlug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="text-right">
      <select
        value={role}
        disabled={isPending}
        onChange={(event) => {
          const newRole = event.target.value;
          setError(null);
          startTransition(async () => {
            const result = await updateMemberRole(membershipId, newRole, communitySlug);
            if (result?.error) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
        className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium capitalize text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
