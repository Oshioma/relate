"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { CURRENCIES } from "@/lib/currencies";
import { setCommunityCurrency } from "./billing-actions";

// The community's one currency: memberships, courses and space prices are all
// charged in it. Changing it moves every existing price over (same amounts).
export function CurrencySection({
  communityId,
  communitySlug,
  currency,
}: {
  communityId: string;
  communitySlug: string;
  currency: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currency);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  // A stored code that isn't in the list (set before the list existed) still shows.
  const options = CURRENCIES.some((c) => c.code === currency)
    ? CURRENCIES
    : [{ code: currency, label: currency.toUpperCase() }, ...CURRENCIES];

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await setCommunityCurrency(communityId, communitySlug, value);
      if (res.error) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <div>
          <Label htmlFor="community_currency">Currency</Label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              id="community_currency"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSaved(false);
              }}
              className="w-full max-w-xs rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {options.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <Button type="button" className="w-auto" disabled={isPending || value === currency} onClick={save}>
              {isPending ? "Saving…" : "Save currency"}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Membership tiers, courses and space prices are all charged in this currency. Pick the one your Stripe
            account pays out in.
          </p>
        </div>
        {value !== currency && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-foreground">
            Saving moves every existing price to {value.toUpperCase()}. The amounts aren&apos;t converted: a price of 10{" "}
            {currency.toUpperCase()} becomes 10 {value.toUpperCase()}. People already subscribed keep paying what they
            signed up for.
          </p>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
        {saved && !isPending && (
          <p role="status" className="flex items-center gap-1.5 text-sm text-accent">
            <CheckCircle2 className="h-4 w-4" />
            Saved. Every price is now in {currency.toUpperCase()}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
