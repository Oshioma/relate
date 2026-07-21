// =============================================================================
// Place-Based Community Blueprint — data-model foundation.
//
// This file is intentionally NOT wired into src/types/database.ts / Database
// yet. None of these tables exist in supabase/schema.sql today. They document
// the shape every future Place feature (Explore Map, Marketplace, Business
// Directory, Guides, Clubs, Volunteer Hub, Jobs, Accommodation) should
// converge on, so each can be built independently without re-deriving its
// schema from scratch — and so they stay interoperable with each other and
// with the "Living Map" (every entity that can have a location, does).
//
// What already exists and should NOT be redefined here:
//   - Event               → src/types/database.ts (events table)
//   - Business            → src/types/database.ts (businesses table — the
//                           Business Directory space's core entity)
//   - BusinessProfile     → src/types/database.ts (a member's own business
//                           profile page; distinct from `Business`, which is
//                           a place-scoped directory/map listing any member
//                           can add, with or without being the owner)
//   - MapCategory         → src/types/database.ts (map_categories table — a
//                           community's togglable Explore Map layers)
//   - Landmark            → src/types/database.ts (landmarks table — a pin
//                           on the Explore Map that isn't already a Business)
//   - MarketplaceListing  → src/types/database.ts (marketplace_listings table)
//   - JobListing          → src/types/database.ts (job_listings table)
//
// When a feature here actually gets built, move its type into database.ts
// alongside a real migration and delete it from this file.
// =============================================================================

/** A point on the Explore Map. Both fields are set together, or neither is. */
export interface GeoLocation {
  lat: number;
  lng: number;
}

/**
 * Composed into any entity that can appear on the Living Map: a marketplace
 * listing at the seller's pickup point, a discussion tied to a beach, a
 * volunteer request where help is needed, a photo where it was taken. See
 * Post/Event in database.ts for the two entities that already have these
 * columns for real.
 */
export interface MapPinnable {
  location: GeoLocation | null;
  location_label: string | null;
}

/** A walking trail, boat route, transit line or similar path — a Route is a sequence of GeoLocation points rather than a single pin. */
export interface Route {
  id: string;
  community_id: string;
  name: string;
  description: string | null;
  points: GeoLocation[];
  distance_meters: number | null;
  created_by: string;
  created_at: string;
}

export type AccommodationType = "hotel" | "hostel" | "guesthouse" | "holiday_rental" | "long_term_rental" | "house_share" | "camping";

/** One listing in the Accommodation space. */
export interface Accommodation extends MapPinnable {
  id: string;
  community_id: string;
  space_id: string;
  listed_by: string;
  accommodation_type: AccommodationType;
  name: string;
  description: string | null;
  photo_urls: string[];
  price_per_night: number | null;
  currency: string | null;
  booking_url: string | null;
  created_at: string;
}

/** A member-written guide (Best Coffee, Hidden Gems, Moving Here, …) in the Guides space. Highlights zero or more places it references. */
export interface Guide {
  id: string;
  community_id: string;
  space_id: string;
  title: string;
  body: string;
  featured: boolean;
  landmark_ids: string[];
  business_ids: string[];
  contributor_ids: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** A subcommunity in the Clubs & Groups space — a full community-within-a-community with its own members and a usual meeting location. */
export interface Club extends MapPinnable {
  id: string;
  community_id: string;
  space_id: string;
  name: string;
  description: string | null;
  category: string | null;
  created_by: string;
  created_at: string;
}

export type VolunteerProjectStatus = "open" | "in_progress" | "completed";

/** A project, cause or one-off request in the Volunteer Hub space. */
export interface VolunteerProject extends MapPinnable {
  id: string;
  community_id: string;
  space_id: string;
  organiser_id: string;
  organisation_id: string | null;
  title: string;
  description: string;
  status: VolunteerProjectStatus;
  volunteers_needed: number | null;
  created_at: string;
}

/** A member recommendation for a restaurant, activity, service, professional, walk, viewpoint, or contractor — searchable across the whole community. */
export interface Recommendation extends MapPinnable {
  id: string;
  community_id: string;
  space_id: string;
  recommended_by: string;
  category: string;
  title: string;
  note: string;
  business_id: string | null;
  landmark_id: string | null;
  created_at: string;
}

/** A star rating + comment against a Business, Guide, Accommodation or MarketplaceListing. One `target_type`/`target_id` pair, rather than a table per entity. */
export interface Review {
  id: string;
  community_id: string;
  author_id: string;
  target_type: "business" | "guide" | "accommodation" | "marketplace_listing" | "landmark";
  target_id: string;
  rating: number;
  body: string | null;
  created_at: string;
}

/** A non-profit, club, government body or similar organisation operating in the community — the entity Volunteer Projects and some Business listings can belong to. */
export interface Organisation {
  id: string;
  community_id: string;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  verified: boolean;
  created_at: string;
}

/** A police, fire, hospital or other emergency contact — shown on the map's Emergency Services layer and in the community's Guides. */
export interface EmergencyContact {
  id: string;
  community_id: string;
  name: string;
  category: string;
  phone: string | null;
  location: GeoLocation | null;
  notes: string | null;
}

/** A bus stop, ferry terminal, train station or similar transport node, feeding the map's Public Transport layer. */
export interface TransportStop extends MapPinnable {
  id: string;
  community_id: string;
  name: string;
  mode: "bus" | "ferry" | "train" | "tram" | "other";
  routes: string[];
}

/**
 * The place itself, at whatever scale the creator chose (island, city, campus,
 * …). Communities already carry location_type/location_name directly (see
 * database.ts) for the common case of one community = one place; this
 * richer record is for the future case of a community spanning multiple
 * named places (a Region community with several Towns inside it, a Country
 * community with several Cities), each with its own map centre and bounds.
 */
export interface Place {
  id: string;
  community_id: string;
  parent_place_id: string | null;
  name: string;
  location_type: string;
  center: GeoLocation;
  bounds: { northeast: GeoLocation; southwest: GeoLocation } | null;
}
