import { cn } from "@/lib/utils";

// A calm progress bar: milestones done out of total. The width transition
// makes ticking a milestone visibly move it; reduced-motion users get the
// new width without the animation.
export function ProgressBar({ done, total, className, showLabel = true }: { done: number; total: number; className?: string; showLabel?: boolean }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className={className}>
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={`${done} of ${total} milestones done`}
      >
        <div className={cn("h-full rounded-full bg-accent transition-[width] duration-700 ease-out motion-reduce:transition-none")} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {total === 0 ? "No milestones yet" : `${done} of ${total} milestones`}
        </p>
      )}
    </div>
  );
}
