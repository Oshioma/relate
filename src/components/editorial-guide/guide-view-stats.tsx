import { Eye } from "lucide-react";
import type { GuideViewStats } from "@/lib/data/editorial-guides";

// Staff-only readership line for a guide: daily readers today, this week and
// this month. Rendered only for staff (the stats are only returned to them).
export function GuideViewStatsBadge({ stats }: { stats: GuideViewStats | null | undefined }) {
  if (!stats) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" title={`${stats.allTime} reads all time · ${stats.readers30} different readers in the last 30 days. Counts one read per reader per day; staff visits aren't counted.`}>
      <Eye className="h-3.5 w-3.5" aria-hidden />
      <span>
        <span className="font-medium text-foreground">{stats.today}</span> today · <span className="font-medium text-foreground">{stats.last7}</span> this week ·{" "}
        <span className="font-medium text-foreground">{stats.last30}</span> last 30 days
      </span>
    </span>
  );
}
