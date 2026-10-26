import Link from "@/components/ui/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { timelinePath } from "@/lib/timeline/availability";
import { textsPath } from "@/lib/timeline/texts/paths";

// THE ARCHIVE'S OWN NAVIGATION, under the timeline it belongs to.
//
// Six views of one archive. Every one of them leads back to a passage, and
// every passage leads back to its marker on the timeline.

export type TextsTab = "library" | "read" | "compare" | "themes" | "images" | "interpretations";

const TABS: { key: TextsTab; label: string; href: (base: string) => string }[] = [
  { key: "library", label: "Ancient texts", href: (base) => base },
  { key: "read", label: "Read passages", href: (base) => `${base}/read` },
  { key: "compare", label: "Compare texts", href: (base) => `${base}/compare` },
  { key: "themes", label: "Trace an idea", href: (base) => `${base}/themes` },
  { key: "images", label: "Original images", href: (base) => `${base}/images` },
  { key: "interpretations", label: "Alternative interpretations", href: (base) => `${base}/interpretations` },
];

export function TextsNav({ communitySlug, active }: { communitySlug: string; active: TextsTab | null }) {
  const base = textsPath(communitySlug);
  return (
    <div>
      <Link
        href={timelinePath(communitySlug)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to the timeline
      </Link>
      <nav aria-label="Text archive" className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-1 border-b border-border">
          {TABS.map((tab) => (
            <li key={tab.key}>
              <Link
                href={tab.href(base)}
                aria-current={active === tab.key ? "page" : undefined}
                className={cn(
                  "inline-block whitespace-nowrap border-b-2 px-3 py-2 text-sm",
                  active === tab.key
                    ? "border-accent font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
