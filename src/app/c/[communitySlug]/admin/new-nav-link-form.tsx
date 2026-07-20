"use client";

import { useActionState, useRef, useEffect } from "react";
import { createNavLink, type NavLinkFormState } from "./nav-links-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewNavLinkForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [state, formAction] = useActionState<NavLinkFormState, FormData>(createNavLink, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="nav_link_label">Label</Label>
          <Input id="nav_link_label" name="label" placeholder="Farm App" required />
        </div>
        <div>
          <Label htmlFor="nav_link_url">URL</Label>
          <Input id="nav_link_url" name="url" type="text" placeholder="example.com" required />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add link
      </SubmitButton>
    </form>
  );
}
