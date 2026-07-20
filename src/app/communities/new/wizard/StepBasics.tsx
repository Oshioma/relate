"use client";

import { Globe, Lock, Mail } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { slugify, cn } from "@/lib/utils";
import type { CommunityPrivacy } from "@/types/database";
import type { WizardState } from "./types";

const PRIVACY_OPTIONS: { value: CommunityPrivacy; label: string; description: string; icon: typeof Globe }[] = [
  { value: "public", label: "Public", description: "Anyone can find and join.", icon: Globe },
  { value: "private", label: "Private", description: "Visible in search, but content is members-only.", icon: Lock },
  { value: "invite_only", label: "Invite Only", description: "Hidden — members must be invited to join.", icon: Mail },
];

export function StepBasics({ state, update }: { state: WizardState; update: (patch: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Let&apos;s set up your community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start with the basics. Logo and cover image can be added afterward from the community&apos;s Admin page.
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
            update({ name: value, slug: state.slugTouched ? state.slug : slugify(value) });
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
            onChange={(e) => update({ slug: slugify(e.target.value), slugTouched: true })}
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

      <div>
        <Label>Privacy</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRIVACY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = state.privacy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ privacy: opt.value })}
                className={cn(
                  "rounded-md border-2 p-3 text-left transition-colors",
                  isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                )}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-1.5 text-sm font-medium text-foreground">{opt.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
