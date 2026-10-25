import type { CreatorTestimonial } from "@/types/database";

// Creator quotes on the platform homepage (Platform admin -> Homepage). The
// homepage shows up to HOMEPAGE_TESTIMONIALS quotes in all, these first, then
// real member quotes from the featured communities.
export const MAX_CREATOR_TESTIMONIALS = 6;
export const MAX_CREATOR_QUOTE = 400;
export const MAX_CREATOR_NAME = 80;
export const MAX_CREATOR_ROLE = 120;
export const HOMEPAGE_TESTIMONIALS = 3;

// The stored list, whatever shape the column came back in: only entries with a
// quote survive, trimmed. Never throws, so a bad row can't break the homepage.
export function readCreatorTestimonials(value: unknown): CreatorTestimonial[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t): t is Record<string, unknown> => Boolean(t) && typeof t === "object")
    .map((t) => ({
      quote: typeof t.quote === "string" ? t.quote.trim() : "",
      name: typeof t.name === "string" ? t.name.trim() : "",
      role: typeof t.role === "string" ? t.role.trim() : "",
    }))
    .filter((t) => t.quote.length > 0);
}

// The admin form's rows (quote_<i>, name_<i>, role_<i>), checked. Rows with no
// quote are dropped, so the spare empty rows aren't an error.
export function parseCreatorTestimonialsForm(
  formData: FormData
): { ok: true; testimonials: CreatorTestimonial[] } | { ok: false; error: string } {
  const rows = Array.from({ length: MAX_CREATOR_TESTIMONIALS }, (_, i) => ({
    quote: String(formData.get(`quote_${i}`) ?? ""),
    name: String(formData.get(`name_${i}`) ?? ""),
    role: String(formData.get(`role_${i}`) ?? ""),
  }));
  const testimonials = readCreatorTestimonials(rows);
  if (testimonials.some((t) => t.quote.length > MAX_CREATOR_QUOTE)) {
    return { ok: false, error: `Keep each quote to ${MAX_CREATOR_QUOTE} characters or fewer.` };
  }
  if (testimonials.some((t) => t.name.length > MAX_CREATOR_NAME)) {
    return { ok: false, error: `Keep each name to ${MAX_CREATOR_NAME} characters or fewer.` };
  }
  if (testimonials.some((t) => t.role.length > MAX_CREATOR_ROLE)) {
    return { ok: false, error: `Keep each "who they are" line to ${MAX_CREATOR_ROLE} characters or fewer.` };
  }
  return { ok: true, testimonials };
}
