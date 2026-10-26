"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2 } from "lucide-react";
import { shareableCheckoutLink } from "@/lib/checkout-links";

// The shareable "buy" link for a tier or course, with a copy button. Anyone
// who opens it goes straight to Stripe Checkout, signed in or not (see
// src/lib/checkout-links.ts). The full address is worked out in the browser so
// it's on the host the admin is using: the community's own domain when they're
// on it.
const noSubscription = () => () => {};

export function CopyCheckoutLink({ path, communitySlug, label = "Checkout link" }: { path: string; communitySlug: string; label?: string }) {
  // The page's address never changes under this component, so there's
  // nothing to subscribe to; the server render shows the bare path.
  const link = useSyncExternalStore(
    noSubscription,
    () => shareableCheckoutLink(path, communitySlug, window.location),
    () => path
  );
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-2 rounded-md bg-muted/60 px-3 py-2">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        Share it anywhere: it opens Stripe Checkout straight away, no signup first. New buyers are signed in when they&apos;ve
        paid; anyone who already has an account gets a sign-in email.
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded bg-card px-2 py-1 text-xs text-foreground">{link}</code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
