import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Community, MembershipRole, MembershipStatus, Profile } from "@/types/database";

// These functions power the platform-admin "Communities & Members" tab. They
// read across EVERY community — including private ones the operator isn't a
// member of — so they must be called with the service-role admin client
// (createAdminClient), and only after the caller has been verified as a
// super admin. RLS would otherwise hide memberships and content of
// communities the operator hasn't joined (see the memberships_select policy).
type Client = SupabaseClient<Database>;

export type CommunityMemberRow = {
  role: MembershipRole;
  joinedAt: string;
  profile: Profile;
};

export type CommunityWithMembers = {
  community: Community;
  memberCount: number;
  // Members ordered most-engaged first (contribution score, then recency of
  // activity), so the people driving a community surface at the top.
  members: CommunityMemberRow[];
};

export type PlatformOverview = {
  communities: number;
  users: number;
  memberships: number;
};

// Headline counts for the top of the tab. Each is a head-only COUNT (no rows
// fetched). users = every profile row; memberships = active memberships only.
export async function getPlatformOverview(admin: Client): Promise<PlatformOverview> {
  const [communities, users, memberships] = await Promise.all([
    admin.from("communities").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("community_memberships").select("id", { count: "exact", head: true }).eq("status", "active"),
  ]);

  return {
    communities: communities.count ?? 0,
    users: users.count ?? 0,
    memberships: memberships.count ?? 0,
  };
}

export type PlatformUserRow = {
  profile: Profile;
  // How many communities the user is an ACTIVE member of. 0 = signed up but
  // hasn't joined (or been added to) any community yet — these users never
  // appear under a community, which is why the total user count is higher than
  // the sum of members shown in the list.
  communityCount: number;
};

// Every registered profile with its active-membership count, newest first.
// Unattached users (communityCount 0) are surfaced first so the gap between
// "total users" and "users shown in communities" is easy to audit.
export async function getAllUsers(admin: Client): Promise<PlatformUserRow[]> {
  const [{ data: profiles, error: profilesError }, { data: memberships, error: membershipsError }] =
    await Promise.all([
      admin.from("profiles").select("*").order("created_at", { ascending: false }),
      admin.from("community_memberships").select("user_id").eq("status", "active"),
    ]);

  if (profilesError) throw profilesError;
  if (membershipsError) throw membershipsError;

  const counts = new Map<string, number>();
  for (const row of memberships ?? []) {
    counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);
  }

  return ((profiles ?? []) as Profile[])
    .map((profile) => ({ profile, communityCount: counts.get(profile.id) ?? 0 }))
    .sort((a, b) => {
      if ((a.communityCount === 0) !== (b.communityCount === 0)) return a.communityCount === 0 ? -1 : 1;
      return new Date(b.profile.created_at).getTime() - new Date(a.profile.created_at).getTime();
    });
}

type MembershipWithProfileRow = {
  role: MembershipRole;
  created_at: string;
  community_id: string;
  profile: Profile | Profile[] | null;
};

function firstProfile(profile: Profile | Profile[] | null): Profile | null {
  if (!profile) return null;
  return Array.isArray(profile) ? (profile[0] ?? null) : profile;
}

// Every community (newest first) with its active members attached. One query
// for communities and one for all active memberships+profiles, joined in
// memory — avoids a per-community round trip.
export async function getCommunitiesWithMembers(admin: Client): Promise<CommunityWithMembers[]> {
  const [{ data: communities, error: communitiesError }, { data: memberships, error: membershipsError }] =
    await Promise.all([
      admin.from("communities").select("*").order("created_at", { ascending: false }),
      admin
        .from("community_memberships")
        .select("role, created_at, community_id, profile:user_id (*)")
        .eq("status", "active"),
    ]);

  if (communitiesError) throw communitiesError;
  if (membershipsError) throw membershipsError;

  const membersByCommunity = new Map<string, CommunityMemberRow[]>();
  for (const row of (memberships ?? []) as unknown as MembershipWithProfileRow[]) {
    const profile = firstProfile(row.profile);
    if (!profile) continue;
    if (!membersByCommunity.has(row.community_id)) membersByCommunity.set(row.community_id, []);
    membersByCommunity.get(row.community_id)!.push({ role: row.role, joinedAt: row.created_at, profile });
  }

  const roleWeight: Record<MembershipRole, number> = { owner: 3, admin: 2, moderator: 1, member: 0 };

  return ((communities ?? []) as Community[]).map((community) => {
    const members = membersByCommunity.get(community.id) ?? [];
    members.sort((a, b) => {
      // Staff first, then by contribution score, then most recently active.
      if (roleWeight[b.role] !== roleWeight[a.role]) return roleWeight[b.role] - roleWeight[a.role];
      if (b.profile.contribution_score !== a.profile.contribution_score) {
        return b.profile.contribution_score - a.profile.contribution_score;
      }
      const aActive = a.profile.last_active_at ? new Date(a.profile.last_active_at).getTime() : 0;
      const bActive = b.profile.last_active_at ? new Date(b.profile.last_active_at).getTime() : 0;
      return bActive - aActive;
    });
    return { community, memberCount: members.length, members };
  });
}

// --- Single-user detail ------------------------------------------------------

export type UserMembership = {
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt: string;
  community: Pick<Community, "id" | "name" | "slug">;
};

export type UserActivityItem =
  | {
      kind: "post";
      id: string;
      createdAt: string;
      title: string;
      communityName: string;
      communitySlug: string;
      spaceSlug: string;
      postId: string;
    }
  | {
      kind: "comment";
      id: string;
      createdAt: string;
      body: string;
      communityName: string;
      communitySlug: string;
      spaceSlug: string;
      postId: string;
      postTitle: string;
    };

export type UserCommunityActivity = {
  communityId: string;
  communityName: string;
  communitySlug: string;
  posts: number;
  comments: number;
};

export type PlatformUserDetail = {
  profile: Profile;
  memberships: UserMembership[];
  totals: { posts: number; comments: number; eventsHosted: number; eventsAttended: number };
  // Where this user is most active, most-active first.
  byCommunity: UserCommunityActivity[];
  recentActivity: UserActivityItem[];
};

type CommunityRef = { id?: string; name: string; slug: string } | { id?: string; name: string; slug: string }[] | null;
type SpaceRef = { slug: string } | { slug: string }[] | null;

function firstRef<T>(ref: T | T[] | null | undefined): T | null {
  if (!ref) return null;
  return Array.isArray(ref) ? (ref[0] ?? null) : ref;
}

type UserPostRow = {
  id: string;
  title: string;
  created_at: string;
  community_id: string;
  communities: CommunityRef;
  spaces: SpaceRef;
};

type UserCommentRow = {
  id: string;
  body: string;
  created_at: string;
  post_id: string;
  posts: {
    title: string;
    community_id: string;
    communities: CommunityRef;
    spaces: SpaceRef;
  } | null;
};

export async function getPlatformUserDetail(admin: Client, userId: string): Promise<PlatformUserDetail | null> {
  const { data: profile, error: profileError } = await admin.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const [
    { data: memberships, error: membershipsError },
    { data: posts, error: postsError },
    { data: comments, error: commentsError },
    eventsHosted,
    eventsAttended,
  ] = await Promise.all([
    admin
      .from("community_memberships")
      .select("role, status, created_at, community:community_id (id, name, slug)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    admin
      .from("posts")
      .select("id, title, created_at, community_id, communities:community_id (name, slug), spaces:space_id (slug)")
      .eq("author_id", userId)
      .order("created_at", { ascending: false }),
    admin
      .from("comments")
      .select("id, body, created_at, post_id, posts:post_id (title, community_id, communities:community_id (name, slug), spaces:space_id (slug))")
      .eq("author_id", userId)
      .order("created_at", { ascending: false }),
    admin.from("events").select("id", { count: "exact", head: true }).eq("created_by", userId),
    admin.from("event_rsvps").select("event_id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  if (membershipsError) throw membershipsError;
  if (postsError) throw postsError;
  if (commentsError) throw commentsError;

  const userMemberships: UserMembership[] = ((memberships ?? []) as unknown as Array<{
    role: MembershipRole;
    status: MembershipStatus;
    created_at: string;
    community: CommunityRef;
  }>)
    .map((row) => {
      const community = firstRef(row.community);
      if (!community?.id) return null;
      return {
        role: row.role,
        status: row.status,
        joinedAt: row.created_at,
        community: { id: community.id, name: community.name, slug: community.slug },
      } satisfies UserMembership;
    })
    .filter((m): m is UserMembership => m !== null);

  const postRows = (posts ?? []) as unknown as UserPostRow[];
  const commentRows = (comments ?? []) as unknown as UserCommentRow[];

  // Per-community tallies across ALL of the user's posts and comments (not just
  // the recent slice), so "most active in" is accurate.
  const byCommunityMap = new Map<string, UserCommunityActivity>();
  const bump = (id: string, name: string, slug: string, field: "posts" | "comments") => {
    if (!byCommunityMap.has(id)) {
      byCommunityMap.set(id, { communityId: id, communityName: name, communitySlug: slug, posts: 0, comments: 0 });
    }
    byCommunityMap.get(id)![field] += 1;
  };

  for (const post of postRows) {
    const community = firstRef(post.communities);
    if (community) bump(post.community_id, community.name, community.slug, "posts");
  }
  for (const comment of commentRows) {
    const community = firstRef(comment.posts?.communities);
    if (comment.posts && community) bump(comment.posts.community_id, community.name, community.slug, "comments");
  }

  const byCommunity = [...byCommunityMap.values()].sort(
    (a, b) => b.posts + b.comments - (a.posts + a.comments)
  );

  const postItems: UserActivityItem[] = postRows.map((post) => {
    const community = firstRef(post.communities);
    return {
      kind: "post",
      id: post.id,
      createdAt: post.created_at,
      title: post.title,
      communityName: community?.name ?? "",
      communitySlug: community?.slug ?? "",
      spaceSlug: firstRef(post.spaces)?.slug ?? "",
      postId: post.id,
    };
  });

  const commentItems: UserActivityItem[] = commentRows.map((comment) => {
    const community = firstRef(comment.posts?.communities);
    return {
      kind: "comment",
      id: comment.id,
      createdAt: comment.created_at,
      body: comment.body,
      communityName: community?.name ?? "",
      communitySlug: community?.slug ?? "",
      spaceSlug: firstRef(comment.posts?.spaces)?.slug ?? "",
      postId: comment.post_id,
      postTitle: comment.posts?.title ?? "a post",
    };
  });

  const recentActivity = [...postItems, ...commentItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return {
    profile,
    memberships: userMemberships,
    totals: {
      posts: postRows.length,
      comments: commentRows.length,
      eventsHosted: eventsHosted.count ?? 0,
      eventsAttended: eventsAttended.count ?? 0,
    },
    byCommunity,
    recentActivity,
  };
}

// --- Spam cleanup ------------------------------------------------------------

export type SpamCandidate = {
  id: string;
  username: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
};

// Accounts that look like automated signup spam, by the strictest safe rule:
// the email was NEVER confirmed, the user belongs to NO community, and they
// have written NO posts or comments. Anything a real (if inactive) member would
// have — a confirmed email, a membership, any content — excludes them. Super
// admins are always excluded as a hard guard. The same predicate is re-run
// server-side before any deletion, so this list is safe to act on.
//
// Note: this keys off email confirmation. If email confirmation is turned OFF
// in the Supabase project, every signup is auto-confirmed and nothing matches —
// keep confirmation on so bots that never confirm stay quarantined here.
export async function getSpamCandidates(admin: Client): Promise<SpamCandidate[]> {
  // 1. Every profile (id + display fields).
  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, username, full_name, is_super_admin, created_at")
    .order("created_at", { ascending: false });
  if (profilesError) throw profilesError;

  // 2. Users who belong to at least one community (any status) — a membership,
  //    even inactive, means this isn't a drive-by bot.
  const { data: memberships, error: membershipsError } = await admin
    .from("community_memberships")
    .select("user_id");
  if (membershipsError) throw membershipsError;
  const hasMembership = new Set((memberships ?? []).map((m) => m.user_id));

  // 3. Users who have authored any content.
  const [{ data: postAuthors, error: postsError }, { data: commentAuthors, error: commentsError }] =
    await Promise.all([
      admin.from("posts").select("author_id"),
      admin.from("comments").select("author_id"),
    ]);
  if (postsError) throw postsError;
  if (commentsError) throw commentsError;
  const hasContent = new Set<string>();
  for (const p of postAuthors ?? []) hasContent.add(p.author_id);
  for (const c of commentAuthors ?? []) hasContent.add(c.author_id);

  // 4. Email-confirmation state + address from the auth admin API, paginated.
  const confirmedById = new Map<string, boolean>();
  const emailById = new Map<string, string | null>();
  const perPage = 200;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    for (const u of users) {
      confirmedById.set(u.id, Boolean(u.email_confirmed_at));
      emailById.set(u.id, u.email ?? null);
    }
    if (users.length < perPage) break;
  }

  type ProfileLite = { id: string; username: string; full_name: string | null; is_super_admin: boolean; created_at: string };
  return ((profiles ?? []) as ProfileLite[])
    .filter(
      (p) =>
        !p.is_super_admin &&
        confirmedById.get(p.id) === false && // email never confirmed (known + false)
        !hasMembership.has(p.id) &&
        !hasContent.has(p.id)
    )
    .map((p) => ({
      id: p.id,
      username: p.username,
      fullName: p.full_name,
      email: emailById.get(p.id) ?? null,
      createdAt: p.created_at,
    }));
}
