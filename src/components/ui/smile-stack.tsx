import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";
import { describeReactors, type Reactor } from "@/lib/post-reactions";

interface SmileStackProps {
  /** The first few who smiled, in the order they should appear. */
  reactors: Reactor[];
  /** The full tally, which can exceed `reactors.length` — see describeReactors. */
  count: number;
  /** How many faces to show before collapsing the rest into "+N". */
  max?: number;
  size?: number;
  className?: string;
}

/**
 * Faces of the members who smiled, overlapped, with the remainder as "+N".
 *
 * The whole stack is one label to a screen reader — a row of avatar images
 * reads as noise otherwise — and the same sentence is the hover title, so the
 * names are reachable with a pointer as well.
 */
export function SmileStack({ reactors, count, max = 3, size = 22, className }: SmileStackProps) {
  if (count === 0) return null;

  const shown = reactors.slice(0, max);
  const remainder = count - shown.length;
  const label = describeReactors(shown, count);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} title={label}>
      {shown.length > 0 && (
        <span aria-hidden className="flex -space-x-1.5">
          {shown.map((reactor) => (
            <Avatar
              key={reactor.id}
              src={reactor.avatarUrl}
              name={reactor.name}
              size={size}
              className="ring-2 ring-card"
            />
          ))}
        </span>
      )}
      {remainder > 0 && (
        <span aria-hidden className="text-xs text-muted-foreground">
          {shown.length > 0 ? `+${remainder}` : remainder}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
