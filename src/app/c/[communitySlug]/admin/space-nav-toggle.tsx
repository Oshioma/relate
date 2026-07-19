"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SpaceNavToggle({ spaceId, defaultChecked }: { spaceId: string; defaultChecked: boolean }) {
  const router = useRouter();

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const showInNav = event.target.checked;
    const supabase = createClient();
    await supabase.from("spaces").update({ show_in_nav: showInNav }).eq("id", spaceId);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={toggle}
        className="h-4 w-4 rounded border-border"
      />
      Show in navigation
    </label>
  );
}
