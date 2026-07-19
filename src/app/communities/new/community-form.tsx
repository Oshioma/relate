"use client";

import { useActionState, useState } from "react";
import { createCommunity, type CommunityFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { slugify } from "@/lib/utils";

export function CommunityForm() {
  const [state, formAction] = useActionState<CommunityFormState, FormData>(createCommunity, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Community name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Kushukuru Community"
          value={name}
          onChange={(event) => {
            const value = event.target.value;
            setName(value);
            if (!slugTouched) {
              setSlug(slugify(value));
            }
          }}
        />
      </div>

      <div>
        <Label htmlFor="slug">URL</Label>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="shrink-0">/c/</span>
          <Input
            id="slug"
            name="slug"
            required
            placeholder="kushukuru"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" rows={3} placeholder="What's this community about?" />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="is_public" defaultChecked className="h-4 w-4 rounded border-border" />
        Public — anyone can find and join
      </label>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Creating…">Create community</SubmitButton>
    </form>
  );
}
