import assert from "node:assert/strict";
import { test } from "node:test";
import {
  businessJsonLd,
  businessSchemaType,
  canonicalUrl,
  communityCanonicalOrigin,
  communitySitemap,
  COMMUNITY_DISALLOW,
  jsonLd,
  metaDescription,
  servingOrigin,
  stayJsonLd,
} from "./seo";

process.env.NEXT_PUBLIC_SITE_URL = "https://relate.click";

const mzungu = { slug: "mzunguzanzibar", custom_domain: "mzunguzanzibar.com", custom_domain_verified_at: "2026-01-01T00:00:00Z" };

test("canonical origin is the custom domain on whichever form serves the page", () => {
  // The domain's host redirects the bare form to www, so a crawler reads www.
  assert.equal(communityCanonicalOrigin("www.mzunguzanzibar.com", mzungu), "https://www.mzunguzanzibar.com");
  assert.equal(communityCanonicalOrigin("mzunguzanzibar.com", mzungu), "https://mzunguzanzibar.com");
  // Rendered on the subdomain (a signed-in member): the verified domain.
  assert.equal(communityCanonicalOrigin("mzunguzanzibar.relate.click", mzungu), "https://mzunguzanzibar.com");
});

test("canonical origin falls back to the subdomain without a verified domain", () => {
  const unverified = { ...mzungu, custom_domain_verified_at: null };
  assert.equal(communityCanonicalOrigin("mzunguzanzibar.relate.click", unverified), "https://mzunguzanzibar.relate.click");
  // Someone else's domain pointed at the app never becomes the canonical.
  assert.equal(communityCanonicalOrigin("evil.example", unverified), "https://mzunguzanzibar.relate.click");
});

test("serving origin swaps in the www form only for the same domain", () => {
  assert.equal(servingOrigin("www.mzunguzanzibar.com", "https://mzunguzanzibar.com"), "https://www.mzunguzanzibar.com");
  assert.equal(servingOrigin("mzunguzanzibar.relate.click", "https://mzunguzanzibar.com"), "https://mzunguzanzibar.com");
  assert.equal(servingOrigin(null, "https://mzunguzanzibar.com"), "https://mzunguzanzibar.com");
});

test("canonical URLs drop query strings and trailing slashes", () => {
  assert.equal(canonicalUrl("https://www.mzunguzanzibar.com", "/"), "https://www.mzunguzanzibar.com/");
  assert.equal(canonicalUrl("https://www.mzunguzanzibar.com/", "/guides/"), "https://www.mzunguzanzibar.com/guides");
  assert.equal(canonicalUrl("https://www.mzunguzanzibar.com", "/?view=feed"), "https://www.mzunguzanzibar.com/");
  assert.equal(canonicalUrl("https://www.mzunguzanzibar.com", "/spaces/business-directory?category=cafe"), "https://www.mzunguzanzibar.com/spaces/business-directory");
});

test("meta descriptions collapse whitespace and clip at a word", () => {
  assert.equal(metaDescription("The digital heartbeat of Zanzibar.\r\nOne platform."), "The digital heartbeat of Zanzibar. One platform.");
  assert.equal(metaDescription("   "), null);
  assert.equal(metaDescription(null), null);
  const long = metaDescription("word ".repeat(60))!;
  assert.ok(long.length <= 161);
  assert.ok(long.endsWith("word…"));
  assert.equal(metaDescription("<p>Fresh <b>fish</b></p>"), "Fresh fish");
});

test("JSON-LD cannot close its script tag early", () => {
  assert.ok(!jsonLd({ description: "</script><script>alert(1)</script>" }).__html.includes("</script>"));
});

test("business categories map to schema.org types", () => {
  assert.equal(businessSchemaType("restaurant"), "Restaurant");
  assert.equal(businessSchemaType("cafe"), "CafeOrCoffeeShop");
  assert.equal(businessSchemaType("boda-boda"), "LocalBusiness");
});

const place = {
  name: "Kendwa Rocks",
  description: "Beach bar and hotel.",
  address: null,
  location_label: "Kendwa",
  lat: -5.75,
  lng: 39.29,
  phone: "+255 777 000 000",
  website: "https://kendwarocks.com",
};
const crumbs = [{ name: "Mzungu Zanzibar", url: "https://www.mzunguzanzibar.com/" }];

test("business JSON-LD carries place details and only on-site ratings", () => {
  const [business, breadcrumbs] = businessJsonLd({
    business: { ...place, category: "restaurant", google_maps_url: null },
    url: "https://www.mzunguzanzibar.com/spaces/business-directory/businesses/kendwa-rocks",
    images: ["https://cdn.example/a.jpg"],
    rating: { avgRating: 4.333, ratingCount: 3 },
    breadcrumbs: crumbs,
  }) as unknown as [Record<string, unknown>, Record<string, unknown>];
  assert.equal(business["@type"], "Restaurant");
  assert.deepEqual(business.geo, { "@type": "GeoCoordinates", latitude: -5.75, longitude: 39.29 });
  assert.deepEqual(business.address, { "@type": "PostalAddress", addressLocality: "Kendwa" });
  assert.equal((business.aggregateRating as { ratingValue: number }).ratingValue, 4.3);
  assert.equal(breadcrumbs["@type"], "BreadcrumbList");

  const [unrated] = businessJsonLd({
    business: { ...place, category: "other", google_maps_url: null },
    url: "https://x/",
    images: [],
    rating: { avgRating: null, ratingCount: 0 },
    breadcrumbs: crumbs,
  }) as unknown as [Record<string, unknown>];
  assert.equal(unrated.aggregateRating, undefined);
  assert.equal(unrated.image, undefined);
});

test("stay JSON-LD gives the lodging type and price", () => {
  const [stay] = stayJsonLd({
    listing: { ...place, accommodation_type: "guesthouse", price_per_night: 80, currency: "USD", price_unit: "per_night", amenities: ["Wi-Fi"], max_guests: 4, bedrooms: 2 },
    url: "https://x/",
    images: [],
    rating: { avgRating: null, ratingCount: 0 },
    breadcrumbs: crumbs,
  }) as unknown as [Record<string, unknown>];
  assert.equal(stay["@type"], "BedAndBreakfast");
  assert.equal(stay.priceRange, "From USD 80 per night");
  assert.equal(stay.numberOfRooms, 2);
});

test("the sitemap lists public pages only, on the canonical origin", () => {
  const entries = communitySitemap({
    origin: "https://www.mzunguzanzibar.com",
    eventsPublic: true,
    guides: [{ slug: "where-to-stay-in-zanzibar", updated_at: "2026-10-12T10:21:27Z" }],
    spaces: [
      { slug: "business-directory", space_type: "business_directory", visibility: "public" },
      { slug: "marketplace", space_type: "marketplace", visibility: "private" },
    ],
    businesses: [
      { slug: "kendwa-rocks", space_slug: "business-directory", updated_at: null },
      { slug: "secret", space_slug: "marketplace", updated_at: null },
    ],
    stays: [],
  });
  const urls = entries.map((e) => e.url);
  assert.ok(urls.includes("https://www.mzunguzanzibar.com/"));
  assert.ok(urls.includes("https://www.mzunguzanzibar.com/guides"));
  assert.ok(urls.includes("https://www.mzunguzanzibar.com/guides/where-to-stay-in-zanzibar"));
  assert.ok(urls.includes("https://www.mzunguzanzibar.com/spaces/business-directory/businesses/kendwa-rocks"));
  assert.ok(urls.includes("https://www.mzunguzanzibar.com/events"));
  assert.ok(!urls.some((u) => u.includes("marketplace")));
});

test("robots rules never block the public membership page", () => {
  // Robots rules are prefix matches; a bare "/members" would block "/membership".
  assert.ok(!COMMUNITY_DISALLOW.includes("/members"));
  const blocks = (path: string) =>
    COMMUNITY_DISALLOW.some((rule) => (rule.endsWith("$") ? path === rule.slice(0, -1) : !rule.includes("*") && path.startsWith(rule)));
  assert.equal(blocks("/membership"), false);
  assert.equal(blocks("/members"), true);
  assert.equal(blocks("/members/oshi"), true);
  assert.equal(blocks("/guides/where-to-stay-in-zanzibar"), false);
});
