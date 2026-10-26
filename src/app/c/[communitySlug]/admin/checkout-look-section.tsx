"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { useFormDraft } from "@/lib/use-form-draft";
import { CHECKOUT_MESSAGE_MAX, defaultCheckoutMessage } from "@/lib/checkout-look";
import { setCheckoutMessage, syncCheckoutBranding } from "./billing-actions";

// How the community's Stripe Checkout pages look: the logo and colour at the
// top (pushed to the Stripe account), the picture beside what's being bought
// (the cover, else the logo — automatic), and a line under the Pay button.
export function CheckoutLookSection({
  communityId,
  communitySlug,
  communityName,
  checkoutMessage,
  hasLogo,
}: {
  communityId: string;
  communitySlug: string;
  communityName: string;
  checkoutMessage: string | null;
  hasLogo: boolean;
}) {
  const router = useRouter();
  const { formRef, clearDraft } = useFormDraft(`checkout-message:${communityId}`);
  const [messageSaved, setMessageSaved] = useState(false);
  const [brandingDone, setBrandingDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveMessage(formData: FormData) {
    setError(null);
    setMessageSaved(false);
    startTransition(async () => {
      const res = await setCheckoutMessage(communityId, communitySlug, String(formData.get("checkout_message") ?? ""));
      if (res.error) setError(res.error);
      else {
        clearDraft();
        setMessageSaved(true);
        router.refresh();
      }
    });
  }

  function pushBranding() {
    setError(null);
    setBrandingDone(false);
    startTransition(async () => {
      const res = await syncCheckoutBranding(communityId, communitySlug);
      if (res.error) setError(res.error);
      else setBrandingDone(true);
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-5">
        <div>
          <p className="text-sm font-medium text-foreground">Checkout page</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            How the Stripe page looks when someone pays for a membership, a course or a space. The community&apos;s cover
            photo (or logo) shows beside what they&apos;re buying automatically.
          </p>
        </div>

        <div>
          <Label>Logo and colour at the top</Label>
          <p className="mb-2 text-xs text-muted-foreground">
            Puts your community logo and accent colour on your Stripe account, so every checkout shows them. Press it
            again after you change the logo.
          </p>
          <Button type="button" variant="secondary" className="w-auto" disabled={isPending || !hasLogo} onClick={pushBranding}>
            {isPending ? "Working…" : "Use our logo on Stripe checkout"}
          </Button>
          {!hasLogo && <p className="mt-1 text-xs text-muted-foreground">Add a logo in Community details first.</p>}
          {brandingDone && (
            <p role="status" className="mt-1 flex items-center gap-1 text-xs text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" /> Done. New checkouts show your logo.
            </p>
          )}
        </div>

        <form ref={formRef} action={saveMessage}>
          <Label htmlFor="checkout_message">Message under the Pay button</Label>
          <Textarea
            id="checkout_message"
            name="checkout_message"
            rows={3}
            maxLength={CHECKOUT_MESSAGE_MAX}
            defaultValue={checkoutMessage ?? ""}
            placeholder={defaultCheckoutMessage(communityName)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Leave it empty to use the line shown in grey. Up to {CHECKOUT_MESSAGE_MAX} characters.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" className="w-auto" disabled={isPending}>
              {isPending ? "Saving…" : "Save message"}
            </Button>
            {messageSaved && (
              <span role="status" className="flex items-center gap-1 text-xs text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </div>
        </form>

        {error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
