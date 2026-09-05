"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NAV_GROUPS, defaultNavGroup } from "@/lib/nav-groups";

// Which sidebar section this space sits in.
//
// Writes straight through the browser client like the nav toggle beside it —
// spaces_update_admin is the authority, so a member who reached this control
// would simply have their update rejected.
export function SpaceNavGroup({
  spaceId,
  spaceType,
  value,
}: {
  spaceId: string;
  spaceType: string;
  value: string | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const suggestion = defaultNavGroup(spaceType);

  async function change(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value || null;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("spaces").update({ nav_group: next }).eq("id", spaceId);
    setSaving(false);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      Section
      <select
        defaultValue={value ?? ""}
        onChange={change}
        disabled={saving}
        aria-label="Sidebar section for this space"
        className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground disabled:opacity-50"
      >
        {/* Ungrouped is a real answer, not a missing one: these spaces gather
            in an unlabelled section at the end of the nav. */}
        <option value="">
          {suggestion ? `Ungrouped (suggested: ${labelFor(suggestion)})` : "Ungrouped"}
        </option>
        {NAV_GROUPS.map((group) => (
          <option key={group.key} value={group.key}>
            {group.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function labelFor(key: string): string {
  return NAV_GROUPS.find((g) => g.key === key)?.label ?? key;
}
