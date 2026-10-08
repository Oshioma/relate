import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface ActivityStat {
  icon: LucideIcon;
  value: number;
  label: string;
}

// "This week in the community" — a handful of counts, each with its icon.
// Zero rows are dropped by the caller; with nothing left, the card hides.
export function CommunityActivityCard({ stats }: { stats: ActivityStat[] }) {
  if (stats.length === 0) return null;

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Community activity</h2>
      <ul className="space-y-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/70">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-bold leading-tight text-foreground">{value.toLocaleString()}</span>
              <span className="block text-xs text-muted-foreground">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
