"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SpaceType } from "@/types/database";

// Super admin control for the platform-wide default pool: whether a space type
// is available by default for new (and un-overridden) communities.
export function DefaultSpaceTypeToggle({ spaceType, defaultChecked }: { spaceType: SpaceType; defaultChecked: boolean }) {
  const router = useRouter();

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const enabled = event.target.checked;
    const supabase = createClient();
    await supabase.from("space_type_defaults").upsert({ space_type: spaceType, enabled }, { onConflict: "space_type" });
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input type="checkbox" defaultChecked={defaultChecked} onChange={toggle} className="h-4 w-4 rounded border-border" />
      <span>Available by default</span>
    </label>
  );
}

// Super admin control for one community's pool override. An explicit row
// decides whether the community may add spaces of this type; resetting removes
// the override so the community falls back to the platform default.
export function CommunitySpaceTypeToggle({
  communityId,
  spaceType,
  label,
  defaultChecked,
  isOverride,
}: {
  communityId: string;
  spaceType: SpaceType;
  label: string;
  defaultChecked: boolean;
  isOverride: boolean;
}) {
  const router = useRouter();

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const enabled = event.target.checked;
    const supabase = createClient();
    await supabase
      .from("community_space_types")
      .upsert({ community_id: communityId, space_type: spaceType, enabled }, { onConflict: "community_id,space_type" });
    router.refresh();
  }

  async function reset() {
    const supabase = createClient();
    await supabase.from("community_space_types").delete().eq("community_id", communityId).eq("space_type", spaceType);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 text-sm text-foreground">
      <label className="flex flex-1 items-center gap-2">
        <input type="checkbox" defaultChecked={defaultChecked} onChange={toggle} className="h-4 w-4 rounded border-border" />
        <span className="truncate">{label}</span>
      </label>
      {isOverride ? (
        <button type="button" onClick={reset} className="shrink-0 text-xs text-accent underline">
          Reset
        </button>
      ) : (
        <span className="shrink-0 text-xs text-muted-foreground">Default</span>
      )}
    </div>
  );
}
