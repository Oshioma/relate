// The currencies a community can charge in: the ones Stripe accepts for card
// payments that people here are likeliest to use. Codes are Stripe's lowercase
// ISO 4217. Zero-decimal currencies (JPY, UGX…) are left out on purpose: prices
// are stored in hundredths, which Stripe reads as whole units for those.
export const CURRENCIES: { code: string; label: string }[] = [
  { code: "gbp", label: "British pound (GBP)" },
  { code: "usd", label: "US dollar (USD)" },
  { code: "eur", label: "Euro (EUR)" },
  { code: "cad", label: "Canadian dollar (CAD)" },
  { code: "aud", label: "Australian dollar (AUD)" },
  { code: "nzd", label: "New Zealand dollar (NZD)" },
  { code: "chf", label: "Swiss franc (CHF)" },
  { code: "sek", label: "Swedish krona (SEK)" },
  { code: "nok", label: "Norwegian krone (NOK)" },
  { code: "dkk", label: "Danish krone (DKK)" },
  { code: "zar", label: "South African rand (ZAR)" },
  { code: "kes", label: "Kenyan shilling (KES)" },
  { code: "tzs", label: "Tanzanian shilling (TZS)" },
  { code: "ngn", label: "Nigerian naira (NGN)" },
  { code: "aed", label: "UAE dirham (AED)" },
  { code: "inr", label: "Indian rupee (INR)" },
  { code: "sgd", label: "Singapore dollar (SGD)" },
  { code: "hkd", label: "Hong Kong dollar (HKD)" },
  { code: "mxn", label: "Mexican peso (MXN)" },
  { code: "brl", label: "Brazilian real (BRL)" },
];

export const DEFAULT_CURRENCY = "usd";

export function isSupportedCurrency(code: string): boolean {
  return CURRENCIES.some((c) => c.code === code);
}

// A typed or stored code → a supported lowercase code, or null.
export function normalizeCurrency(raw: unknown): string | null {
  const code = String(raw ?? "").trim().toLowerCase();
  return isSupportedCurrency(code) ? code : null;
}
