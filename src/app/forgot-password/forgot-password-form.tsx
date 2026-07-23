"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type PasswordResetState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<PasswordResetState, FormData>(requestPasswordReset, undefined);

  if (state?.done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-foreground">
          If that email has an account, a reset link is on its way. Click it, then choose your new password.
        </p>
        <p className="text-sm text-muted-foreground">
          Nothing arriving? Check your spam folder, and make sure it&apos;s the same email you signed up (or were
          invited) with.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>

      {state?.error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Sending…">Email me a reset link</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
