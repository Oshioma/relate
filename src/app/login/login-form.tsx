"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthFormState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
      </div>

      {state?.error && (
        <div className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          <p>{state.error}</p>
          {/* The account exists but was never confirmed — the one sign-in
              failure the member can resolve themselves, so link them straight
              to a fresh activation link rather than leaving them to guess. */}
          {state.unconfirmed && (
            <Link
              href={`/signup/resend?next=${encodeURIComponent(next)}`}
              className="mt-2 inline-block font-medium underline"
            >
              Send me a new activation link
            </Link>
          )}
        </div>
      )}

      <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="font-medium text-accent hover:underline">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
