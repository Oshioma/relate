"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePrivacy, type PrivacyFormState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Profile } from "@/types/database";

const TOGGLES: { name: keyof Profile; label: string; description: string }[] = [
  { name: "hide_profile", label: "Hide my profile", description: "Only members who share a community with you can see your profile." },
  { name: "hide_online_status", label: "Hide online status", description: "Don't show others when you were last active." },
  { name: "hide_communities", label: "Hide communities", description: "Don't list the communities you've joined on your profile." },
  { name: "hide_social_links", label: "Hide social links", description: "Keep your linked social accounts private." },
  { name: "hide_business_profile", label: "Hide business profile", description: "Keep your business profile out of your public profile." },
  { name: "is_discoverable", label: "Appear in member directory", description: "Turn off to opt out of directory search and discovery sections entirely." },
];

export function PrivacyForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState<PrivacyFormState, FormData>(updatePrivacy, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm font-medium text-foreground">Privacy</p>

      <div className="space-y-3">
        {TOGGLES.map((toggle) => (
          <label key={toggle.name} className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name={toggle.name}
              defaultChecked={
                toggle.name === "is_discoverable" ? profile.is_discoverable : Boolean(profile[toggle.name])
              }
              className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
            />
            <span>
              <span className="block font-medium text-foreground">{toggle.label}</span>
              <span className="block text-muted-foreground">{toggle.description}</span>
            </span>
          </label>
        ))}
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div className="flex items-center gap-4">
        <SubmitButton pendingText="Saving…" className="w-auto">
          Save privacy settings
        </SubmitButton>
        <Link href="/settings/blocked" className="text-sm text-muted-foreground hover:text-foreground">
          Manage blocked members
        </Link>
      </div>
    </form>
  );
}
