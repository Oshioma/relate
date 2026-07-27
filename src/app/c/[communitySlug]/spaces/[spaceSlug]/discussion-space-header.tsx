import type { ComponentType } from "react";
import { Avatar } from "@/components/ui/avatar";
import { RichText } from "@/components/ui/rich-text";
import type { DiscussionSpaceSummary } from "@/lib/data/posts";

// The masthead for discussion-style spaces (Feed, Growing Journey, Ask for
// Help…). Beyond the plain title, it shows who's been posting and how much, so
// the space reads as an active place the moment you land — the stats are real
// activity, so the whole activity row hides until the space has a post.
export function DiscussionSpaceHeader({
  name,
  description,
  Icon,
  summary,
}: {
  name: string;
  description: string | null;
  Icon: ComponentType<{ className?: string }>;
  summary: DiscussionSpaceSummary;
}) {
  const extra = summary.contributorCount - summary.contributors.length;

  return (
    <div className="mb-6">
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{name}</h1>
          {description && <RichText content={description} className="mt-1 text-muted-foreground" />}
        </div>
      </div>

      {summary.postCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
          {summary.contributors.length > 0 && (
            <div className="flex -space-x-2">
              {summary.contributors.map((c) => (
                <Avatar key={c.id} src={c.avatarUrl} name={c.name} size={28} className="ring-2 ring-background" />
              ))}
              {extra > 0 && (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground ring-2 ring-background">
                  +{extra}
                </span>
              )}
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{summary.postCount}</span> {summary.postCount === 1 ? "post" : "posts"}
            {" · "}
            <span className="font-semibold text-foreground">{summary.contributorCount}</span>{" "}
            {summary.contributorCount === 1 ? "contributor" : "contributors"}
          </span>
          {summary.activeThisWeek && (
            <span className="ml-auto inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
              Active this week
            </span>
          )}
        </div>
      )}
    </div>
  );
}
