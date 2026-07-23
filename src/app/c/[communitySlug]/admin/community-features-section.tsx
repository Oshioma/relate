"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FeatureControl } from "@/lib/data/features";

// Community-owner feature toggles. The super admin controls availability
// (whether a feature may be used at all); here the owner turns available
// features on or off for their own community. A feature the super admin has
// switched off shows as unavailable and can't be enabled from here.
export function CommunityFeaturesSection({ communityId, controls }: { communityId: string; controls: FeatureControl[] }) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      {controls.map((control) => (
        <FeatureRow key={control.key} communityId={communityId} control={control} />
      ))}
    </div>
  );
}

function FeatureRow({ communityId, control }: { communityId: string; control: FeatureControl }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(control.ownerEnabled);
  const [saving, setSaving] = useState(false);

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    setEnabled(next);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("community_feature_prefs")
      .upsert({ community_id: communityId, feature_key: control.key, enabled: next }, { onConflict: "community_id,feature_key" });
    setSaving(false);
    if (error) {
      setEnabled(!next); // revert optimistic flip
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{control.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{control.description}</p>
        {!control.available && (
          <p className="mt-1 text-xs text-danger">Turned off by the platform admin — not available for this community.</p>
        )}
      </div>
      <label className="flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={control.available && enabled}
          disabled={!control.available || saving}
          onChange={toggle}
          className="h-4 w-4 rounded border-border disabled:opacity-50"
        />
      </label>
    </div>
  );
}
