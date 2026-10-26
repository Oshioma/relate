import Link from "@/components/ui/link";
import { Settings2 } from "lucide-react";
import { SPACE_TYPES, SPACE_TYPE_CATEGORIES } from "@/lib/space-types";
import { TypeChip } from "../../admin/space-row-parts";
import type { SpaceType } from "@/types/database";

// Admins only: a slim bar under the cover saying what type of space this is
// (its "Add a space" category and type) and what that type does, with a link
// to the space's row in Admin → Spaces & Content to change it. Members never
// see it. Shown for every type, including the ones with no masthead (custom
// pages, directories, lessons), so the type is never a guess.
export function SpaceTypeBar({ communitySlug, spaceId, spaceType }: { communitySlug: string; spaceId: string; spaceType: SpaceType }) {
  const meta = SPACE_TYPES[spaceType];
  const category = SPACE_TYPE_CATEGORIES.find((c) => c.key === meta.category);
  const Icon = meta.icon;
  return (
    <div className="border-b border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-sm sm:px-6">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
          Space type:
        </span>
        <TypeChip tone={meta.category}>{meta.label}</TypeChip>
        {category && <span className="text-xs text-muted-foreground">{category.label}</span>}
        <span className="hidden min-w-0 flex-1 truncate text-xs text-muted-foreground md:inline">{meta.description}</span>
        <Link
          href={`/c/${communitySlug}/admin#space-${spaceId}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-2 hover:text-accent"
        >
          <Settings2 className="h-3.5 w-3.5" aria-hidden />
          Change type
        </Link>
      </div>
    </div>
  );
}
