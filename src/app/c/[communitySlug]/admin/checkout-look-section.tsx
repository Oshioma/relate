"use client";

import { flushSync } from "react-dom";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { useFormDraft, useFormDraftRef } from "@/lib/use-form-draft";
import { CHECKOUT_MESSAGE_MAX, defaultCheckoutMessage } from "@/lib/checkout-look";
import { setCheckoutMessage, setTierCheckoutLook, syncCheckoutBranding } from "./billing-actions";

export type CheckoutTier = {
  id: string;
  name: string;
  checkout_message: string | null;
  checkout_image_url: string | null;
};

// How the community's Stripe Checkout pages look: the logo and colour at the
// top (pushed to the Stripe account), the picture beside what's being bought
// (the cover, else the logo — automatic), and a line under the Pay button.
// Each membership tier then gets its own window below, with its own line and
// picture; anything it leaves empty uses the community's.
export function CheckoutLookSection({
  communityId,
  communitySlug,
  communityName,
  checkoutMessage,
  coverUrl,
  hasLogo,
  tiers,
}: {
  communityId: string;
  communitySlug: string;
  communityName: string;
  checkoutMessage: string | null;
  // The picture a tier without its own shows (cover, else logo).
  coverUrl: string | null;
  hasLogo: boolean;
  tiers: CheckoutTier[];
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
    <div className="space-y-4">
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
            {tiers.length > 0 && (
              <p className="mb-2 text-xs text-muted-foreground">
                Used for courses, paid spaces and any membership below that doesn&apos;t have its own.
              </p>
            )}
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

      {tiers.map((tier) => (
        <TierCheckoutWindow
          key={tier.id}
          communityId={communityId}
          communitySlug={communitySlug}
          tier={tier}
          fallbackMessage={checkoutMessage?.trim() || defaultCheckoutMessage(communityName)}
          fallbackImageUrl={coverUrl}
        />
      ))}
    </div>
  );
}

// One membership tier's checkout page: its own line under the Pay button and
// its own picture beside the product. The picture is kept in a hidden field
// so a refresh before saving keeps it along with the typed line.
function TierCheckoutWindow({
  communityId,
  communitySlug,
  tier,
  fallbackMessage,
  fallbackImageUrl,
}: {
  communityId: string;
  communitySlug: string;
  tier: CheckoutTier;
  fallbackMessage: string;
  fallbackImageUrl: string | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(tier.checkout_image_url);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.checkout_image_url === "string") setImageUrl(values.checkout_image_url || null);
  }, []);
  const { clear, saveNow } = useFormDraftRef(formRef, `tier-checkout:${tier.id}`, { onRestore });

  function setPicture(url: string | null) {
    flushSync(() => setImageUrl(url));
    setSaved(false);
    saveNow();
  }

  function save(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await setTierCheckoutLook(
        communityId,
        communitySlug,
        tier.id,
        String(formData.get("checkout_message") ?? ""),
        String(formData.get("checkout_image_url") ?? "")
      );
      if (res.error) setError(res.error);
      else {
        clear();
        setSaved(true);
        router.refresh();
      }
    });
  }

  const messageId = `tier_checkout_message_${tier.id}`;
  return (
    <Card>
      <CardContent className="pt-5">
        <form ref={formRef} action={save} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">Checkout page: {tier.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              What someone sees on Stripe when they join this membership. Leave either part empty to use the
              community&apos;s.
            </p>
          </div>

          <input type="hidden" name="checkout_image_url" value={imageUrl ?? ""} data-draft />

          <div>
            <Label>Picture beside the membership</Label>
            <ImageUpload
              key={imageUrl ?? "none"}
              bucket="community-assets"
              basePath={`${communityId}/tier-${tier.id}-checkout`}
              currentUrl={imageUrl ?? fallbackImageUrl}
              onUploaded={(url) => setPicture(url)}
              shape="square"
              size={64}
              label="Upload picture"
              hint={imageUrl ? "Square pictures look best." : "Uses the community's cover photo until you upload one."}
            />
            {imageUrl && (
              <button type="button" onClick={() => setPicture(null)} className="mt-1 text-xs text-muted-foreground hover:text-foreground">
                Use the community&apos;s picture instead
              </button>
            )}
          </div>

          <div>
            <Label htmlFor={messageId}>Message under the Pay button</Label>
            <Textarea
              id={messageId}
              name="checkout_message"
              rows={3}
              maxLength={CHECKOUT_MESSAGE_MAX}
              defaultValue={tier.checkout_message ?? ""}
              placeholder={fallbackMessage}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave it empty to use the line shown in grey. Up to {CHECKOUT_MESSAGE_MAX} characters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" className="w-auto" disabled={isPending}>
              {isPending ? "Saving…" : "Save this checkout page"}
            </Button>
            {saved && (
              <span role="status" className="flex items-center gap-1 text-xs text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </div>

          {error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
