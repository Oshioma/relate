import type { CommunityTestimonial } from "@/types/database";

// Limits for the landing page testimonials (Admin -> Landing page).
export const MAX_TESTIMONIALS = 12;
export const MAX_TESTIMONIAL_QUOTE = 1000;
export const MAX_TESTIMONIAL_NAME = 120;

// The stored list, whatever shape the column came back in: only entries with
// some words survive, trimmed. Never throws, so a bad row can't break the page.
export function readTestimonials(value: unknown): CommunityTestimonial[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t): t is Record<string, unknown> => Boolean(t) && typeof t === "object")
    .map((t) => ({
      quote: typeof t.quote === "string" ? t.quote.trim() : "",
      name: typeof t.name === "string" ? t.name.trim() : "",
    }))
    .filter((t) => t.quote.length > 0);
}

// Parse and check what the admin form sent (a JSON list). Rows with no quote
// are dropped, so an empty row left at the end isn't an error.
export function parseTestimonialsInput(
  raw: string
): { ok: true; testimonials: CommunityTestimonial[] } | { ok: false; error: string } {
  let value: unknown;
  try {
    value = raw.trim() ? JSON.parse(raw) : [];
  } catch {
    return { ok: false, error: "The testimonials couldn't be read. Refresh the page and try again." };
  }
  const testimonials = readTestimonials(value);
  if (testimonials.length > MAX_TESTIMONIALS) {
    return { ok: false, error: `Keep it to ${MAX_TESTIMONIALS} testimonials or fewer.` };
  }
  if (testimonials.some((t) => t.quote.length > MAX_TESTIMONIAL_QUOTE)) {
    return { ok: false, error: `Keep each testimonial to ${MAX_TESTIMONIAL_QUOTE} characters or fewer.` };
  }
  if (testimonials.some((t) => t.name.length > MAX_TESTIMONIAL_NAME)) {
    return { ok: false, error: `Keep each name to ${MAX_TESTIMONIAL_NAME} characters or fewer.` };
  }
  return { ok: true, testimonials };
}
