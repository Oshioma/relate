// The line of text Stripe Checkout shows under a membership's name: the tier's
// own description, then the spaces it unlocks. Stripe shows it as one
// paragraph, so line breaks are folded into spaces. Empty -> undefined, so the
// field is left off the request.
export function tierCheckoutDescription(description: string | null | undefined, spaceNames: string[]): string | undefined {
  const parts: string[] = [];
  const text = String(description ?? "").replace(/\s+/g, " ").trim();
  if (text) parts.push(text);
  const names = spaceNames.map((n) => n.trim()).filter(Boolean);
  if (names.length > 0) parts.push(`Unlocks: ${names.join(", ")}.`);
  const joined = parts.join(" ");
  if (!joined) return undefined;
  return joined.length > 1000 ? `${joined.slice(0, 999).trimEnd()}…` : joined;
}
