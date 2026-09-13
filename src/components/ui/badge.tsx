import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "accent" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-accent-soft text-accent",
  danger: "bg-danger/10 text-danger",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        // shrink-0 and whitespace-nowrap: a badge is a label, and a label that
        // has been squeezed is worse than one that has been dropped. In a flex
        // row a badge would otherwise shrink below its own word — and with no
        // overflow-hidden on it, the word simply spilled out of the pill and
        // drew across whatever came next. In the Spaces manager that put the
        // space type on top of the "Show in navigation" checkbox.
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
