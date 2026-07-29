// Hand-written types mirroring supabase/schema.sql.
// If the schema changes, update these alongside it.
//
// NOTE: these must be `type` aliases, not `interface`s. Interfaces don't
// structurally satisfy `Record<string, unknown>` in TypeScript's `extends`
// checks (they support declaration merging, so the compiler can't assume a
// closed shape), which breaks the `GenericTable` constraint that
// @supabase/postgrest-js uses to type `.insert()` / `.update()` — every
// table's Row/Insert/Update silently degrades to `never`.

export type MembershipRole = "owner" | "admin" | "moderator" | "member";
export type MembershipStatus = "active" | "invited" | "banned";
export type CommunityPrivacy = "public" | "private" | "invite_only";
export type SpaceVisibility = "public" | "members" | "private";
export type SpaceType =
  | "discussion"
  | "journal"
  | "gallery"
  | "resources"
  | "directory"
  | "challenges"
  | "growth_journey"
  | "qa"
  | "custom"
  | "map"
  | "marketplace"
  | "business_directory"
  | "guides"
  | "clubs"
  | "volunteer_hub"
  | "jobs"
  | "accommodation"
  | "recommendations"
  | "course"
  | "crop_guides"
  | "plant_scanner"
  | "my_crops"
  | "plant_id"
  | "live";
export type PostType = "discussion" | "announcement" | "resource";
export type ResourceType = "link" | "file" | "video" | "document";
export type BuiltInBusinessCategory = "restaurant" | "cafe" | "shop" | "accommodation" | "service" | "health" | "fitness" | "coworking" | "activity" | "taxi" | "other";
// Stored as text: a built-in value above, or the slug of a per-space custom
// category (business_custom_categories) staff added — e.g. "fundi". The
// `string & {}` keeps built-in autocomplete while allowing any slug.
export type BusinessCategory = BuiltInBusinessCategory | (string & {});
export type MarketplaceListingType = "goods" | "services" | "property" | "vehicles" | "jobs" | "free" | "wanted" | "experiences" | "tickets";
export type MarketplaceListingStatus = "active" | "sold" | "expired";
export type JobType = "full_time" | "part_time" | "volunteer" | "remote" | "internship" | "seasonal";
export type JobListingStatus = "open" | "closed";
export type AccommodationType = "hotel" | "hostel" | "guesthouse" | "holiday_rental" | "long_term_rental" | "house_share" | "camping";
export type AccommodationStatus = "available" | "unavailable";
export type AccommodationPriceUnit = "per_night" | "per_week" | "per_month";
export type RecommendationCategory = "restaurant" | "cafe" | "activity" | "service" | "professional" | "walk" | "viewpoint" | "contractor" | "other";
export type VolunteerProjectStatus = "open" | "in_progress" | "completed";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  profession: string | null;
  company: string | null;
  website: string | null;
  social_links: Record<string, string>;
  contribution_score: number;
  last_active_at: string | null;
  hide_profile: boolean;
  hide_online_status: boolean;
  hide_communities: boolean;
  hide_social_links: boolean;
  hide_business_profile: boolean;
  is_discoverable: boolean;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
};

// location_type/location_name back the Place-Based Community blueprint's
// "what kind of place is this?" wizard step (see src/lib/community-templates.ts).
// Both are free text rather than a DB enum: location_type is validated
// against PLACE_LOCATION_TYPES at the application layer, which keeps adding
// new place kinds a code-only change. Both stay null for every non-place
// template.
export type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  owner_id: string;
  privacy: CommunityPrivacy;
  // Who can see the Members list/page — independent of `privacy` above.
  // The page always requires a signed-in user regardless of this setting.
  // 'public' = any signed-in visitor (incl. guests who haven't joined),
  // 'members' = active members only, 'private' = staff only.
  members_visibility: SpaceVisibility;
  // The wizard template this community was created from (COMMUNITY_TEMPLATES
  // key), or null for older communities. Gates type-specific features such as
  // AI event discovery (place only).
  template_key: string | null;
  location_type: string | null;
  location_name: string | null;
  // Custom-domain trio (supabase/custom-domains.sql). Only writable through
  // the service-role client — a DB trigger rejects anon/authenticated writes
  // to these columns, so include them in an Update payload only from the
  // owner-checked server actions in the community admin page.
  custom_domain: string | null;
  custom_domain_token: string | null;
  custom_domain_verified_at: string | null;
  // Generated column: `is_public = (privacy = 'public')`. Read-only — Postgres
  // rejects any insert/update that sets it directly. Write `privacy` instead.
  is_public: boolean;
  // Admin opt-in: show this community's events to signed-out visitors. Only
  // takes effect for a community guests can already reach (is_public).
  events_public: boolean;
  created_at: string;
  updated_at: string;
};

export type CommunityMembership = {
  id: string;
  user_id: string;
  community_id: string;
  role: MembershipRole;
  status: MembershipStatus;
  created_at: string;
};

export type Space = {
  id: string;
  community_id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: SpaceVisibility;
  space_type: SpaceType;
  sort_order: number;
  show_in_nav: boolean;
  // Overrides the community's location_name for this space's live data
  // (today: the Tides & Weather panel). Null = use the community's location.
  // See supabase/space-location.sql.
  location_name: string | null;
  created_at: string;
};

// A post can optionally be pinned to a place on the community's Explore Map
// (a beach, a landmark, a neighbourhood) — the start of the "Living Map":
// the map isn't a separate page, it's another way to browse anything that
// has a location. Both lat and lng are set together, or both are null.
export type Post = {
  id: string;
  community_id: string;
  space_id: string;
  author_id: string;
  title: string;
  body: string | null;
  media_url: string | null;
  post_type: PostType;
  is_pinned: boolean;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type PostReaction = {
  id: string;
  post_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
};

// `location` remains the free-text venue name/address; lat/lng/location_label
// are the optional map pin — an event appears on the Explore Map at its venue
// without requiring the venue to exist as a separate Landmark/Place record.
export type Event = {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  online_url: string | null;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  image_url: string | null;
  created_by: string;
  created_at: string;
};

export type Resource = {
  id: string;
  community_id: string;
  space_id: string;
  title: string;
  description: string | null;
  url: string;
  resource_type: ResourceType;
  created_by: string;
  created_at: string;
};

export type CommunityInvite = {
  id: string;
  community_id: string;
  code: string;
  role: Extract<MembershipRole, "member" | "moderator" | "admin">;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  revoked: boolean;
  created_by: string;
  created_at: string;
  email: string | null;
};

export type CommunityNavLink = {
  id: string;
  community_id: string;
  label: string;
  url: string;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// Built-in, optional nav features a platform super admin can turn on/off —
// see src/lib/features.ts for the labeled list shown in /platform-admin.
export type FeatureKey = "events" | "concierge";

// The feature state new communities start with, and the fallback for any
// community without an explicit community_features override.
export type FeatureDefault = {
  feature_key: FeatureKey;
  enabled: boolean;
  updated_at: string;
};

// Per-community override of a feature_defaults value. Set by the super
// admin — the "availability" layer deciding which features a community may
// use.
export type CommunityFeature = {
  community_id: string;
  feature_key: FeatureKey;
  enabled: boolean;
  updated_at: string;
};

// A community owner's own on/off preference for a feature, within what the
// super admin has made available. A missing row means "on".
export type CommunityFeaturePref = {
  community_id: string;
  feature_key: FeatureKey;
  enabled: boolean;
  updated_at: string;
};

// Per-community position of a built-in nav item (Events, Search) within the
// sidebar, interleaved with the spaces' own sort_order. A missing row means
// "unpositioned" — the layout sorts it after the spaces by default. item_key
// mirrors FeatureKey. See supabase migration community_nav_item_order.
export type CommunityNavItemOrder = {
  community_id: string;
  item_key: FeatureKey;
  sort_order: number;
  show_in_nav: boolean;
  updated_at: string;
};

// The platform-wide default pool: whether a space type is available for new
// (and un-overridden) communities to add. A missing row means "allowed".
// Set by the super admin at /platform-admin.
export type SpaceTypeDefault = {
  space_type: SpaceType;
  enabled: boolean;
  updated_at: string;
};

// Per-community override of the default pool, set by the super admin. Decides
// whether this community's admins may add spaces of the given type. A missing
// row falls back to space_type_defaults, then to "allowed".
export type CommunitySpaceType = {
  community_id: string;
  space_type: SpaceType;
  enabled: boolean;
  updated_at: string;
};

// A default item for a community type (template), editable by a super admin at
// /platform-admin. Usually a space (space_type set, builtin_key null); when
// builtin_key is 'events'/'concierge' it's a built-in nav feature shown in the
// list so it can be ordered like a space. The creation wizard seeds a new
// community's spaces from these. See the template_default_spaces migration.
export type TemplateDefaultSpace = {
  id: string;
  template_key: string;
  name: string;
  description: string;
  space_type: SpaceType;
  builtin_key: FeatureKey | null;
  show_in_nav: boolean;
  sort_order: number;
  updated_at: string;
};

// A review snippet cached from Google Places (businesses.google_reviews).
// Always rendered with Google attribution — see supabase/business-google-places.sql.
export type BusinessGoogleReview = {
  author: string;
  author_photo_url: string | null;
  rating: number;
  text: string;
  relative_time: string;
};

// A listing in a 'business_directory' space (see space-types.ts). Distinct
// from BusinessProfile below, which is a member's own business profile page —
// a Business here is scoped to one place community's directory, addable by
// any member regardless of who (if anyone) owns it.
export type Business = {
  id: string;
  space_id: string;
  community_id: string;
  created_by: string;
  name: string;
  category: BusinessCategory;
  // Cross-cutting flag, independent of category: a locally owned/run business.
  // A Restaurant can be local too, so this composes with category rather than
  // replacing it — the directory offers a "Local" filter on top of the chips.
  is_local: boolean;
  description: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  opening_hours: string | null;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  image_url: string | null;
  image_position: string | null;
  // The listing's owner, set once staff approve a member's claim. This — not
  // created_by (which is just who added the listing) — is who owns the business.
  // Null while unclaimed. Owners manage the listing and reply to reviews.
  claimed_by: string | null;
  // Optional per-day schedule powering a reliable "Open now"; keyed "0".."6"
  // (Sun..Sat). opening_hours (text) stays the human-readable display value.
  opening_hours_structured: BusinessHoursSchedule | null;
  google_place_id: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  google_reviews: BusinessGoogleReview[] | null;
  google_maps_url: string | null;
  google_synced_at: string | null;
  verified: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

// A business category staff have featured for a directory space — surfaced as
// a sub-link under that space in the left nav, deep-linking to the directory
// pre-filtered to the category.
export type FeaturedBusinessCategory = {
  id: string;
  space_id: string;
  community_id: string;
  category: BusinessCategory;
  // Position among a directory space's nav sub-links; staff drag to reorder.
  sort_order: number;
  created_at: string;
};

// One day's opening hours in a structured schedule. A single open–close range
// per day (kept simple; free-text opening_hours covers anything more elaborate).
export type BusinessDayHours = {
  closed: boolean;
  open: string; // "HH:MM"
  close: string; // "HH:MM"
};

// Per-day schedule keyed by day-of-week "0".."6" (Sun..Sat), matching Date.getDay().
export type BusinessHoursSchedule = Record<string, BusinessDayHours>;

// A member's request to be recognised as a listing's owner, resolved by staff.
export type BusinessClaim = {
  id: string;
  business_id: string;
  community_id: string;
  claimant_id: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
};

// A gallery photo for a directory listing. The full set is the source of
// truth for a listing's photos; businesses.image_url mirrors the first one
// (sort_order 0) as a denormalised cover for cards, the feed and map popups.
export type BusinessImage = {
  id: string;
  business_id: string;
  url: string;
  // CSS object-position ("50% 25%") for this photo's crop framing.
  position: string | null;
  sort_order: number;
  created_by: string;
  created_at: string;
};

// One member's review of a listing — a 1-5 star rating with optional text,
// one per member per business. Combines what guides split across guide_ratings
// and guide_comments into a single row the reviewer owns and can edit.
export type BusinessReview = {
  id: string;
  business_id: string;
  author_id: string;
  rating: number;
  body: string | null;
  created_at: string;
  updated_at: string;
};

// A public reply to a review on the listing's behalf — from whoever manages it
// (owner, or the adder while unclaimed, or staff) — one per review, like a
// Google Business response.
export type BusinessReviewReply = {
  id: string;
  review_id: string;
  business_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// A member's bookmark of a listing. Visible only to the member who saved it,
// so the directory's "Saved" filter reflects that viewer alone.
export type BusinessSave = {
  id: string;
  business_id: string;
  user_id: string;
  created_at: string;
};

// A category staff added to a directory space beyond the built-ins ("Fundi",
// "Boda Boda", …). slug is what businesses.category stores; label is what
// renders. Deleting one folds its listings back into 'other' (see
// supabase/business-custom-categories.sql).
export type BusinessCustomCategory = {
  id: string;
  space_id: string;
  community_id: string;
  created_by: string;
  slug: string;
  label: string;
  created_at: string;
};

// A per-space relabelling of a BUILT-IN business category — e.g. showing
// "Activities" as "Experiences". `category` is the built-in value (unchanged
// on the businesses themselves); `label` is what the nav sub-links, chips and
// headings render. Custom categories rename via their own `label` instead, so
// they never appear here (see supabase/business-category-label-overrides.sql).
export type BusinessCategoryLabelOverride = {
  id: string;
  space_id: string;
  community_id: string;
  category: BusinessCategory;
  label: string;
  created_at: string;
  updated_at: string;
};

// A togglable layer on a community's Explore Map (Restaurants, Beaches, …).
// Community-scoped rather than space-scoped — one community has one shared
// map, same reasoning as community_profile_fields. Seeded from a place
// community's chosen location type (see recommendPlaceSetup's mapLayers in
// community-templates.ts) but freely editable afterward.
export type MapCategory = {
  id: string;
  community_id: string;
  name: string;
  icon: string | null;
  enabled: boolean;
  sort_order: number;
  created_at: string;
};

// A pin a member adds directly to a 'map' space — a beach, a viewpoint, a
// trailhead, anything that isn't already a Business (businesses with
// lat/lng set appear on the same map without being duplicated here).
export type Landmark = {
  id: string;
  space_id: string;
  community_id: string;
  category_id: string | null;
  created_by: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  location_label: string | null;
  created_at: string;
  updated_at: string;
};

// One listing in a 'marketplace' space (see space-types.ts). photo_url is a
// single external URL (same reasoning as Avatar's src — arbitrary
// user-supplied hosts, no fixed remotePatterns to allowlist ahead of time),
// not a Storage upload — that's follow-up work.
export type MarketplaceListing = {
  id: string;
  space_id: string;
  community_id: string;
  seller_id: string;
  listing_type: MarketplaceListingType;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  photo_url: string | null;
  status: MarketplaceListingStatus;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  created_at: string;
  updated_at: string;
};

// One posting in a 'jobs' space (see space-types.ts). business_id is
// optional — a posting can link to an existing Business Directory listing
// (the employer) or stand alone. salary is free text (not numeric): real
// postings say "negotiable" or "$18-22/hr" as often as a clean number.
export type JobListing = {
  id: string;
  space_id: string;
  community_id: string;
  posted_by: string;
  business_id: string | null;
  title: string;
  description: string;
  job_type: JobType;
  salary: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  apply_url: string | null;
  status: JobListingStatus;
  created_at: string;
  updated_at: string;
};

// One listing in an 'accommodation' space (see space-types.ts). business_id
// is optional, same reasoning as JobListing — a hotel already in the
// Business Directory can link here instead of duplicating its details.
export type AccommodationListing = {
  id: string;
  space_id: string;
  community_id: string;
  listed_by: string;
  business_id: string | null;
  name: string;
  accommodation_type: AccommodationType;
  description: string | null;
  // Denormalised cover (kept in sync with photo_urls[0]) so the feed and map
  // popups don't need the gallery. photo_urls is the full ordered gallery.
  // The photo gallery; photo_urls[0] is the cover. (The old denormalised
  // photo_url column was dropped once every reader moved to photo_urls[0].)
  photo_urls: string[];
  price_per_night: number | null;
  currency: string | null;
  // How price_per_night should read — per night (default), per week or per
  // month — so long-term rentals aren't shown as nightly rates.
  price_unit: AccommodationPriceUnit;
  booking_url: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  status: AccommodationStatus;
  // Structured facts guests filter on. All optional — a camping spot may set
  // none of them.
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  // Amenity slugs from ACCOMMODATION_AMENITIES (e.g. "wifi", "kitchen").
  amenities: string[];
  // Optional availability window; both null means "ask the host".
  available_from: string | null;
  available_to: string | null;
  created_at: string;
  updated_at: string;
};

// One member's review of a stay — a 1-5 star rating with optional text, one per
// member per listing. Mirrors BusinessReview.
export type AccommodationReview = {
  id: string;
  listing_id: string;
  author_id: string;
  rating: number;
  body: string | null;
  created_at: string;
  updated_at: string;
};

// A public reply to a review from the host (listed_by) or staff — one per
// review, like a Google Business response. Mirrors BusinessReviewReply.
export type AccommodationReviewReply = {
  id: string;
  review_id: string;
  listing_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// A member's bookmark of a stay. Visible only to the member who saved it, so
// the accommodation view's "Saved" filter reflects that viewer alone.
export type AccommodationSave = {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
};

// A member's recommendation in a 'recommendations' space (see
// space-types.ts). business_id/landmark_id optionally link to an existing
// Business Directory listing or Explore Map pin; both stay null for a
// recommendation that isn't tied to either (a walk, a general tip).
export type Recommendation = {
  id: string;
  space_id: string;
  community_id: string;
  recommended_by: string;
  category: RecommendationCategory;
  title: string;
  note: string | null;
  business_id: string | null;
  landmark_id: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
};

export type RecommendationVote = {
  id: string;
  recommendation_id: string;
  user_id: string;
  created_at: string;
};

// A club/group in a 'clubs' space (see space-types.ts). Unlike the brief's
// "full community-within-a-community" description, this mirrors
// space_challenges/space_challenge_participants — a club is something
// members join (ClubMember), not its own nested discussion feed. category
// is free text: a club's topic is genuinely unbounded, unlike a bounded set
// like BusinessCategory.
export type Club = {
  id: string;
  space_id: string;
  community_id: string;
  created_by: string;
  name: string;
  category: string | null;
  description: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
};

export type ClubMember = {
  id: string;
  club_id: string;
  user_id: string;
  joined_at: string;
};

// A wiki-style document in a 'guides' space (see space-types.ts). Any
// active member can edit it — not just the creator or staff — which is
// what "contributors" (GuideContributor) means: everyone who's ever saved
// an edit. GuideRevision snapshots the previous title/body before each
// edit, so there's a real revision history.
export type Guide = {
  id: string;
  space_id: string;
  community_id: string;
  created_by: string;
  title: string;
  body: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type GuideContributor = {
  id: string;
  guide_id: string;
  user_id: string;
  first_contributed_at: string;
};

export type GuideRevision = {
  id: string;
  guide_id: string;
  title: string;
  body: string;
  edited_by: string | null;
  created_at: string;
};

export type GuideRating = {
  id: string;
  guide_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
};

export type GuideComment = {
  id: string;
  guide_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// A project/cause in a 'volunteer_hub' space (see space-types.ts). category
// is free text, same reasoning as Club — the set of causes (beach cleanups,
// fundraising, tree planting, animal rescue, …) is unbounded.
// volunteer_signups is "volunteer matching": who's signed up to help.
export type VolunteerProject = {
  id: string;
  space_id: string;
  community_id: string;
  organiser_id: string;
  title: string;
  category: string | null;
  description: string;
  status: VolunteerProjectStatus;
  volunteers_needed: number | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
};

export type VolunteerSignup = {
  id: string;
  project_id: string;
  user_id: string;
  signed_up_at: string;
};

export type LiveSessionStatus = "scheduled" | "live" | "ended";

// A live video session in a 'live' space (Live Events). One row per session —
// no content hierarchy, unlike Course. Staff start it (status 'live') and end
// it (status 'ended'); members who can view the space join a meeting keyed by
// room_name. room_name is a long unguessable string generated server-side and
// handed to the video provider (meet.jit.si) — at the video layer it's the
// join secret, so it's never user-supplied.
export type LiveSession = {
  id: string;
  space_id: string;
  community_id: string;
  started_by: string | null;
  title: string;
  room_name: string;
  status: LiveSessionStatus;
  // Set when the session was scheduled ahead of time; null for ad-hoc
  // "go live now" sessions.
  scheduled_start: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
};

// A member's RSVP to a scheduled live session — presence = attending, mirroring
// EventRsvp.
export type LiveSessionRsvp = {
  id: string;
  session_id: string;
  community_id: string;
  user_id: string;
  created_at: string;
};

export type CourseStatus = "draft" | "published";

// A course in a 'course' space (see space-types.ts). Deeper than
// Challenges/Clubs: a course owns a content hierarchy (CourseModule ->
// CourseLesson) and per-learner progress (LessonCompletion), and has a
// draft/published status so staff can build it before members see it.
// instructor_id defaults to the creator (no separate picker in the MVP).
export type Course = {
  id: string;
  space_id: string;
  community_id: string;
  created_by: string | null;
  instructor_id: string | null;
  title: string;
  summary: string | null;
  cover_image_url: string | null;
  status: CourseStatus;
  // v2: offer a completion certificate to learners who finish every lesson.
  certificate_enabled: boolean;
  // v3 pricing: price_cents 0 = free (self-enrollable). Paid courses require a
  // staff grant or a payment flow.
  price_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type CourseModule = {
  id: string;
  course_id: string;
  community_id: string;
  title: string;
  sort_order: number;
  // v2 drip: the module (and its lessons) unlock on/after this time. Null means
  // available immediately. Enforced softly in the player, not RLS.
  available_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseLesson = {
  id: string;
  module_id: string;
  course_id: string;
  community_id: string;
  title: string;
  body: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CourseEnrollment = {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  // v3: whether this enrolment was paid for (vs a free/granted enrolment).
  paid: boolean;
};

// One learner has finished one lesson. course_id/community_id are denormalised
// (see the courses migration) so progress and staff-visibility checks stay
// single-hop.
export type LessonCompletion = {
  id: string;
  lesson_id: string;
  course_id: string;
  community_id: string;
  user_id: string;
  completed_at: string;
};

// v2: per-lesson Q&A/discussion.
export type LessonComment = {
  id: string;
  lesson_id: string;
  course_id: string;
  community_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// v2: a staff broadcast pinned to the top of a course.
export type CourseAnnouncement = {
  id: string;
  course_id: string;
  community_id: string;
  author_id: string | null;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
};

// v3: a course this course requires be completed first.
export type CoursePrerequisite = {
  id: string;
  course_id: string;
  prerequisite_course_id: string;
  community_id: string;
  created_at: string;
};

// v3: one quiz per lesson. Correct answers live in quiz_options.is_correct,
// which is never exposed to learners (see the courses_v3 migration).
export type CourseQuiz = {
  id: string;
  lesson_id: string;
  course_id: string;
  community_id: string;
  title: string;
  pass_percent: number;
  created_at: string;
  updated_at: string;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  community_id: string;
  prompt: string;
  sort_order: number;
  created_at: string;
};

export type QuizOption = {
  id: string;
  question_id: string;
  community_id: string;
  label: string;
  is_correct: boolean;
  sort_order: number;
  created_at: string;
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  course_id: string;
  community_id: string;
  user_id: string;
  score_percent: number;
  passed: boolean;
  answers: string[];
  created_at: string;
};

export type NotificationType = "comment" | "post" | "membership" | "claim" | "live_event" | "live_started";

export type Notification = {
  id: string;
  user_id: string;
  community_id: string | null;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  actor_id: string | null;
  read: boolean;
  created_at: string;
};

export type NotificationEmailPreference = {
  user_id: string;
  type: NotificationType;
  enabled: boolean;
};

export type ConciergeQuery = {
  id: string;
  community_id: string;
  user_id: string | null;
  query: string;
  result_count: number;
  had_answer: boolean;
  created_at: string;
};

export type EventRsvp = {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
};

export type BusinessProfile = {
  id: string;
  profile_id: string;
  business_name: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  industry: string | null;
  services: string[];
  products: string[];
  location: string | null;
  contact_links: Record<string, string>;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type MemberInterest = {
  id: string;
  profile_id: string;
  interest: string;
  created_at: string;
};

export type MemberSkill = {
  id: string;
  profile_id: string;
  skill: string;
  created_at: string;
};

export type HelpRequestKind = "needs_help" | "can_help";

export type MemberHelpRequest = {
  id: string;
  profile_id: string;
  kind: HelpRequestKind;
  topic: string;
  created_at: string;
};

export type MemberLocation = {
  id: string;
  profile_id: string;
  city: string | null;
  region: string | null;
  country: string | null;
  is_visible: boolean;
  updated_at: string;
};

export type ProfileFieldType = "text" | "textarea" | "number" | "date" | "dropdown" | "multiselect" | "checkbox" | "url";

export type CommunityProfileField = {
  id: string;
  community_id: string;
  label: string;
  field_type: ProfileFieldType;
  options: string[];
  is_required: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CommunityProfileValue = {
  id: string;
  field_id: string;
  profile_id: string;
  community_id: string;
  value: string | number | boolean | string[] | null;
  created_at: string;
  updated_at: string;
};

export type SpaceJournalField = {
  id: string;
  space_id: string;
  label: string;
  field_type: ProfileFieldType;
  options: string[];
  is_required: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SpaceJournalEntryData = Record<string, string | number | boolean | string[] | null>;

export type SpaceJournalEntry = {
  id: string;
  space_id: string;
  community_id: string;
  author_id: string;
  data: SpaceJournalEntryData;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  space_id: string;
  community_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ChallengeParticipant = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
};

export type MemberContributionScore = {
  id: string;
  profile_id: string;
  points: number;
  reason: string;
  source_type: string | null;
  source_id: string | null;
  created_at: string;
};

export type MemberBlock = {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_one_id: string;
  user_two_id: string;
  last_message_at: string | null;
  created_at: string;
};

export type DirectMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read: boolean;
  created_at: string;
};

export type ConnectionStatus = "pending" | "accepted" | "declined";

export type MemberConnection = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
};

// Crop Guides — a platform-global, organic-first crop record. Not community
// scoped: every community's Crop Guides space browses the same published
// library. The narrative sections (soil/sowing/watering/feeding/harvest) are
// flat label -> value maps rendered as blocks by the crop page.
export type CropStatus = "draft" | "published";
export type CropSection = Record<string, string>;

export type Crop = {
  id: string;
  slug: string;
  common_name: string;
  scientific_name: string | null;
  family: string | null;
  category: string;
  difficulty: string | null;
  lifecycle: string | null;
  beginner_friendly: boolean;
  time_to_maturity_days: number | null;
  average_yield: string | null;
  preferred_climate: string | null;
  usda_zones: string | null;
  tropical_suitable: boolean;
  pollination_type: string | null;
  sun: string | null;
  water_need: string | null;
  drought_tolerant: boolean;
  pollinator_friendly: boolean;
  nitrogen_fixer: boolean;
  organic_favourite: boolean;
  edible_part: string | null;
  image_url: string | null;
  overview: string | null;
  soil: CropSection;
  sowing: CropSection;
  watering: CropSection;
  feeding: CropSection;
  harvest: CropSection;
  pruning: CropSection;
  pollination: CropSection;
  task_timeline: CropSection;
  troubleshooting: CropSection;
  biodiversity: CropSection;
  status: CropStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CropVariety = {
  id: string;
  crop_id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  growth_habit: string | null;
  time_to_harvest: string | null;
  yield: string | null;
  disease_resistance: string | null;
  best_climates: string | null;
  flavour: string | null;
  uses: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CompanionRelationship = "excellent" | "neutral" | "avoid";

export type CropCompanion = {
  id: string;
  crop_id: string;
  companion_crop_id: string | null;
  companion_name: string;
  relationship: CompanionRelationship;
  reason: string | null;
  sort_order: number;
  created_at: string;
};

// crop_pests / crop_diseases carry organic guidance only — there is no
// chemical-control field by design (see the sections migration).
export type CropPest = {
  id: string;
  crop_id: string;
  name: string;
  photo_url: string | null;
  symptoms: string | null;
  life_cycle: string | null;
  damage: string | null;
  organic_treatments: string | null;
  natural_predators: string | null;
  prevention: string | null;
  severity: string | null;
  sort_order: number;
  created_at: string;
};

export type CropDisease = {
  id: string;
  crop_id: string;
  name: string;
  photo_url: string | null;
  symptoms: string | null;
  causes: string | null;
  organic_control: string | null;
  prevention: string | null;
  early_signs: string | null;
  sort_order: number;
  created_at: string;
};

// Region-aware planting calendars.
export type CropRegionKind = "climate" | "geographic";
export type Hemisphere = "north" | "south";
export type CropCalendarActivity = "sow_indoors" | "direct_sow" | "transplant" | "harvest" | "avoid";

export type CropRegion = {
  id: string;
  slug: string;
  name: string;
  kind: CropRegionKind;
  hemisphere: Hemisphere | null;
  sort_order: number;
  created_at: string;
};

export type CropCalendar = {
  id: string;
  crop_id: string;
  region_id: string;
  month: number;
  activity: CropCalendarActivity;
  created_at: string;
};

export type CommunityCropRegion = {
  id: string;
  community_id: string;
  name: string;
  base_region_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// Community power: growing journals, regional tips, saved crops. Field shapes on
// the journal mirror the shamba.online farm app for future import.
export type CropGrowingJournal = {
  id: string;
  crop_id: string;
  community_id: string;
  user_id: string;
  variety: string | null;
  planted_on: string | null;
  harvested_on: string | null;
  climate: string | null;
  location: string | null;
  yield_kg: number | null;
  problems: string | null;
  solutions: string | null;
  weather: string | null;
  success_rating: number | null;
  photos: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CropCommunityTip = {
  id: string;
  crop_id: string;
  community_id: string;
  created_by: string;
  region: string | null;
  body: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
};

export type CropSave = {
  id: string;
  user_id: string;
  crop_id: string;
  community_id: string | null;
  created_at: string;
};

// Community propose-a-crop flow — members submit, staff approve → promoted into
// the global crops library.
export type CropProposalStatus = "pending" | "approved" | "rejected";

export type CropProposal = {
  id: string;
  community_id: string;
  created_by: string;
  common_name: string;
  scientific_name: string | null;
  family: string | null;
  category: string;
  difficulty: string | null;
  lifecycle: string | null;
  overview: string | null;
  preferred_climate: string | null;
  sun: string | null;
  water_need: string | null;
  edible_part: string | null;
  time_to_maturity_days: number | null;
  beginner_friendly: boolean;
  pollinator_friendly: boolean;
  nitrogen_fixer: boolean;
  drought_tolerant: boolean;
  organic_favourite: boolean;
  image_url: string | null;
  status: CropProposalStatus;
  reviewer_note: string | null;
  crop_id: string | null;
  created_at: string;
  updated_at: string;
};

// Community medicinal-use log — member-authored, staff-moderated, searchable by
// ailment. Traditional knowledge, not medical advice.
export type CropMedicinalUse = {
  id: string;
  crop_id: string;
  community_id: string;
  created_by: string;
  ailment: string;
  part_used: string | null;
  preparation: string | null;
  description: string | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
};

// Opt-in sharing of a member's shamba.online farm on the "My Crops" page. When
// is_public, other members can browse this member's crops. farm_email is a
// server-only snapshot used to query the farm bridge — RLS keeps it to the
// owner's own row (see supabase/migrations/*_farm_shares_public_farms.sql).
export type FarmShare = {
  profile_id: string;
  is_public: boolean;
  farm_email: string | null;
  created_at: string;
  updated_at: string;
};

type FKey<Col extends string, Referenced extends string> = {
  foreignKeyName: string;
  columns: [Col];
  isOneToOne: boolean;
  referencedRelation: Referenced;
  referencedColumns: ["id"];
};

type NoRel = { Relationships: [] };

// Only the foreign keys actually embedded via `.select("foo:bar_id (*)")`
// in src/lib/data/*.ts need an entry here — the select-query-parser used by
// @supabase/postgrest-js needs them to type embedded resource selects.
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> } & NoRel;
      communities: {
        Row: Community;
        // is_public is a generated column (derived from privacy) — omitted
        // here so TypeScript itself rejects any attempt to set it directly,
        // not just convention.
        Insert: Partial<Omit<Community, "is_public">> & { name: string; slug: string; owner_id: string };
        Update: Partial<Omit<Community, "is_public">>;
      } & NoRel;
      community_memberships: {
        Row: CommunityMembership;
        Insert: Partial<CommunityMembership> & { user_id: string; community_id: string };
        Update: Partial<CommunityMembership>;
        Relationships: [FKey<"community_id", "communities">, FKey<"user_id", "profiles">];
      };
      spaces: { Row: Space; Insert: Partial<Space> & { community_id: string; name: string; slug: string }; Update: Partial<Space> } & NoRel;
      posts: {
        Row: Post;
        Insert: Partial<Post> & { community_id: string; space_id: string; author_id: string; title: string };
        Update: Partial<Post>;
        Relationships: [FKey<"author_id", "profiles">, FKey<"space_id", "spaces">];
      };
      comments: {
        Row: Comment;
        Insert: Partial<Comment> & { post_id: string; author_id: string; body: string };
        Update: Partial<Comment>;
        Relationships: [FKey<"author_id", "profiles">, FKey<"post_id", "posts">];
      };
      post_reactions: {
        Row: PostReaction;
        Insert: Partial<PostReaction> & { post_id: string; user_id: string };
        Update: Partial<PostReaction>;
        Relationships: [FKey<"post_id", "posts">, FKey<"user_id", "profiles">];
      };
      events: { Row: Event; Insert: Partial<Event> & { community_id: string; title: string; start_time: string; created_by: string }; Update: Partial<Event> } & NoRel;
      resources: { Row: Resource; Insert: Partial<Resource> & { community_id: string; space_id: string; title: string; url: string; created_by: string }; Update: Partial<Resource> } & NoRel;
      community_invites: {
        Row: CommunityInvite;
        Insert: Partial<CommunityInvite> & { community_id: string; code: string; created_by: string };
        Update: Partial<CommunityInvite>;
      } & NoRel;
      community_nav_links: {
        Row: CommunityNavLink;
        Insert: Partial<CommunityNavLink> & { community_id: string; label: string; url: string };
        Update: Partial<CommunityNavLink>;
      } & NoRel;
      feature_defaults: {
        Row: FeatureDefault;
        Insert: Partial<FeatureDefault> & { feature_key: FeatureKey };
        Update: Partial<FeatureDefault>;
      } & NoRel;
      community_features: {
        Row: CommunityFeature;
        Insert: Partial<CommunityFeature> & { community_id: string; feature_key: FeatureKey };
        Update: Partial<CommunityFeature>;
      } & NoRel;
      community_feature_prefs: {
        Row: CommunityFeaturePref;
        Insert: Partial<CommunityFeaturePref> & { community_id: string; feature_key: FeatureKey };
        Update: Partial<CommunityFeaturePref>;
      } & NoRel;
      community_nav_item_order: {
        Row: CommunityNavItemOrder;
        Insert: Partial<CommunityNavItemOrder> & { community_id: string; item_key: FeatureKey; sort_order: number };
        Update: Partial<CommunityNavItemOrder>;
      } & NoRel;
      template_default_spaces: {
        Row: TemplateDefaultSpace;
        Insert: Partial<TemplateDefaultSpace> & { template_key: string; name: string };
        Update: Partial<TemplateDefaultSpace>;
      } & NoRel;
      space_type_defaults: {
        Row: SpaceTypeDefault;
        Insert: Partial<SpaceTypeDefault> & { space_type: SpaceType };
        Update: Partial<SpaceTypeDefault>;
      } & NoRel;
      community_space_types: {
        Row: CommunitySpaceType;
        Insert: Partial<CommunitySpaceType> & { community_id: string; space_type: SpaceType };
        Update: Partial<CommunitySpaceType>;
      } & NoRel;
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & { user_id: string; type: NotificationType; title: string };
        Update: Partial<Notification>;
        Relationships: [FKey<"actor_id", "profiles">];
      };
      notification_email_preferences: {
        Row: NotificationEmailPreference;
        Insert: Partial<NotificationEmailPreference> & { user_id: string; type: NotificationType };
        Update: Partial<NotificationEmailPreference>;
        Relationships: [FKey<"user_id", "profiles">];
      };
      event_rsvps: {
        Row: EventRsvp;
        Insert: Partial<EventRsvp> & { event_id: string; user_id: string };
        Update: Partial<EventRsvp>;
        Relationships: [FKey<"user_id", "profiles">, FKey<"event_id", "events">];
      };
      business_profiles: {
        Row: BusinessProfile;
        Insert: Partial<BusinessProfile> & { profile_id: string; business_name: string };
        Update: Partial<BusinessProfile>;
      } & NoRel;
      businesses: {
        Row: Business;
        Insert: Partial<Business> & { space_id: string; community_id: string; created_by: string; name: string };
        Update: Partial<Business>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"created_by", "profiles">];
      };
      business_images: {
        Row: BusinessImage;
        Insert: Partial<BusinessImage> & { business_id: string; url: string; created_by: string };
        Update: Partial<BusinessImage>;
        Relationships: [FKey<"business_id", "businesses">, FKey<"created_by", "profiles">];
      };
      business_reviews: {
        Row: BusinessReview;
        Insert: Partial<BusinessReview> & { business_id: string; author_id: string; rating: number };
        Update: Partial<BusinessReview>;
        Relationships: [FKey<"business_id", "businesses">, FKey<"author_id", "profiles">];
      };
      business_review_replies: {
        Row: BusinessReviewReply;
        Insert: Partial<BusinessReviewReply> & { review_id: string; business_id: string; author_id: string; body: string };
        Update: Partial<BusinessReviewReply>;
        Relationships: [FKey<"review_id", "business_reviews">, FKey<"business_id", "businesses">, FKey<"author_id", "profiles">];
      };
      business_saves: {
        Row: BusinessSave;
        Insert: Partial<BusinessSave> & { business_id: string; user_id: string };
        Update: Partial<BusinessSave>;
        Relationships: [FKey<"business_id", "businesses">, FKey<"user_id", "profiles">];
      };
      business_claims: {
        Row: BusinessClaim;
        Insert: Partial<BusinessClaim> & { business_id: string; community_id: string; claimant_id: string };
        Update: Partial<BusinessClaim>;
        Relationships: [FKey<"business_id", "businesses">, FKey<"community_id", "communities">, FKey<"claimant_id", "profiles">, FKey<"resolved_by", "profiles">];
      };
      featured_business_categories: {
        Row: FeaturedBusinessCategory;
        Insert: Partial<FeaturedBusinessCategory> & { space_id: string; community_id: string; category: BusinessCategory };
        Update: Partial<FeaturedBusinessCategory>;
        Relationships: [FKey<"space_id", "spaces">];
      };
      business_custom_categories: {
        Row: BusinessCustomCategory;
        Insert: Partial<BusinessCustomCategory> & { space_id: string; community_id: string; created_by: string; slug: string; label: string };
        Update: Partial<BusinessCustomCategory>;
        Relationships: [FKey<"space_id", "spaces">];
      };
      business_category_label_overrides: {
        Row: BusinessCategoryLabelOverride;
        Insert: Partial<BusinessCategoryLabelOverride> & { space_id: string; community_id: string; category: BusinessCategory; label: string };
        Update: Partial<BusinessCategoryLabelOverride>;
        Relationships: [FKey<"space_id", "spaces">];
      };
      map_categories: {
        Row: MapCategory;
        Insert: Partial<MapCategory> & { community_id: string; name: string };
        Update: Partial<MapCategory>;
        Relationships: [FKey<"community_id", "communities">];
      };
      landmarks: {
        Row: Landmark;
        Insert: Partial<Landmark> & { space_id: string; community_id: string; created_by: string; name: string; lat: number; lng: number };
        Update: Partial<Landmark>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"category_id", "map_categories">, FKey<"created_by", "profiles">];
      };
      marketplace_listings: {
        Row: MarketplaceListing;
        Insert: Partial<MarketplaceListing> & { space_id: string; community_id: string; seller_id: string; title: string };
        Update: Partial<MarketplaceListing>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"seller_id", "profiles">];
      };
      job_listings: {
        Row: JobListing;
        Insert: Partial<JobListing> & { space_id: string; community_id: string; posted_by: string; title: string; description: string };
        Update: Partial<JobListing>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"posted_by", "profiles">, FKey<"business_id", "businesses">];
      };
      accommodation_listings: {
        Row: AccommodationListing;
        Insert: Partial<AccommodationListing> & { space_id: string; community_id: string; listed_by: string; name: string };
        Update: Partial<AccommodationListing>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"listed_by", "profiles">, FKey<"business_id", "businesses">];
      };
      accommodation_reviews: {
        Row: AccommodationReview;
        Insert: Partial<AccommodationReview> & { listing_id: string; author_id: string; rating: number };
        Update: Partial<AccommodationReview>;
        Relationships: [FKey<"listing_id", "accommodation_listings">, FKey<"author_id", "profiles">];
      };
      accommodation_review_replies: {
        Row: AccommodationReviewReply;
        Insert: Partial<AccommodationReviewReply> & { review_id: string; listing_id: string; author_id: string; body: string };
        Update: Partial<AccommodationReviewReply>;
        Relationships: [FKey<"review_id", "accommodation_reviews">, FKey<"listing_id", "accommodation_listings">, FKey<"author_id", "profiles">];
      };
      accommodation_saves: {
        Row: AccommodationSave;
        Insert: Partial<AccommodationSave> & { listing_id: string; user_id: string };
        Update: Partial<AccommodationSave>;
        Relationships: [FKey<"listing_id", "accommodation_listings">, FKey<"user_id", "profiles">];
      };
      recommendations: {
        Row: Recommendation;
        Insert: Partial<Recommendation> & { space_id: string; community_id: string; recommended_by: string; title: string };
        Update: Partial<Recommendation>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"recommended_by", "profiles">, FKey<"business_id", "businesses">, FKey<"landmark_id", "landmarks">];
      };
      recommendation_votes: {
        Row: RecommendationVote;
        Insert: Partial<RecommendationVote> & { recommendation_id: string; user_id: string };
        Update: Partial<RecommendationVote>;
        Relationships: [FKey<"recommendation_id", "recommendations">, FKey<"user_id", "profiles">];
      };
      clubs: {
        Row: Club;
        Insert: Partial<Club> & { space_id: string; community_id: string; created_by: string; name: string };
        Update: Partial<Club>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"created_by", "profiles">];
      };
      club_members: {
        Row: ClubMember;
        Insert: Partial<ClubMember> & { club_id: string; user_id: string };
        Update: Partial<ClubMember>;
        Relationships: [FKey<"club_id", "clubs">, FKey<"user_id", "profiles">];
      };
      guides: {
        Row: Guide;
        Insert: Partial<Guide> & { space_id: string; community_id: string; created_by: string; title: string; body: string };
        Update: Partial<Guide>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"created_by", "profiles">];
      };
      guide_contributors: {
        Row: GuideContributor;
        Insert: Partial<GuideContributor> & { guide_id: string; user_id: string };
        Update: Partial<GuideContributor>;
        Relationships: [FKey<"guide_id", "guides">, FKey<"user_id", "profiles">];
      };
      guide_revisions: {
        Row: GuideRevision;
        Insert: Partial<GuideRevision> & { guide_id: string; title: string; body: string };
        Update: Partial<GuideRevision>;
        Relationships: [FKey<"guide_id", "guides">, FKey<"edited_by", "profiles">];
      };
      guide_ratings: {
        Row: GuideRating;
        Insert: Partial<GuideRating> & { guide_id: string; user_id: string; rating: number };
        Update: Partial<GuideRating>;
        Relationships: [FKey<"guide_id", "guides">, FKey<"user_id", "profiles">];
      };
      guide_comments: {
        Row: GuideComment;
        Insert: Partial<GuideComment> & { guide_id: string; author_id: string; body: string };
        Update: Partial<GuideComment>;
        Relationships: [FKey<"guide_id", "guides">, FKey<"author_id", "profiles">];
      };
      volunteer_projects: {
        Row: VolunteerProject;
        Insert: Partial<VolunteerProject> & { space_id: string; community_id: string; organiser_id: string; title: string; description: string };
        Update: Partial<VolunteerProject>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"organiser_id", "profiles">];
      };
      volunteer_signups: {
        Row: VolunteerSignup;
        Insert: Partial<VolunteerSignup> & { project_id: string; user_id: string };
        Update: Partial<VolunteerSignup>;
        Relationships: [FKey<"project_id", "volunteer_projects">, FKey<"user_id", "profiles">];
      };
      courses: {
        Row: Course;
        Insert: Partial<Course> & { space_id: string; community_id: string; title: string };
        Update: Partial<Course>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"created_by", "profiles">, FKey<"instructor_id", "profiles">];
      };
      live_sessions: {
        Row: LiveSession;
        Insert: Partial<LiveSession> & { space_id: string; community_id: string; title: string; room_name: string };
        Update: Partial<LiveSession>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"started_by", "profiles">];
      };
      live_session_rsvps: {
        Row: LiveSessionRsvp;
        Insert: Partial<LiveSessionRsvp> & { session_id: string; community_id: string; user_id: string };
        Update: Partial<LiveSessionRsvp>;
        Relationships: [FKey<"session_id", "live_sessions">, FKey<"user_id", "profiles">];
      };
      course_modules: {
        Row: CourseModule;
        Insert: Partial<CourseModule> & { course_id: string; community_id: string; title: string };
        Update: Partial<CourseModule>;
        Relationships: [FKey<"course_id", "courses">];
      };
      course_lessons: {
        Row: CourseLesson;
        Insert: Partial<CourseLesson> & { module_id: string; course_id: string; community_id: string; title: string };
        Update: Partial<CourseLesson>;
        Relationships: [FKey<"module_id", "course_modules">, FKey<"course_id", "courses">];
      };
      course_enrollments: {
        Row: CourseEnrollment;
        Insert: Partial<CourseEnrollment> & { course_id: string; user_id: string };
        Update: Partial<CourseEnrollment>;
        Relationships: [FKey<"course_id", "courses">, FKey<"user_id", "profiles">];
      };
      lesson_completions: {
        Row: LessonCompletion;
        Insert: Partial<LessonCompletion> & { lesson_id: string; course_id: string; community_id: string; user_id: string };
        Update: Partial<LessonCompletion>;
        Relationships: [FKey<"lesson_id", "course_lessons">, FKey<"course_id", "courses">, FKey<"user_id", "profiles">];
      };
      lesson_comments: {
        Row: LessonComment;
        Insert: Partial<LessonComment> & { lesson_id: string; course_id: string; community_id: string; author_id: string; body: string };
        Update: Partial<LessonComment>;
        Relationships: [FKey<"lesson_id", "course_lessons">, FKey<"course_id", "courses">, FKey<"author_id", "profiles">];
      };
      course_announcements: {
        Row: CourseAnnouncement;
        Insert: Partial<CourseAnnouncement> & { course_id: string; community_id: string; title: string };
        Update: Partial<CourseAnnouncement>;
        Relationships: [FKey<"course_id", "courses">, FKey<"author_id", "profiles">];
      };
      course_prerequisites: {
        Row: CoursePrerequisite;
        Insert: Partial<CoursePrerequisite> & { course_id: string; prerequisite_course_id: string; community_id: string };
        Update: Partial<CoursePrerequisite>;
        Relationships: [FKey<"course_id", "courses">, FKey<"prerequisite_course_id", "courses">];
      };
      course_quizzes: {
        Row: CourseQuiz;
        Insert: Partial<CourseQuiz> & { lesson_id: string; course_id: string; community_id: string };
        Update: Partial<CourseQuiz>;
        Relationships: [FKey<"lesson_id", "course_lessons">, FKey<"course_id", "courses">];
      };
      quiz_questions: {
        Row: QuizQuestion;
        Insert: Partial<QuizQuestion> & { quiz_id: string; community_id: string; prompt: string };
        Update: Partial<QuizQuestion>;
        Relationships: [FKey<"quiz_id", "course_quizzes">];
      };
      quiz_options: {
        Row: QuizOption;
        Insert: Partial<QuizOption> & { question_id: string; community_id: string; label: string };
        Update: Partial<QuizOption>;
        Relationships: [FKey<"question_id", "quiz_questions">];
      };
      quiz_attempts: {
        Row: QuizAttempt;
        Insert: Partial<QuizAttempt> & { quiz_id: string; course_id: string; community_id: string; user_id: string; score_percent: number; passed: boolean };
        Update: Partial<QuizAttempt>;
        Relationships: [FKey<"quiz_id", "course_quizzes">, FKey<"user_id", "profiles">];
      };
      concierge_queries: {
        Row: ConciergeQuery;
        Insert: Partial<ConciergeQuery> & { community_id: string; query: string };
        Update: Partial<ConciergeQuery>;
        Relationships: [FKey<"user_id", "profiles">];
      };
      member_interests: {
        Row: MemberInterest;
        Insert: Partial<MemberInterest> & { profile_id: string; interest: string };
        Update: Partial<MemberInterest>;
      } & NoRel;
      member_skills: {
        Row: MemberSkill;
        Insert: Partial<MemberSkill> & { profile_id: string; skill: string };
        Update: Partial<MemberSkill>;
      } & NoRel;
      member_help_requests: {
        Row: MemberHelpRequest;
        Insert: Partial<MemberHelpRequest> & { profile_id: string; kind: HelpRequestKind; topic: string };
        Update: Partial<MemberHelpRequest>;
      } & NoRel;
      member_locations: {
        Row: MemberLocation;
        Insert: Partial<MemberLocation> & { profile_id: string };
        Update: Partial<MemberLocation>;
      } & NoRel;
      community_profile_fields: {
        Row: CommunityProfileField;
        Insert: Partial<CommunityProfileField> & { community_id: string; label: string };
        Update: Partial<CommunityProfileField>;
      } & NoRel;
      community_profile_values: {
        Row: CommunityProfileValue;
        Insert: Partial<CommunityProfileValue> & { field_id: string; profile_id: string; community_id: string };
        Update: Partial<CommunityProfileValue>;
        Relationships: [FKey<"field_id", "community_profile_fields">];
      };
      space_journal_fields: {
        Row: SpaceJournalField;
        Insert: Partial<SpaceJournalField> & { space_id: string; label: string };
        Update: Partial<SpaceJournalField>;
        Relationships: [FKey<"space_id", "spaces">];
      };
      space_journal_entries: {
        Row: SpaceJournalEntry;
        Insert: Partial<SpaceJournalEntry> & { space_id: string; community_id: string; author_id: string };
        Update: Partial<SpaceJournalEntry>;
        Relationships: [FKey<"space_id", "spaces">, FKey<"author_id", "profiles">];
      };
      // Named space_challenges/space_challenge_participants (not challenges/
      // challenge_participants) — a `challenges` table with an unrelated
      // shape already exists in this database, leftover from an earlier
      // migration on a different codebase.
      space_challenges: {
        Row: Challenge;
        Insert: Partial<Challenge> & { space_id: string; community_id: string; title: string; start_date: string; end_date: string };
        Update: Partial<Challenge>;
        Relationships: [FKey<"space_id", "spaces">];
      };
      space_challenge_participants: {
        Row: ChallengeParticipant;
        Insert: Partial<ChallengeParticipant> & { challenge_id: string; user_id: string };
        Update: Partial<ChallengeParticipant>;
        Relationships: [FKey<"challenge_id", "space_challenges">, FKey<"user_id", "profiles">];
      };
      member_contribution_scores: {
        Row: MemberContributionScore;
        Insert: Partial<MemberContributionScore> & { profile_id: string; points: number; reason: string };
        Update: Partial<MemberContributionScore>;
      } & NoRel;
      member_blocks: {
        Row: MemberBlock;
        Insert: Partial<MemberBlock> & { blocker_id: string; blocked_id: string };
        Update: Partial<MemberBlock>;
        Relationships: [FKey<"blocked_id", "profiles">];
      };
      conversations: {
        Row: Conversation;
        Insert: Partial<Conversation> & { user_one_id: string; user_two_id: string };
        Update: Partial<Conversation>;
        Relationships: [FKey<"user_one_id", "profiles">, FKey<"user_two_id", "profiles">];
      };
      direct_messages: {
        Row: DirectMessage;
        Insert: Partial<DirectMessage> & { conversation_id: string; sender_id: string; body: string };
        Update: Partial<DirectMessage>;
        Relationships: [FKey<"sender_id", "profiles">];
      };
      member_connections: {
        Row: MemberConnection;
        Insert: Partial<MemberConnection> & { requester_id: string; addressee_id: string };
        Update: Partial<MemberConnection>;
      } & NoRel;
      crops: {
        Row: Crop;
        Insert: Partial<Crop> & { slug: string; common_name: string };
        Update: Partial<Crop>;
      } & NoRel;
      crop_varieties: {
        Row: CropVariety;
        Insert: Partial<CropVariety> & { crop_id: string; name: string };
        Update: Partial<CropVariety>;
      } & NoRel;
      crop_companions: {
        Row: CropCompanion;
        Insert: Partial<CropCompanion> & { crop_id: string; companion_name: string };
        Update: Partial<CropCompanion>;
        Relationships: [FKey<"crop_id", "crops">, FKey<"companion_crop_id", "crops">];
      };
      crop_pests: {
        Row: CropPest;
        Insert: Partial<CropPest> & { crop_id: string; name: string };
        Update: Partial<CropPest>;
      } & NoRel;
      crop_diseases: {
        Row: CropDisease;
        Insert: Partial<CropDisease> & { crop_id: string; name: string };
        Update: Partial<CropDisease>;
      } & NoRel;
      crop_regions: {
        Row: CropRegion;
        Insert: Partial<CropRegion> & { slug: string; name: string };
        Update: Partial<CropRegion>;
      } & NoRel;
      crop_calendars: {
        Row: CropCalendar;
        Insert: Partial<CropCalendar> & { crop_id: string; region_id: string; month: number; activity: CropCalendarActivity };
        Update: Partial<CropCalendar>;
      } & NoRel;
      community_crop_regions: {
        Row: CommunityCropRegion;
        Insert: Partial<CommunityCropRegion> & { community_id: string; name: string };
        Update: Partial<CommunityCropRegion>;
      } & NoRel;
      crop_growing_journals: {
        Row: CropGrowingJournal;
        Insert: Partial<CropGrowingJournal> & { crop_id: string; community_id: string; user_id: string };
        Update: Partial<CropGrowingJournal>;
        Relationships: [FKey<"user_id", "profiles">, FKey<"crop_id", "crops">];
      };
      crop_community_tips: {
        Row: CropCommunityTip;
        Insert: Partial<CropCommunityTip> & { crop_id: string; community_id: string; created_by: string; body: string };
        Update: Partial<CropCommunityTip>;
        Relationships: [FKey<"created_by", "profiles">, FKey<"crop_id", "crops">];
      };
      crop_saves: {
        Row: CropSave;
        Insert: Partial<CropSave> & { user_id: string; crop_id: string };
        Update: Partial<CropSave>;
      } & NoRel;
      crop_medicinal_uses: {
        Row: CropMedicinalUse;
        Insert: Partial<CropMedicinalUse> & { crop_id: string; community_id: string; created_by: string; ailment: string };
        Update: Partial<CropMedicinalUse>;
        Relationships: [FKey<"created_by", "profiles">, FKey<"crop_id", "crops">];
      };
      crop_proposals: {
        Row: CropProposal;
        Insert: Partial<CropProposal> & { community_id: string; created_by: string; common_name: string };
        Update: Partial<CropProposal>;
        Relationships: [FKey<"created_by", "profiles">];
      };
      farm_shares: {
        Row: FarmShare;
        Insert: Partial<FarmShare> & { profile_id: string };
        Update: Partial<FarmShare>;
      } & NoRel;
    };
    Views: Record<string, never>;
    Functions: {
      approve_crop_proposal: {
        Args: { p_proposal_id: string };
        Returns: string;
      };
      consume_ai_quota: {
        Args: { p_bucket: string; p_identity: string; p_limit: number };
        Returns: boolean;
      };
      get_invite_preview: {
        Args: { p_code: string };
        Returns: {
          community_name: string | null;
          community_slug: string | null;
          community_logo_url: string | null;
          community_cover_image_url: string | null;
          community_is_public: boolean | null;
          valid: boolean;
          reason: string | null;
        }[];
      };
      redeem_invite: {
        Args: { p_code: string };
        Returns: { community_slug: string | null; error: string | null }[];
      };
      find_user_id_by_email: {
        Args: { p_email: string };
        Returns: string | null;
      };
      community_slug_for_domain: {
        Args: { p_domain: string };
        Returns: string | null;
      };
      course_quiz_data: {
        Args: { p_course_id: string };
        Returns: {
          quiz_id: string;
          lesson_id: string;
          quiz_title: string;
          pass_percent: number;
          question_id: string | null;
          question_prompt: string | null;
          question_sort: number | null;
          option_id: string | null;
          option_label: string | null;
          option_sort: number | null;
        }[];
      };
      grade_quiz: {
        Args: { p_quiz_id: string; p_selected: string[] };
        Returns: { score_percent: number; passed: boolean }[];
      };
    };
  };
};
