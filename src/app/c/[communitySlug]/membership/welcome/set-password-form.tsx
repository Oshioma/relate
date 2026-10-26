"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updatePassword, type UpdatePasswordState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

// Optional for a buyer whose account was just made at checkout: they're signed
// in already, and a password lets them sign in again on another device without
// waiting for an email. Passwords are never kept as a draft.
export function SetPasswordForm() {
  const [state, formAction] = useActionState<UpdatePasswordState, FormData>(updatePassword, undefined);

  if (state?.done) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-foreground">
        <CheckCircle2 className="h-4 w-4 text-accent" />
        Password saved. Use it with your email next time you sign in.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="welcome_password">Password</Label>
        <Input id="welcome_password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
      </div>
      <div>
        <Label htmlFor="welcome_password_confirm">Repeat it</Label>
        <Input id="welcome_password_confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} placeholder="Same password again" />
      </div>
      {state?.error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      <SubmitButton pendingText="Saving…">Save password</SubmitButton>
    </form>
  );
}
