"use client";

import { Input, Textarea, Label } from "@/components/ui/input";
import { slugifyCommunity } from "@/lib/utils";
import type { WizardState } from "./types";

export function StepBasics({ state, update }: { state: WizardState; update: (patch: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Let&apos;s set up your community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Name it, choose how people get in, and pick a starting point. You&apos;ll see it as visitors and members will before anything is created.
        </p>
      </div>

      <div>
        <Label htmlFor="name">Community name</Label>
        <Input
          id="name"
          required
          placeholder="Kushukuru Community"
          value={state.name}
          onChange={(e) => {
            const value = e.target.value;
            update({ name: value, slug: state.slugTouched ? state.slug : slugifyCommunity(value) });
          }}
        />
      </div>

      <div>
        <Label htmlFor="slug">URL</Label>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="shrink-0">/c/</span>
          <Input
            id="slug"
            required
            placeholder="kushukuru"
            value={state.slug}
            onChange={(e) => update({ slug: slugifyCommunity(e.target.value), slugTouched: true })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="What's this community about?"
          value={state.description}
          onChange={(e) => update({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
