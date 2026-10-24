import { Eye } from "lucide-react";
import { startViewAsMember } from "../view-as-member-actions";

// Starts the "view as member" preview (src/lib/view-as-member.ts) and lands on
// the community feed; a bar there offers the way back.
export function ViewAsMemberButton({ communityId, communitySlug, label = "View as member" }: { communityId: string; communitySlug: string; label?: string }) {
  return (
    <form action={startViewAsMember}>
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Eye className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
