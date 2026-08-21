import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthEvent, AuthEventType, Community, Database, Profile } from "@/types/database";

// Reads of the auth_events log for the platform-admin "Signups & logins" tab.
// Like the rest of platform-analytics, every function here must be called with
// the service-role admin client (createAdminClient) and only after the caller
// has been verified as a super admin: RLS grants super admins select on
// auth_events, but the joins onto communities and profiles below span every
// community on the platform — private and invite-only ones included, which is
// the entire point of the tab (spotting a new signup to a community nobody on
// the operator's account is a member of).
type Client = SupabaseClient<Database>;

export const AUTH_EVENT_TYPES: AuthEventType[] = [
  "signup",
  "email_confirmed",
  "login",
  "join",
  "invited",
  "leave",
];

export type AuthEventRange = "24h" | "7d" | "30d" | "90d" | "all";

export const AUTH_EVENT_RANGES: { key: AuthEventRange; label: string; days: number | null }[] = [
  { key: "24h", label: "24 hours", days: 1 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: null },
];

export function parseAuthEventRange(value: string | undefined): AuthEventRange {
  return AUTH_EVENT_RANGES.some((r) => r.key === value) ? (value as AuthEventRange) : "30d";
}

export function rangeStart(range: AuthEventRange): string | null {
  const days = AUTH_EVENT_RANGES.find((r) => r.key === range)?.days ?? null;
  if (days === null) return null;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export type AuthEventCounts = Record<AuthEventType, number>;

function emptyCounts(): AuthEventCounts {
  return { signup: 0, email_confirmed: 0, login: 0, join: 0, invited: 0, leave: 0 };
}

export type CommunityAuthActivity = {
  // Null for the synthetic "no community" bucket — signups and sign-ins that
  // happened on the platform itself, with no community context to attribute.
  communityId: string | null;
  name: string;
  slug: string | null;
  privacy: string | null;
  // Total active members today, for context next to the movement in the window.
  memberCount: number;
  counts: AuthEventCounts;
  // Distinct people behind the events, so ten sign-ins by one person don't read
  // as ten people.
  uniqueUsers: number;
  lastEventAt: string | null;
  // True when the community existed before the window opened — a community
  // created inside the window has its whole membership counted as "joins",
  // which would otherwise look like a spike.
  createdInWindow: boolean;
};

export type AuthEventFeedItem = {
  id: string;
  type: AuthEventType;
  createdAt: string;
  source: string | null;
  path: string | null;
  host: string | null;
  backfilled: boolean;
  user: Pick<Profile, "id" | "username" | "full_name" | "avatar_url"> | null;
  communityId: string | null;
  communityName: string | null;
  communitySlug: string | null;
  communityPrivacy: string | null;
};

export type AuthEventDay = {
  day: string; // YYYY-MM-DD (UTC)
  counts: AuthEventCounts;
};

export type AuthAnalytics = {
  // Exact totals for the window, counted in the database (not derived from the
  // capped row fetch below), so the headline numbers are always right.
  totals: AuthEventCounts;
  // How many rows the breakdown below was built from, and whether that hit the
  // cap — surfaced in the UI so a truncated breakdown is never read as fact.
  rowsAnalysed: number;
  truncated: boolean;
  byCommunity: CommunityAuthActivity[];
  daily: AuthEventDay[];
  recent: AuthEventFeedItem[];
  // People who signed up in the window and are still in no community at all.
  signupsWithoutCommunity: number;
};

// Hard ceiling on the rows pulled into memory for the per-community breakdown.
// Well above a year of events for a platform of this size; the exact totals
// above stay correct even if it is ever hit.
const ROW_CAP = 50_000;

type EventRow = Pick<
  AuthEvent,
  "id" | "event_type" | "user_id" | "community_id" | "community_slug" | "source" | "path" | "host" | "created_at"
> & { metadata: Record<string, unknown> | null };

// Thrown when the auth_events table isn't there yet — the migration that adds
// it hasn't been pushed to this Supabase project. The tab renders a "run the
// migration" notice instead of a 500, since an operator seeing this page for
// the first time is exactly who is most likely to hit it.
export class AuthEventsNotInstalledError extends Error {
  constructor() {
    super("The auth_events table does not exist yet — push the auth_events_analytics migration.");
    this.name = "AuthEventsNotInstalledError";
  }
}

function isMissingTable(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  const message = (error as { message?: string } | null)?.message ?? "";
  // 42P01 from Postgres, PGRST205 from PostgREST's schema cache.
  return code === "42P01" || code === "PGRST205" || /auth_events.*does not exist/i.test(message);
}

export async function getAuthAnalytics(admin: Client, range: AuthEventRange): Promise<AuthAnalytics> {
  try {
    return await loadAuthAnalytics(admin, range);
  } catch (error) {
    if (isMissingTable(error)) throw new AuthEventsNotInstalledError();
    throw error;
  }
}

async function loadAuthAnalytics(admin: Client, range: AuthEventRange): Promise<AuthAnalytics> {
  const since = rangeStart(range);

  const [totals, { data: rows, error: rowsError }, { data: communities, error: communitiesError }, memberCounts] =
    await Promise.all([
      countByType(admin, since),
      (() => {
        let query = admin
          .from("auth_events")
          .select("id, event_type, user_id, community_id, community_slug, source, path, host, metadata, created_at")
          .order("created_at", { ascending: false })
          .limit(ROW_CAP);
        if (since) query = query.gte("created_at", since);
        return query;
      })(),
      admin.from("communities").select("id, name, slug, privacy, created_at"),
      activeMemberCounts(admin),
    ]);

  if (rowsError) throw rowsError;
  if (communitiesError) throw communitiesError;

  const events = ((rows ?? []) as unknown as EventRow[]).filter(
    // Backfilled rows are synthesised history (see the migration) — they belong
    // in "all time" but would invent activity inside a recent window.
    (e) => !since || (e.metadata?.backfilled as boolean | undefined) !== true
  );

  const communityById = new Map(
    ((communities ?? []) as unknown as Pick<Community, "id" | "name" | "slug" | "privacy" | "created_at">[]).map((c) => [
      c.id,
      c,
    ])
  );

  // --- per-community aggregation --------------------------------------------
  const buckets = new Map<string, CommunityAuthActivity & { users: Set<string> }>();
  const bucketFor = (event: EventRow) => {
    const key = event.community_id ?? "__none__";
    if (!buckets.has(key)) {
      const community = event.community_id ? communityById.get(event.community_id) : undefined;
      buckets.set(key, {
        communityId: event.community_id,
        name:
          community?.name ??
          (event.community_id
            ? `Deleted community${event.community_slug ? ` (/c/${event.community_slug})` : ""}`
            : "No community — signed up on the platform"),
        slug: community?.slug ?? event.community_slug,
        privacy: community?.privacy ?? null,
        memberCount: 0,
        counts: emptyCounts(),
        uniqueUsers: 0,
        lastEventAt: null,
        createdInWindow: Boolean(since && community && community.created_at >= since),
        users: new Set<string>(),
      });
    }
    return buckets.get(key)!;
  };

  const daily = new Map<string, AuthEventCounts>();

  for (const event of events) {
    const bucket = bucketFor(event);
    bucket.counts[event.event_type] += 1;
    if (event.user_id) bucket.users.add(event.user_id);
    if (!bucket.lastEventAt || event.created_at > bucket.lastEventAt) bucket.lastEventAt = event.created_at;

    const day = event.created_at.slice(0, 10);
    if (!daily.has(day)) daily.set(day, emptyCounts());
    daily.get(day)![event.event_type] += 1;
  }

  // Communities with no events in the window still belong in the table — a
  // community that went quiet is exactly what an operator wants to spot.
  for (const community of communityById.values()) {
    if (!buckets.has(community.id)) {
      buckets.set(community.id, {
        communityId: community.id,
        name: community.name,
        slug: community.slug,
        privacy: community.privacy,
        memberCount: 0,
        counts: emptyCounts(),
        uniqueUsers: 0,
        lastEventAt: null,
        createdInWindow: Boolean(since && community.created_at >= since),
        users: new Set<string>(),
      });
    }
  }

  const byCommunity: CommunityAuthActivity[] = [...buckets.values()]
    .map(({ users, ...bucket }) => ({
      ...bucket,
      uniqueUsers: users.size,
      memberCount: bucket.communityId ? (memberCounts.get(bucket.communityId) ?? 0) : 0,
    }))
    .sort((a, b) => {
      const score = (c: CommunityAuthActivity) => c.counts.signup + c.counts.join + c.counts.login;
      if (score(b) !== score(a)) return score(b) - score(a);
      return b.memberCount - a.memberCount;
    });

  // --- recent feed ----------------------------------------------------------
  const feedRows = events.slice(0, 60);
  const profileIds = [...new Set(feedRows.map((e) => e.user_id).filter((id): id is string => Boolean(id)))];
  const profileById = new Map<string, Pick<Profile, "id" | "username" | "full_name" | "avatar_url">>();
  if (profileIds.length > 0) {
    const { data: profiles, error } = await admin
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .in("id", profileIds);
    if (error) throw error;
    for (const profile of (profiles ?? []) as Pick<Profile, "id" | "username" | "full_name" | "avatar_url">[]) {
      profileById.set(profile.id, profile);
    }
  }

  const recent: AuthEventFeedItem[] = feedRows.map((event) => {
    const community = event.community_id ? communityById.get(event.community_id) : undefined;
    return {
      id: event.id,
      type: event.event_type,
      createdAt: event.created_at,
      source: event.source,
      path: event.path,
      host: event.host,
      backfilled: (event.metadata?.backfilled as boolean | undefined) === true,
      user: event.user_id ? (profileById.get(event.user_id) ?? null) : null,
      communityId: event.community_id,
      communityName: community?.name ?? (event.community_slug ? `/c/${event.community_slug}` : null),
      communitySlug: community?.slug ?? event.community_slug,
      communityPrivacy: community?.privacy ?? null,
    };
  });

  // Signups in the window by people who are in no community today — the "signed
  // up but never landed anywhere" number.
  const signupUserIds = new Set(
    events.filter((e) => e.event_type === "signup" && e.user_id).map((e) => e.user_id as string)
  );
  let signupsWithoutCommunity = 0;
  if (signupUserIds.size > 0) {
    const { data: memberships, error } = await admin
      .from("community_memberships")
      .select("user_id")
      .eq("status", "active")
      .in("user_id", [...signupUserIds]);
    if (error) throw error;
    const attached = new Set((memberships ?? []).map((m) => m.user_id));
    signupsWithoutCommunity = [...signupUserIds].filter((id) => !attached.has(id)).length;
  }

  return {
    totals,
    rowsAnalysed: events.length,
    truncated: (rows ?? []).length >= ROW_CAP,
    byCommunity,
    daily: [...daily.entries()]
      .map(([day, counts]) => ({ day, counts }))
      .sort((a, b) => (a.day < b.day ? -1 : 1)),
    recent,
    signupsWithoutCommunity,
  };
}

// Exact per-type totals, one head-only COUNT each — cheap, and immune to the
// row cap on the breakdown above.
async function countByType(admin: Client, since: string | null): Promise<AuthEventCounts> {
  const results = await Promise.all(
    AUTH_EVENT_TYPES.map(async (type) => {
      let query = admin
        .from("auth_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", type);
      if (since) {
        query = query.gte("created_at", since);
      }
      const { count, error } = await query;
      if (error) throw error;
      return [type, count ?? 0] as const;
    })
  );
  return { ...emptyCounts(), ...Object.fromEntries(results) };
}

async function activeMemberCounts(admin: Client): Promise<Map<string, number>> {
  const { data, error } = await admin
    .from("community_memberships")
    .select("community_id")
    .eq("status", "active");
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.community_id, (counts.get(row.community_id) ?? 0) + 1);
  }
  return counts;
}

// --- Single user -------------------------------------------------------------

export type UserAuthActivity = {
  signupCommunity: { id: string; name: string; slug: string } | null;
  signupSource: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  events: AuthEventFeedItem[];
};

// The account-level story for one person on the per-user admin page: where they
// signed up, when they last signed in, and their last few auth events.
export async function getUserAuthActivity(admin: Client, userId: string): Promise<UserAuthActivity> {
  try {
    return await loadUserAuthActivity(admin, userId);
  } catch (error) {
    // The per-user page has plenty else to show, so a missing table degrades to
    // an empty section rather than a 500.
    if (isMissingTable(error)) {
      return { signupCommunity: null, signupSource: null, lastLoginAt: null, loginCount: 0, events: [] };
    }
    throw error;
  }
}

async function loadUserAuthActivity(admin: Client, userId: string): Promise<UserAuthActivity> {
  const [{ data: rows, error }, { data: profile, error: profileError }, loginCountResult] = await Promise.all([
    admin
      .from("auth_events")
      .select("id, event_type, user_id, community_id, community_slug, source, path, host, metadata, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    admin.from("profiles").select("signup_community_id, signup_source").eq("id", userId).maybeSingle(),
    // Counted rather than derived from the 50-row slice above, so a heavy user's
    // sign-in total stays exact.
    admin
      .from("auth_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "login"),
  ]);
  if (error) throw error;
  if (profileError) throw profileError;
  if (loginCountResult.error) throw loginCountResult.error;

  const events = (rows ?? []) as unknown as EventRow[];
  const signupCommunityId = (profile as { signup_community_id?: string | null } | null)?.signup_community_id ?? null;
  const communityIds = [
    ...new Set(
      [...events.map((e) => e.community_id), signupCommunityId].filter((id): id is string => Boolean(id))
    ),
  ];
  const communityById = new Map<string, Pick<Community, "id" | "name" | "slug" | "privacy">>();
  if (communityIds.length > 0) {
    const { data: communities, error: communitiesError } = await admin
      .from("communities")
      .select("id, name, slug, privacy")
      .in("id", communityIds);
    if (communitiesError) throw communitiesError;
    for (const community of (communities ?? []) as Pick<Community, "id" | "name" | "slug" | "privacy">[]) {
      communityById.set(community.id, community);
    }
  }

  const lastLogin = events.find((e) => e.event_type === "login") ?? null;
  const signupCommunity = signupCommunityId ? (communityById.get(signupCommunityId) ?? null) : null;

  return {
    signupCommunity: signupCommunity
      ? { id: signupCommunity.id, name: signupCommunity.name, slug: signupCommunity.slug }
      : null,
    signupSource: (profile as { signup_source?: string | null } | null)?.signup_source ?? null,
    lastLoginAt: lastLogin?.created_at ?? null,
    loginCount: loginCountResult.count ?? 0,
    events: events.slice(0, 15).map((event) => {
      const community = event.community_id ? communityById.get(event.community_id) : undefined;
      return {
        id: event.id,
        type: event.event_type,
        createdAt: event.created_at,
        source: event.source,
        path: event.path,
        host: event.host,
        backfilled: (event.metadata?.backfilled as boolean | undefined) === true,
        user: null,
        communityId: event.community_id,
        communityName: community?.name ?? (event.community_slug ? `/c/${event.community_slug}` : null),
        communitySlug: community?.slug ?? event.community_slug,
        communityPrivacy: community?.privacy ?? null,
      };
    }),
  };
}
