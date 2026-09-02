"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resendConfirmation, type ResendConfirmationState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function ResendConfirmationForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<ResendConfirmationState, FormData>(resendConfirmation, undefined);

  if (state?.done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-foreground">
          If that address is waiting to be confirmed, a new link is on its way. Open it and press{" "}
          <span className="font-medium">Confirm my email</span> — that last step is what activates the account.
        </p>
        <p className="text-sm text-muted-foreground">
          Nothing arriving? Check your spam folder, and make sure it&apos;s the same address you signed up with. If you
          already confirmed once, just sign in instead.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>

      {state?.error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Sending…">Email me a new link</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Already confirmed?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Forgot your password instead?{" "}
        <Link href="/forgot-password" className="font-medium text-accent hover:underline">
          Reset it
        </Link>
      </p>
    </form>
  );
}
