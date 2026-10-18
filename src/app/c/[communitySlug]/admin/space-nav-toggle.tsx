"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AutoSaveCheckbox } from "@/components/ui/auto-save-checkbox";

export function SpaceNavToggle({ spaceId, defaultChecked }: { spaceId: string; defaultChecked: boolean }) {
  const router = useRouter();

  return (
    <AutoSaveCheckbox
      label="Show in navigation"
      defaultChecked={defaultChecked}
      onSave={async (showInNav) => {
        const supabase = createClient();
        const { error } = await supabase.from("spaces").update({ show_in_nav: showInNav }).eq("id", spaceId);
        if (error) return error.message;
        router.refresh();
      }}
    />
  );
}

// The feed's photo card for the space, independent of the sidebar link.
export function SpaceCardToggle({ spaceId, defaultChecked }: { spaceId: string; defaultChecked: boolean }) {
  const router = useRouter();

  return (
    <AutoSaveCheckbox
      label="Show as card on feed"
      defaultChecked={defaultChecked}
      onSave={async (showAsCard) => {
        const supabase = createClient();
        const { error } = await supabase.from("spaces").update({ show_as_card: showAsCard }).eq("id", spaceId);
        if (error) return error.message;
        router.refresh();
      }}
    />
  );
}
