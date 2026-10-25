// The line Stripe Checkout shows under a membership's name. Stripe renders it
// as small grey text folded behind a toggle, so it carries only what the plan
// unlocks; the full description is on the community's Membership page, read
// before Join. Nothing to say -> undefined, so the field is left off.
export function tierCheckoutDescription(spaceNames: string[]): string | undefined {
  const names = spaceNames.map((n) => n.trim()).filter(Boolean);
  if (names.length === 0) return undefined;
  const text = `Unlocks: ${names.join(", ").replace(/[.\s]+$/, "")}.`;
  return text.length > 1000 ? `${text.slice(0, 999).trimEnd()}…` : text;
}
