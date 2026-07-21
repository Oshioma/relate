"use client";

import { useRef, useState } from "react";
import { createNavLink } from "./nav-links-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewNavLinkForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createNavLink(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
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

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add link
      </SubmitButton>
    </form>
  );
}
