import { cn } from "@/lib/utils";

export function courseProgressPercent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((Math.min(completed, total) / total) * 100);
}

// A slim completion bar shared by the course card and the player header.
export function ProgressBar({ completed, total, className }: { completed: number; total: number; className?: string }) {
  const percent = courseProgressPercent(completed, total);
  const done = total > 0 && completed >= total;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", done ? "bg-emerald-500" : "bg-accent")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{percent}%</span>
    </div>
  );
}
