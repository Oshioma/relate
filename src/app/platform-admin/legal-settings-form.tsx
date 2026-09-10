"use client";

import Link from "next/link";
import { useActionState } from "react";
import { savePlatformLegal, type LegalFormState } from "./actions";
import { RichEditor } from "@/components/ui/rich-editor";
import { SubmitButton } from "@/components/ui/submit-button";
import type { PlatformSettings } from "@/types/database";

export function LegalSettingsForm({ settings }: { settings: PlatformSettings | null }) {
  const [state, formAction] = useActionState<LegalFormState, FormData>(savePlatformLegal, undefined);

  return (
    <form action={formAction} className="space-y-6 rounded-lg border border-border p-4">
      <div>
        <label htmlFor="legal_terms" className="mb-1 block text-sm font-medium text-foreground">
          Terms &amp; Conditions
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          Shown at{" "}
          <Link href="/terms" target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-2">
            /terms
          </Link>
          , linked in the site footer. Leave empty to hide the page.
        </p>
        <RichEditor id="legal_terms" name="terms" rows={12} defaultValue={settings?.terms ?? ""} placeholder="Your platform's terms of use…" />
      </div>

      <div>
        <label htmlFor="legal_privacy" className="mb-1 block text-sm font-medium text-foreground">
          Privacy Policy
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          Shown at{" "}
          <Link href="/privacy" target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-2">
            /privacy
          </Link>
          , linked in the site footer. Leave empty to hide the page.
        </p>
        <RichEditor id="legal_privacy" name="privacy" rows={12} defaultValue={settings?.privacy ?? ""} placeholder="How you handle members' data…" />
      </div>

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save legal documents
      </SubmitButton>
    </form>
  );
}
