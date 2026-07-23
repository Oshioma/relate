"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthFormState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function SignupForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(signup, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" type="text" autoComplete="name" required placeholder="Jane Doe" />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>

      {typeof state?.error === "string" && state.error.trim() !== "" && (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <SubmitButton pendingText="Creating account…">Create account</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
