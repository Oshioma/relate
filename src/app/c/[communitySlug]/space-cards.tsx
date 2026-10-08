import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Space } from "@/types/database";
import { SPACE_TYPES } from "@/lib/space-types";

// The row of photo cards under the feed hero: the community's headline spaces,
// each a one-click way in. It's the desktop twin of the mobile DiscoverStrip —
// hidden below `md`, where the strip already does this job — and it shows at
// most five so the row stays one row; the sidebar lists the rest.
export function SpaceCards({ spaces, base }: { spaces: Space[]; base: string }) {
  const shown = spaces.slice(0, 5);
  if (shown.length === 0) return null;

  return (
    <div className="hidden gap-4 md:grid md:grid-cols-3 xl:grid-cols-5">
      {shown.map((space) => {
        const Icon = SPACE_TYPES[space.space_type].icon;
        return (
          <Link
            key={space.id}
            href={`${base}/spaces/${space.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="relative block aspect-[2/1] w-full overflow-hidden bg-accent-soft">
              {space.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={space.image_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-accent">
                  <Icon className="h-10 w-10 opacity-60" />
                </span>
              )}
            </span>
            <span className="flex flex-1 flex-col p-4">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 truncate text-sm font-semibold text-foreground">{space.name}</span>
              </span>
              {space.description && (
                <span className="mt-2 line-clamp-3 break-words text-xs leading-relaxed text-muted-foreground">
                  {space.description}
                </span>
              )}
              <span className="mt-auto flex justify-end pt-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
