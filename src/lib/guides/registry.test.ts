import { test } from "node:test";
import assert from "node:assert/strict";
import { editorialGuideEntry } from "./registry";

// Guide cards carry a short name; the full, imaginative title heads the guide.
const CARD_TITLES: Record<string, string> = {
  "where-to-stay-in-zanzibar": "Where to Stay",
  "best-boutique-hotels-zanzibar": "Boutique Hotels",
  "best-luxury-resorts-zanzibar": "Luxury Hotels",
  "most-picturesque-places-zanzibar": "Picturesque",
  "best-restaurants-zanzibar": "Restaurants",
  "zanzibar-beach-bars": "Beach Bars",
  "zanzibar-adventures": "Adventure",
  "getting-around-zanzibar": "Transport",
};

test("every guide card has a short, simple title", () => {
  for (const [slug, title] of Object.entries(CARD_TITLES)) {
    assert.equal(editorialGuideEntry(slug)?.cardTitle, title, slug);
  }
});
