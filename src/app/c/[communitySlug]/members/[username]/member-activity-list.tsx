import Link from "next/link";
import { MessageSquare, FileText } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/lib/data/member-activity";

export function MemberActivityList({ activity, communitySlug }: { activity: ActivityItem[]; communitySlug: string }) {
  if (activity.length === 0) return null;

  return (
    <ul className="space-y-3">
      {activity.map((item) => {
        const href = `/c/${communitySlug}/spaces/${item.spaceSlug}/posts/${item.postId}`;

        return (
          <li key={`${item.kind}-${item.id}`} className="flex items-start gap-2.5 text-sm">
            {item.kind === "post" ? (
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0">
              {item.kind === "post" ? (
                <Link href={href} className="font-medium text-foreground hover:underline">
                  {item.title}
                </Link>
              ) : (
                <p className="text-foreground">
                  Commented on{" "}
                  <Link href={href} className="font-medium hover:underline">
                    {item.postTitle}
                  </Link>
                  : <span className="text-muted-foreground">{item.body.length > 120 ? `${item.body.slice(0, 120)}…` : item.body}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
