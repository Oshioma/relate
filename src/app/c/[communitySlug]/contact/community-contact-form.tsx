"use client";

import { useActionState } from "react";
import { submitCommunityContact, type CommunityContactState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function CommunityContactForm({ communityId }: { communityId: string }) {
  const [state, formAction] = useActionState<CommunityContactState, FormData>(submitCommunityContact, undefined);

  if (state && "ok" in state) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">Thanks — your message has been sent.</p>
        <p className="mt-1 text-sm text-muted-foreground">The team will get back to you by email as soon as they can.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-card p-6">
      <input type="hidden" name="community_id" value={communityId} />

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
