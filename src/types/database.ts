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
  | "recommendations";
export type PostType = "discussion" | "announcement" | "resource";
export type ResourceType = "link" | "file" | "video" | "document";
export type BusinessCategory = "restaurant" | "cafe" | "shop" | "accommodation" | "service" | "health" | "fitness" | "coworking" | "other";

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
  location_type: string | null;
  location_name: string | null;
  // Generated column: `is_public = (privacy = 'public')`. Read-only — Postgres
  // rejects any insert/update that sets it directly. Write `privacy` instead.
  is_public: boolean;
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
  description: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  opening_hours: string | null;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  verified: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type NotificationType = "comment" | "post" | "membership";

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
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & { user_id: string; type: NotificationType; title: string };
        Update: Partial<Notification>;
        Relationships: [FKey<"actor_id", "profiles">];
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
    };
    Views: Record<string, never>;
    Functions: {
      get_invite_preview: {
        Args: { p_code: string };
        Returns: { community_name: string | null; community_slug: string | null; valid: boolean; reason: string | null }[];
      };
      redeem_invite: {
        Args: { p_code: string };
        Returns: { community_slug: string | null; error: string | null }[];
      };
      find_user_id_by_email: {
        Args: { p_email: string };
        Returns: string | null;
      };
    };
  };
};
