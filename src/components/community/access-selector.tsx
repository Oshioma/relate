"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Globe, Users, CreditCard, BadgeCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ACCESS_CHOICES,
  accessChoiceOf,
  accessShifts,
  describeSpaceAccess,
  formatMonthly,
  settingsForChoice,
  spaceAccessFor,
  tiersLosingAccess,
  type AccessChoice,
  type AccessCommunity,
  type AccessSpace,
  type AccessState,
  type AccessTier,
} from "@/lib/access/model";

const ICONS: Record<AccessChoice, LucideIcon> = {
  everyone: Globe,
  members: Users,
  paid: CreditCard,
  tiers: BadgeCheck,
  team: ShieldCheck,
};

const STATE_WORDS: Record<AccessState, string> = { open: "can open it", locked: "see it locked", hidden: "don't see it" };

// "Who can open it?" — one picker for every space, reading and writing the
// settings Relate already has (visibility, the space's own price, its tier
// links) through src/lib/access. It renders inside a <form> and submits:
//   access_choice  — marks the form as using the picker
//   visibility     — public | members | private
//   price          — the space's own monthly price (whole units), "" = none
//   tier_ids       — one field per tier the space should be in
//   when_locked    — "teaser" to show it locked to visitors, "" for not
// The server (updateSpace) re-derives and checks all of it; this is the
// explanation, not the lock.
export function AccessSelector({
  idPrefix,
  space,
  tiers,
  community,
  paymentsEnabled,
}: {
  idPrefix: string;
  space: AccessSpace;
  tiers: AccessTier[];
  community: AccessCommunity;
  // Stripe connected and the plan allows charging: the paid choices can be set.
  paymentsEnabled: boolean;
}) {
  const initialChoice = accessChoiceOf(space, tiers);
  const [choice, setChoice] = useState<AccessChoice>(initialChoice);
  const [selectedTierIds, setSelectedTierIds] = useState<string[]>(space.tierIds);
  const [ownPrice, setOwnPrice] = useState(space.price_cents > 0 ? (space.price_cents / 100).toFixed(2) : "");
  const [teaser, setTeaser] = useState(space.when_locked === "teaser");
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ownPriceCents = Math.max(0, Math.round((Number(ownPrice) || 0) * 100));
  const after = settingsForChoice(choice, tiers, { tierIds: selectedTierIds, priceCents: ownPriceCents, currentTierIds: space.tierIds });
  const before = { visibility: space.visibility, price_cents: space.price_cents, tierIds: space.tierIds };
  // Only a members space in a community visitors can reach can be a teaser.
  const teaserPossible = after.visibility === "members" && community.privacy !== "invite_only";
  const preview: AccessSpace = { ...space, ...after, when_locked: teaserPossible && teaser ? "teaser" : null };
  const losing = tiersLosingAccess(before, after, tiers);
  const { widens, narrows } = accessShifts(community, space, preview);
  const onSaleNames = tiers.filter((t) => !t.archived_at).map((t) => t.name);
  const visibleTiers = tiers.filter((t) => !t.archived_at || space.tierIds.includes(t.id));

  // A paid choice can't be newly picked without payments, and "Paid members"
  // needs a membership to point at. Whatever a space already is stays
  // selectable, so editing never forces a change.
  function unavailable(value: AccessChoice): string | null {
    if (value === initialChoice) return null;
    if ((value === "paid" || value === "tiers") && !paymentsEnabled) return "Connect payments first";
    if (value === "paid" && !tiers.some((t) => !t.archived_at)) return "Create a membership first";
    if (value === "tiers" && visibleTiers.length === 0 && !paymentsEnabled) return "Create a membership first";
    return null;
  }

  const options = ACCESS_CHOICES.map((c) => ({
    ...c,
    // "Paid members" is the memberships on sale now; a membership created
    // later never unlocks this space unless someone ticks it there.
    description: c.value === "paid" && onSaleNames.length ? `Anyone on ${onSaleNames.join(", ")}. New memberships aren't added automatically.` : c.description,
    disabledReason: unavailable(c.value),
  }));
  const enabledIndexes = options.map((o, i) => (o.disabledReason ? -1 : i)).filter((i) => i >= 0);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>, index: number) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", " ", "Enter"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    if (e.key === " " || e.key === "Enter") {
      if (!options[index].disabledReason) setChoice(options[index].value);
      return;
    }
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const pos = enabledIndexes.indexOf(index);
    const next = enabledIndexes[(pos + step + enabledIndexes.length) % enabledIndexes.length];
    setChoice(options[next].value);
    optionRefs.current[next]?.focus();
  }

  const viewers: { label: string; state: AccessState }[] = [
    { label: "Visitors", state: spaceAccessFor(community, preview, { kind: "visitor" }) },
    { label: "Free members", state: spaceAccessFor(community, preview, { kind: "member" }) },
    { label: "Paid members", state: spaceAccessFor(community, preview, { kind: "paid", tierIds: after.tierIds, spaceIds: after.price_cents > 0 ? [space.id] : [] }) },
  ];

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1.5 text-sm font-medium text-foreground">Who can open it?</legend>
      <input type="hidden" name="access_choice" value={choice} />
      <input type="hidden" name="visibility" value={after.visibility} />
      {after.tierIds.map((id) => (
        <input key={id} type="hidden" name="tier_ids" value={id} />
      ))}
      {choice === "tiers" ? null : <input type="hidden" name="price" value="" />}
      <input type="hidden" name="when_locked" value={preview.when_locked ?? ""} />

      <div role="radiogroup" aria-label="Who can open it?" className="grid gap-1.5">
        {options.map((option, index) => {
          const Icon = ICONS[option.value];
          const checked = choice === option.value;
          const disabled = Boolean(option.disabledReason);
          return (
            <div
              key={option.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="radio"
              aria-checked={checked}
              aria-disabled={disabled}
              tabIndex={checked ? 0 : -1}
              onClick={() => !disabled && setChoice(option.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                checked ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40",
                disabled && "cursor-not-allowed opacity-60 hover:border-border"
              )}
            >
              <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md", checked ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{option.label}</span>
                <span className="block text-xs text-muted-foreground">{option.disabledReason ?? option.description}</span>
              </span>
            </div>
          );
        })}
      </div>

      {choice === "tiers" && (
        <div className="space-y-2 rounded-lg border border-border p-3">
          {visibleTiers.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Memberships that unlock it</p>
              {visibleTiers.map((tier) => (
                <label key={tier.id} htmlFor={`${idPrefix}-tier-${tier.id}`} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    id={`${idPrefix}-tier-${tier.id}`}
                    type="checkbox"
                    checked={selectedTierIds.includes(tier.id)}
                    onChange={(e) =>
                      setSelectedTierIds((ids) => (e.target.checked ? [...ids, tier.id] : ids.filter((id) => id !== tier.id)))
                    }
                    className="h-4 w-4 rounded border-border accent-[var(--accent)]"
                  />
                  <span>
                    {tier.name} · {formatMonthly(tier.price_cents, tier.currency)}
                    {tier.archived_at && <span className="text-muted-foreground"> (archived, keeps its members)</span>}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No memberships yet. You can still sell this space on its own below.</p>
          )}
          <div>
            <Label htmlFor={`${idPrefix}-own-price`}>Also sell it on its own (monthly, optional)</Label>
            <div className="flex gap-2">
              <Input
                id={`${idPrefix}-own-price`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={ownPrice}
                onChange={(e) => setOwnPrice(e.target.value)}
                placeholder="0.00"
                disabled={!paymentsEnabled && space.price_cents === 0}
                className="flex-1"
              />
              <span className="flex items-center px-1 text-sm text-muted-foreground" title="Your community's currency, set in Admin → Payments">
                {(space.currency || "usd").toUpperCase()}
              </span>
            </div>
          </div>
          {selectedTierIds.length === 0 && ownPriceCents === 0 && (
            <p className="text-xs text-danger">Pick at least one membership or set a price, or nobody new can get in.</p>
          )}
        </div>
      )}

      {teaserPossible && (
        <label htmlFor={`${idPrefix}-teaser`} className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground">
          <input
            id={`${idPrefix}-teaser`}
            type="checkbox"
            checked={teaser}
            onChange={(e) => setTeaser(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[var(--accent)]"
          />
          <span>
            Show it locked to visitors
            <span className="block text-xs text-muted-foreground">
              People who haven&apos;t joined see its name, short description and cover picture with a lock, so they know
              it&apos;s there. Nothing inside it is shown.
            </span>
          </span>
        </label>
      )}

      <p className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground" aria-live="polite">
        {viewers.map((v) => `${v.label} ${STATE_WORDS[v.state]}`).join(" · ")}.
        {choice !== initialChoice || after.tierIds.join() !== space.tierIds.join() ? ` Now: ${describeSpaceAccess(preview, tiers)}.` : ""}
      </p>
      {narrows.length > 0 && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
          {narrows.map((n) => `${n.who} will ${n.to === "locked" ? "see it locked" : "no longer see it"}`).join(" and ")} when you save.
        </p>
      )}
      {widens.length > 0 && (
        // Opening restricted content to more people is never one click: the
        // form won't submit until this is ticked (the browser enforces
        // `required`, and keyboard users reach it in order).
        <label htmlFor={`${idPrefix}-confirm-widen`} className="flex items-start gap-2 rounded-lg border border-accent bg-accent-soft px-3 py-2 text-xs text-foreground">
          <input
            id={`${idPrefix}-confirm-widen`}
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[var(--accent)]"
          />
          <span>
            I understand {widens.map((w) => w.who.toLowerCase()).join(" and ")} will be able to open everything in &ldquo;{space.name}&rdquo;
            {space.price_cents > 0 || space.tierIds.length > 0 ? ", including content people paid for" : ""}.
          </span>
        </label>
      )}
      {losing.length > 0 && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
          People on {losing.map((t) => t.name).join(", ")} will lose access to this space when you save.
        </p>
      )}
    </fieldset>
  );
}
