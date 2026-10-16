import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        // A switched-off field looks switched off, rather than like a field
        // that simply won't take a click (see the admin page's platform view).
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props} />;
}
