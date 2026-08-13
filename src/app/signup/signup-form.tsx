"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthFormState } from "@/app/auth/actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { TurnstileWidget } from "@/components/turnstile-widget";

export function SignupForm({ next, prefilledEmail }: { next: string; prefilledEmail?: string | null }) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(signup, undefined);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {/* Honeypot: hidden from people, but bots fill every field they find. A
          non-empty value makes the server reject the signup. Kept out of the
          tab order and off autocomplete so real users never touch it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" type="text" autoComplete="name" required placeholder="Jane Doe" />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        {prefilledEmail ? (
          // Came from an email invite — we already have their address, so lock
          // it and let them get straight to picking a password. readOnly (not
          // disabled) keeps the value in the submitted form data.
          <>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              readOnly
              defaultValue={prefilledEmail}
              className="cursor-not-allowed bg-muted text-muted-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">This is the address your invite was sent to.</p>
          </>
        ) : (
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        )}
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

      {turnstileSiteKey && <TurnstileWidget siteKey={turnstileSiteKey} />}

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
