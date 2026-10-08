"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormDraftRef } from "@/lib/use-form-draft";
import type { JourneyFormState } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { cn } from "@/lib/utils";

type Action = (prev: JourneyFormState, fd: FormData) => Promise<JourneyFormState>;

// Every guided-journey form: useActionState + an auto-saved draft.
//
// The draft is cleared the moment the form is submitted (many of these
// actions redirect on success, after which nothing on this page runs again)
// and written back straight away if the action returns an error — so a failed
// submit never loses what was typed, and a successful one never leaves a
// stale draft behind.
export function DraftForm({
  action,
  draftKey,
  hidden,
  children,
  submitLabel,
  pendingLabel = "Saving…",
  className,
  onRestore,
  onSuccess,
  submitClassName,
  footer,
  resetOnSuccess = false,
  submitVariant = "primary",
  submitSize = "lg",
}: {
  action: Action;
  draftKey: string;
  hidden: Record<string, string>;
  children: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  onRestore?: (values: Record<string, string | string[]>) => void;
  onSuccess?: () => void;
  submitClassName?: string;
  footer?: ReactNode;
  resetOnSuccess?: boolean;
  submitVariant?: "primary" | "secondary" | "danger";
  submitSize?: "sm" | "md" | "lg";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, undefined);
  const { clear, saveNow } = useFormDraftRef(formRef, draftKey, { onRestore });
  const lastState = useRef<JourneyFormState>(undefined);

  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state?.error) saveNow();
    if (state?.ok) {
      clear();
      if (resetOnSuccess) formRef.current?.reset();
      onSuccess?.();
    }
  }, [state, saveNow, clear, resetOnSuccess, onSuccess]);

  return (
    <form ref={formRef} action={formAction} onSubmit={() => clear()} className={className ?? "space-y-5"}>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
      {state?.error && (
        <p role="alert" className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {state.ok}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Submit label={submitLabel} pendingLabel={pendingLabel} className={submitClassName} variant={submitVariant} size={submitSize} />
        {footer}
      </div>
    </form>
  );
}

function Submit({
  label,
  pendingLabel,
  className,
  variant,
  size,
}: {
  label: string;
  pendingLabel: string;
  className?: string;
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size={size} variant={variant} disabled={pending} className={cn("rounded-full", className)}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

// Chips for single/multi choice questions — real radios/checkboxes underneath
// (so they work without JS and the draft hook can save them), styled as pills.
export function ChoiceChips({
  name,
  options,
  type = "checkbox",
  defaultValue = [],
  required = false,
}: {
  name: string;
  options: { value: string; label: string }[];
  type?: "checkbox" | "radio";
  defaultValue?: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type={type}
            name={name}
            value={option.value}
            defaultChecked={defaultValue.includes(option.value)}
            required={required && type === "radio"}
            className="peer sr-only"
          />
          <span className="inline-flex select-none items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-accent">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

export function Field({ label, help, children, htmlFor }: { label: string; help?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>
      {help && <p className="-mt-1 mb-2 text-xs text-muted-foreground">{help}</p>}
      {children}
    </div>
  );
}
