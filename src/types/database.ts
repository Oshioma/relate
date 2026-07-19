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
export type SpaceVisibility = "public" | "members" | "private";
export type PostType = "discussion" | "announcement" | "resource";
export type ResourceType = "link" | "file" | "video" | "document";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  owner_id: string;
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
  sort_order: number;
  created_at: string;
};

export type Post = {
  id: string;
  community_id: string;
  space_id: string;
  author_id: string;
  title: string;
  body: string | null;
  post_type: PostType;
  is_pinned: boolean;
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

export type Event = {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  online_url: string | null;
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
  role: Extract<MembershipRole, "member" | "moderator">;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  revoked: boolean;
  created_by: string;
  created_at: string;
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
      communities: { Row: Community; Insert: Partial<Community> & { name: string; slug: string; owner_id: string }; Update: Partial<Community> } & NoRel;
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
        Relationships: [FKey<"author_id", "profiles">];
      };
      comments: {
        Row: Comment;
        Insert: Partial<Comment> & { post_id: string; author_id: string; body: string };
        Update: Partial<Comment>;
        Relationships: [FKey<"author_id", "profiles">];
      };
      events: { Row: Event; Insert: Partial<Event> & { community_id: string; title: string; start_time: string; created_by: string }; Update: Partial<Event> } & NoRel;
      resources: { Row: Resource; Insert: Partial<Resource> & { community_id: string; space_id: string; title: string; url: string; created_by: string }; Update: Partial<Resource> } & NoRel;
      community_invites: {
        Row: CommunityInvite;
        Insert: Partial<CommunityInvite> & { community_id: string; code: string; created_by: string };
        Update: Partial<CommunityInvite>;
      } & NoRel;
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & { user_id: string; type: NotificationType; title: string };
        Update: Partial<Notification>;
        Relationships: [FKey<"actor_id", "profiles">];
      };
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
    };
  };
};
