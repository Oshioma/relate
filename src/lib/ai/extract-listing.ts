import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { ACCOMMODATION_TYPES, ACCOMMODATION_PRICE_UNITS, ACCOMMODATION_AMENITIES } from "@/lib/accommodation-types";
import { EMPTY_DRAFT, type ListingDraft, type ListingImportKind } from "@/lib/listing-draft";
import type { PageContent } from "@/lib/page-content";
import type { BusinessCategory, AccommodationType, AccommodationPriceUnit } from "@/types/database";

// Turns a pasted listing page (Booking.com, Airbnb, a hotel's own site …) into
// a form draft. The model's only job is extraction: everything it returns has
// to be present in the page we hand it, and anything absent is left out so the
// field stays empty rather than plausibly wrong.

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 1500;

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export function isListingExtractionConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const SYSTEM_PROMPT = `You extract structured listing details from a web page that a community member pasted a link to, so a directory form can be pre-filled.

Rules, in order of importance:
1. Only report details that appear in the supplied page content. If a field isn't stated, omit it. Never guess, never infer from the brand name, never fill a field from general knowledge about the place.
2. Prefer the JSON-LD block when it disagrees with the page text — it is the site's own structured data.
3. The description must be your own neutral one-or-two-sentence summary of what the place is and what stands out, drawn only from the page. No marketing superlatives, no invented amenities, no quotes, no emoji, max 300 characters.
4. Ignore the surrounding site: navigation, cookie banners, "other properties you may like", review carousels for different places, and prices for unrelated listings are all noise. If the page describes several properties, use only the main one the URL points at.
5. Prices must be the listing's own nightly/weekly/monthly rate as a plain number, with its ISO currency code. Do not convert currencies. Skip a price if it is a total for a specific date range, a discount, or a "from" price you can't attribute confidently.
6. If the page is a login wall, captcha, error page, or otherwise doesn't describe the place, call the tool with no fields set.`;

// Field schemas shared by both kinds. Every field is optional — the model
// omitting one is how it says "not stated on the page".
const COMMON_PROPERTIES: Record<string, unknown> = {
  name: { type: "string", description: "The official name of the place, without the site's suffixes (no ' - Booking.com', no city appended)." },
  description: { type: "string", description: "Your neutral 1-2 sentence summary, max 300 characters." },
  address: { type: "string", description: "Full street address as printed on the page." },
  location_label: {
    type: "string",
    description: "Just the village, neighbourhood or beach the place is in (e.g. 'Kendwa', 'Jambiani') — not the country, not the full address.",
  },
  website: { type: "string", description: "The place's OWN website, only if the page links to it. Never the booking site's URL." },
  phone: { type: "string", description: "Contact phone number in international format if shown." },
  lat: { type: "number", description: "Latitude, only if the page states coordinates." },
  lng: { type: "number", description: "Longitude, only if the page states coordinates." },
};

function businessSchema(categories: string[]): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      ...COMMON_PROPERTIES,
      category: {
        type: "string",
        enum: categories,
        description: "The category that best fits what this place is.",
      },
      is_local: {
        type: "boolean",
        description: "True only if the page makes clear it is an independent, locally owned business rather than part of an international chain.",
      },
      opening_hours: {
        type: "array",
        description: "Weekly opening hours, one entry per day the page lists. Omit entirely unless the page shows a real schedule.",
        items: {
          type: "object",
          properties: {
            day: { type: "integer", minimum: 0, maximum: 6, description: "0 = Sunday, 6 = Saturday." },
            closed: { type: "boolean", description: "True if the place is closed that day." },
            open: { type: "string", description: "Opening time, 24h 'HH:MM'." },
            close: { type: "string", description: "Closing time, 24h 'HH:MM'." },
          },
          required: ["day"],
        },
      },
    },
  };
}

function accommodationSchema(): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      ...COMMON_PROPERTIES,
      accommodation_type: {
        type: "string",
        enum: ACCOMMODATION_TYPES.map((t) => t.value),
        description: "What kind of stay this is.",
      },
      price: { type: "number", description: "The rate as a plain number, no currency symbol or thousands separator." },
      price_unit: { type: "string", enum: ACCOMMODATION_PRICE_UNITS.map((u) => u.value), description: "What the price covers." },
      currency: { type: "string", description: "ISO 4217 code for the price, e.g. 'USD', 'EUR', 'TZS'." },
      bedrooms: { type: "integer", minimum: 0 },
      bathrooms: { type: "integer", minimum: 0 },
      max_guests: { type: "integer", minimum: 0, description: "How many guests the listing sleeps." },
      amenities: {
        type: "array",
        description: "Only amenities the page explicitly lists for this property.",
        items: { type: "string", enum: ACCOMMODATION_AMENITIES.map((a) => a.value) },
      },
    },
  };
}

type RawDay = { day?: number; closed?: boolean; open?: string; close?: string };

type RawExtraction = {
  name?: string;
  description?: string;
  address?: string;
  location_label?: string;
  website?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  category?: string;
  is_local?: boolean;
  opening_hours?: RawDay[];
  accommodation_type?: string;
  price?: number;
  price_unit?: string;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  amenities?: string[];
};

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const MAX_DESCRIPTION = 300;

function text(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100 ? value : null;
}

function coordinate(value: unknown, limit: number): number | null {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit ? value : null;
}

function httpUrl(value: unknown): string | null {
  const raw = text(value, 500);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

// The model returns hours as a day list because a flat array is far easier for
// it to get right than our "0".."6" keyed object; we rebuild the object here.
function toSchedule(days: RawDay[] | undefined): ListingDraft["opening_hours"] {
  if (!Array.isArray(days) || days.length === 0) return null;

  const schedule: NonNullable<ListingDraft["opening_hours"]> = {};
  let hasOpen = false;
  for (const entry of days) {
    if (typeof entry?.day !== "number" || entry.day < 0 || entry.day > 6) continue;
    const key = String(Math.trunc(entry.day));
    if (entry.closed) {
      schedule[key] = { closed: true, open: "09:00", close: "17:00" };
      continue;
    }
    if (typeof entry.open !== "string" || typeof entry.close !== "string") continue;
    if (!HHMM.test(entry.open) || !HHMM.test(entry.close) || entry.close <= entry.open) continue;
    schedule[key] = { closed: false, open: entry.open, close: entry.close };
    hasOpen = true;
  }
  if (!hasOpen) return null;
  for (const day of ["0", "1", "2", "3", "4", "5", "6"]) {
    if (!schedule[day]) schedule[day] = { closed: true, open: "09:00", close: "17:00" };
  }
  return schedule;
}

function toDraft(raw: RawExtraction, kind: ListingImportKind, categories: string[]): ListingDraft {
  const amenities = new Set(ACCOMMODATION_AMENITIES.map((a) => a.value));
  const accommodationTypes = new Set(ACCOMMODATION_TYPES.map((t) => t.value));
  const priceUnits = new Set(ACCOMMODATION_PRICE_UNITS.map((u) => u.value));
  const currency = text(raw.currency, 8);

  return {
    ...EMPTY_DRAFT,
    name: text(raw.name, 120),
    description: text(raw.description, MAX_DESCRIPTION),
    address: text(raw.address, 240),
    location_label: text(raw.location_label, 80),
    website: httpUrl(raw.website),
    phone: text(raw.phone, 40),
    lat: coordinate(raw.lat, 90),
    lng: coordinate(raw.lng, 180),

    category: kind === "business" && raw.category && categories.includes(raw.category) ? (raw.category as BusinessCategory) : null,
    is_local: kind === "business" && typeof raw.is_local === "boolean" ? raw.is_local : null,
    opening_hours: kind === "business" ? toSchedule(raw.opening_hours) : null,

    accommodation_type:
      kind === "accommodation" && raw.accommodation_type && accommodationTypes.has(raw.accommodation_type as AccommodationType)
        ? (raw.accommodation_type as AccommodationType)
        : null,
    price: kind === "accommodation" && typeof raw.price === "number" && Number.isFinite(raw.price) && raw.price > 0 ? raw.price : null,
    price_unit:
      kind === "accommodation" && raw.price_unit && priceUnits.has(raw.price_unit as AccommodationPriceUnit)
        ? (raw.price_unit as AccommodationPriceUnit)
        : null,
    currency: kind === "accommodation" && currency && /^[A-Za-z]{3}$/.test(currency) ? currency.toUpperCase() : null,
    bedrooms: kind === "accommodation" ? count(raw.bedrooms) : null,
    bathrooms: kind === "accommodation" ? count(raw.bathrooms) : null,
    max_guests: kind === "accommodation" ? count(raw.max_guests) : null,
    amenities:
      kind === "accommodation" && Array.isArray(raw.amenities)
        ? [...new Set(raw.amenities.filter((a): a is string => typeof a === "string" && amenities.has(a)))]
        : [],
  };
}

function buildPrompt(url: string, page: PageContent | null): string {
  const parts = [`URL the member pasted: ${url}`];

  if (!page) {
    parts.push(
      "",
      "The page itself could not be fetched, so there is NO page content below.",
      "Extract ONLY what the URL string itself literally encodes — typically the place's name and its town from the path slug.",
      "Do not set any other field. Do not describe the place. Do not guess its category, price, or address."
    );
    return parts.join("\n");
  }

  parts.push(`Final URL after redirects: ${page.finalUrl}`);
  if (page.title) parts.push(`Page title: ${page.title}`);
  if (page.description) parts.push(`Page meta description: ${page.description}`);
  if (page.jsonLd.length > 0) parts.push("", "Structured data (schema.org JSON-LD) from the page:", ...page.jsonLd);
  parts.push("", "Visible page text:", page.text);
  return parts.join("\n");
}

// Returns null when extraction isn't configured or the call fails — callers
// fall back to whatever the Google Places / URL paths produced.
export async function extractListingWithAi({
  url,
  kind,
  page,
  categories,
}: {
  url: string;
  kind: ListingImportKind;
  page: PageContent | null;
  categories: string[];
}): Promise<ListingDraft | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const schema = kind === "business" ? businessSchema(categories) : accommodationSchema();

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: "save_listing",
          description:
            kind === "business"
              ? "Record the directory listing details found on the page. Omit every field the page does not state."
              : "Record the accommodation listing details found on the page. Omit every field the page does not state.",
          input_schema: schema as Anthropic.Tool["input_schema"],
        },
      ],
      tool_choice: { type: "tool", name: "save_listing" },
      messages: [{ role: "user", content: buildPrompt(url, page) }],
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") return null;
    return toDraft(toolUse.input as RawExtraction, kind, categories);
  } catch {
    return null;
  }
}
