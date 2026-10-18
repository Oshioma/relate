"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "saving" | "saved" | "error";

// A checkbox that saves the moment it's clicked — and says so. Without a
// Save button, a bare checkbox gave no sign anything had been stored, so this
// shows "Saving…" while the write is in flight, a "Saved" tick for a couple of
// seconds after, or "Couldn't save" (with the box flipped back) if it failed.
//
// `onSave` gets the new value and resolves to an error message, or null/undefined
// on success.
export function AutoSaveCheckbox({
  label,
  defaultChecked,
  onSave,
  className,
}: {
  label: string;
  defaultChecked: boolean;
  onSave: (checked: boolean) => Promise<string | null | undefined>;
  className?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    setChecked(next);
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    let error: string | null | undefined;
    try {
      error = await onSave(next);
    } catch {
      error = "Couldn't save";
    }
    if (error) {
      setChecked(!next);
      setStatus("error");
    } else {
      setStatus("saved");
      timer.current = setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <div className={cn("flex shrink-0 flex-col items-end gap-0.5", className)}>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={checked}
          disabled={status === "saving"}
          onChange={toggle}
          className="h-4 w-4 rounded border-border disabled:opacity-50"
        />
        {label}
      </label>
      <span aria-live="polite" className="flex h-4 items-center gap-1 text-xs">
        {status === "saving" && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving…
          </span>
        )}
        {status === "saved" && (
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            <Check className="h-3 w-3" />
            Saved
          </span>
        )}
        {status === "error" && <span className="font-medium text-danger">Couldn&apos;t save — try again</span>}
      </span>
    </div>
  );
}
