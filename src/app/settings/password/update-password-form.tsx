"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { updatePassword, type UpdatePasswordState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState<UpdatePasswordState, FormData>(updatePassword, undefined);

  if (state?.done) {
    return (
      <div className="space-y-4 text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm text-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          Password updated — use it next time you sign in.
        </p>
        <Link href="/dashboard" className="inline-block text-sm font-medium text-accent hover:underline">
          Go to your communities
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="new_password">New password</Label>
        <Input
          id="new_password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <Label htmlFor="confirm_password">Repeat it</Label>
        <Input
          id="confirm_password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Same password again"
        />
      </div>

      {state?.error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…">Save password</SubmitButton>
    </form>
  );
}
