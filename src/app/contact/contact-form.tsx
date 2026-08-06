"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(submitContactForm, undefined);

  if (state && "ok" in state) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">Thanks — your message is on its way.</p>
        <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you by email as soon as we can.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-card p-6">
      {/* Honeypot: hidden from real users, catches form-filling bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="contact_name">Your name</Label>
        <Input id="contact_name" name="name" required maxLength={100} autoComplete="name" />
      </div>

      <div>
        <Label htmlFor="contact_email">Your email</Label>
        <Input id="contact_email" name="email" type="email" required maxLength={200} autoComplete="email" />
      </div>

      <div>
        <Label htmlFor="contact_message">Message</Label>
        <Textarea id="contact_message" name="message" rows={6} required maxLength={5000} placeholder="How can we help?" />
      </div>

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Sending…" className="w-auto">
        Send message
      </SubmitButton>
    </form>
  );
}
