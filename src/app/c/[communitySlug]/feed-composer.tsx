import Link from "next/link";
import type { Space } from "@/types/database";
import { SPACE_TYPES } from "@/lib/space-types";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// The "Share something with the community…" bar at the top of the feed. Every
// post belongs to a space, so this isn't a form of its own — it's a doorway to
// a space's real composer (#new-post), which already handles photos, crops and
// draft-saving. The big input goes to the first space a member can post in;
// the chips underneath go straight to the others (Ask for Help, Growing
// Journey, …), each with its space-type icon.
export function FeedComposer({
  base,
  spaces,
  viewerName,
  viewerAvatar,
}: {
  base: string;
  spaces: Space[];
  viewerName: string;
  viewerAvatar: string | null;
}) {
  const [primary, ...others] = spaces;
  if (!primary) return null;
  const href = (space: Space) => `${base}/spaces/${space.slug}#new-post`;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar src={viewerAvatar} name={viewerName} size={40} />
        <Link
          href={href(primary)}
          className="flex h-11 min-w-0 flex-1 items-center rounded-full bg-muted px-5 text-sm text-muted-foreground transition-colors hover:bg-muted/70"
        >
          <span className="truncate">Share something with the community…</span>
        </Link>
      </div>
      {spaces.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2 sm:pl-[52px]">
          {[primary, ...others].slice(0, 5).map((space) => {
            const Icon = SPACE_TYPES[space.space_type].icon;
            return (
              <Link
                key={space.id}
                href={href(space)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Icon className="h-3.5 w-3.5" />
                {space.name}
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
