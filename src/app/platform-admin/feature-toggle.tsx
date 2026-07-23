"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FeatureKey } from "@/types/database";

export function DefaultFeatureToggle({ featureKey, defaultChecked }: { featureKey: FeatureKey; defaultChecked: boolean }) {
  const router = useRouter();

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const enabled = event.target.checked;
    const supabase = createClient();
    await supabase.from("feature_defaults").upsert({ feature_key: featureKey, enabled }, { onConflict: "feature_key" });
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input type="checkbox" defaultChecked={defaultChecked} onChange={toggle} className="h-4 w-4 rounded border-border" />
      Enabled by default for new communities
    </label>
  );
}

export function CommunityFeatureToggle({
  communityId,
  featureKey,
  defaultChecked,
  isOverride,
}: {
  communityId: string;
  featureKey: FeatureKey;
  defaultChecked: boolean;
  isOverride: boolean;
}) {
  const router = useRouter();

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const enabled = event.target.checked;
    const supabase = createClient();
    await supabase
      .from("community_features")
      .upsert({ community_id: communityId, feature_key: featureKey, enabled }, { onConflict: "community_id,feature_key" });
    router.refresh();
  }

  async function reset() {
    const supabase = createClient();
    await supabase.from("community_features").delete().eq("community_id", communityId).eq("feature_key", featureKey);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" defaultChecked={defaultChecked} onChange={toggle} className="h-4 w-4 rounded border-border" />
      {isOverride ? (
        <button type="button" onClick={reset} className="text-xs text-accent underline">
          Reset to default
        </button>
      ) : (
        <span className="text-xs text-muted-foreground">Using default</span>
      )}
    </div>
  );
}
