// Search-engine plumbing shared by the community pages, robots.txt and
// sitemap.xml: which origin a community's canonical URLs live on, the clean
// path a page answers to, meta-description trimming, and the JSON-LD blocks
// for businesses, stays and the community itself. Nothing here touches the
// database or server-only APIs, so it is unit-tested directly
// (src/lib/seo.test.ts).

import { communityShareOrigin, communitySubdomainUrl, wwwCounterpart } from "@/lib/custom-domain";

// The proxy hands the page the clean path it was asked for on a community's
// host (/guides, not /c/<slug>/guides) in this request header, so layouts can
// write a canonical link for every page without each page building its own.
// The proxy always overwrites or strips it, so a client cannot inject one.
export const SEO_PATH_HEADER = "x-relate-path";

type CommunityDomain = { slug: string; custom_domain: string | null; custom_domain_verified_at: string | null };

function bareHostname(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().replace(/:\d+$/, "");
}

// The origin a community's pages should be indexed under. With a verified
// custom domain that is the domain, but on whichever of its bare / www forms
// actually serves the page: the domain's host redirects one to the other
// (mzunguzanzibar.com -> www.mzunguzanzibar.com), and a canonical link that
// points at a redirect is a mixed signal search engines may ignore. A crawler
// is always signed out, so it always lands on the serving form and reads that
// host here. Rendered anywhere else (a member on the subdomain) the verified
// domain itself is the best answer we have. Without a custom domain it is the
// community's automatic subdomain, or null where that doesn't resolve (dev).
export function communityCanonicalOrigin(host: string | null | undefined, community: CommunityDomain): string | null {
  const shareOrigin = communityShareOrigin(community);
  if (shareOrigin && community.custom_domain) {
    const hostname = bareHostname(host);
    const domain = community.custom_domain.toLowerCase();
    if (hostname && (hostname === domain || wwwCounterpart(hostname) === domain)) return `https://${hostname}`;
    return shareOrigin;
  }
  return communitySubdomainUrl(community.slug);
}

// Same rule for a page that only knows the share origin (the guide pages,
// whose URLs are built by guideUrl): swap it for the host serving the request
// when that host is the same domain in its other www / bare form.
export function servingOrigin(host: string | null | undefined, shareOrigin: string): string {
  const hostname = bareHostname(host);
  const domain = bareHostname(shareOrigin.replace(/^https?:\/\//i, "").replace(/\/.*$/, ""));
  if (hostname && hostname !== domain && wwwCounterpart(hostname) === domain) return `https://${hostname}`;
  return shareOrigin;
}

// The canonical URL for a clean path on a community origin, without its query
// string or fragment: filters, ?view=feed and tracking parameters all collapse
// onto the one page.
export function canonicalUrl(origin: string, path: string): string {
  const clean = path.replace(/[?#].*$/, "") || "/";
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return `${origin.replace(/\/+$/, "")}${withSlash === "/" ? "/" : withSlash.replace(/\/+$/, "")}`;
}

// A meta description: whitespace (including the \r\n owners paste in)
// collapsed, and clipped at a word boundary to ~160 characters, about what a
// search result shows before truncating.
export function metaDescription(text: string | null | undefined, max = 160): string | null {
  const flat = (text ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!flat) return null;
  if (flat.length <= max) return flat;
  const clipped = flat.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[\s,;:.–—-]+$/, "")}…`;
}

// Only absolute http(s) URLs may go into Open Graph or JSON-LD unaided; a
// relative one is resolved against the page's origin when there is one.
export function absoluteUrl(src: string | null | undefined, origin: string | null): string | null {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (!origin || !src.startsWith("/")) return null;
  return `${origin.replace(/\/+$/, "")}${src}`;
}

// A JSON-LD <script> body. "<" is escaped so a stray "</script>" inside a
// listing's description can't close the tag early.
export function jsonLd(value: unknown) {
  return { __html: JSON.stringify(value).replace(/</g, "\\u003c") };
}

// The community's front page: who publishes the site (Organization) and the
// site itself (WebSite), which is what lets a search engine show the site
// name rather than the bare domain above the result.
export function communitySiteJsonLd(input: { name: string; description: string | null; url: string; logo: string | null; image: string | null }) {
  const organization = {
    "@type": "Organization",
    "@id": `${input.url}#organization`,
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.description ? { description: input.description } : {}),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${input.url}#website`,
    name: input.name,
    url: input.url,
    inLanguage: "en",
    publisher: { "@id": `${input.url}#organization` },
    ...(input.description ? { description: input.description } : {}),
  };
  return { "@context": "https://schema.org", "@graph": [organization, website] };
}

// schema.org's LocalBusiness subtypes for the built-in directory categories;
// anything else (custom categories included) is a plain LocalBusiness.
const BUSINESS_SCHEMA_TYPES: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  bar: "BarOrPub",
  accommodation: "LodgingBusiness",
  shop: "Store",
  health: "HealthAndBeautyBusiness",
  fitness: "SportsActivityLocation",
  activity: "TouristAttraction",
  taxi: "TaxiService",
};

export function businessSchemaType(category: string): string {
  return BUSINESS_SCHEMA_TYPES[category] ?? "LocalBusiness";
}

type Rating = { avgRating: number | null; ratingCount: number };

// Only this site's own member reviews count: search engines don't accept
// ratings copied from another site (the Google rating shown on the page) as
// structured data.
function aggregateRating({ avgRating, ratingCount }: Rating) {
  if (!avgRating || ratingCount < 1) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.round(avgRating * 10) / 10,
      reviewCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

type Place = {
  name: string;
  description: string | null;
  address: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
};

function placeFields(place: Place, url: string, images: string[]) {
  const address = place.address?.trim() || null;
  const locality = place.location_label?.trim() || null;
  return {
    name: place.name,
    url,
    ...(metaDescription(place.description, 500) ? { description: metaDescription(place.description, 500) } : {}),
    ...(images.length ? { image: images } : {}),
    ...(place.phone?.trim() ? { telephone: place.phone.trim() } : {}),
    ...(address || locality
      ? {
          address: {
            "@type": "PostalAddress",
            ...(address ? { streetAddress: address } : {}),
            ...(locality ? { addressLocality: locality } : {}),
          },
        }
      : {}),
    ...(place.lat != null && place.lng != null ? { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } } : {}),
    ...(place.website && /^https?:\/\//i.test(place.website) ? { sameAs: [place.website] } : {}),
  };
}

export function businessJsonLd(input: {
  business: Place & { category: string; google_maps_url: string | null };
  url: string;
  images: string[];
  rating: Rating;
  breadcrumbs: { name: string; url: string }[];
}) {
  const { business } = input;
  const place = placeFields(business, input.url, input.images);
  return [
    {
      "@context": "https://schema.org",
      "@type": businessSchemaType(business.category),
      "@id": `${input.url}#business`,
      ...place,
      ...(business.google_maps_url ? { hasMap: business.google_maps_url } : {}),
      ...aggregateRating(input.rating),
    },
    breadcrumbJsonLd(input.breadcrumbs),
  ];
}

const STAY_SCHEMA_TYPES: Record<string, string> = {
  hotel: "Hotel",
  hostel: "Hostel",
  guesthouse: "BedAndBreakfast",
  camping: "Campground",
};

export function stayJsonLd(input: {
  listing: Place & {
    accommodation_type: string;
    price_per_night: number | null;
    currency: string | null;
    price_unit: string | null;
    amenities: string[] | null;
    max_guests: number | null;
    bedrooms: number | null;
  };
  url: string;
  images: string[];
  rating: Rating;
  breadcrumbs: { name: string; url: string }[];
}) {
  const { listing } = input;
  const unit = listing.price_unit === "per_week" ? "week" : listing.price_unit === "per_month" ? "month" : "night";
  const price = listing.price_per_night != null && listing.currency ? `From ${listing.currency} ${listing.price_per_night} per ${unit}` : null;
  return [
    {
      "@context": "https://schema.org",
      "@type": STAY_SCHEMA_TYPES[listing.accommodation_type] ?? "LodgingBusiness",
      "@id": `${input.url}#stay`,
      ...placeFields(listing, input.url, input.images),
      ...(price ? { priceRange: price } : {}),
      ...(listing.amenities?.length
        ? { amenityFeature: listing.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })) }
        : {}),
      ...(listing.max_guests ? { maximumAttendeeCapacity: listing.max_guests } : {}),
      ...(listing.bedrooms ? { numberOfRooms: listing.bedrooms } : {}),
      ...aggregateRating(input.rating),
    },
    breadcrumbJsonLd(input.breadcrumbs),
  ];
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
  };
}

// robots.txt for a community's host. Everything a guest can read is open; the
// member-only and account areas are kept out of the crawl (they only bounce a
// crawler to the sign-in page anyway). Robots rules are prefix matches, so
// "/members" is written as "/members$" and "/members/" — a bare "/members"
// would also block "/membership", the public price list.
export const COMMUNITY_DISALLOW = [
  "/admin",
  "/inbox",
  "/members$",
  "/members/",
  "/settings",
  "/dashboard",
  "/messages",
  "/notifications",
  "/login",
  "/signup",
  "/forgot-password",
  "/auth/",
  "/api/",
  "/invite/",
  "/guides/*/edit",
  "/*/manage",
  "/*?view=feed",
];

export const PLATFORM_DISALLOW = [
  "/dashboard",
  "/settings",
  "/messages",
  "/notifications",
  "/platform-admin",
  "/communities",
  "/auth/",
  "/api/",
  "/invite/",
  "/welcome/",
];

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
};

// Every page of a community a guest can read and a search engine should know
// about, as clean URLs on its canonical origin. The caller passes only rows a
// signed-out visitor can see (it reads them with a cookie-free client), so
// nothing here re-checks visibility beyond the public-space rule.
export function communitySitemap(input: {
  origin: string;
  eventsPublic: boolean;
  guides: { slug: string; updated_at: string | null }[];
  spaces: { slug: string; space_type: string; visibility: string }[];
  businesses: { slug: string | null; space_slug: string; updated_at: string | null }[];
  stays: { slug: string | null; space_slug: string; updated_at: string | null }[];
}): SitemapEntry[] {
  const at = (path: string) => canonicalUrl(input.origin, path);
  const entries: SitemapEntry[] = [{ url: at("/"), changeFrequency: "daily", priority: 1 }];

  if (input.guides.length) {
    const newest = input.guides.map((g) => g.updated_at).filter((d): d is string => Boolean(d)).sort().at(-1);
    entries.push({ url: at("/guides"), changeFrequency: "weekly", priority: 0.9, ...(newest ? { lastModified: newest } : {}) });
    for (const guide of input.guides) {
      entries.push({ url: at(`/guides/${guide.slug}`), changeFrequency: "weekly", priority: 0.9, ...(guide.updated_at ? { lastModified: guide.updated_at } : {}) });
    }
  }

  const publicSpaces = input.spaces.filter((s) => s.visibility === "public");
  for (const space of publicSpaces) {
    entries.push({ url: at(`/spaces/${space.slug}`), changeFrequency: "daily", priority: 0.7 });
  }
  const publicSlugs = new Set(publicSpaces.map((s) => s.slug));

  for (const business of input.businesses) {
    if (!business.slug || !publicSlugs.has(business.space_slug)) continue;
    entries.push({
      url: at(`/spaces/${business.space_slug}/businesses/${business.slug}`),
      changeFrequency: "monthly",
      priority: 0.6,
      ...(business.updated_at ? { lastModified: business.updated_at } : {}),
    });
  }
  for (const stay of input.stays) {
    if (!stay.slug || !publicSlugs.has(stay.space_slug)) continue;
    entries.push({
      url: at(`/spaces/${stay.space_slug}/stays/${stay.slug}`),
      changeFrequency: "weekly",
      priority: 0.7,
      ...(stay.updated_at ? { lastModified: stay.updated_at } : {}),
    });
  }

  if (input.eventsPublic) entries.push({ url: at("/events"), changeFrequency: "daily", priority: 0.6 });
  entries.push({ url: at("/membership"), changeFrequency: "monthly", priority: 0.4 });
  entries.push({ url: at("/contact"), changeFrequency: "monthly", priority: 0.3 });
  return entries;
}
